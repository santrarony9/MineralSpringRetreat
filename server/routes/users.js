import express from 'express';
import crypto from 'crypto';
import { readDB, writeDB } from '../db.js';
import {
  requireSuperAdminMiddleware,
  hashPassword,
  logActivity
} from '../auth.js';

const router = express.Router();

/**
 * Generate a cryptographically secure random password
 */
function generateRandomPassword(length = 12) {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const special = '!@#$%^&*';
  const all = upper + lower + numbers + special;

  let pwd = '';
  pwd += upper[crypto.randomInt(upper.length)];
  pwd += lower[crypto.randomInt(lower.length)];
  pwd += numbers[crypto.randomInt(numbers.length)];
  pwd += special[crypto.randomInt(special.length)];

  for (let i = pwd.length; i < length; i++) {
    pwd += all[crypto.randomInt(all.length)];
  }

  // Shuffle characters
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
}

/**
 * Check if the user is the only active superadmin in the system
 */
function isLastActiveSuperAdmin(db, userId) {
  const activeSuperAdmins = (db.users || []).filter(
    u => u.role === 'superadmin' && (u.status === 'active' || !u.status)
  );
  return activeSuperAdmins.length === 1 && activeSuperAdmins[0].id === userId;
}

/**
 * Format user for response (never include passwordHash)
 */
function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    name: user.name || user.username,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'staff',
    status: user.status || 'active',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt
  };
}

/**
 * GET /api/users
 * Super Admin: List all backend users with filtering and metrics
 */
router.get('/', requireSuperAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.users) {
    return res.status(500).json({ error: 'Database unavailable' });
  }

  // Exclude public guest accounts
  let staffUsers = db.users.filter(u => u.role !== 'guest');

  const { search, role, status } = req.query;

  // Role filter
  if (role && role !== 'all') {
    staffUsers = staffUsers.filter(u => u.role === role);
  }

  // Status filter
  if (status && status !== 'all') {
    staffUsers = staffUsers.filter(u => (u.status || 'active') === status);
  }

  // Search filter
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    staffUsers = staffUsers.filter(
      u =>
        (u.username && u.username.toLowerCase().includes(q)) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.phone && u.phone.toLowerCase().includes(q))
    );
  }

  // Counts across all backend users
  const allStaff = db.users.filter(u => u.role !== 'guest');
  const counts = {
    total: allStaff.length,
    superadmin: allStaff.filter(u => u.role === 'superadmin').length,
    admin: allStaff.filter(u => u.role === 'admin').length,
    manager: allStaff.filter(u => u.role === 'manager').length,
    staff: allStaff.filter(u => u.role === 'staff').length,
    active: allStaff.filter(u => (u.status || 'active') === 'active').length,
    inactive: allStaff.filter(u => u.status === 'inactive').length
  };

  res.json({
    users: staffUsers.map(sanitizeUser),
    counts
  });
});

/**
 * POST /api/users
 * Super Admin: Create a new backend user
 */
router.post('/', requireSuperAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  if (!db.users) db.users = [];

  const { name, email, phone, username, password, role, status } = req.body || {};

  // Validations
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "User's full name is required." });
  }

  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(cleanUsername)) {
    return res.status(400).json({ error: 'Username can only contain letters, numbers, underscores, and hyphens.' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  const cleanEmail = email.trim().toLowerCase();

  // Role validation
  const allowedRoles = ['superadmin', 'admin', 'manager', 'staff'];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ error: `Invalid role specified. Allowed roles: ${allowedRoles.join(', ')}.` });
  }
  const userRole = (role && allowedRoles.includes(role)) ? role : 'staff';

  // Uniqueness check
  const existingUsername = db.users.find(u => u.username && u.username.toLowerCase() === cleanUsername);
  if (existingUsername) {
    return res.status(400).json({ error: `Username '${cleanUsername}' is already taken.` });
  }

  const existingEmail = db.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  if (existingEmail) {
    return res.status(400).json({ error: `Email '${cleanEmail}' is already registered.` });
  }

  // Handle password: if empty, auto-generate
  let plainPassword = password && password.trim();
  let generated = false;
  if (!plainPassword) {
    plainPassword = generateRandomPassword(12);
    generated = true;
  } else if (plainPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  const now = new Date().toISOString();
  const newUser = {
    id: 'usr-' + crypto.randomBytes(6).toString('hex'),
    username: cleanUsername,
    name: name.trim(),
    email: cleanEmail,
    phone: (phone && phone.trim()) || '',
    passwordHash: hashPassword(plainPassword),
    role: userRole,
    status: status === 'inactive' ? 'inactive' : 'active',
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null
  };

  db.users.push(newUser);
  writeDB(db);

  logActivity(
    'USER_CREATED',
    `Created new ${userRole} account '${cleanUsername}' (${name.trim()})`,
    req.ip,
    req.adminUser.username
  );

  res.status(201).json({
    success: true,
    message: `User '${cleanUsername}' created successfully.`,
    user: sanitizeUser(newUser),
    generatedPassword: generated ? plainPassword : null,
    temporaryPassword: plainPassword
  });
});

/**
 * PUT /api/users/:id
 * Super Admin: Edit user details
 */
router.put('/:id', requireSuperAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.users) return res.status(500).json({ error: 'Database unavailable' });

  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  const { name, email, phone, username, role, status } = req.body || {};

  // Safeguard: Cannot demote or deactivate last active Super Admin
  if (isLastActiveSuperAdmin(db, user.id)) {
    if (role && role !== 'superadmin') {
      return res.status(400).json({
        error: 'Cannot demote the last active Super Admin. Assign another Super Admin first.'
      });
    }
    if (status === 'inactive') {
      return res.status(400).json({
        error: 'Cannot deactivate the last active Super Admin account.'
      });
    }
  }

  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ error: 'Full name cannot be blank.' });
    user.name = name.trim();
  }

  if (username !== undefined) {
    const cleanUsername = username.trim().toLowerCase();
    if (cleanUsername.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    const duplicate = db.users.find(u => u.id !== user.id && u.username && u.username.toLowerCase() === cleanUsername);
    if (duplicate) return res.status(400).json({ error: `Username '${cleanUsername}' is already taken.` });
    user.username = cleanUsername;
  }

  if (email !== undefined) {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.includes('@')) return res.status(400).json({ error: 'Valid email is required.' });
    const duplicate = db.users.find(u => u.id !== user.id && u.email && u.email.toLowerCase() === cleanEmail);
    if (duplicate) return res.status(400).json({ error: `Email '${cleanEmail}' is already in use.` });
    user.email = cleanEmail;
  }

  if (phone !== undefined) {
    user.phone = phone.trim();
  }

  if (role !== undefined) {
    const allowedRoles = ['superadmin', 'admin', 'manager', 'staff'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role specified. Allowed roles: ${allowedRoles.join(', ')}.` });
    }
    user.role = role;
  }

  if (status !== undefined) {
    user.status = status === 'inactive' ? 'inactive' : 'active';
    // If deactivated, kill active sessions
    if (user.status === 'inactive') {
      db.sessions = (db.sessions || []).filter(s => s.userId !== user.id);
    }
  }

  user.updatedAt = new Date().toISOString();
  writeDB(db);

  logActivity(
    'USER_UPDATED',
    `Updated details for user '${user.username}' (Role: ${user.role}, Status: ${user.status})`,
    req.ip,
    req.adminUser.username
  );

  res.json({
    success: true,
    message: `User '${user.username}' updated successfully.`,
    user: sanitizeUser(user)
  });
});

/**
 * PATCH /api/users/:id/status
 * Super Admin: Toggle account active/inactive
 */
router.patch('/:id/status', requireSuperAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.users) return res.status(500).json({ error: 'Database unavailable' });

  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  // Safeguards
  if (req.adminUser.id === user.id) {
    return res.status(400).json({ error: 'You cannot deactivate your own logged-in account.' });
  }

  if (isLastActiveSuperAdmin(db, user.id)) {
    return res.status(400).json({ error: 'Cannot deactivate the last active Super Admin.' });
  }

  const currentStatus = user.status || 'active';
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  user.status = newStatus;
  user.updatedAt = new Date().toISOString();

  // If deactivated, purge active sessions
  if (newStatus === 'inactive') {
    db.sessions = (db.sessions || []).filter(s => s.userId !== user.id);
  }

  writeDB(db);

  logActivity(
    'USER_STATUS_TOGGLED',
    `Account status for '${user.username}' changed to '${newStatus}'`,
    req.ip,
    req.adminUser.username
  );

  res.json({
    success: true,
    message: `User '${user.username}' is now ${newStatus}.`,
    user: sanitizeUser(user)
  });
});

/**
 * POST /api/users/:id/reset-password
 * Super Admin: Reset a user's password directly
 */
router.post('/:id/reset-password', requireSuperAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.users) return res.status(500).json({ error: 'Database unavailable' });

  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  let { newPassword } = req.body || {};
  let generated = false;

  if (!newPassword || !newPassword.trim()) {
    newPassword = generateRandomPassword(12);
    generated = true;
  } else if (newPassword.trim().length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  user.passwordHash = hashPassword(newPassword.trim());
  user.updatedAt = new Date().toISOString();

  // Invalidate user sessions so they must re-authenticate with new password
  db.sessions = (db.sessions || []).filter(s => s.userId !== user.id);

  writeDB(db);

  logActivity(
    'USER_PASSWORD_RESET',
    `Super Admin reset password for user '${user.username}'`,
    req.ip,
    req.adminUser.username
  );

  res.json({
    success: true,
    message: `Password for user '${user.username}' has been reset successfully.`,
    temporaryPassword: generated ? newPassword : newPassword.trim()
  });
});

/**
 * DELETE /api/users/:id
 * Super Admin: Delete user
 */
router.delete('/:id', requireSuperAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.users) return res.status(500).json({ error: 'Database unavailable' });

  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });

  // Safeguards
  if (req.adminUser.id === user.id) {
    return res.status(400).json({ error: 'You cannot delete your own logged-in account.' });
  }

  if (isLastActiveSuperAdmin(db, user.id)) {
    return res.status(400).json({ error: 'Cannot delete the last active Super Admin account.' });
  }

  // Remove sessions
  db.sessions = (db.sessions || []).filter(s => s.userId !== user.id);

  // Remove user
  db.users = db.users.filter(u => u.id !== user.id);
  writeDB(db);

  logActivity(
    'USER_DELETED',
    `Super Admin deleted user '${user.username}' (${user.role})`,
    req.ip,
    req.adminUser.username
  );

  res.json({
    success: true,
    message: `User '${user.username}' deleted successfully.`
  });
});

export default router;

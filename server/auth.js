import crypto from 'crypto';
import { readDB, writeDB } from './db.js';

const KEY_LEN = 64;
const COST = 16384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Rate limiter storage: ip -> { attempts: number, lockUntil: number }
const loginAttempts = new Map();

/**
 * Hash password with scrypt and a cryptographically random salt
 */
export function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plainPassword, salt, KEY_LEN, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELIZATION
  });
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify password against stored scrypt hash using timingSafeEqual
 */
export function verifyPassword(plainPassword, storedHash) {
  try {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return false;
    const [salt, keyHex] = parts;
    const derivedKey = crypto.scryptSync(plainPassword, salt, KEY_LEN, {
      N: COST,
      r: BLOCK_SIZE,
      p: PARALLELIZATION
    });
    const storedBuffer = Buffer.from(keyHex, 'hex');
    return crypto.timingSafeEqual(derivedKey, storedBuffer);
  } catch (err) {
    console.error('[AUTH] Verification error:', err);
    return false;
  }
}

/**
 * Check rate limit for IP
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return { allowed: true };

  if (record.lockUntil && record.lockUntil > now) {
    const remainingSec = Math.ceil((record.lockUntil - now) / 1000);
    return {
      allowed: false,
      message: `Too many failed attempts. Account locked temporarily for ${remainingSec} seconds.`
    };
  }

  return { allowed: true };
}

/**
 * Record failed attempt
 */
export function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;
  if (record.attempts >= 5) {
    record.lockUntil = now + 15 * 60 * 1000; // lock 15 minutes
  }
  loginAttempts.set(ip, record);
}

/**
 * Reset rate limit on success
 */
export function resetRateLimit(ip) {
  loginAttempts.delete(ip);
}

/**
 * Create a persistent session in db.json
 */
export function createSession(userId, ip, userAgent) {
  const token = 'msr_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  const db = readDB();
  if (!db) return null;
  if (!db.sessions) db.sessions = [];

  // Remove expired sessions
  const now = Date.now();
  db.sessions = db.sessions.filter(s => new Date(s.expiresAt).getTime() > now);

  const session = {
    token,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt,
    ip: ip || '127.0.0.1',
    userAgent: userAgent || 'Unknown'
  };

  db.sessions.push(session);
  writeDB(db);
  return session;
}

/**
 * Verify session token
 */
export function verifySession(token) {
  if (!token) return null;
  const db = readDB();
  if (!db || !db.sessions) return null;

  const session = db.sessions.find(s => s.token === token);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() < Date.now()) {
    // Session expired
    return null;
  }

  // Look up user
  const user = (db.users || []).find(u => u.id === session.userId);
  if (!user) return null;

  return {
    session,
    user: {
      id: user.id,
      username: user.username,
      name: user.name || user.username || 'Guest',
      email: user.email,
      role: user.role || 'staff',
      status: user.status || 'active',
      picture: user.picture || '',
      phone: user.phone || '',
      googleId: user.googleId || null,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt
    }
  };
}

/**
 * Destroy a session
 */
export function destroySession(token) {
  const db = readDB();
  if (!db || !db.sessions) return true;
  db.sessions = db.sessions.filter(s => s.token !== token);
  return writeDB(db);
}

/**
 * Log admin activity
 */
export function logActivity(action, details, ip = '127.0.0.1', username = 'system') {
  const db = readDB();
  if (!db) return;
  if (!db.auditLogs) db.auditLogs = [];

  const entry = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    action,
    details: typeof details === 'string' ? details : JSON.stringify(details),
    ip,
    username
  };

  db.auditLogs.unshift(entry);
  // Cap at 200 logs
  if (db.auditLogs.length > 200) db.auditLogs = db.auditLogs.slice(0, 200);
  writeDB(db);
}

/**
 * Create password reset token
 */
export function createResetToken(userId) {
  const db = readDB();
  if (!db) return null;
  if (!db.passwordResets) db.passwordResets = [];

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.passwordResets.push({
    token,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt,
    used: false
  });

  writeDB(db);
  return token;
}

/**
 * Verify reset token
 */
export function verifyResetToken(token) {
  const db = readDB();
  if (!db || !db.passwordResets) return null;

  const record = db.passwordResets.find(r => r.token === token && !r.used);
  if (!record) return null;

  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return null; // Expired
  }

  return record;
}

/**
 * Mark reset token used and update user password
 */
export function applyPasswordReset(token, newPassword) {
  const record = verifyResetToken(token);
  if (!record) return { success: false, message: 'Invalid or expired reset token' };

  const db = readDB();
  const user = (db.users || []).find(u => u.id === record.userId);
  if (!user) return { success: false, message: 'User not found' };

  user.passwordHash = hashPassword(newPassword);
  user.updatedAt = new Date().toISOString();

  // Invalidate token
  const resetEntry = db.passwordResets.find(r => r.token === token);
  if (resetEntry) resetEntry.used = true;

  // Invalidate existing sessions for security
  db.sessions = (db.sessions || []).filter(s => s.userId !== user.id);

  writeDB(db);
  logActivity('PASSWORD_RESET_COMPLETED', `Password reset for user ${user.username}`, '127.0.0.1', user.username);
  return { success: true };
}

/**
 * Express middleware to require authenticated backend staff/admin
 */
export function requireAdminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No session token provided.' });
  }

  const result = verifySession(token);
  if (!result) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }

  // Check account active status
  if (result.user.status === 'inactive') {
    return res.status(403).json({ error: 'Your account has been deactivated. Please contact the Super Admin.' });
  }

  // Reject customers/guests from administrative endpoints
  if (result.user.role === 'guest') {
    return res.status(403).json({ error: 'Access denied: Customer accounts cannot access administrative APIs.' });
  }

  req.adminUser = result.user;
  req.session = result.session;
  next();
}

/**
 * Express middleware builder for strict Role-Based Access Control (RBAC)
 */
export function requireRoleMiddleware(...allowedRoles) {
  return (req, res, next) => {
    requireAdminMiddleware(req, res, () => {
      const user = req.adminUser;
      if (!user) {
        return res.status(401).json({ error: 'Authentication required.' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          error: `Access denied. Your role '${user.role}' lacks permission for this action. Required: ${allowedRoles.join(' or ')}.`,
          code: 'INSUFFICIENT_PERMISSIONS',
          currentRole: user.role,
          requiredRoles: allowedRoles
        });
      }

      next();
    });
  };
}

/**
 * Convenience RBAC Middlewares
 */
export const requireSuperAdminMiddleware = requireRoleMiddleware('superadmin');
export const requireAdminOrAboveMiddleware = requireRoleMiddleware('superadmin', 'admin', 'manager');
export const requireStaffOrAboveMiddleware = requireRoleMiddleware('superadmin', 'admin', 'manager', 'staff');

/**
 * Express middleware to require authenticated guest or admin
 */
export function requireGuestMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. Please sign in with your Google account before proceeding.',
      code: 'AUTH_REQUIRED'
    });
  }

  const result = verifySession(token);
  if (!result) {
    return res.status(401).json({
      error: 'Session expired or invalid. Please sign in again with Google.',
      code: 'SESSION_EXPIRED'
    });
  }

  req.guestUser = result.user;
  req.session = result.session;
  next();
}

/**
 * Find or create a guest user using stable Google ID (sub)
 */
export function findOrCreateGoogleUser({ googleId, email, name, picture }) {
  if (!googleId) {
    throw new Error('Google ID (sub) is required.');
  }

  const db = readDB();
  if (!db) throw new Error('Database unavailable.');
  if (!db.users) db.users = [];

  const now = new Date().toISOString();

  // 1. First look up by stable Google sub ID
  let user = db.users.find(u => u.googleId === googleId);

  // 2. If not found by googleId, check by email if guest
  if (!user && email) {
    user = db.users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase() && u.role === 'guest');
    if (user) {
      // Link stable Google ID
      user.googleId = googleId;
    }
  }

  if (user) {
    // Update profile with latest info from Google
    user.name = name || user.name || user.email?.split('@')[0] || 'Guest';
    if (email) user.email = email;
    if (picture) user.picture = picture;
    user.lastLoginAt = now;
    user.updatedAt = now;
  } else {
    // Create new guest account
    user = {
      id: 'guest-' + crypto.randomBytes(6).toString('hex'),
      googleId,
      email: email || '',
      name: name || email?.split('@')[0] || 'Guest',
      picture: picture || '',
      phone: '',
      role: 'guest',
      createdAt: now,
      lastLoginAt: now,
      updatedAt: now
    };
    db.users.push(user);
  }

  writeDB(db);
  return user;
}

/**
 * Update guest profile information (e.g. phone number, full name)
 */
export function updateGuestProfile(userId, { name, phone }) {
  const db = readDB();
  if (!db || !db.users) return null;

  const user = db.users.find(u => u.id === userId);
  if (!user) return null;

  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  user.updatedAt = new Date().toISOString();

  writeDB(db);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    phone: user.phone,
    role: user.role,
    googleId: user.googleId,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt
  };
}

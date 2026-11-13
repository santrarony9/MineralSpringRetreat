import express from 'express';
import crypto from 'crypto';
import {
  verifyPassword,
  hashPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  createSession,
  verifySession,
  destroySession,
  logActivity,
  createResetToken,
  applyPasswordReset,
  requireAdminMiddleware,
  requireGuestMiddleware,
  findOrCreateGoogleUser,
  updateGuestProfile
} from '../auth.js';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const { username, password } = req.body;

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({ success: false, message: rateCheck.message });
  }

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const db = readDB();
  if (!db || !db.users) {
    return res.status(500).json({ success: false, message: 'Database unavailable.' });
  }

  const user = db.users.find(
    u => (u.username && u.username.toLowerCase() === username.trim().toLowerCase()) ||
         (u.email && u.email.toLowerCase() === username.trim().toLowerCase())
  );

  if (!user || !verifyPassword(password, user.passwordHash)) {
    recordFailedAttempt(ip);
    logActivity('LOGIN_FAILED', `Failed login attempt for username '${username}'`, ip, username);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please verify your username and password.'
    });
  }

  // Check account active status
  if (user.status === 'inactive') {
    return res.status(403).json({
      success: false,
      message: 'Your account has been deactivated. Please contact the Super Admin.'
    });
  }

  // Reject guest accounts from admin login
  if (user.role === 'guest') {
    return res.status(403).json({
      success: false,
      message: 'Customer accounts cannot access the admin backend. Please use Google Sign-in on the main website.'
    });
  }

  // Success
  resetRateLimit(ip);
  user.lastLoginAt = new Date().toISOString();
  writeDB(db);

  const userAgent = req.headers['user-agent'] || 'Unknown';
  const session = createSession(user.id, ip, userAgent);

  logActivity('LOGIN_SUCCESS', `Staff member '${user.username}' (${user.role}) logged in successfully`, ip, user.username);

  return res.json({
    success: true,
    token: session.token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name || user.username,
      email: user.email,
      phone: user.phone || '',
      role: user.role || 'staff',
      status: user.status || 'active'
    },
    message: 'Authentication successful'
  });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    destroySession(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.json({ valid: false });
  }

  const verified = verifySession(token);
  if (verified) {
    return res.json({ valid: true, user: verified.user });
  }
  return res.json({ valid: false });
});

// POST /api/auth/change-password
router.post('/change-password', requireAdminMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new passwords are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
  }

  const db = readDB();
  const user = db.users.find(u => u.id === req.adminUser.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (!verifyPassword(currentPassword, user.passwordHash)) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
  }

  user.passwordHash = hashPassword(newPassword);
  user.updatedAt = new Date().toISOString();
  writeDB(db);

  logActivity('PASSWORD_CHANGED', `User '${user.username}' changed their password`, req.ip, user.username);
  return res.json({ success: true, message: 'Password updated successfully.' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const db = readDB();
  const user = (db.users || []).find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    // For security, don't disclose whether email exists
    return res.json({
      success: true,
      message: 'If the provided email is associated with an administrator account, a recovery token has been generated.'
    });
  }

  const resetToken = createResetToken(user.id);
  logActivity('PASSWORD_RESET_REQUESTED', `Reset token requested for ${user.username}`, req.ip, user.username);

  return res.json({
    success: true,
    message: 'Reset token generated successfully.',
    resetToken // Returned for administrator convenience in local development
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
  }

  const result = applyPasswordReset(token, newPassword);
  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.json({ success: true, message: 'Password reset successfully. You may now log in with your new password.' });
});

// GET /api/auth/logs
router.get('/logs', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  res.json(db.auditLogs || []);
});

// ==========================================
// GOOGLE GUEST AUTHENTICATION & OAUTH 2.0
// ==========================================

// GET /api/auth/google/config
router.get('/google/config', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  res.json({
    configured: Boolean(clientId && clientId !== 'your-google-oauth-client-id.apps.googleusercontent.com'),
    clientId: clientId && clientId !== 'your-google-oauth-client-id.apps.googleusercontent.com' ? clientId : '',
    devMode: !clientId || clientId === 'your-google-oauth-client-id.apps.googleusercontent.com'
  });
});

// GET /api/auth/google/url
router.get('/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const configured = Boolean(clientId && clientId !== 'your-google-oauth-client-id.apps.googleusercontent.com');

  if (!configured) {
    return res.json({
      configured: false,
      devMode: true,
      message: 'Google Client ID not configured in .env. Dev Sign-in enabled.'
    });
  }

  const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
  const state = crypto.randomBytes(16).toString('hex');
  const scope = encodeURIComponent('openid email profile');
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=select_account&state=${state}`;

  return res.json({
    configured: true,
    url: authUrl,
    state
  });
});

// GET /api/auth/google/callback
router.get('/google/callback', async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const { code, error } = req.query;

  if (error) {
    return res.redirect(`${clientUrl}/?auth_error=${encodeURIComponent(error)}#reserve`);
  }

  if (!code) {
    return res.redirect(`${clientUrl}/?auth_error=No+authorization+code+provided#reserve`);
  }

  try {
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/auth/google/callback`;
    const params = new URLSearchParams({
      code: String(code),
      client_id: process.env.GOOGLE_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[GOOGLE_OAUTH] Token exchange failed:', tokenData);
      return res.redirect(`${clientUrl}/?auth_error=${encodeURIComponent(tokenData.error_description || 'Token exchange failed')}#reserve`);
    }

    // Retrieve userinfo
    const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const profile = await userinfoRes.json();
    if (!profile.sub) {
      return res.redirect(`${clientUrl}/?auth_error=Failed+to+retrieve+Google+profile#reserve`);
    }

    const guest = findOrCreateGoogleUser({
      googleId: profile.sub,
      email: profile.email,
      name: profile.name,
      picture: profile.picture
    });

    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const session = createSession(guest.id, ip, userAgent);

    logActivity('GOOGLE_OAUTH_LOGIN', `Guest '${guest.name}' logged in via Google (${guest.email})`, ip, guest.email);

    return res.redirect(
      `${clientUrl}/?auth=success&token=${session.token}&guestName=${encodeURIComponent(guest.name)}#my-bookings`
    );
  } catch (err) {
    console.error('[GOOGLE_OAUTH] Callback error:', err);
    return res.redirect(`${clientUrl}/?auth_error=${encodeURIComponent(err.message)}#reserve`);
  }
});

// POST /api/auth/google/verify
router.post('/google/verify', async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: 'Google credential token is required' });
  }

  try {
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    const data = await googleRes.json();

    if (!googleRes.ok || !data.sub) {
      return res.status(401).json({ error: data.error_description || 'Invalid Google credential' });
    }

    const guest = findOrCreateGoogleUser({
      googleId: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture
    });

    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const session = createSession(guest.id, ip, userAgent);

    logActivity('GOOGLE_ID_TOKEN_VERIFY', `Guest '${guest.name}' authenticated via Google One Tap (${guest.email})`, ip, guest.email);

    return res.json({
      success: true,
      token: session.token,
      user: {
        id: guest.id,
        googleId: guest.googleId,
        name: guest.name,
        email: guest.email,
        picture: guest.picture,
        phone: guest.phone || '',
        role: guest.role,
        createdAt: guest.createdAt,
        lastLoginAt: guest.lastLoginAt
      }
    });
  } catch (err) {
    console.error('[GOOGLE_VERIFY] Verification failed:', err);
    return res.status(500).json({ error: 'Failed to verify Google token: ' + err.message });
  }
});

// POST /api/auth/google/dev-login
// Fast demonstration and testing endpoint for offline / development environments
router.post('/google/dev-login', (req, res) => {
  const { name, email, googleId, picture, phone } = req.body || {};
  const guestEmail = (email && email.trim()) || 'sarah.jenkins@gmail.com';
  const gId = googleId || ('google-dev-' + crypto.createHash('md5').update(guestEmail).digest('hex').substring(0, 16));

  try {
    const guest = findOrCreateGoogleUser({
      googleId: gId,
      email: guestEmail,
      name: name || 'Sarah Jenkins',
      picture: picture || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    });

    if (phone) {
      updateGuestProfile(guest.id, { phone });
      guest.phone = phone;
    }

    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'DevBrowser';
    const session = createSession(guest.id, ip, userAgent);

    logActivity('GUEST_DEV_LOGIN', `Guest '${guest.name}' signed in via Google Dev Auth (${guest.email})`, ip, guest.email);

    return res.json({
      success: true,
      token: session.token,
      user: {
        id: guest.id,
        googleId: guest.googleId,
        name: guest.name,
        email: guest.email,
        picture: guest.picture,
        phone: guest.phone || phone || '',
        role: guest.role,
        createdAt: guest.createdAt,
        lastLoginAt: guest.lastLoginAt
      }
    });
  } catch (err) {
    console.error('[DEV_LOGIN] Error:', err);
    return res.status(500).json({ error: 'Dev login error: ' + err.message });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.json({ authenticated: false, user: null });
  }

  const verified = verifySession(token);
  if (!verified) {
    return res.json({ authenticated: false, user: null });
  }

  return res.json({
    authenticated: true,
    user: verified.user
  });
});

// PUT /api/auth/guest/profile
router.put('/guest/profile', requireGuestMiddleware, (req, res) => {
  const { name, phone } = req.body;

  if (name !== undefined && !name.trim()) {
    return res.status(400).json({ error: 'Name cannot be empty' });
  }

  const updatedUser = updateGuestProfile(req.guestUser.id, { name, phone });
  if (!updatedUser) {
    return res.status(404).json({ error: 'Guest user not found' });
  }

  logActivity('GUEST_PROFILE_UPDATED', `Guest '${updatedUser.name}' updated profile details`, req.ip, updatedUser.email);

  return res.json({
    success: true,
    user: updatedUser,
    message: 'Profile updated successfully'
  });
});

export default router;

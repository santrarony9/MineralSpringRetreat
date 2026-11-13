import express from 'express';
import { readDB, writeDB } from '../db.js';
import { requireAdminMiddleware, logActivity } from '../auth.js';

const router = express.Router();

/**
 * GET /api/guests
 * Admin: List all registered guests with search, booking counts, and profiles
 */
router.get('/', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let guests = (db.users || []).filter(u => u.role === 'guest');
  const inquiries = db.inquiries || [];
  const { search } = req.query;

  if (search) {
    const q = search.toLowerCase();
    guests = guests.filter(g =>
      (g.name && g.name.toLowerCase().includes(q)) ||
      (g.email && g.email.toLowerCase().includes(q)) ||
      (g.phone && g.phone.includes(q)) ||
      (g.googleId && g.googleId.toLowerCase().includes(q))
    );
  }

  // Enrich with booking stats
  const enrichedGuests = guests.map(guest => {
    const guestInquiries = inquiries.filter(
      i => i.guestId === guest.id || (i.email && i.email.toLowerCase() === (guest.email || '').toLowerCase())
    );

    return {
      id: guest.id,
      googleId: guest.googleId,
      name: guest.name || 'Guest',
      email: guest.email,
      picture: guest.picture || '',
      phone: guest.phone || '',
      role: guest.role,
      createdAt: guest.createdAt,
      lastLoginAt: guest.lastLoginAt,
      bookingsCount: guestInquiries.length,
      bookings: guestInquiries
    };
  });

  // Sort by lastLoginAt or createdAt descending
  enrichedGuests.sort((a, b) => new Date(b.lastLoginAt || b.createdAt) - new Date(a.lastLoginAt || a.createdAt));

  res.json(enrichedGuests);
});

/**
 * GET /api/guests/:id
 * Admin: View single guest details and associated inquiries
 */
router.get('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const guest = (db.users || []).find(u => u.id === req.params.id && u.role === 'guest');
  if (!guest) return res.status(404).json({ error: 'Guest not found' });

  const inquiries = (db.inquiries || []).filter(
    i => i.guestId === guest.id || (i.email && i.email.toLowerCase() === (guest.email || '').toLowerCase())
  );

  res.json({
    guest: {
      id: guest.id,
      googleId: guest.googleId,
      name: guest.name,
      email: guest.email,
      picture: guest.picture,
      phone: guest.phone,
      role: guest.role,
      createdAt: guest.createdAt,
      lastLoginAt: guest.lastLoginAt
    },
    inquiries
  });
});

/**
 * DELETE /api/guests/:id
 * Admin: Remove a guest account
 */
router.delete('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const idx = (db.users || []).findIndex(u => u.id === req.params.id && u.role === 'guest');
  if (idx === -1) return res.status(404).json({ error: 'Guest not found' });

  const guest = db.users[idx];
  db.users.splice(idx, 1);
  // Remove associated sessions
  if (db.sessions) {
    db.sessions = db.sessions.filter(s => s.userId !== guest.id);
  }

  writeDB(db);
  logActivity('GUEST_DELETED', `Admin deleted guest account for ${guest.name} (${guest.email})`, req.ip, req.adminUser.username);

  res.json({ success: true, message: 'Guest account deleted' });
});

export default router;

import express from 'express';
import { readDB, writeDB } from '../db.js';
import { requireAdminMiddleware, logActivity } from '../auth.js';

const router = express.Router();

/**
 * GET /api/rooms
 * Public list of rooms (filters by visible unless admin or ?all=true)
 */
router.get('/', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let rooms = (db.rooms || []).slice();
  // Sort by displayOrder if available
  rooms.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (req.query.all !== 'true') {
    rooms = rooms.filter(r => r.visible !== false);
  }

  res.json(rooms);
});

/**
 * GET /api/rooms/:id
 */
router.get('/:id', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const room = (db.rooms || []).find(r => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
});

/**
 * POST /api/rooms
 * Create new room
 */
router.post('/', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  if (!db.rooms) db.rooms = [];

  const newRoom = {
    id: req.body.id || 'room-' + Date.now(),
    name: req.body.name || 'New Mountain Suite',
    tagline: req.body.tagline || '',
    description: req.body.description || '',
    pricePerNight: Number(req.body.pricePerNight) || 1500,
    pricePerPerson: Number(req.body.pricePerPerson) || 1500,
    sharingType: req.body.sharingType || 'Per Person / Night',
    capacity: Number(req.body.capacity) || 2,
    maxGuests: Number(req.body.maxGuests) || 2,
    bed: req.body.bed || '1 Double Bed',
    size: req.body.size || '300 sq. ft.',
    mealsIncluded: req.body.mealsIncluded || 'All 4 Meals (Breakfast, Lunch, Evening Snacks & Tea, Dinner)',
    images: Array.isArray(req.body.images) && req.body.images.length > 0 ? req.body.images : ['/images/mineral-springs/room-double-sharing-balcony.jpg'],
    facilities: Array.isArray(req.body.facilities) ? req.body.facilities : [
      'Clean and comfortable room',
      'Attached Western-style toilet',
      'Geyser for 24/7 hot water',
      'Private balcony with mountain views',
      'All 4 home-cooked meals included'
    ],
    policies: Array.isArray(req.body.policies) ? req.body.policies : [
      'Includes 4 meals: Breakfast, Lunch, Evening Snacks, Dinner',
      'Rates are indicative and may vary depending on season and availability'
    ],
    visible: req.body.visible !== undefined ? Boolean(req.body.visible) : true,
    displayOrder: Number(req.body.displayOrder) || (db.rooms.length + 1)
  };

  db.rooms.push(newRoom);
  writeDB(db);

  logActivity('ROOM_CREATED', `Created new room '${newRoom.name}'`, req.ip, req.adminUser.username);
  res.status(201).json({ success: true, room: newRoom });
});

/**
 * PUT /api/rooms/:id
 * Update room
 */
router.put('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.rooms) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.rooms.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Room not found' });

  db.rooms[idx] = {
    ...db.rooms[idx],
    ...req.body,
    id: req.params.id // Preserve ID
  };

  writeDB(db);
  logActivity('ROOM_UPDATED', `Updated room '${db.rooms[idx].name}'`, req.ip, req.adminUser.username);
  res.json({ success: true, room: db.rooms[idx] });
});

/**
 * DELETE /api/rooms/:id
 */
router.delete('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.rooms) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.rooms.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Room not found' });

  const roomName = db.rooms[idx].name;
  db.rooms.splice(idx, 1);
  writeDB(db);

  logActivity('ROOM_DELETED', `Deleted room '${roomName}'`, req.ip, req.adminUser.username);
  res.json({ success: true, message: 'Room deleted successfully' });
});

export default router;

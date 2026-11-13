import express from 'express';
import { readDB, writeDB } from '../db.js';
import { requireAdminMiddleware, logActivity } from '../auth.js';

const router = express.Router();

/**
 * GET /api/gallery
 */
router.get('/', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let gallery = (db.gallery || []).slice();
  gallery.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const { category } = req.query;
  if (category && category !== 'All') {
    gallery = gallery.filter(g => g.category?.toLowerCase() === category.toLowerCase());
  }

  res.json(gallery);
});

/**
 * POST /api/gallery
 */
router.post('/', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  if (!db.gallery) db.gallery = [];

  const newPhoto = {
    id: req.body.id || 'gal-' + Date.now(),
    title: req.body.title || 'Retreat View',
    category: req.body.category || 'Landscape',
    image: req.body.image || '/images/mineral-springs/retreat-main-cottage-facade.jpg',
    aspect: req.body.aspect || 'wide',
    altText: req.body.altText || 'Mineral Springs Retreat photograph',
    displayOrder: Number(req.body.displayOrder) || (db.gallery.length + 1)
  };

  db.gallery.push(newPhoto);
  writeDB(db);

  logActivity('GALLERY_PHOTO_ADDED', `Added photo '${newPhoto.title}' to gallery`, req.ip, req.adminUser.username);
  res.status(201).json({ success: true, photo: newPhoto });
});

/**
 * PUT /api/gallery/:id
 */
router.put('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.gallery) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.gallery.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Gallery photo not found' });

  db.gallery[idx] = {
    ...db.gallery[idx],
    ...req.body,
    id: req.params.id
  };

  writeDB(db);
  logActivity('GALLERY_PHOTO_UPDATED', `Updated photo '${db.gallery[idx].title}'`, req.ip, req.adminUser.username);
  res.json({ success: true, photo: db.gallery[idx] });
});

/**
 * DELETE /api/gallery/:id
 */
router.delete('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.gallery) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.gallery.findIndex(g => g.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Gallery photo not found' });

  const title = db.gallery[idx].title;
  db.gallery.splice(idx, 1);
  writeDB(db);

  logActivity('GALLERY_PHOTO_DELETED', `Deleted gallery photo '${title}'`, req.ip, req.adminUser.username);
  res.json({ success: true, message: 'Photo deleted' });
});

export default router;

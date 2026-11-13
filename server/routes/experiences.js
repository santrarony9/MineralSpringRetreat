import express from 'express';
import { readDB, writeDB } from '../db.js';
import { requireAdminMiddleware, logActivity } from '../auth.js';

const router = express.Router();

/**
 * GET /api/experiences
 */
router.get('/', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let exps = (db.experiences || []).slice();
  exps.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  if (req.query.all !== 'true') {
    exps = exps.filter(e => e.visible !== false);
  }

  res.json(exps);
});

/**
 * POST /api/experiences
 */
router.post('/', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  if (!db.experiences) db.experiences = [];

  const newExp = {
    id: req.body.id || 'exp-' + Date.now(),
    title: req.body.title || 'New Retreat Experience',
    category: req.body.category || 'Nature',
    description: req.body.description || '',
    image: req.body.image || '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg',
    timing: req.body.timing || 'Daily',
    highlight: req.body.highlight || 'Curated Retreat Activity',
    visible: req.body.visible !== undefined ? Boolean(req.body.visible) : true,
    displayOrder: Number(req.body.displayOrder) || (db.experiences.length + 1)
  };

  db.experiences.push(newExp);
  writeDB(db);

  logActivity('EXPERIENCE_CREATED', `Created experience '${newExp.title}'`, req.ip, req.adminUser.username);
  res.status(201).json({ success: true, experience: newExp });
});

/**
 * PUT /api/experiences/:id
 */
router.put('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.experiences) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.experiences.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Experience not found' });

  db.experiences[idx] = {
    ...db.experiences[idx],
    ...req.body,
    id: req.params.id
  };

  writeDB(db);
  logActivity('EXPERIENCE_UPDATED', `Updated experience '${db.experiences[idx].title}'`, req.ip, req.adminUser.username);
  res.json({ success: true, experience: db.experiences[idx] });
});

/**
 * DELETE /api/experiences/:id
 */
router.delete('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.experiences) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.experiences.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Experience not found' });

  const title = db.experiences[idx].title;
  db.experiences.splice(idx, 1);
  writeDB(db);

  logActivity('EXPERIENCE_DELETED', `Deleted experience '${title}'`, req.ip, req.adminUser.username);
  res.json({ success: true, message: 'Experience deleted' });
});

export default router;

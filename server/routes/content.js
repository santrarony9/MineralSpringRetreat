import express from 'express';
import { readDB, writeDB } from '../db.js';
import { requireAdminMiddleware, logActivity, verifySession } from '../auth.js';

const router = express.Router();

/**
 * GET /api/content/pages
 * Public endpoint. If ?preview=true and Bearer token is valid, returns draftPages.
 * Otherwise returns published pages.
 */
router.get('/pages', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const preview = req.query.preview === 'true';
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (preview && token && verifySession(token)) {
    return res.json({
      isDraftPreview: true,
      pages: db.draftPages || db.pages || {}
    });
  }

  res.json({
    isDraftPreview: false,
    pages: db.pages || {}
  });
});

/**
 * GET /api/content/pages/:pageId
 */
router.get('/pages/:pageId', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const { pageId } = req.params;
  const preview = req.query.preview === 'true';
  const token = req.headers.authorization?.replace('Bearer ', '');

  const dataSource = (preview && token && verifySession(token)) ? (db.draftPages || db.pages) : db.pages;
  const pageData = dataSource?.[pageId];

  if (!pageData) {
    return res.status(404).json({ error: `Page '${pageId}' not found.` });
  }

  res.json(pageData);
});

/**
 * PUT /api/content/pages/:pageId
 * Updates content for a specific page.
 * By default, updates BOTH live published pages and draftPages immediately
 * so edits reflect instantly on the live public website.
 */
router.put('/pages/:pageId', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const { pageId } = req.params;
  if (!db.pages) db.pages = {};
  if (!db.draftPages) db.draftPages = JSON.parse(JSON.stringify(db.pages));

  const publishImmediately = req.query.publishImmediately !== 'false' && req.body.publishImmediately !== false;

  // Always update draft
  db.draftPages[pageId] = req.body;

  // Update live published content immediately by default
  if (publishImmediately) {
    db.pages[pageId] = req.body;
  }

  writeDB(db);

  logActivity(
    publishImmediately ? 'CONTENT_SAVED_AND_PUBLISHED' : 'DRAFT_CONTENT_UPDATED',
    `Updated content for page '${pageId}' (live published: ${publishImmediately})`,
    req.ip,
    req.adminUser.username
  );

  res.json({
    success: true,
    pageId,
    published: publishImmediately,
    content: db.pages[pageId] || db.draftPages[pageId]
  });
});

/**
 * POST /api/content/publish
 * Commits all draftPages to live published pages.
 */
router.post('/publish', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  if (!db.draftPages) {
    return res.status(400).json({ error: 'No draft content to publish.' });
  }

  // Backup previous published version
  db.pages = JSON.parse(JSON.stringify(db.draftPages));
  writeDB(db);

  logActivity('CONTENT_PUBLISHED', 'Published all draft page changes to live production', req.ip, req.adminUser.username);
  res.json({ success: true, message: 'All content published live to website successfully!', pages: db.pages });
});

/**
 * POST /api/content/discard-draft
 * Resets draft pages to current published pages.
 */
router.post('/discard-draft', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  db.draftPages = JSON.parse(JSON.stringify(db.pages || {}));
  writeDB(db);

  logActivity('DRAFT_DISCARDED', 'Discarded unpublished draft changes', req.ip, req.adminUser.username);
  res.json({ success: true, message: 'Draft changes reverted to current published version.', pages: db.draftPages });
});

export default router;

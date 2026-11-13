import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readDB, writeDB } from '../db.js';
import { requireAdminMiddleware, logActivity } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');
const DIST_UPLOADS_DIR = path.join(__dirname, '..', '..', 'dist', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const ensureDistUploads = () => {
  const distDir = path.join(__dirname, '..', '..', 'dist');
  if (fs.existsSync(distDir) && !fs.existsSync(DIST_UPLOADS_DIR)) {
    fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
  }
};
ensureDistUploads();

const saveUploadBuffer = (filename, buffer) => {
  try {
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
    ensureDistUploads();
    if (fs.existsSync(DIST_UPLOADS_DIR)) {
      try {
        fs.writeFileSync(path.join(DIST_UPLOADS_DIR, filename), buffer);
      } catch (e) {
        console.warn('[MEDIA] Could not copy to dist/uploads:', e.message);
      }
    }
    return true;
  } catch (fsErr) {
    console.warn('[MEDIA] Filesystem write skipped on serverless/read-only environment:', fsErr.message);
    return false;
  }
};

const deleteUploadFile = (filename) => {
  try {
    const p1 = path.join(UPLOADS_DIR, filename);
    if (fs.existsSync(p1)) {
      try { fs.unlinkSync(p1); } catch {}
    }
    const p2 = path.join(DIST_UPLOADS_DIR, filename);
    if (fs.existsSync(p2)) {
      try { fs.unlinkSync(p2); } catch {}
    }
  } catch (e) {}
};

const router = express.Router();

/**
 * GET /api/media
 * Search, filter by folder/category, list all media assets
 */
router.get('/', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let media = db.media || [];
  const { category, search } = req.query;

  if (category && category !== 'All') {
    media = media.filter(m => m.category?.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    media = media.filter(m =>
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.altText && m.altText.toLowerCase().includes(q)) ||
      (m.filename && m.filename.toLowerCase().includes(q))
    );
  }

  res.json(media);
});

/**
 * POST /api/media/upload
 * Accept base64 dataUrl or list of dataUrls
 */
router.post('/upload', requireAdminMiddleware, (req, res) => {
  const { dataUrl, filename, title, altText, category, items } = req.body;
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  if (!db.media) db.media = [];

  const uploadSingle = (dataUrlStr, origName, cat, customTitle, customAlt) => {
    const matches = dataUrlStr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 data format');
    }

    const mime = matches[1];
    let ext = mime.split('/')[1] || 'jpg';
    if (ext === 'jpeg') ext = 'jpg';

    const safeBase = (origName ? origName.replace(/\.[^.]+$/, '') : 'photo')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase();
    const storedFilename = `${safeBase}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
    const savedToDisk = saveUploadBuffer(storedFilename, Buffer.from(matches[2], 'base64'));
    
    // In serverless / Vercel with read-only disk, retain full dataUrl for persistence
    const url = (savedToDisk && !process.env.VERCEL) ? `/uploads/${storedFilename}` : dataUrlStr;

    const newMedia = {
      id: 'med-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      filename: storedFilename,
      url,
      dataUrl: dataUrlStr,
      title: customTitle || safeBase.replace(/[-_]/g, ' '),
      altText: customAlt || `Mineral Springs Retreat - ${safeBase.replace(/[-_]/g, ' ')}`,
      category: cat || 'General',
      uploadedAt: new Date().toISOString()
    };

    db.media.unshift(newMedia);
    return newMedia;
  };

  try {
    if (Array.isArray(items) && items.length > 0) {
      const results = items.map(item =>
        uploadSingle(item.dataUrl, item.filename, item.category || category, item.title, item.altText)
      );
      writeDB(db);
      logActivity('MEDIA_MULTI_UPLOAD', `Uploaded ${results.length} new photos`, req.ip, req.adminUser.username);
      return res.status(201).json({ success: true, count: results.length, media: results });
    }

    if (!dataUrl) {
      return res.status(400).json({ error: 'No image data provided.' });
    }

    const created = uploadSingle(dataUrl, filename, category, title, altText);
    writeDB(db);
    logActivity('MEDIA_UPLOAD', `Uploaded image '${created.filename}'`, req.ip, req.adminUser.username);
    return res.status(201).json({ success: true, media: created });
  } catch (err) {
    console.error('[MEDIA] Upload error:', err);
    return res.status(500).json({ error: 'Failed to process image upload: ' + err.message });
  }
});

/**
 * PUT /api/media/:id
 * Update title, alt text, category
 */
router.put('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.media) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.media.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Media asset not found.' });

  const { title, altText, category } = req.body;
  if (title !== undefined) db.media[idx].title = title;
  if (altText !== undefined) db.media[idx].altText = altText;
  if (category !== undefined) db.media[idx].category = category;
  db.media[idx].updatedAt = new Date().toISOString();

  writeDB(db);
  logActivity('MEDIA_METADATA_UPDATE', `Updated metadata for image '${db.media[idx].filename}'`, req.ip, req.adminUser.username);
  res.json({ success: true, media: db.media[idx] });
});

/**
 * POST /api/media/:id/replace
 * Replace an image file with a new photograph, and cascade update
 * every reference to the old image in pages, rooms, experiences, gallery, and settings!
 */
router.post('/:id/replace', requireAdminMiddleware, (req, res) => {
  const { dataUrl, filename } = req.body;
  if (!dataUrl) return res.status(400).json({ error: 'Replacement image data required.' });

  const db = readDB();
  if (!db || !db.media) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.media.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Media asset not found.' });

  const oldUrl = db.media[idx].url;

  try {
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format.' });
    }

    let ext = matches[1].split('/')[1] || 'jpg';
    if (ext === 'jpeg') ext = 'jpg';

    const safeBase = (filename ? filename.replace(/\.[^.]+$/, '') : 'replaced')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase();
    const storedFilename = `${safeBase}-${Date.now()}.${ext}`;
    saveUploadBuffer(storedFilename, Buffer.from(matches[2], 'base64'));
    const newUrl = `/uploads/${storedFilename}`;

    // Update media catalog entry
    db.media[idx].filename = storedFilename;
    db.media[idx].url = newUrl;
    db.media[idx].replacedAt = new Date().toISOString();

    // Cascading update across database JSON: replace oldUrl with newUrl
    const cascadeReplace = (obj) => {
      if (!obj) return;
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'string' && obj[key] === oldUrl) {
          obj[key] = newUrl;
        } else if (Array.isArray(obj[key])) {
          obj[key] = obj[key].map(item => (typeof item === 'string' && item === oldUrl ? newUrl : item));
          obj[key].forEach(item => {
            if (typeof item === 'object') cascadeReplace(item);
          });
        } else if (typeof obj[key] === 'object') {
          cascadeReplace(obj[key]);
        }
      }
    };

    if (db.pages) cascadeReplace(db.pages);
    if (db.draftPages) cascadeReplace(db.draftPages);
    if (db.rooms) cascadeReplace(db.rooms);
    if (db.experiences) cascadeReplace(db.experiences);
    if (db.gallery) cascadeReplace(db.gallery);
    if (db.settings) cascadeReplace(db.settings);

    writeDB(db);

    logActivity('MEDIA_REPLACED', `Replaced '${oldUrl}' with '${newUrl}' across all site references`, req.ip, req.adminUser.username);
    res.json({ success: true, message: 'Image replaced and website references automatically updated.', media: db.media[idx] });
  } catch (err) {
    console.error('[MEDIA] Replace error:', err);
    res.status(500).json({ error: 'Failed to replace image: ' + err.message });
  }
});

/**
 * DELETE /api/media/:id
 * Delete media item from library and disk if in uploads
 */
router.delete('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.media) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.media.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Media asset not found.' });

  const item = db.media[idx];

  // If in uploads dir, remove file from both public and dist uploads
  if (item.url?.startsWith('/uploads/')) {
    deleteUploadFile(path.basename(item.url));
  }

  db.media.splice(idx, 1);
  writeDB(db);

  logActivity('MEDIA_DELETED', `Deleted image '${item.filename}'`, req.ip, req.adminUser.username);
  res.json({ success: true, message: 'Image deleted from Media Library.' });
});

export default router;

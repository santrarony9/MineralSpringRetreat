import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { readDB, writeDB, dbSyncMiddleware } from './db.js';
import { runMigration } from './scripts/migrateDb.js';
import { requireAdminMiddleware } from './auth.js';

// Modular Route Handlers
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import mediaRoutes from './routes/media.js';
import roomsRoutes from './routes/rooms.js';
import experiencesRoutes from './routes/experiences.js';
import galleryRoutes from './routes/gallery.js';
import inquiriesRoutes from './routes/inquiries.js';
import designRoutes from './routes/design.js';
import guestsRoutes from './routes/guests.js';
import whatsappRoutes from './routes/whatsapp.js';
import usersRoutes from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env configuration natively
if (typeof process.loadEnvFile === 'function') {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath);
      console.log('[ENV] Loaded environment configuration from .env');
    }
  } catch (err) {
    console.warn('[ENV] Notice:', err.message);
  }
}

// Run DB migration & schema check on boot
runMigration();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(dbSyncMiddleware);
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Ensure uploads folder exists in public and dist
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const distUploadsDir = path.join(__dirname, '..', 'dist', 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  if (fs.existsSync(path.join(__dirname, '..', 'dist')) && !fs.existsSync(distUploadsDir)) {
    fs.mkdirSync(distUploadsDir, { recursive: true });
  }
} catch (e) {}

// Global cache-prevention middleware for all API requests
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Explicit, high-priority static route for uploads
app.use('/uploads', express.static(uploadsDir, {
  etag: false,
  maxAge: 0,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    property: 'Mineral Springs Retreat',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount Modular Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/experiences', experiencesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/design', designRoutes);
app.use('/api/guests', guestsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/users', usersRoutes);

// --- LEGACY COMPATIBILITY ENDPOINTS (Backward Compatibility) ---
app.post('/api/admin/login', (req, res, next) => {
  // Delegate to new auth handler
  req.url = '/login';
  authRoutes(req, res, next);
});

app.post('/api/admin/verify', (req, res, next) => {
  req.url = '/verify';
  authRoutes(req, res, next);
});

app.post('/api/admin/upload', requireAdminMiddleware, (req, res, next) => {
  req.url = '/upload';
  mediaRoutes(req, res, next);
});

// Legacy Settings GET & PUT
app.get('/api/settings', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database read error' });
  res.json(db.settings || {});
});

app.put('/api/settings', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database read error' });
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json({ success: true, settings: db.settings });
});

// Legacy Tariff
app.get('/api/tariff', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database read error' });
  res.json(db.tariffDetails || {});
});

// Legacy Travel
app.get('/api/travel', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database read error' });
  res.json(db.travelInfo || {});
});

// Legacy Perks
app.get('/api/perks', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database read error' });
  res.json(db.perks || []);
});

// Legacy Testimonials
app.get('/api/testimonials', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database read error' });
  res.json(db.testimonials || []);
});

// Admin Stats Overview
app.get('/api/admin/stats', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database read error' });
  const inquiries = db.inquiries || [];
  const rooms = db.rooms || [];
  const gallery = db.gallery || [];
  const experiences = db.experiences || [];
  const media = db.media || [];
  const guests = (db.users || []).filter(u => u.role === 'guest');
  const pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;
  const confirmedInquiries = inquiries.filter(i => i.status === 'Confirmed').length;
  res.json({
    totalInquiries: inquiries.length,
    pendingInquiries,
    confirmedInquiries,
    totalGuests: guests.length,
    totalRooms: rooms.length,
    totalGallery: gallery.length,
    totalExperiences: experiences.length,
    totalMedia: media.length
  });
});

// Serve static images and uploads with cache prevention
app.use(express.static(path.join(__dirname, '..', 'public'), {
  etag: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
}));

// Serve dist in production if built
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir, {
    etag: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));

  // Handle SPA routing for both /admin and public routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Mineral Springs Retreat CMS Backend running at http://localhost:${PORT}`);
  });
}

export default app;

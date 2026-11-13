import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const EXAMPLE_DB_PATH = path.join(DATA_DIR, 'db.example.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

// Auto-seed db.json from db.example.json if missing (e.g. fresh clone/deployment)
if (!fs.existsSync(DB_PATH) && fs.existsSync(EXAMPLE_DB_PATH)) {
  try {
    fs.copyFileSync(EXAMPLE_DB_PATH, DB_PATH);
    console.log('[DB] Initialized fresh server/data/db.json from template.');
  } catch (seedErr) {
    console.warn('[DB] Could not copy db.example.json:', seedErr.message);
  }
}

let writeLock = false;

/**
 * Read the entire database safely
 */
export function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return null;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[DB] Error reading db.json:', err);
    return null;
  }
}

/**
 * Write to the database atomically with automatic backup rotation
 */
export function writeDB(data) {
  if (writeLock) {
    // Retry shortly if write lock is held
    const start = Date.now();
    while (writeLock && Date.now() - start < 1500) {
      // spin briefly
    }
  }

  writeLock = true;
  try {
    const tempPath = DB_PATH + '.tmp.' + Date.now();
    const serialized = JSON.stringify(data, null, 2);
    fs.writeFileSync(tempPath, serialized, 'utf-8');

    // Create a rotating backup once per hour or if db.json exists
    try {
      if (fs.existsSync(DB_PATH)) {
        const backupFile = path.join(BACKUP_DIR, `db-backup-${new Date().toISOString().slice(0, 10)}.json`);
        if (!fs.existsSync(backupFile)) {
          fs.copyFileSync(DB_PATH, backupFile);
        }
      }
    } catch (bErr) {
      console.warn('[DB] Backup notice:', bErr.message);
    }

    fs.renameSync(tempPath, DB_PATH);
    return true;
  } catch (err) {
    console.error('[DB] Error writing db.json:', err);
    return false;
  } finally {
    writeLock = false;
  }
}

/**
 * Get a specific top-level collection or default
 */
export function getCollection(name, defaultValue = []) {
  const db = readDB();
  if (!db || db[name] === undefined) return defaultValue;
  return db[name];
}

/**
 * Update a specific top-level collection atomically
 */
export function setCollection(name, value) {
  const db = readDB() || {};
  db[name] = value;
  return writeDB(db);
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const EXAMPLE_DB_PATH = path.join(__dirname, 'data', 'db.example.json');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');

// In-memory cache for fast synchronous access
let inMemoryDB = null;
let lastCloudSyncTime = 0;
const CLOUD_SYNC_INTERVAL_MS = 2500; // re-sync from cloud store at most once per 2.5s

// Ensure directories exist safely
try {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });
} catch (e) {
  console.warn('[DB] Directory notice:', e.message);
}

// Auto-seed db.json from db.example.json if missing (fresh clone or new serverless container)
export function ensureLocalSeed() {
  if (!fs.existsSync(DB_PATH) && fs.existsSync(EXAMPLE_DB_PATH)) {
    try {
      fs.copyFileSync(EXAMPLE_DB_PATH, DB_PATH);
      console.log('[DB] Initialized fresh db.json from template at', DB_PATH);
    } catch (seedErr) {
      console.warn('[DB] Could not copy db.example.json:', seedErr.message);
    }
  }
}
ensureLocalSeed();

// KV Credentials helper (Vercel KV / Upstash Redis)
export const getKVConfig = () => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url, token };
  return null;
};

/**
 * Fetch database from Vercel KV / Upstash Redis
 */
export async function syncFromCloud() {
  const kv = getKVConfig();
  if (!kv) return null;

  try {
    const res = await fetch(`${kv.url}/get/msr_db`, {
      headers: { Authorization: `Bearer ${kv.token}` }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.result) {
      const parsed = typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
      inMemoryDB = parsed;
      lastCloudSyncTime = Date.now();
      // Cache to local /tmp file for fast synchronous reads
      try {
        fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
      } catch {}
      return parsed;
    }
  } catch (err) {
    console.warn('[DB] Cloud sync read error:', err.message);
  }
  return null;
}

/**
 * Save database to Vercel KV / Upstash Redis
 */
export async function flushToCloud(data) {
  const kv = getKVConfig();
  if (!kv) return false;

  try {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    const res = await fetch(`${kv.url}/set/msr_db`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.error('[DB] Cloud flush error:', err.message);
    return false;
  }
}

/**
 * Express middleware to ensure fresh cloud state on incoming requests
 */
export function dbSyncMiddleware(req, res, next) {
  if (getKVConfig() && Date.now() - lastCloudSyncTime > CLOUD_SYNC_INTERVAL_MS) {
    syncFromCloud()
      .catch(() => {})
      .finally(() => next());
  } else {
    next();
  }
}

let writeLock = false;

/**
 * Read the entire database safely
 */
export function readDB() {
  if (inMemoryDB) return inMemoryDB;

  ensureLocalSeed();
  try {
    if (!fs.existsSync(DB_PATH)) {
      if (fs.existsSync(EXAMPLE_DB_PATH)) {
        const tpl = JSON.parse(fs.readFileSync(EXAMPLE_DB_PATH, 'utf-8'));
        inMemoryDB = tpl;
        return tpl;
      }
      return null;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    inMemoryDB = parsed;
    return parsed;
  } catch (err) {
    console.error('[DB] Error reading db.json:', err);
    return null;
  }
}

/**
 * Write to the database atomically with automatic backup rotation and cloud flush
 */
export function writeDB(data) {
  inMemoryDB = data;

  // Flush to cloud asynchronously if KV is configured
  if (getKVConfig()) {
    flushToCloud(data).catch(err => {
      console.warn('[DB] Async cloud flush background notice:', err.message);
    });
  }

  if (writeLock) {
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

    // Create a rotating backup once per day if not in serverless
    if (!IS_VERCEL) {
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

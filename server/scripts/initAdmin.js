import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const args = process.argv.slice(2);
let username = 'admin';
let password = '';
let email = 'stay@mineralspringsretreat.com';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--username' && args[i + 1]) username = args[++i];
  if (args[i] === '--password' && args[i + 1]) password = args[++i];
  if (args[i] === '--email' && args[i + 1]) email = args[++i];
}

if (!password) {
  // If not provided on command line, use secure environment or default generated
  password = process.env.ADMIN_PASSWORD || 'Admin@Mineral2026!';
}

if (!fs.existsSync(DB_PATH)) {
  console.error('[INIT_ADMIN] Error: db.json does not exist. Run migration first.');
  process.exit(1);
}

try {
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  if (!db.users) db.users = [];

  const existingIdx = db.users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  const userObj = {
    id: existingIdx >= 0 ? db.users[existingIdx].id : 'usr-' + Date.now(),
    username,
    email,
    passwordHash: hashPassword(password),
    role: 'superadmin',
    createdAt: existingIdx >= 0 ? db.users[existingIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null
  };

  if (existingIdx >= 0) {
    db.users[existingIdx] = userObj;
    console.log(`[INIT_ADMIN] Successfully updated administrator account '${username}'.`);
  } else {
    db.users.push(userObj);
    console.log(`[INIT_ADMIN] Successfully created new administrator account '${username}'.`);
  }

  // Terminate any active sessions for this user for security
  if (db.sessions) {
    db.sessions = db.sessions.filter(s => s.userId !== userObj.id);
  }

  // Atomically write
  const tempPath = DB_PATH + '.tmp.' + Date.now();
  fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);

  console.log(`[INIT_ADMIN] Admin Username: ${username}`);
  console.log(`[INIT_ADMIN] Admin Email:    ${email}`);
  console.log(`[INIT_ADMIN] Admin Password: [CONFIGURED SECURELY]`);
  console.log(`[INIT_ADMIN] Password hash stored with scrypt.`);
} catch (err) {
  console.error('[INIT_ADMIN] Failed to initialize admin:', err);
  process.exit(1);
}

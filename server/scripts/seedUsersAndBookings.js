import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from '../auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
if (!db.users) db.users = [];

// 1. Super Admin (Website Owner)
const adminIdx = db.users.findIndex(u => u.username === 'admin');
if (adminIdx !== -1) {
  db.users[adminIdx].name = 'Website Owner';
  db.users[adminIdx].role = 'superadmin';
  db.users[adminIdx].status = 'active';
  db.users[adminIdx].phone = '+91 79081 92498';
  db.users[adminIdx].email = 'stay@mineralspringsretreat.com';
} else {
  db.users.unshift({
    id: 'usr-admin-1',
    username: 'admin',
    name: 'Website Owner',
    email: 'stay@mineralspringsretreat.com',
    phone: '+91 79081 92498',
    passwordHash: hashPassword('Admin@Mineral2026!'),
    role: 'superadmin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null
  });
}

// 2. Admin / Manager (Rajesh Sharma)
const managerIdx = db.users.findIndex(u => u.username === 'manager_rajesh');
const managerObj = {
  id: managerIdx !== -1 ? db.users[managerIdx].id : 'usr-manager-2',
  username: 'manager_rajesh',
  name: 'Rajesh Sharma',
  email: 'rajesh.manager@mineralspringsretreat.com',
  phone: '+91 98321 55443',
  passwordHash: hashPassword('Manager@2026!'),
  role: 'admin',
  status: 'active',
  createdAt: managerIdx !== -1 ? db.users[managerIdx].createdAt : new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: null
};
if (managerIdx !== -1) db.users[managerIdx] = managerObj;
else db.users.push(managerObj);

// 3. Staff (Priya Gurung)
const staffIdx = db.users.findIndex(u => u.username === 'staff_priya');
const staffObj = {
  id: staffIdx !== -1 ? db.users[staffIdx].id : 'usr-staff-3',
  username: 'staff_priya',
  name: 'Priya Gurung',
  email: 'priya.frontdesk@mineralspringsretreat.com',
  phone: '+91 98322 77889',
  passwordHash: hashPassword('Staff@2026!'),
  role: 'staff',
  status: 'active',
  createdAt: staffIdx !== -1 ? db.users[staffIdx].createdAt : new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: null
};
if (staffIdx !== -1) db.users[staffIdx] = staffObj;
else db.users.push(staffObj);

// 4. Ensure realistic sample inquiries
if (!db.inquiries || db.inquiries.length < 3) {
  db.inquiries = [
    {
      id: 'MSR-49175',
      guestName: 'Sarah Jenkins',
      email: 'sarah.jenkins@gmail.com',
      phone: '+91 79081 92498',
      room: 'Double Sharing Eco Room',
      checkIn: '2026-11-13',
      checkOut: '2026-11-15',
      guests: 2,
      estimatedTotal: 6000,
      status: 'Confirmed',
      paymentStatus: 'Fully Paid',
      message: 'Quiet corner room with valley view please.',
      createdAt: '2026-11-12T10:00:00.000Z',
      updatedAt: '2026-11-12T12:00:00.000Z'
    },
    {
      id: 'MSR-59665',
      guestName: 'Eleanor Vance',
      email: 'eleanor.vance@gmail.com',
      phone: '+91 98321 88888',
      room: 'Group & Family Cottage Suite',
      checkIn: '2026-11-18',
      checkOut: '2026-11-21',
      guests: 4,
      estimatedTotal: 18000,
      status: 'Pending',
      paymentStatus: 'Partial (Advance Paid)',
      message: 'Requesting bonfire evening on our second night.',
      createdAt: '2026-11-12T10:30:00.000Z',
      updatedAt: '2026-11-12T10:30:00.000Z'
    },
    {
      id: 'MSR-71284',
      guestName: 'Amitav Sengupta',
      email: 'amitav.sengupta@yahoo.co.in',
      phone: '+91 98324 77665',
      room: 'Twin Sharing Pine Balcony Room',
      checkIn: '2026-11-25',
      checkOut: '2026-11-28',
      guests: 2,
      estimatedTotal: 9000,
      status: 'Contacted',
      paymentStatus: 'Pay at Homestay',
      message: 'Need Darjeeling station pickup Bolero.',
      createdAt: '2026-11-12T11:00:00.000Z',
      updatedAt: '2026-11-12T11:45:00.000Z'
    },
    {
      id: 'MSR-88329',
      guestName: 'Rohan Banerjee',
      email: 'rohan.banerjee@gmail.com',
      phone: '+91 98326 44332',
      room: 'Double Sharing Eco Room',
      checkIn: '2026-12-01',
      checkOut: '2026-12-04',
      guests: 2,
      estimatedTotal: 9000,
      status: 'Pending',
      paymentStatus: 'Pending',
      message: 'Vegetarian meals preferred.',
      createdAt: '2026-11-12T11:15:00.000Z',
      updatedAt: '2026-11-12T11:15:00.000Z'
    }
  ];
}

fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
console.log('✓ Successfully seeded users and realistic bookings into db.json');

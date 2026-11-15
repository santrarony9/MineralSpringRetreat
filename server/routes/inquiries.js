import express from 'express';
import { readDB, writeDB } from '../db.js';
import {
  requireAdminMiddleware,
  requireAdminOrAboveMiddleware,
  requireGuestMiddleware,
  verifySession,
  logActivity
} from '../auth.js';
import { sendWhatsAppBookingNotification } from '../services/whatsapp.js';

const router = express.Router();

/**
 * Room Availability & Overlap Checker (Asia/Kolkata Timezone)
 * Returns day-by-day availability and detects any overlapping reservations.
 * Cancelled bookings strictly DO NOT block room availability.
 */
export function checkRoomAvailability(db, { roomId, checkIn, checkOut, excludeInquiryId = null, numRooms = 1 }) {
  const rooms = db.rooms || [];
  const room = rooms.find(r => r.id === roomId || r.name?.toLowerCase() === roomId?.toLowerCase());
  const totalUnits = room?.totalUnits || 2;

  // Active bookings for this room, excluding cancelled and current booking being edited
  const activeBookings = (db.inquiries || []).filter(i => {
    if (i.id === excludeInquiryId) return false;
    // Cancelled bookings strictly DO NOT block room availability
    if (i.status?.toLowerCase() === 'cancelled') return false;

    const matchesRoom = (
      i.roomId === roomId ||
      i.roomId === room?.id ||
      i.room?.toLowerCase() === room?.name?.toLowerCase() ||
      i.room?.toLowerCase() === roomId?.toLowerCase()
    );
    return matchesRoom;
  });

  const conflicts = [];
  const start = new Date(checkIn + 'T00:00:00+05:30');
  const end = new Date(checkOut + 'T00:00:00+05:30');

  let cur = new Date(start);
  while (cur < end) {
    const curDateStr = cur.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    // Active bookings occupying this night (curDateStr)
    const overlapping = activeBookings.filter(b => {
      // b occupies night D if b.checkIn <= D < b.checkOut
      return b.checkIn <= curDateStr && curDateStr < b.checkOut;
    });

    const bookedUnits = overlapping.reduce((sum, b) => sum + (Number(b.numRooms) || 1), 0);
    const requestedUnits = Number(numRooms) || 1;

    if (bookedUnits + requestedUnits > totalUnits) {
      conflicts.push({
        date: curDateStr,
        bookedUnits,
        totalUnits,
        availableUnits: Math.max(0, totalUnits - bookedUnits),
        overlappingBookings: overlapping.map(b => ({
          id: b.id,
          guestName: b.guestName,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          status: b.status
        }))
      });
    }

    cur.setDate(cur.getDate() + 1);
  }

  return {
    isAvailable: conflicts.length === 0,
    roomName: room?.name || roomId,
    totalUnits,
    conflicts
  };
}

/**
 * GET /api/inquiries/availability
 * Protected: requires admin
 * Returns day-by-day room inventory and availability matrix for calendar views
 */
router.get('/availability', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const rooms = (db.rooms || []).map(r => ({
    id: r.id,
    name: r.name,
    totalUnits: r.totalUnits || 2,
    pricePerPerson: r.pricePerPerson || 1500
  }));

  // Determine date range in Asia/Kolkata
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  if (!startDate || !endDate) {
    // Default to current month in Asia/Kolkata
    const now = new Date();
    const curYear = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric' });
    const curMonth = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata', month: '2-digit' });
    startDate = req.query.month ? `${req.query.month}-01` : `${curYear}-${curMonth}-01`;

    const [y, m] = (req.query.month || `${curYear}-${curMonth}`).split('-').map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    endDate = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }

  const activeInquiries = (db.inquiries || []).filter(i => i.status?.toLowerCase() !== 'cancelled');

  const days = [];
  const start = new Date(startDate + 'T00:00:00+05:30');
  const end = new Date(endDate + 'T00:00:00+05:30');

  let cur = new Date(start);
  while (cur <= end) {
    const curDateStr = cur.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    const dayRooms = rooms.map(room => {
      const dayBookings = activeInquiries.filter(i => {
        const matchesRoom = (
          i.roomId === room.id ||
          i.room?.toLowerCase() === room.name.toLowerCase()
        );
        return matchesRoom && i.checkIn <= curDateStr && curDateStr < i.checkOut;
      });

      const bookedUnits = dayBookings.reduce((sum, b) => sum + (Number(b.numRooms) || 1), 0);
      const availableUnits = Math.max(0, room.totalUnits - bookedUnits);

      let status = 'available';
      if (bookedUnits >= room.totalUnits) {
        status = 'sold_out';
      } else if (bookedUnits > 0) {
        status = 'limited';
      }

      return {
        roomId: room.id,
        roomName: room.name,
        totalUnits: room.totalUnits,
        bookedUnits,
        availableUnits,
        status,
        bookings: dayBookings.map(b => ({
          id: b.id,
          guestName: b.guestName,
          status: b.status,
          numRooms: b.numRooms || 1
        }))
      };
    });

    const totalUnitsAll = dayRooms.reduce((sum, r) => sum + r.totalUnits, 0);
    const totalBookedAll = dayRooms.reduce((sum, r) => sum + r.bookedUnits, 0);
    const totalAvailAll = Math.max(0, totalUnitsAll - totalBookedAll);

    let overallStatus = 'available';
    if (totalBookedAll >= totalUnitsAll) {
      overallStatus = 'sold_out';
    } else if (totalBookedAll > 0) {
      overallStatus = 'limited';
    }

    days.push({
      date: curDateStr,
      rooms: dayRooms,
      totalUnits: totalUnitsAll,
      bookedUnits: totalBookedAll,
      availableUnits: totalAvailAll,
      overallStatus
    });

    cur.setDate(cur.getDate() + 1);
  }

  res.json({
    startDate,
    endDate,
    rooms,
    days
  });
});

/**
 * POST /api/inquiries/manual
 * Protected: requires admin
 * Allows admin to create a manual booking directly from the Calendar or Admin Panel
 */
router.post('/manual', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  if (!db.inquiries) db.inquiries = [];

  const {
    guestName,
    email,
    phone,
    roomId,
    roomName,
    checkIn,
    checkOut,
    adults,
    children,
    numRooms,
    specialRequests,
    status = 'Confirmed',
    ratePerPerson,
    overrideOverlap = false
  } = req.body;

  if (!guestName || !phone || !checkIn || !checkOut) {
    return res.status(400).json({
      error: 'Please provide Guest Name, Phone, Check-in date, and Check-out date.'
    });
  }

  const start = new Date(checkIn + 'T00:00:00+05:30');
  const end = new Date(checkOut + 'T00:00:00+05:30');

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  if (end <= start) {
    return res.status(400).json({ error: 'Check-out date must be strictly after check-in date.' });
  }

  const diffTime = Math.abs(end - start);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const matchedRoom = (db.rooms || []).find(r => r.id === roomId || r.name === roomName) || {
    id: 'double-sharing',
    name: roomName || 'Double Sharing Eco Room',
    pricePerPerson: 1500,
    totalUnits: 2
  };

  const requestedUnits = Number(numRooms) || 1;
  const bookingStatus = status === 'Confirmed' ? 'Confirmed' : 'Pending';

  // Check room availability for confirmed or pending bookings
  if (!overrideOverlap) {
    const availCheck = checkRoomAvailability(db, {
      roomId: matchedRoom.id,
      checkIn,
      checkOut,
      numRooms: requestedUnits
    });

    if (!availCheck.isAvailable) {
      return res.status(409).json({
        error: `Room '${matchedRoom.name}' is already fully booked on: ${availCheck.conflicts.map(c => c.date).join(', ')}. Please choose other dates or select another accommodation.`,
        code: 'ROOM_OVERLAPPING',
        conflicts: availCheck.conflicts
      });
    }
  }

  const totalAdults = Number(adults) || 2;
  const unitRate = Number(ratePerPerson) || matchedRoom.pricePerPerson || 1500;
  const calculatedTotal = unitRate * totalAdults * nights;

  const now = new Date().toISOString();
  const newInquiry = {
    id: 'MSR-' + Math.floor(10000 + Math.random() * 90000),
    guestId: 'manual-' + Date.now(),
    googleId: null,
    createdAt: now,
    guestName: guestName.trim(),
    email: (email || '').trim(),
    phone: phone.trim(),
    roomId: matchedRoom.id,
    room: matchedRoom.name,
    checkIn,
    checkOut,
    nights,
    adults: totalAdults,
    children: Number(children) || 0,
    numRooms: requestedUnits,
    specialRequests: specialRequests ? specialRequests.trim() : '',
    ratePerPerson: unitRate,
    estimatedTotal: calculatedTotal,
    status: bookingStatus,
    isManualBooking: true,
    createdBy: req.adminUser.username || 'Admin',
    statusHistory: [
      {
        status: bookingStatus,
        timestamp: now,
        changedBy: `${req.adminUser.username || 'Admin'} (Admin Manual Booking)`
      }
    ],
    internalNotes: [
      {
        id: 'note-' + Date.now(),
        text: `Manual booking created by ${req.adminUser.username || 'Admin'} via Booking Calendar.`,
        author: req.adminUser.username || 'Admin',
        timestamp: now
      }
    ],
    enquiryNote: `Manual reservation created by administrator ${req.adminUser.username || 'Admin'}.`
  };

  db.inquiries.unshift(newInquiry);
  writeDB(db);

  logActivity(
    'MANUAL_BOOKING_CREATED',
    `Administrator '${req.adminUser.username}' created manual booking ${newInquiry.id} for '${guestName}' (${matchedRoom.name}, ${checkIn} to ${checkOut}, Status: ${bookingStatus})`,
    req.ip,
    req.adminUser.username
  );

  // Trigger automated WhatsApp notification to host
  sendWhatsAppBookingNotification(newInquiry, 'new').catch(err => {
    console.error('[WHATSAPP] Manual booking notification error:', err);
  });

  res.status(201).json({
    success: true,
    message: `Manual reservation ${newInquiry.id} created successfully!`,
    inquiry: newInquiry
  });
});

/**
 * PUT /api/inquiries/:id
 * Protected: requires admin
 * Full update for an inquiry from Admin / Calendar
 */
router.put('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.inquiries) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.inquiries.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });

  const existing = db.inquiries[idx];
  const now = new Date().toISOString();

  const {
    guestName,
    email,
    phone,
    roomId,
    room,
    checkIn,
    checkOut,
    adults,
    children,
    numRooms,
    specialRequests,
    status,
    overrideOverlap = false
  } = req.body;

  const targetRoomId = roomId || existing.roomId;
  const targetCheckIn = checkIn || existing.checkIn;
  const targetCheckOut = checkOut || existing.checkOut;
  const targetUnits = Number(numRooms) || existing.numRooms || 1;
  const targetStatus = status || existing.status;

  // Validate dates if updated
  if (checkIn || checkOut) {
    const start = new Date(targetCheckIn + 'T00:00:00+05:30');
    const end = new Date(targetCheckOut + 'T00:00:00+05:30');
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ error: 'Check-out date must be strictly after check-in date.' });
    }
  }

  // Check overlap if confirmed or becoming confirmed, unless overridden
  if (targetStatus === 'Confirmed' && !overrideOverlap) {
    const availCheck = checkRoomAvailability(db, {
      roomId: targetRoomId,
      checkIn: targetCheckIn,
      checkOut: targetCheckOut,
      numRooms: targetUnits,
      excludeInquiryId: existing.id
    });

    if (!availCheck.isAvailable) {
      return res.status(409).json({
        error: `Cannot update booking: Room is already booked on dates: ${availCheck.conflicts.map(c => c.date).join(', ')}.`,
        code: 'ROOM_OVERLAPPING',
        conflicts: availCheck.conflicts
      });
    }
  }

  // Recalculate nights and total
  const start = new Date(targetCheckIn + 'T00:00:00+05:30');
  const end = new Date(targetCheckOut + 'T00:00:00+05:30');
  const diffTime = Math.abs(end - start);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const matchedRoom = (db.rooms || []).find(r => r.id === targetRoomId || r.name === room) || {
    name: room || existing.room,
    pricePerPerson: existing.ratePerPerson || 1500
  };

  const totalAdults = Number(adults) !== undefined ? Number(adults) : existing.adults;
  const ratePerPerson = matchedRoom.pricePerPerson || existing.ratePerPerson || 1500;
  const estimatedTotal = ratePerPerson * totalAdults * nights;

  const statusChanged = targetStatus && targetStatus !== existing.status;
  const isCancelled = targetStatus?.toLowerCase() === 'cancelled';
  const datesChanged = (targetCheckIn !== existing.checkIn) || (targetCheckOut !== existing.checkOut);

  if (statusChanged) {
    if (!existing.statusHistory) existing.statusHistory = [];
    existing.statusHistory.push({
      status: targetStatus,
      timestamp: now,
      changedBy: req.adminUser.username || 'Admin'
    });
  }

  db.inquiries[idx] = {
    ...existing,
    guestName: guestName ? guestName.trim() : existing.guestName,
    email: email !== undefined ? email.trim() : existing.email,
    phone: phone ? phone.trim() : existing.phone,
    roomId: targetRoomId,
    room: matchedRoom.name,
    checkIn: targetCheckIn,
    checkOut: targetCheckOut,
    nights,
    adults: totalAdults,
    children: children !== undefined ? Number(children) : existing.children,
    numRooms: targetUnits,
    specialRequests: specialRequests !== undefined ? specialRequests.trim() : existing.specialRequests,
    ratePerPerson,
    estimatedTotal,
    status: targetStatus,
    updatedAt: now,
    modifiedBy: req.adminUser.username || 'Admin'
  };

  const updated = db.inquiries[idx];
  writeDB(db);

  logActivity(
    'INQUIRY_UPDATED',
    `Administrator '${req.adminUser.username}' updated booking ${existing.id} (${updated.guestName}, ${updated.room}, Status: ${updated.status})`,
    req.ip,
    req.adminUser.username
  );

  // Send WhatsApp notifications on cancellation or date changes
  if (isCancelled && !existing.whatsapp_cancel_sent) {
    sendWhatsAppBookingNotification(updated, 'cancel').catch(err => {
      console.error('[WHATSAPP] Cancellation notification error:', err);
    });
  } else if (datesChanged) {
    sendWhatsAppBookingNotification(updated, 'modify').catch(err => {
      console.error('[WHATSAPP] Modification notification error:', err);
    });
  }

  res.json({ success: true, inquiry: updated });
});

/**
 * GET /api/inquiries
 * Protected: requires admin
 */
router.get('/', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  let inquiries = (db.inquiries || []).slice();
  const { status, search } = req.query;

  if (status && status !== 'all') {
    inquiries = inquiries.filter(i => i.status?.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    inquiries = inquiries.filter(i =>
      (i.guestName && i.guestName.toLowerCase().includes(q)) ||
      (i.email && i.email.toLowerCase().includes(q)) ||
      (i.phone && i.phone.includes(q)) ||
      (i.id && i.id.toLowerCase().includes(q))
    );
  }

  res.json(inquiries);
});

/**
 * GET /api/inquiries/export-csv
 * Protected: requires Admin or Super Admin. Exports all bookings as CSV.
 */
router.get('/export-csv', requireAdminOrAboveMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const inquiries = db.inquiries || [];

  const headers = [
    'Reference ID',
    'Guest Name',
    'Email',
    'Phone',
    'Room / Suite',
    'Check-In',
    'Check-Out',
    'Nights',
    'Adults',
    'Children',
    'Rooms Count',
    'Estimated Total (INR)',
    'Status',
    'Created At',
    'Special Requests'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = inquiries.map(i => [
    escapeCSV(i.id),
    escapeCSV(i.guestName),
    escapeCSV(i.email),
    escapeCSV(i.phone),
    escapeCSV(i.room),
    escapeCSV(i.checkIn),
    escapeCSV(i.checkOut),
    escapeCSV(i.nights),
    escapeCSV(i.adults),
    escapeCSV(i.children || 0),
    escapeCSV(i.numRooms || 1),
    escapeCSV(i.estimatedTotal),
    escapeCSV(i.status),
    escapeCSV(i.createdAt),
    escapeCSV(i.specialRequests || '')
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const filename = `mineral-springs-reservations-${new Date().toISOString().split('T')[0]}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csvContent);
});

/**
 * GET /api/inquiries/my-bookings
 * Protected: requires guest authentication. Guests only see their own bookings.
 */
router.get('/my-bookings', requireGuestMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const guestId = req.guestUser.id;
  const guestEmail = (req.guestUser.email || '').toLowerCase();

  const userInquiries = (db.inquiries || []).filter(i => {
    if (i.guestId && i.guestId === guestId) return true;
    if (guestEmail && i.email && i.email.toLowerCase() === guestEmail) return true;
    return false;
  });

  res.json(userInquiries);
});

/**
 * POST /api/inquiries
 * Guest-authenticated submission of reservation inquiry.
 */
router.post('/', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  if (!db.inquiries) db.inquiries = [];

  // Authenticate Guest
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'Please sign in with your Google account before submitting a reservation inquiry.',
      code: 'AUTH_REQUIRED'
    });
  }

  const sessionData = verifySession(token);
  if (!sessionData || !sessionData.user) {
    return res.status(401).json({
      error: 'Your session has expired. Please sign in again with your Google account.',
      code: 'SESSION_EXPIRED'
    });
  }

  const guestUser = sessionData.user;

  const {
    guestName,
    email,
    phone,
    roomId,
    roomName,
    checkIn,
    checkOut,
    adults,
    children,
    numRooms,
    specialRequests
  } = req.body;

  // Validation
  if (!guestName || !email || !phone || !checkIn || !checkOut) {
    return res.status(400).json({
      error: 'Please provide all required fields (Name, Email, Phone, Check-in, Check-out)'
    });
  }

  // Strict Date Validation
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      error: 'Invalid check-in or check-out date format.'
    });
  }

  if (end <= start) {
    return res.status(400).json({
      error: 'Check-out date must be strictly after check-in date.'
    });
  }

  const diffTime = Math.abs(end - start);
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const matchedRoom = (db.rooms || []).find(r => r.id === roomId) || {
    name: roomName || 'Eco Mountain Room',
    pricePerPerson: 1500
  };

  const totalAdults = Number(adults) || 2;
  const ratePerPerson = matchedRoom.pricePerPerson || 1500;
  const estimatedTotal = ratePerPerson * totalAdults * nights;

  const now = new Date().toISOString();
  const newInquiry = {
    id: 'MSR-' + Math.floor(10000 + Math.random() * 90000),
    guestId: guestUser.id,
    googleId: guestUser.googleId || null,
    createdAt: now,
    guestName: guestName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    roomId: roomId || 'general',
    room: matchedRoom.name,
    checkIn,
    checkOut,
    nights,
    adults: totalAdults,
    children: Number(children) || 0,
    numRooms: Number(numRooms) || 1,
    specialRequests: specialRequests ? specialRequests.trim() : '',
    ratePerPerson,
    estimatedTotal,
    status: 'Pending',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: now,
        changedBy: `${guestName} (Guest Submission)`
      }
    ],
    internalNotes: [],
    enquiryNote: 'Inquiry received. Reservation requires confirmation by retreat host.'
  };

  db.inquiries.unshift(newInquiry);
  writeDB(db);

  logActivity(
    'INQUIRY_CREATED',
    `Guest '${guestName}' (${email}) submitted booking inquiry ${newInquiry.id} for ${matchedRoom.name} (${checkIn} to ${checkOut})`,
    req.ip,
    email
  );

  // Automatically trigger WhatsApp notification to the host
  // Triggered strictly from the backend AFTER the booking is saved to the database
  sendWhatsAppBookingNotification(newInquiry).catch(err => {
    console.error('[WHATSAPP] Automatic notification exception:', err);
  });

  // Generate WhatsApp inquiry links for both numbers
  const hostPhone = db.settings?.whatsapp || db.settings?.phone || '+917908192498';
  const cleanPhone = hostPhone.replace(/[^0-9]/g, '');
  const hostPhone2 = db.settings?.whatsapp2 || db.settings?.phone2 || '+919830355105';
  const cleanPhone2 = hostPhone2.replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    `Hello Mineral Springs Retreat!\n\n` +
    `I have submitted a booking inquiry on your website:\n` +
    `• Reference: ${newInquiry.id}\n` +
    `• Room: ${newInquiry.room}\n` +
    `• Dates: ${checkIn} to ${checkOut} (${nights} night${nights > 1 ? 's' : ''})\n` +
    `• Guests: ${adults} Adults${children > 0 ? `, ${children} Children` : ''}\n` +
    `• Guest Name: ${guestName}\n` +
    `• Phone: ${phone}\n` +
    (specialRequests ? `• Requests: ${specialRequests}\n\n` : `\n`) +
    `Please review my dates and let me know about availability and confirmation. Thank you!`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${waText}`;
  const whatsappUrl2 = `https://wa.me/${cleanPhone2}?text=${waText}`;

  res.status(201).json({
    success: true,
    message: 'Booking inquiry received! Our host desk will contact you shortly.',
    inquiry: newInquiry,
    whatsappUrl,
    whatsappUrl2,
    hostPhone1: '+91 79081 92498',
    hostPhone2: '+91 98303 55105'
  });
});

/**
 * POST /api/inquiries/:id/notes
 * Admin: Add internal note to inquiry
 */
router.post('/:id/notes', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.inquiries) return res.status(500).json({ error: 'Database unavailable' });

  const inquiry = db.inquiries.find(i => i.id === req.params.id);
  if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

  const { note } = req.body;
  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Note text is required' });
  }

  if (!inquiry.internalNotes) inquiry.internalNotes = [];

  const noteEntry = {
    id: 'note-' + Date.now(),
    text: note.trim(),
    author: req.adminUser.username || 'Admin',
    timestamp: new Date().toISOString()
  };

  inquiry.internalNotes.push(noteEntry);
  writeDB(db);

  logActivity('INQUIRY_NOTE_ADDED', `Admin added internal note to ${inquiry.id}`, req.ip, req.adminUser.username);

  res.json({ success: true, inquiry, note: noteEntry });
});

/**
 * PATCH /api/inquiries/:id
 * Admin: Update status or inquiry details
 */
router.patch('/:id', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.inquiries) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.inquiries.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });

  const existing = db.inquiries[idx];
  const now = new Date().toISOString();

  // If status is becoming 'Confirmed' or dates are being changed, check availability unless overridden
  if (req.body.status === 'Confirmed' && existing.status !== 'Confirmed' && !req.body.overrideOverlap) {
    const targetRoomId = req.body.roomId || existing.roomId;
    const targetCheckIn = req.body.checkIn || existing.checkIn;
    const targetCheckOut = req.body.checkOut || existing.checkOut;
    const targetUnits = Number(req.body.numRooms) || existing.numRooms || 1;

    const availCheck = checkRoomAvailability(db, {
      roomId: targetRoomId,
      checkIn: targetCheckIn,
      checkOut: targetCheckOut,
      numRooms: targetUnits,
      excludeInquiryId: existing.id
    });

    if (!availCheck.isAvailable) {
      return res.status(409).json({
        error: `Cannot confirm booking: Room has overlapping confirmed reservations on dates: ${availCheck.conflicts.map(c => c.date).join(', ')}.`,
        code: 'ROOM_OVERLAPPING',
        conflicts: availCheck.conflicts
      });
    }
  }

  // If status is being updated, log in statusHistory
  const statusChanged = req.body.status && req.body.status !== existing.status;
  const isCancelled = req.body.status?.toLowerCase() === 'cancelled';
  const datesChanged = (req.body.checkIn && req.body.checkIn !== existing.checkIn) ||
                       (req.body.checkOut && req.body.checkOut !== existing.checkOut) ||
                       (req.body.room && req.body.room !== existing.room);

  if (statusChanged) {
    if (!existing.statusHistory) existing.statusHistory = [];
    existing.statusHistory.push({
      status: req.body.status,
      timestamp: now,
      changedBy: req.adminUser.username || 'Admin'
    });
  }

  db.inquiries[idx] = {
    ...existing,
    ...req.body,
    updatedAt: now
  };

  const updatedInquiry = db.inquiries[idx];
  writeDB(db);
  logActivity('INQUIRY_STATUS_UPDATED', `Updated inquiry ${existing.id} status to '${updatedInquiry.status}'`, req.ip, req.adminUser.username);

  // Trigger automated WhatsApp notification for cancellation or modification events
  if (isCancelled) {
    sendWhatsAppBookingNotification(updatedInquiry, 'cancel').catch(err => {
      console.error('[WHATSAPP] Cancellation notification error:', err);
    });
  } else if (datesChanged) {
    sendWhatsAppBookingNotification(updatedInquiry, 'modify').catch(err => {
      console.error('[WHATSAPP] Modification notification error:', err);
    });
  }

  res.json({ success: true, inquiry: updatedInquiry });
});

/**
 * POST /api/inquiries/:id/cancel
 * Guest or Admin: Cancel an existing booking inquiry
 */
router.post('/:id/cancel', (req, res) => {
  const db = readDB();
  if (!db || !db.inquiries) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.inquiries.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });

  const inquiry = db.inquiries[idx];
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required to cancel booking.' });
  }

  const session = verifySession(token);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const user = session.user;
  const isAdmin = user.role === 'admin' || user.role === 'superadmin' || user.role === 'manager';
  const isOwner = (inquiry.guestId && inquiry.guestId === user.id) ||
                  (inquiry.email && user.email && inquiry.email.toLowerCase() === user.email.toLowerCase());

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ error: 'You do not have permission to cancel this booking.' });
  }

  const now = new Date().toISOString();
  inquiry.status = 'Cancelled';
  inquiry.updatedAt = now;
  inquiry.cancelledAt = now;
  inquiry.cancelledBy = user.username || user.name || user.email || 'Guest';

  if (!inquiry.statusHistory) inquiry.statusHistory = [];
  inquiry.statusHistory.push({
    status: 'Cancelled',
    timestamp: now,
    changedBy: inquiry.cancelledBy
  });

  writeDB(db);

  logActivity(
    'INQUIRY_CANCELLED',
    `Booking ${inquiry.id} cancelled by ${inquiry.cancelledBy}`,
    req.ip,
    user.email || user.username
  );

  // Automatically trigger WhatsApp cancellation alert to the host
  sendWhatsAppBookingNotification(inquiry, 'cancel').catch(err => {
    console.error('[WHATSAPP] Cancellation notification exception:', err);
  });

  res.json({
    success: true,
    message: 'Booking cancelled successfully. The host has been notified.',
    inquiry
  });
});

/**
 * PUT /api/inquiries/:id/modify
 * Guest or Admin: Modify dates, guests, or details of an existing booking
 */
router.put('/:id/modify', (req, res) => {
  const db = readDB();
  if (!db || !db.inquiries) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.inquiries.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });

  const inquiry = db.inquiries[idx];
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required to modify booking.' });
  }

  const session = verifySession(token);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const user = session.user;
  const isAdmin = user.role === 'admin' || user.role === 'superadmin' || user.role === 'manager';
  const isOwner = (inquiry.guestId && inquiry.guestId === user.id) ||
                  (inquiry.email && user.email && inquiry.email.toLowerCase() === user.email.toLowerCase());

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ error: 'You do not have permission to modify this booking.' });
  }

  const {
    checkIn,
    checkOut,
    adults,
    children,
    numRooms,
    room,
    specialRequests
  } = req.body;

  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res.status(400).json({ error: 'Invalid check-in or check-out dates.' });
    }
    const diffTime = Math.abs(end - start);
    inquiry.nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    inquiry.checkIn = checkIn;
    inquiry.checkOut = checkOut;
  }

  if (adults !== undefined) inquiry.adults = Number(adults) || 1;
  if (children !== undefined) inquiry.children = Number(children) || 0;
  if (numRooms !== undefined) inquiry.numRooms = Number(numRooms) || 1;
  if (room) inquiry.room = room;
  if (specialRequests !== undefined) inquiry.specialRequests = specialRequests.trim();

  // Recalculate estimatedTotal
  const ratePerPerson = inquiry.ratePerPerson || 1500;
  inquiry.estimatedTotal = ratePerPerson * (inquiry.adults || 1) * (inquiry.nights || 1);

  const now = new Date().toISOString();
  inquiry.updatedAt = now;
  inquiry.modifiedBy = user.username || user.name || user.email || 'Guest';

  if (!inquiry.statusHistory) inquiry.statusHistory = [];
  inquiry.statusHistory.push({
    status: inquiry.status,
    timestamp: now,
    changedBy: `${inquiry.modifiedBy} (Booking Modified)`
  });

  // Reset modify flag so host receives updated notification
  delete inquiry.whatsapp_modify_sent;

  writeDB(db);

  logActivity(
    'INQUIRY_MODIFIED',
    `Booking ${inquiry.id} modified by ${inquiry.modifiedBy}`,
    req.ip,
    user.email || user.username
  );

  // Automatically trigger WhatsApp modification alert to the host
  sendWhatsAppBookingNotification(inquiry, 'modify').catch(err => {
    console.error('[WHATSAPP] Modification notification exception:', err);
  });

  res.json({
    success: true,
    message: 'Booking updated successfully. The host has been notified of the changes.',
    inquiry
  });
});

/**
 * DELETE /api/inquiries/:id
 * Admin or Super Admin: Delete inquiry
 */
router.delete('/:id', requireAdminOrAboveMiddleware, (req, res) => {
  const db = readDB();
  if (!db || !db.inquiries) return res.status(500).json({ error: 'Database unavailable' });

  const idx = db.inquiries.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Inquiry not found' });

  const id = db.inquiries[idx].id;
  db.inquiries.splice(idx, 1);
  writeDB(db);

  logActivity('INQUIRY_DELETED', `Deleted inquiry ${id}`, req.ip, req.adminUser.username);
  res.json({ success: true, message: 'Inquiry deleted' });
});

export default router;

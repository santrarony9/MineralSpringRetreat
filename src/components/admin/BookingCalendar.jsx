import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter, Search,
  Plus, RefreshCw, X, CheckCircle, AlertTriangle, Clock, Ban,
  Eye, Edit2, Users, BedDouble, Phone, Mail, Check, AlertCircle,
  CalendarDays, List, Columns, Sun, ShieldAlert, ArrowRight,
  ExternalLink, CheckCheck, MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * Returns current date string in Asia/Kolkata timezone (YYYY-MM-DD)
 */
function getKolkataDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Format date for friendly display (e.g., "Nov 14, 2026")
 */
function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function BookingCalendar({ onNavigateToInquiries }) {
  const {
    inquiries,
    loadInquiries,
    rooms,
    adminToken,
    adminUser,
    cancelBooking,
    createManualBooking,
    updateBooking
  } = useApp();

  // Active view: 'month' | 'week' | 'day' | 'list'
  const [view, setView] = useState('month');

  // Currently focused date (in Asia/Kolkata)
  const todayStr = useMemo(() => getKolkataDateString(), []);
  const [currentDate, setCurrentDate] = useState(() => {
    const [y, m, d] = todayStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  });

  // Selected booking for detailed panel
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [overlapWarning, setOverlapWarning] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    roomId: 'double-sharing',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    numRooms: 1,
    status: 'Confirmed',
    specialRequests: '',
    ratePerPerson: 1500,
    overrideOverlap: false
  });

  // Filters state
  const [filterRoom, setFilterRoom] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCheckIn, setFilterCheckIn] = useState('');
  const [filterCheckOut, setFilterCheckOut] = useState('');

  // Availability matrix state from backend
  const [availability, setAvailability] = useState(null);
  const [loadingAvail, setLoadingAvail] = useState(false);

  // Fetch availability for current visible range
  const fetchAvailability = useCallback(async () => {
    if (!adminToken) return;
    try {
      setLoadingAvail(true);
      const y = currentDate.getFullYear();
      const m = String(currentDate.getMonth() + 1).padStart(2, '0');
      const res = await fetch(`/api/inquiries/availability?month=${y}-${m}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAvailability(data);
      }
    } catch (err) {
      console.error('Error fetching calendar availability:', err);
    } finally {
      setLoadingAvail(false);
    }
  }, [adminToken, currentDate]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Current year & month numbers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Month navigation
  const prevPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (view === 'week') {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 7);
      setCurrentDate(prev);
    } else if (view === 'day') {
      const prev = new Date(currentDate);
      prev.setDate(prev.getDate() - 1);
      setCurrentDate(prev);
    }
  };

  const nextPeriod = () => {
    if (view === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (view === 'week') {
      const nxt = new Date(currentDate);
      nxt.setDate(nxt.getDate() + 7);
      setCurrentDate(nxt);
    } else if (view === 'day') {
      const nxt = new Date(currentDate);
      nxt.setDate(nxt.getDate() + 1);
      setCurrentDate(nxt);
    }
  };

  const goToToday = () => {
    const [y, m, d] = todayStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, d));
  };

  // Header Title based on active view
  const headerTitle = useMemo(() => {
    if (view === 'month' || view === 'list') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    if (view === 'week') {
      const dayOfWeek = currentDate.getDay();
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - dayOfWeek);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    if (view === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
    return '';
  }, [view, currentDate]);

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return (inquiries || []).filter(b => {
      // Room filter
      if (filterRoom !== 'all') {
        const matchesRoom = b.roomId === filterRoom || b.room?.toLowerCase() === filterRoom.toLowerCase();
        if (!matchesRoom) return false;
      }
      // Status filter
      if (filterStatus !== 'all') {
        if (b.status?.toLowerCase() !== filterStatus.toLowerCase()) return false;
      }
      // Search filter (name, id, phone, email)
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase().trim();
        const matchesQ = (
          (b.guestName && b.guestName.toLowerCase().includes(q)) ||
          (b.id && b.id.toLowerCase().includes(q)) ||
          (b.phone && b.phone.includes(q)) ||
          (b.email && b.email.toLowerCase().includes(q))
        );
        if (!matchesQ) return false;
      }
      // Check-in filter
      if (filterCheckIn && b.checkIn < filterCheckIn) return false;
      // Check-out filter
      if (filterCheckOut && b.checkOut > filterCheckOut) return false;

      return true;
    });
  }, [inquiries, filterRoom, filterStatus, filterSearch, filterCheckIn, filterCheckOut]);

  // Status Styling Helper
  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'confirmed':
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          pill: 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
        };
      case 'pending':
        return {
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-500',
          pill: 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
        };
      case 'cancelled':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          pill: 'bg-rose-50 text-rose-800 border-rose-200 line-through opacity-75 hover:bg-rose-100'
        };
      case 'completed':
        return {
          badge: 'bg-neutral-100 text-neutral-700 border-neutral-300',
          dot: 'bg-neutral-400',
          pill: 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-700 border-gray-300',
          dot: 'bg-gray-400',
          pill: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
        };
    }
  };

  // Open Create Booking Modal
  const openNewBookingModal = (dateStr = '') => {
    setEditingBooking(null);
    setFormError('');
    setOverlapWarning(null);

    const defaultCheckIn = dateStr || todayStr;
    const [y, m, d] = defaultCheckIn.split('-').map(Number);
    const nextDay = new Date(y, m - 1, d + 2); // 2 nights default
    const defaultCheckOut = getKolkataDateString(nextDay);

    setFormData({
      guestName: '',
      email: '',
      phone: '',
      roomId: rooms?.[0]?.id || 'double-sharing',
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      adults: 2,
      children: 0,
      numRooms: 1,
      status: 'Confirmed',
      specialRequests: '',
      ratePerPerson: 1500,
      overrideOverlap: false
    });
    setModalOpen(true);
  };

  // Open Edit Booking Modal
  const openEditBookingModal = (booking) => {
    setEditingBooking(booking);
    setFormError('');
    setOverlapWarning(null);

    setFormData({
      guestName: booking.guestName || '',
      email: booking.email || '',
      phone: booking.phone || '',
      roomId: booking.roomId || 'double-sharing',
      checkIn: booking.checkIn || '',
      checkOut: booking.checkOut || '',
      adults: booking.adults || 2,
      children: booking.children || 0,
      numRooms: booking.numRooms || 1,
      status: booking.status || 'Confirmed',
      specialRequests: booking.specialRequests || '',
      ratePerPerson: booking.ratePerPerson || 1500,
      overrideOverlap: false
    });
    setModalOpen(true);
  };

  // Submit Create or Edit Booking
  const handleSaveBooking = async (e) => {
    e.preventDefault();
    setFormError('');
    setOverlapWarning(null);
    setActionLoading(true);

    try {
      if (editingBooking) {
        // Edit existing
        const res = await updateBooking(editingBooking.id, formData);
        if (res.success) {
          setModalOpen(false);
          setSelectedBooking(res.inquiry);
          fetchAvailability();
        } else {
          if (res.conflicts) {
            setOverlapWarning({
              error: res.error,
              conflicts: res.conflicts
            });
          } else {
            setFormError(res.error || 'Failed to update reservation');
          }
        }
      } else {
        // Create new manual booking
        const res = await createManualBooking(formData);
        if (res.success) {
          setModalOpen(false);
          setSelectedBooking(res.inquiry);
          fetchAvailability();
        } else {
          if (res.conflicts) {
            setOverlapWarning({
              error: res.error,
              conflicts: res.conflicts
            });
          } else {
            setFormError(res.error || 'Failed to create reservation');
          }
        }
      }
    } catch (err) {
      setFormError(err.message || 'An unexpected error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Status Change from Panel
  const handleStatusChange = async (bookingId, newStatus) => {
    if (!window.confirm(`Change booking ${bookingId} status to '${newStatus}'?`)) return;
    setActionLoading(true);
    try {
      const res = await updateBooking(bookingId, { status: newStatus });
      if (res.success) {
        setSelectedBooking(res.inquiry);
        fetchAvailability();
      } else {
        alert(res.error || 'Failed to update booking status');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel Booking from Panel
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingId}? The host will receive an automatic WhatsApp notification, and the room will immediately be freed for other guests.`)) return;
    setActionLoading(true);
    try {
      const res = await cancelBooking(bookingId);
      if (res.success) {
        setSelectedBooking(res.inquiry);
        fetchAvailability();
      } else {
        alert(res.error || 'Failed to cancel reservation');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Build Month Grid
  const monthDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = lastDayOfMonth.getDate();

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevDays = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(year, month - 1, d);
      prevDays.push({
        date: getKolkataDateString(prevDate),
        dayNum: d,
        isCurrentMonth: false
      });
    }

    // Current month days
    const currDays = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const currDate = new Date(year, month, d);
      currDays.push({
        date: getKolkataDateString(currDate),
        dayNum: d,
        isCurrentMonth: true
      });
    }

    // Next month filler days to complete grid (multiples of 7)
    const totalCells = prevDays.length + currDays.length;
    const remaining = (7 - (totalCells % 7)) % 7;
    const nextDays = [];
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      nextDays.push({
        date: getKolkataDateString(nextDate),
        dayNum: d,
        isCurrentMonth: false
      });
    }

    return [...prevDays, ...currDays, ...nextDays];
  }, [year, month]);

  // Map of bookings active on each date string
  const bookingsByDate = useMemo(() => {
    const map = {};
    for (const b of filteredInquiries) {
      if (!b.checkIn || !b.checkOut) continue;
      const start = new Date(b.checkIn + 'T00:00:00+05:30');
      const end = new Date(b.checkOut + 'T00:00:00+05:30');

      let cur = new Date(start);
      while (cur <= end) {
        const dStr = cur.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        if (!map[dStr]) map[dStr] = [];

        // Determine relation to date
        const isCheckIn = dStr === b.checkIn;
        const isCheckOut = dStr === b.checkOut;
        map[dStr].push({
          booking: b,
          isCheckIn,
          isCheckOut,
          isStay: !isCheckIn && !isCheckOut
        });

        cur.setDate(cur.getDate() + 1);
      }
    }
    return map;
  }, [filteredInquiries]);

  // Availability map from API
  const availMap = useMemo(() => {
    const map = {};
    if (availability?.days) {
      for (const d of availability.days) {
        map[d.date] = d;
      }
    }
    return map;
  }, [availability]);

  // Week View Days
  const weekDays = useMemo(() => {
    const dayOfWeek = currentDate.getDay();
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      days.push({
        date: getKolkataDateString(cur),
        dayName: cur.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: cur.getDate()
      });
    }
    return days;
  }, [currentDate]);

  // Daily View Data
  const dailyDateStr = useMemo(() => getKolkataDateString(currentDate), [currentDate]);
  const dailyBookings = useMemo(() => {
    return bookingsByDate[dailyDateStr] || [];
  }, [bookingsByDate, dailyDateStr]);

  const dailyCheckIns = useMemo(() => dailyBookings.filter(b => b.isCheckIn), [dailyBookings]);
  const dailyCheckOuts = useMemo(() => dailyBookings.filter(b => b.isCheckOut), [dailyBookings]);
  const dailyStayOvers = useMemo(() => dailyBookings.filter(b => b.isStay), [dailyBookings]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] overflow-hidden text-[#1A1A1A]">
      {/* ============================================================== */}
      {/* 1. CALENDAR TOP TOOLBAR */}
      {/* ============================================================== */}
      <header className="bg-white border-b border-[#EAE4DB] px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-[#B89A70]" />
            <h1 className="text-xl font-serif text-[#17251D] font-bold tracking-tight">
              Booking Calendar
            </h1>
            <span className="text-[11px] font-mono uppercase bg-[#17251D] text-[#B89A70] px-2 py-0.5 rounded font-medium">
              Asia / Kolkata (IST)
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 font-light">
            Mineral Springs Retreat · Reservation Availability & Schedule Overview
          </p>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Switcher */}
          <div className="flex items-center bg-[#F3EFEA] p-0.5 rounded-lg border border-[#EAE4DB]">
            {[
              { id: 'month', label: 'Month', icon: CalendarDays },
              { id: 'week', label: 'Week', icon: Columns },
              { id: 'day', label: 'Day', icon: Sun },
              { id: 'list', label: 'List', icon: List }
            ].map(v => {
              const Icon = v.icon;
              const isActive = view === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#17251D] text-[#B89A70] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>

          {/* New Manual Booking Button */}
          <button
            onClick={() => openNewBookingModal()}
            className="flex items-center space-x-1.5 bg-[#17251D] hover:bg-[#23382c] text-[#FAF7F2] border border-[#B89A70]/40 px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#B89A70]" />
            <span>+ Manual Booking</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={() => { loadInquiries(); fetchAvailability(); }}
            title="Refresh bookings and availability"
            className="p-1.5 text-neutral-600 hover:text-[#17251D] hover:bg-[#F3EFEA] border border-[#EAE4DB] rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loadingAvail ? 'animate-spin text-[#B89A70]' : ''}`} />
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. NAVIGATION BAR & STATUS LEGEND */}
      {/* ============================================================== */}
      <div className="bg-white/80 border-b border-[#EAE4DB] px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 backdrop-blur-xs">
        {/* Previous / Next / Today */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-[#F3EFEA] rounded-lg p-0.5 border border-[#EAE4DB]">
            <button
              onClick={prevPeriod}
              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              title="Previous Period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold text-[#17251D] hover:bg-white rounded transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextPeriod}
              className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-white rounded transition-colors"
              title="Next Period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-serif font-bold text-[#17251D] pl-1">
            {headerTitle}
          </span>
        </div>

        {/* Status Colours Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-neutral-600">
          <span className="text-neutral-400 uppercase tracking-wider text-[10px]">Status:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500"></span>
            <span>Pending</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-emerald-600"></span>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-rose-600"></span>
            <span>Cancelled (Free)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 border border-neutral-500"></span>
            <span>Completed</span>
          </div>

          <div className="h-3 w-px bg-neutral-300 mx-1 hidden sm:block"></div>

          <span className="text-neutral-400 uppercase tracking-wider text-[10px] hidden sm:inline">Rooms:</span>
          <div className="hidden sm:flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Avail</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Limited</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Full</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CALENDAR FILTER BAR */}
      {/* ============================================================== */}
      <div className="bg-[#FAF7F2] border-b border-[#EAE4DB] px-6 py-2.5 flex flex-wrap items-center gap-2.5 text-xs shrink-0">
        <div className="flex items-center space-x-1.5 text-neutral-500 shrink-0 font-medium">
          <Filter className="w-3.5 h-3.5 text-[#B89A70]" />
          <span>Filters:</span>
        </div>

        {/* Accommodation Filter */}
        <select
          value={filterRoom}
          onChange={e => setFilterRoom(e.target.value)}
          className="bg-white border border-[#EAE4DB] rounded-md px-2.5 py-1 text-xs text-[#17251D] focus:outline-hidden focus:ring-1 focus:ring-[#B89A70]"
        >
          <option value="all">All Accommodations</option>
          {(rooms || []).map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-white border border-[#EAE4DB] rounded-md px-2.5 py-1 text-xs text-[#17251D] focus:outline-hidden focus:ring-1 focus:ring-[#B89A70]"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">🟡 Pending</option>
          <option value="Confirmed">🟢 Confirmed</option>
          <option value="Cancelled">🔴 Cancelled</option>
          <option value="Completed">⚪ Completed</option>
        </select>

        {/* Search Input */}
        <div className="relative min-w-[180px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search guest or MSR-..."
            value={filterSearch}
            onChange={e => setFilterSearch(e.target.value)}
            className="w-full bg-white border border-[#EAE4DB] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#17251D] placeholder:text-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-[#B89A70]"
          />
        </div>

        {/* Date Jump / Filters */}
        <div className="flex items-center space-x-1.5 text-neutral-500">
          <span>From:</span>
          <input
            type="date"
            value={filterCheckIn}
            onChange={e => setFilterCheckIn(e.target.value)}
            className="bg-white border border-[#EAE4DB] rounded-md px-2 py-0.5 text-xs text-[#17251D]"
          />
        </div>

        {(filterRoom !== 'all' || filterStatus !== 'all' || filterSearch || filterCheckIn || filterCheckOut) && (
          <button
            onClick={() => {
              setFilterRoom('all');
              setFilterStatus('all');
              setFilterSearch('');
              setFilterCheckIn('');
              setFilterCheckOut('');
            }}
            className="text-[#B89A70] hover:text-[#17251D] font-medium text-[11px] underline flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}

        <div className="ml-auto text-[11px] text-neutral-500">
          Showing <span className="font-semibold text-[#17251D]">{filteredInquiries.length}</span> reservations
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MAIN CALENDAR BODY (MONTH / WEEK / DAY / LIST) */}
      {/* ============================================================== */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        
        {/* ------------------------------------------------------------ */}
        {/* VIEW A: MONTHLY VIEW */}
        {/* ------------------------------------------------------------ */}
        {view === 'month' && (
          <div className="bg-white rounded-xl border border-[#EAE4DB] shadow-xs overflow-hidden flex flex-col h-full min-h-[600px]">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-[#EAE4DB] bg-[#FAF7F2] text-center font-semibold text-[11px] text-neutral-600 uppercase tracking-wider py-2.5">
              <span>Sunday</span>
              <span>Monday</span>
              <span>Tuesday</span>
              <span>Wednesday</span>
              <span>Thursday</span>
              <span>Friday</span>
              <span>Saturday</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 flex-1 auto-rows-fr divide-x divide-y divide-[#EAE4DB]">
              {monthDays.map((cell, idx) => {
                const dayBookings = bookingsByDate[cell.date] || [];
                const dayAvail = availMap[cell.date];
                const isToday = cell.date === todayStr;

                return (
                  <div
                    key={cell.date + idx}
                    onClick={() => {
                      // Navigate to day view or quick add
                      setCurrentDate(new Date(cell.date + 'T00:00:00+05:30'));
                    }}
                    className={`min-h-[105px] p-1.5 flex flex-col justify-between transition-colors cursor-pointer group ${
                      !cell.isCurrentMonth
                        ? 'bg-[#F9F7F4]/60 text-neutral-400'
                        : isToday
                        ? 'bg-amber-50/40'
                        : 'bg-white hover:bg-[#FAF7F2]/80'
                    }`}
                  >
                    {/* Date Number & Daily Availability Indicator */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? 'bg-[#17251D] text-[#B89A70]'
                            : cell.isCurrentMonth
                            ? 'text-neutral-800'
                            : 'text-neutral-400'
                        }`}
                      >
                        {cell.dayNum}
                      </span>

                      {/* Room Availability Chip */}
                      {cell.isCurrentMonth && dayAvail && (
                        <span
                          title={`${dayAvail.availableUnits} of ${dayAvail.totalUnits} rooms available`}
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full font-semibold border ${
                            dayAvail.overallStatus === 'available'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : dayAvail.overallStatus === 'limited'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {dayAvail.availableUnits}/{dayAvail.totalUnits} free
                        </span>
                      )}
                    </div>

                    {/* Bookings Pills for this Date */}
                    <div className="flex-1 my-1 space-y-1 overflow-hidden">
                      {dayBookings.slice(0, 3).map(({ booking, isCheckIn, isCheckOut }) => {
                        const style = getStatusColor(booking.status);
                        return (
                          <div
                            key={booking.id + cell.date}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooking(booking);
                            }}
                            title={`${booking.guestName} (${booking.room}) - ${booking.status}`}
                            className={`text-[10px] px-1.5 py-0.5 rounded border truncate flex items-center justify-between transition-all shadow-2xs ${style.pill}`}
                          >
                            <span className="truncate font-medium flex items-center space-x-1">
                              {isCheckIn && <span className="font-bold text-[8px] opacity-75">↳ IN</span>}
                              {isCheckOut && <span className="font-bold text-[8px] opacity-75">↲ OUT</span>}
                              <span className="truncate">{booking.guestName}</span>
                            </span>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                          </div>
                        );
                      })}

                      {dayBookings.length > 3 && (
                        <div className="text-[9px] text-[#B89A70] font-semibold text-center hover:underline">
                          +{dayBookings.length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Plus icon on hover for quick booking on this date */}
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openNewBookingModal(cell.date);
                        }}
                        className="text-[10px] text-[#B89A70] hover:text-[#17251D] flex items-center space-x-0.5 font-medium"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Book</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* VIEW B: WEEKLY VIEW */}
        {/* ------------------------------------------------------------ */}
        {view === 'week' && (
          <div className="bg-white rounded-xl border border-[#EAE4DB] shadow-xs overflow-hidden flex flex-col h-full min-h-[550px]">
            <div className="grid grid-cols-7 border-b border-[#EAE4DB] divide-x divide-[#EAE4DB] bg-[#FAF7F2]">
              {weekDays.map(w => {
                const isToday = w.date === todayStr;
                const dayAvail = availMap[w.date];
                return (
                  <div key={w.date} className={`p-3 text-center ${isToday ? 'bg-amber-50/50' : ''}`}>
                    <div className="text-xs font-semibold text-neutral-500 uppercase">{w.dayName}</div>
                    <div className={`text-base font-serif font-bold mt-0.5 ${isToday ? 'text-[#B89A70]' : 'text-[#17251D]'}`}>
                      {w.dayNum}
                    </div>
                    {dayAvail && (
                      <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-white border border-[#EAE4DB]">
                        {dayAvail.availableUnits}/{dayAvail.totalUnits} rooms free
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-7 flex-1 divide-x divide-[#EAE4DB] bg-white overflow-y-auto">
              {weekDays.map(w => {
                const dayBookings = bookingsByDate[w.date] || [];
                return (
                  <div key={w.date} className="p-2 space-y-2 min-h-[400px]">
                    {dayBookings.length === 0 ? (
                      <div className="text-center py-8 text-[11px] text-neutral-400 font-light">
                        No bookings
                      </div>
                    ) : (
                      dayBookings.map(({ booking, isCheckIn, isCheckOut }) => {
                        const style = getStatusColor(booking.status);
                        return (
                          <div
                            key={booking.id + w.date}
                            onClick={() => setSelectedBooking(booking)}
                            className={`p-2 rounded-lg border text-xs cursor-pointer shadow-2xs transition-all hover:scale-[1.01] ${style.pill}`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span className="truncate">{booking.guestName}</span>
                              <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                            </div>
                            <div className="text-[10px] text-neutral-600 truncate mt-0.5">
                              {booking.room}
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500 mt-1 flex items-center justify-between">
                              <span>{isCheckIn ? 'Check-in' : isCheckOut ? 'Check-out' : 'Staying'}</span>
                              <span>₹{booking.estimatedTotal?.toLocaleString('en-IN') || 0}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* VIEW C: DAILY VIEW */}
        {/* ------------------------------------------------------------ */}
        {view === 'day' && (
          <div className="space-y-6">
            {/* Day Header KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-[#EAE4DB] shadow-xs">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Total Bookings Today</span>
                <div className="text-2xl font-serif font-bold text-[#17251D] mt-1">
                  {dailyBookings.length}
                </div>
                <span className="text-[11px] text-neutral-500 font-light">On {formatDisplayDate(dailyDateStr)}</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-emerald-700">Checking In</span>
                <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">
                  {dailyCheckIns.length}
                </div>
                <span className="text-[11px] text-emerald-600 font-light">Guests arriving today</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-rose-700">Checking Out</span>
                <div className="text-2xl font-serif font-bold text-rose-800 mt-1">
                  {dailyCheckOuts.length}
                </div>
                <span className="text-[11px] text-rose-600 font-light">Guests departing today</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-amber-700">In-House Stay</span>
                <div className="text-2xl font-serif font-bold text-amber-800 mt-1">
                  {dailyStayOvers.length}
                </div>
                <span className="text-[11px] text-amber-600 font-light">Continuing nights</span>
              </div>
            </div>

            {/* Room Availability Matrix for this day */}
            <div className="bg-white rounded-xl border border-[#EAE4DB] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4 border-b border-[#EAE4DB] pb-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#17251D]">
                    Accommodation Inventory Matrix
                  </h3>
                  <p className="text-xs text-neutral-500 font-light">
                    Unit-by-unit availability for {formatDisplayDate(dailyDateStr)}
                  </p>
                </div>
                <button
                  onClick={() => openNewBookingModal(dailyDateStr)}
                  className="bg-[#17251D] text-[#FAF7F2] hover:bg-[#23382c] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B89A70]" />
                  <span>Add Booking for Today</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(rooms || []).map(room => {
                  const dayAvailInfo = availMap[dailyDateStr]?.rooms?.find(r => r.roomId === room.id);
                  const bookedUnits = dayAvailInfo?.bookedUnits || 0;
                  const totalUnits = room.totalUnits || 2;
                  const freeUnits = Math.max(0, totalUnits - bookedUnits);

                  return (
                    <div key={room.id} className="border border-[#EAE4DB] rounded-lg p-4 bg-[#FAF7F2]/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <BedDouble className="w-4 h-4 text-[#B89A70]" />
                          <span className="font-semibold text-xs text-[#17251D]">{room.name}</span>
                        </div>
                        <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                          freeUnits > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {freeUnits} / {totalUnits} Units Available
                        </span>
                      </div>

                      {/* Units visualization */}
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {Array.from({ length: totalUnits }).map((_, unitIdx) => {
                          const isBooked = unitIdx < bookedUnits;
                          const bookingOnUnit = dayAvailInfo?.bookings?.[unitIdx];
                          return (
                            <div
                              key={unitIdx}
                              className={`p-2 rounded border text-xs text-center transition-all ${
                                isBooked
                                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                              }`}
                            >
                              <div className="text-[10px] text-neutral-400 font-mono">Unit {unitIdx + 1}</div>
                              <div className="font-semibold truncate mt-0.5">
                                {isBooked ? (bookingOnUnit?.guestName || 'Occupied') : 'Vacant (Available)'}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* List of Bookings Active on this Day */}
            <div className="bg-white rounded-xl border border-[#EAE4DB] p-5 shadow-xs">
              <h3 className="font-serif font-bold text-base text-[#17251D] mb-3">
                All Bookings on {formatDisplayDate(dailyDateStr)} ({dailyBookings.length})
              </h3>
              {dailyBookings.length === 0 ? (
                <div className="text-center py-10 text-neutral-400 text-xs font-light">
                  No reservations scheduled for this date.
                </div>
              ) : (
                <div className="space-y-2">
                  {dailyBookings.map(({ booking, isCheckIn, isCheckOut, isStay }) => {
                    const style = getStatusColor(booking.status);
                    return (
                      <div
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#FAF7F2] hover:bg-[#F3EFEA] rounded-lg border border-[#EAE4DB] transition-all cursor-pointer gap-2"
                      >
                        <div className="flex items-center space-x-3">
                          <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                          <div>
                            <div className="font-semibold text-xs text-[#17251D] flex items-center space-x-2">
                              <span>{booking.guestName}</span>
                              <span className="font-mono text-[10px] text-neutral-400 font-normal">({booking.id})</span>
                              <span className={`text-[9px] font-mono px-2 py-0.2 rounded border font-semibold ${style.badge}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-600 mt-0.5">
                              {booking.room} · {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ''}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs font-mono">
                          <span className="text-neutral-500">
                            {booking.checkIn} &rarr; {booking.checkOut} ({booking.nights} nights)
                          </span>
                          <span className="font-semibold text-[#17251D]">
                            ₹{booking.estimatedTotal?.toLocaleString('en-IN') || 0}
                          </span>
                          <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-white border border-[#EAE4DB] font-medium text-[#B89A70]">
                            {isCheckIn ? 'Checking In' : isCheckOut ? 'Checking Out' : 'Staying'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* VIEW D: LIST VIEW OF ALL BOOKINGS */}
        {/* ------------------------------------------------------------ */}
        {view === 'list' && (
          <div className="bg-white rounded-xl border border-[#EAE4DB] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#EAE4DB] text-neutral-500 font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Accommodation</th>
                    <th className="py-3 px-4">Check-In</th>
                    <th className="py-3 px-4">Check-Out</th>
                    <th className="py-3 px-4">Nights</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Total (INR)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4DB]">
                  {filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="text-center py-12 text-neutral-400 text-xs">
                        No reservations match the current filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map(b => {
                      const style = getStatusColor(b.status);
                      return (
                        <tr
                          key={b.id}
                          onClick={() => setSelectedBooking(b)}
                          className="hover:bg-[#FAF7F2]/60 cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-4 font-mono font-semibold text-[#17251D]">
                            {b.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#17251D]">
                            <div>{b.guestName}</div>
                            <div className="text-[10px] text-neutral-400 font-mono">{b.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-neutral-700">
                            {b.room}
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-600">
                            {b.checkIn}
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-600">
                            {b.checkOut}
                          </td>
                          <td className="py-3 px-4 font-mono text-center">
                            {b.nights}
                          </td>
                          <td className="py-3 px-4 font-mono text-center">
                            {b.adults}A {b.children > 0 ? `${b.children}C` : ''}
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-[#17251D]">
                            ₹{b.estimatedTotal?.toLocaleString('en-IN') || 0}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold inline-block ${style.badge}`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(b);
                              }}
                              className="text-[#B89A70] hover:text-[#17251D] font-medium text-xs underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 5. DETAILED BOOKING SLIDE-OVER / MODAL PANEL */}
      {/* ============================================================== */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#EAE4DB] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#17251D] text-[#FAF7F2] p-5 flex items-center justify-between border-b border-[#B89A70]/30 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-[#B89A70] text-[#17251D] flex items-center justify-center font-bold font-serif text-sm">
                  {selectedBooking.guestName?.[0]?.toUpperCase() || 'G'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-serif font-bold text-base text-[#FAF7F2]">
                      {selectedBooking.guestName}
                    </h2>
                    <span className="font-mono text-xs text-[#B89A70]">
                      ({selectedBooking.id})
                    </span>
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-semibold mt-1 inline-block ${getStatusColor(selectedBooking.status).badge}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#1A1A1A]">
              {/* Contact Information */}
              <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#EAE4DB] space-y-2">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold">Guest Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#B89A70]" />
                    <a href={`tel:${selectedBooking.phone}`} className="font-mono text-neutral-800 hover:underline">
                      {selectedBooking.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#B89A70]" />
                    <span className="truncate text-neutral-800">{selectedBooking.email || 'No email provided'}</span>
                  </div>
                </div>
              </div>

              {/* Stay & Room Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4DB]">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Accommodation</span>
                  <div className="font-semibold text-neutral-900 mt-0.5">{selectedBooking.room}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {selectedBooking.numRooms || 1} Room(s)
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4DB]">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Stay Duration</span>
                  <div className="font-mono font-semibold text-neutral-900 mt-0.5">
                    {selectedBooking.nights} Night(s)
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {selectedBooking.checkIn} &rarr; {selectedBooking.checkOut}
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4DB]">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Party Size</span>
                  <div className="font-semibold text-neutral-900 mt-0.5">
                    {selectedBooking.adults} Adults
                    {selectedBooking.children > 0 && `, ${selectedBooking.children} Children`}
                  </div>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EAE4DB]">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">Estimated Total</span>
                  <div className="font-serif font-bold text-base text-[#17251D] mt-0.5">
                    ₹{selectedBooking.estimatedTotal?.toLocaleString('en-IN') || 0}
                  </div>
                  <span className="text-[9px] text-neutral-500">Includes 4 homemade meals</span>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
                  <span className="text-[10px] font-mono uppercase text-amber-800 font-semibold">Special Requests</span>
                  <p className="text-xs text-amber-950 mt-1 italic">
                    "{selectedBooking.specialRequests}"
                  </p>
                </div>
              )}

              {/* Timeline Information */}
              <div className="text-[10px] font-mono text-neutral-400 border-t border-[#EAE4DB] pt-3 flex items-center justify-between">
                <span>Created: {new Date(selectedBooking.createdAt).toLocaleString()}</span>
                {selectedBooking.isManualBooking && (
                  <span className="text-[#B89A70] font-semibold">Admin Manual Booking</span>
                )}
              </div>
            </div>

            {/* Footer Quick Actions */}
            <div className="bg-[#FAF7F2] p-4 border-t border-[#EAE4DB] flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Quick Status Buttons */}
              <div className="flex items-center space-x-1.5">
                {selectedBooking.status === 'Pending' && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusChange(selectedBooking.id, 'Confirmed')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Confirm</span>
                  </button>
                )}

                {selectedBooking.status === 'Confirmed' && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleStatusChange(selectedBooking.id, 'Completed')}
                    className="bg-neutral-600 hover:bg-neutral-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark Completed</span>
                  </button>
                )}

                {selectedBooking.status !== 'Cancelled' && (
                  <button
                    disabled={actionLoading}
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

              {/* Edit & Open in Reservations Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const b = selectedBooking;
                    setSelectedBooking(null);
                    openEditBookingModal(b);
                  }}
                  className="bg-white border border-[#EAE4DB] text-neutral-700 hover:text-[#17251D] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 shadow-2xs"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>

                {onNavigateToInquiries && (
                  <button
                    onClick={() => {
                      setSelectedBooking(null);
                      onNavigateToInquiries(selectedBooking.id);
                    }}
                    className="bg-[#17251D] hover:bg-[#23382c] text-[#FAF7F2] px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1"
                  >
                    <span>Full Record</span>
                    <ExternalLink className="w-3 h-3 text-[#B89A70]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. CREATE / EDIT BOOKING MODAL */}
      {/* ============================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#EAE4DB] max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#17251D] text-[#FAF7F2] p-5 flex items-center justify-between border-b border-[#B89A70]/30 shrink-0">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-[#B89A70]" />
                <h2 className="font-serif font-bold text-base text-[#FAF7F2]">
                  {editingBooking ? `Edit Booking (${editingBooking.id})` : 'Create Manual Booking'}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBooking} className="p-6 overflow-y-auto space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Overlap Conflict Warning */}
              {overlapWarning && (
                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg space-y-2">
                  <div className="flex items-center space-x-2 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Room Overlap Warning</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {overlapWarning.error}
                  </p>
                  <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.overrideOverlap}
                      onChange={e => setFormData({ ...formData, overrideOverlap: e.target.checked })}
                      className="rounded border-[#EAE4DB] text-[#B89A70] focus:ring-[#B89A70]"
                    />
                    <span className="font-semibold text-xs text-[#17251D]">
                      Override room availability limit and confirm anyway
                    </span>
                  </label>
                </div>
              )}

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                    placeholder="e.g. Anandita Sen"
                    className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D] focus:ring-1 focus:ring-[#B89A70]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 79081 92498"
                    className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D] focus:ring-1 focus:ring-[#B89A70]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="guest@example.com"
                  className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D] focus:ring-1 focus:ring-[#B89A70]"
                />
              </div>

              {/* Accommodation Selection */}
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Select Room / Accommodation *
                </label>
                <select
                  value={formData.roomId}
                  onChange={e => setFormData({ ...formData, roomId: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D] focus:ring-1 focus:ring-[#B89A70]"
                >
                  {(rooms || []).map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} (Total: {r.totalUnits || 2} units · Approx ₹{r.pricePerPerson || 1500}/person)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Check-In Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
                    onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D] focus:ring-1 focus:ring-[#B89A70]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Check-Out Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut}
                    onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D] focus:ring-1 focus:ring-[#B89A70]"
                  />
                </div>
              </div>

              {/* Guests Count & Rooms */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.adults}
                    onChange={e => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={formData.children}
                    onChange={e => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 mb-1">
                    Units Booked
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={formData.numRooms}
                    onChange={e => setFormData({ ...formData, numRooms: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D]"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Booking Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D]"
                >
                  <option value="Confirmed">🟢 Confirmed (Guaranteed Reservation)</option>
                  <option value="Pending">🟡 Pending (Host Confirmation Required)</option>
                  <option value="Completed">⚪ Completed (Past Stay)</option>
                  <option value="Cancelled">🔴 Cancelled (Free Inventory)</option>
                </select>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block font-medium text-neutral-700 mb-1">
                  Special Requests / Internal Notes
                </label>
                <textarea
                  rows="2"
                  value={formData.specialRequests}
                  onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                  placeholder="Dietary requests, late arrival, payment notes..."
                  className="w-full bg-[#FAF7F2] border border-[#EAE4DB] rounded-lg px-3 py-2 text-xs text-[#17251D]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#EAE4DB] flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-[#FAF7F2] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-[#17251D] hover:bg-[#23382c] text-[#FAF7F2] border border-[#B89A70]/40 px-5 py-2 rounded-lg text-xs font-medium tracking-wide shadow-xs flex items-center space-x-1.5"
                >
                  {actionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#B89A70]" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-[#B89A70]" />
                  )}
                  <span>{editingBooking ? 'Save Changes' : 'Confirm & Save Booking'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

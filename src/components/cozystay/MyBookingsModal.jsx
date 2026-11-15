import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X, Calendar, Clock, MapPin, Users, Phone, Mail, CheckCircle2,
  AlertCircle, MessageSquare, LogOut, Edit2, Check, ArrowRight, UtensilsCrossed
} from 'lucide-react';

export default function MyBookingsModal() {
  const {
    myBookingsModalOpen,
    setMyBookingsModalOpen,
    guestUser,
    myBookings,
    guestLogout,
    updateGuestProfile,
    cancelBooking,
    modifyBooking,
    openBooking,
    settings
  } = useApp();

  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(guestUser?.phone || '');
  const [savingPhone, setSavingPhone] = useState(false);
  const [modifyingBookingId, setModifyingBookingId] = useState(null);
  const [modifyFormData, setModifyFormData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    specialRequests: ''
  });
  const [actionLoading, setActionLoading] = useState(false);

  if (!myBookingsModalOpen || !guestUser) return null;

  const handleSavePhone = async (e) => {
    e.preventDefault();
    setSavingPhone(true);
    await updateGuestProfile({ phone: phoneNumber });
    setSavingPhone(false);
    setEditingPhone(false);
  };

  const handleOpenModify = (booking) => {
    setModifyingBookingId(booking.id);
    setModifyFormData({
      checkIn: booking.checkIn || '',
      checkOut: booking.checkOut || '',
      adults: booking.adults || 2,
      children: booking.children || 0,
      specialRequests: booking.specialRequests || ''
    });
  };

  const handleSubmitModify = async (e) => {
    e.preventDefault();
    if (!modifyingBookingId) return;
    setActionLoading(true);
    await modifyBooking(modifyingBookingId, modifyFormData);
    setActionLoading(false);
    setModifyingBookingId(null);
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking inquiry? The retreat host will be notified automatically via WhatsApp.')) {
      setActionLoading(true);
      await cancelBooking(bookingId);
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider rounded-full border border-emerald-300">
            Confirmed Reservation
          </span>
        );
      case 'Contacted':
        return (
          <span className="px-3 py-1 bg-sky-100 text-sky-800 text-[11px] font-semibold uppercase tracking-wider rounded-full border border-sky-300">
            Host Reached Out
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-3 py-1 bg-neutral-200 text-neutral-700 text-[11px] font-semibold uppercase tracking-wider rounded-full border border-neutral-300">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[11px] font-semibold uppercase tracking-wider rounded-full border border-amber-300">
            Under Host Review
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 select-none text-[#1A1A1A]">
      <div
        className="relative bg-[#FAF7F2] w-full max-w-3xl shadow-2xl border border-[#D5C9B8] rounded-3xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#17251D] px-6 sm:px-8 py-5 flex items-center justify-between border-b border-[#B89A70]/30 shrink-0">
          <div>
            <span className="text-[10px] font-roman uppercase tracking-[0.26em] text-[#B89A70] block">
              {settings?.homestayName || 'MINERAL SPRINGS RETREAT'}
            </span>
            <h3 className="font-roman text-2xl sm:text-3xl text-[#FAF7F2] font-normal uppercase tracking-wide">
              Guest Dashboard & Bookings
            </h3>
          </div>

          <button
            onClick={() => setMyBookingsModalOpen(false)}
            className="p-2 text-[#FAF7F2]/70 hover:text-white rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Guest Profile Card */}
          <div className="bg-white border border-[#D5C9B8] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans">
            <div className="flex items-center space-x-4">
              {guestUser.picture ? (
                <img
                  src={guestUser.picture}
                  alt={guestUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#B89A70] shadow-sm shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#17251D] text-[#B89A70] font-roman text-xl flex items-center justify-center border-2 border-[#B89A70] shrink-0">
                  {guestUser.name?.charAt(0) || 'G'}
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-roman text-xl text-[#17251D] font-normal">
                    {guestUser.name}
                  </h4>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] uppercase font-semibold rounded-full border border-emerald-200">
                    Google Verified
                  </span>
                </div>
                <div className="text-xs text-[#555D56] flex items-center space-x-1 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#B89A70]" />
                  <span>{guestUser.email}</span>
                </div>

                {/* Inline Phone Edit */}
                <div className="text-xs text-[#555D56] flex items-center space-x-1.5 mt-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#B89A70]" />
                  {editingPhone ? (
                    <form onSubmit={handleSavePhone} className="flex items-center space-x-2">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 79081 92498"
                        className="px-2 py-1 text-xs border border-[#D5C9B8] rounded-md w-36"
                      />
                      <button
                        type="submit"
                        disabled={savingPhone}
                        className="p-1 bg-[#17251D] text-[#FAF7F2] rounded hover:bg-black"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>{guestUser.phone || 'No phone added yet'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneNumber(guestUser.phone || '');
                          setEditingPhone(true);
                        }}
                        className="text-[#B89A70] hover:underline text-[11px] flex items-center space-x-0.5"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
              <button
                type="button"
                onClick={() => {
                  setMyBookingsModalOpen(false);
                  openBooking();
                }}
                className="px-4 py-2 bg-[#17251D] text-[#FAF7F2] hover:bg-black rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors"
              >
                + New Inquiry
              </button>

              <button
                type="button"
                onClick={guestLogout}
                className="p-2 text-neutral-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-roman text-xl text-[#17251D] uppercase tracking-wide">
                My Reservation Inquiries ({myBookings.length})
              </h4>
              <span className="text-[11px] text-[#555D56] font-sans">
                Authentic Homestay with 4 Daily Meals
              </span>
            </div>

            {myBookings.length === 0 ? (
              <div className="p-8 bg-white border border-[#D5C9B8] rounded-2xl text-center space-y-3 font-sans">
                <Calendar className="w-10 h-10 text-[#B89A70] mx-auto opacity-70" />
                <h5 className="font-roman text-lg text-[#17251D]">No reservation inquiries yet</h5>
                <p className="text-xs text-[#555D56] max-w-sm mx-auto">
                  Ready to experience the mountain mist of Dawaipani? Inquire for your rustic eco-stay today.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMyBookingsModalOpen(false);
                    openBooking();
                  }}
                  className="px-5 py-2.5 bg-[#B89A70] text-[#17251D] font-semibold text-xs rounded-xl shadow-xs hover:bg-[#a0855e] transition-colors"
                >
                  Reserve Your Stay
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((b) => {
                  const cleanPhone = (settings?.whatsapp || settings?.phone || '+917908192498').replace(/[^0-9]/g, '');
                  const cleanPhone2 = (settings?.whatsapp2 || settings?.phone2 || '+919830355105').replace(/[^0-9]/g, '');
                  const waText = encodeURIComponent(
                    `Hello Mineral Springs Retreat!\n\nI am checking on my booking inquiry ${b.id} for ${b.room} (${b.checkIn} to ${b.checkOut}).`
                  );
                  return (
                    <div
                      key={b.id}
                      className="bg-white border border-[#D5C9B8] rounded-2xl p-5 shadow-sm space-y-3 font-sans"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE4DB] pb-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#8C7A65] tracking-wider uppercase block">
                            REF: {b.id}
                          </span>
                          <h5 className="font-roman text-lg text-[#17251D] font-normal">
                            {b.room}
                          </h5>
                        </div>
                        <div>{getStatusBadge(b.status)}</div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#555D56] py-1">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8C7A65] block">Dates</span>
                          <span className="font-medium text-[#17251D]">
                            {b.checkIn} → {b.checkOut}
                          </span>
                          <span className="text-[10px] text-neutral-400 block">({b.nights} night{b.nights > 1 ? 's' : ''})</span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8C7A65] block">Guests</span>
                          <span className="font-medium text-[#17251D]">
                            {b.adults} Adults{b.children > 0 ? `, ${b.children} Ch` : ''}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8C7A65] block">Meals Included</span>
                          <span className="font-medium text-emerald-800 flex items-center space-x-1">
                            <UtensilsCrossed className="w-3 h-3 text-emerald-600" />
                            <span>All 4 Daily Meals</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8C7A65] block">Estimated Total</span>
                          <span className="font-roman text-base font-semibold text-[#17251D] tabular-nums">
                            ₹{Number(b.estimatedTotal || 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {b.specialRequests && (
                        <div className="text-[11px] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE4DB] text-[#555D56]">
                          <strong className="text-[#17251D]">Special Requests:</strong> {b.specialRequests}
                        </div>
                      )}

                      {/* Guest Actions: Modify Dates or Cancel Booking */}
                      {b.status !== 'Cancelled' && (
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EAE4DB]">
                          <button
                            type="button"
                            onClick={() => handleOpenModify(b)}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-white hover:bg-[#FAF7F2] text-[#17251D] border border-[#D5C9B8] rounded-lg text-[11px] font-semibold transition-colors inline-flex items-center space-x-1"
                          >
                            <Edit2 className="w-3 h-3 text-[#B89A70]" />
                            <span>Modify Dates / Guests</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCancel(b.id)}
                            disabled={actionLoading}
                            className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors inline-flex items-center space-x-1"
                          >
                            <X className="w-3 h-3 text-rose-500" />
                            <span>Cancel Booking</span>
                          </button>
                        </div>
                      )}

                      {/* Inline Modify Form */}
                      {modifyingBookingId === b.id && (
                        <form onSubmit={handleSubmitModify} className="p-4 bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl space-y-3 mt-2 text-xs">
                          <div className="font-semibold text-[#17251D] uppercase text-[11px] tracking-wider">
                            Modify Reservation Dates & Guests
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] uppercase font-semibold text-[#555D56] block mb-1">Check-in</label>
                              <input
                                type="date"
                                required
                                value={modifyFormData.checkIn}
                                onChange={(e) => setModifyFormData(d => ({ ...d, checkIn: e.target.value }))}
                                className="w-full px-2 py-1.5 bg-white border border-[#D5C9B8] rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-semibold text-[#555D56] block mb-1">Check-out</label>
                              <input
                                type="date"
                                required
                                value={modifyFormData.checkOut}
                                onChange={(e) => setModifyFormData(d => ({ ...d, checkOut: e.target.value }))}
                                className="w-full px-2 py-1.5 bg-white border border-[#D5C9B8] rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-semibold text-[#555D56] block mb-1">Adults</label>
                              <input
                                type="number"
                                min={1}
                                max={6}
                                value={modifyFormData.adults}
                                onChange={(e) => setModifyFormData(d => ({ ...d, adults: Number(e.target.value) }))}
                                className="w-full px-2 py-1.5 bg-white border border-[#D5C9B8] rounded-lg text-xs"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-semibold text-[#555D56] block mb-1">Children</label>
                              <input
                                type="number"
                                min={0}
                                max={4}
                                value={modifyFormData.children}
                                onChange={(e) => setModifyFormData(d => ({ ...d, children: Number(e.target.value) }))}
                                className="w-full px-2 py-1.5 bg-white border border-[#D5C9B8] rounded-lg text-xs"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-semibold text-[#555D56] block mb-1">Special Requests</label>
                            <textarea
                              rows={2}
                              value={modifyFormData.specialRequests}
                              onChange={(e) => setModifyFormData(d => ({ ...d, specialRequests: e.target.value }))}
                              placeholder="Any dietary preferences, arrival notes..."
                              className="w-full px-2 py-1.5 bg-white border border-[#D5C9B8] rounded-lg text-xs"
                            />
                          </div>
                          <div className="flex items-center justify-end space-x-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setModifyingBookingId(null)}
                              className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-200 rounded-lg text-xs"
                            >
                              Dismiss
                            </button>
                            <button
                              type="submit"
                              disabled={actionLoading}
                              className="px-4 py-1.5 bg-[#17251D] text-[#FAF7F2] hover:bg-black rounded-lg text-xs font-semibold"
                            >
                              {actionLoading ? 'Saving & Notifying...' : 'Update & Notify Host'}
                            </button>
                          </div>
                        </form>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                        <span className="text-[10px] text-neutral-400">
                          Inquiry submitted: {new Date(b.createdAt).toLocaleDateString()}
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-medium text-[11px] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                            <span>WhatsApp (+91 79081 92498)</span>
                          </a>
                          <a
                            href={`https://wa.me/${cleanPhone2}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-medium text-[11px] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                            <span>WhatsApp (+91 98303 55105)</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

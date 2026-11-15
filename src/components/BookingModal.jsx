import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { CozySparkle } from './cozystay/CozyIcons';
import { X, CheckCircle2, Calendar, Users, Home, Phone, Mail, MessageSquare, ArrowRight, ShieldCheck, UtensilsCrossed } from 'lucide-react';
import gsap from 'gsap';

export default function BookingModal() {
  const {
    bookingModalOpen,
    closeBooking,
    bookingPrefill,
    rooms,
    settings,
    submitInquiry,
    guestUser,
    guestToken,
    setGuestAuthModalOpen
  } = useApp();
  const modalRef = useRef(null);

  const [formData, setFormData] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    numRooms: 1,
    guestName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (bookingModalOpen) {
      setSuccessData(null);
      setErrorMessage('');

      // Check if we have pending booking preserved in sessionStorage
      let savedBooking = null;
      try {
        const raw = sessionStorage.getItem('msr_pending_booking');
        if (raw) savedBooking = JSON.parse(raw);
      } catch {}

      setFormData(prev => ({
        ...prev,
        roomId: savedBooking?.roomId || bookingPrefill.roomId || prev.roomId || (rooms[0]?.id || 'double-sharing'),
        checkIn: savedBooking?.checkIn || bookingPrefill.checkIn || prev.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        checkOut: savedBooking?.checkOut || bookingPrefill.checkOut || prev.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        adults: savedBooking?.adults || bookingPrefill.guests || prev.adults || 2,
        children: savedBooking?.children ?? prev.children ?? 0,
        numRooms: savedBooking?.numRooms || prev.numRooms || 1,
        specialRequests: savedBooking?.specialRequests || prev.specialRequests || '',
        guestName: guestUser?.name || prev.guestName || '',
        email: guestUser?.email || prev.email || '',
        phone: guestUser?.phone || savedBooking?.phone || prev.phone || ''
      }));

      if (modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.96, y: 15 },
          { opacity: 1, scale: 1.0, y: 0, duration: 0.35, ease: 'power2.out' }
        );
      }
    }
  }, [bookingModalOpen, bookingPrefill, rooms, guestUser]);

  if (!bookingModalOpen) return null;

  const handleOpenGoogleAuth = () => {
    try {
      sessionStorage.setItem('msr_pending_booking', JSON.stringify({
        roomId: formData.roomId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        adults: formData.adults,
        children: formData.children,
        numRooms: formData.numRooms,
        specialRequests: formData.specialRequests,
        phone: formData.phone
      }));
    } catch {}
    setGuestAuthModalOpen(true);
  };

  const selectedRoom = rooms.find(r => r.id === formData.roomId) || rooms[0] || { pricePerNight: 3000, pricePerPerson: 1500, name: 'Double Sharing Eco Room' };

  const checkInDate = new Date(formData.checkIn);
  const checkOutDate = new Date(formData.checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const calculatedNights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1);
  const ratePerPerson = selectedRoom.pricePerPerson || Math.round((selectedRoom.pricePerNight || 3000) / (selectedRoom.capacity || 2));
  const estimatedTotal = ratePerPerson * (formData.adults || 2) * calculatedNights;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    if (!guestToken) {
      setErrorMessage('Please sign in with your Google account to confirm your reservation inquiry.');
      handleOpenGoogleAuth();
      setSubmitting(false);
      return;
    }

    if (checkOutDate <= checkInDate) {
      setErrorMessage('Check-out date must be strictly after check-in date.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await submitInquiry({
        ...formData,
        roomName: selectedRoom.name
      });
      if (res.requireAuth) {
        setErrorMessage(res.error || 'Authentication required');
        return;
      }
      try {
        sessionStorage.removeItem('msr_pending_booking');
      } catch {}
      setSuccessData(res);
    } catch (err) {
      setErrorMessage(err.message || 'Error saving booking inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 lg:p-10 select-none text-cozy-charcoal">
      <div 
        ref={modalRef}
        className="relative bg-cozy-cream w-full max-w-4xl shadow-2xl border border-cozy-border overflow-hidden my-auto rounded-3xl will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeBooking}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white hover:bg-cozy-forest hover:text-white rounded-full transition-colors text-cozy-forest border border-cozy-border shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {successData ? (
          // Success Confirmation Screen
          <div className="p-8 sm:p-14 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-sans uppercase tracking-[0.22em] text-cozy-sandDark block mb-1 font-semibold">
              RESERVATION INQUIRY RECEIVED
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl text-cozy-forest mb-3 font-normal">
              Thank You, {formData.guestName}
            </h2>

            <div className="inline-block px-4 py-1.5 bg-white border border-cozy-border text-cozy-forest text-xs font-mono font-medium rounded-full mb-6">
              Reference ID: {successData.inquiry?.id}
            </div>

            <p className="font-sans text-xs sm:text-sm text-cozy-muted max-w-lg mx-auto mb-8 leading-relaxed">
              Your booking inquiry for <strong>{successData.inquiry?.room}</strong> ({calculatedNights} nights, {formData.checkIn} to {formData.checkOut}) has been securely received by {settings?.officialName || 'Mineral Springs Retreat'}.
            </p>

            {/* Price Preview */}
            <div className="p-6 bg-white rounded-2xl border border-cozy-border text-left max-w-md mx-auto mb-8 shadow-sm space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between text-cozy-muted">
                <span>Tariff (All 4 Meals Included):</span>
                <span className="font-medium text-cozy-forest tabular-nums whitespace-nowrap">₹{ratePerPerson.toLocaleString('en-IN')} / person / night</span>
              </div>
              <div className="flex justify-between text-cozy-muted">
                <span>Party Size & Duration:</span>
                <span className="font-medium text-cozy-forest tabular-nums whitespace-nowrap">{formData.adults} Guest{formData.adults > 1 ? 's' : ''} × {calculatedNights} night{calculatedNights > 1 ? 's' : ''}</span>
              </div>
              <div className="pt-3 border-t border-cozy-border flex justify-between font-serif text-lg sm:text-xl text-cozy-forest">
                <span>Estimated Total:</span>
                <span className="text-cozy-sandDark font-semibold num-price tabular-nums whitespace-nowrap">₹{estimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            {(successData.whatsappUrl || successData.whatsappUrl2) && (
              <div className="space-y-2.5">
                <p className="text-xs text-cozy-muted">Chat directly with our retreat hosts to confirm your booking:</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {successData.whatsappUrl && (
                    <a
                      href={successData.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cozy-btn-sand text-xs tracking-wider font-semibold py-3 px-5 shadow-md inline-flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4 text-[#151F18]" />
                      <span>WhatsApp (+91 79081 92498)</span>
                      <CozySparkle className="w-3.5 h-3.5 text-[#151F18]" />
                    </a>
                  )}
                  {successData.whatsappUrl2 && (
                    <a
                      href={successData.whatsappUrl2}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cozy-btn-sand text-xs tracking-wider font-semibold py-3 px-5 shadow-md inline-flex items-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4 text-[#151F18]" />
                      <span>WhatsApp (+91 98303 55105)</span>
                      <CozySparkle className="w-3.5 h-3.5 text-[#151F18]" />
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="pt-8 mt-8 border-t border-cozy-border">
              <button
                onClick={closeBooking}
                className="text-xs uppercase tracking-widest text-cozy-muted hover:text-cozy-forest underline underline-offset-4"
              >
                Return to Website
              </button>
            </div>
          </div>
        ) : (
          // Booking Form
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-7 p-6 sm:p-10">
              <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-cozy-sandDark block mb-1 font-semibold">
                MINERAL SPRINGS RETREAT · DIRECT INQUIRY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-cozy-forest mb-2 font-normal">
                Book Your Stay
              </h2>
              <p className="font-sans text-xs sm:text-sm text-cozy-muted mb-6 leading-relaxed">
                Inquire directly for authentic homestay rates, including all 4 daily home-cooked meals.
              </p>

              {errorMessage && (
                <div className="p-3.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs mb-6 rounded-xl">
                  {errorMessage}
                </div>
              )}

              {/* Guest Authentication Banner */}
              {guestUser ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between mb-5 font-sans">
                  <div className="flex items-center space-x-3">
                    {guestUser.picture ? (
                      <img
                        src={guestUser.picture}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-emerald-300 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {guestUser.name?.charAt(0) || 'G'}
                      </div>
                    )}
                    <div className="text-xs">
                      <div className="font-semibold text-emerald-950 flex items-center space-x-1.5">
                        <span>{guestUser.name}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-medium">
                          Verified Gmail
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-800/80 block">{guestUser.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300 shrink-0">
                    Active Session
                  </span>
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2.5 mb-5 font-sans">
                  <div className="flex items-center space-x-2 text-amber-900 text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Google (Gmail) Authentication Required</span>
                  </div>
                  <p className="text-[11px] text-amber-800/90 leading-relaxed">
                    Please log in with your verified Google account to submit a reservation inquiry. You will be able to track your confirmation status anytime.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenGoogleAuth}
                    className="w-full py-2.5 bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign in with Google to Book</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Room Selector */}
                <div>
                  <label htmlFor="roomId" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                    Select Room / Suite *
                  </label>
                  <select
                    id="roomId"
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none focus:border-cozy-forest rounded-xl"
                    required
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — ₹{r.pricePerPerson || Math.round((r.pricePerNight || 3000) / (r.capacity || 2))}/person/night (4 Meals Included)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkIn" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                      Check-In Date *
                    </label>
                    <input
                      id="checkIn"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none focus:border-cozy-forest rounded-xl"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkOut" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                      Check-Out Date *
                    </label>
                    <input
                      id="checkOut"
                      type="date"
                      required
                      min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none focus:border-cozy-forest rounded-xl"
                    />
                  </div>
                </div>

                {/* Party Size */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="adults" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                      Guests
                    </label>
                    <select
                      id="adults"
                      value={formData.adults}
                      onChange={(e) => setFormData({ ...formData, adults: Number(e.target.value) })}
                      className="w-full px-2.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none rounded-xl"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="children" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                      Children
                    </label>
                    <select
                      id="children"
                      value={formData.children}
                      onChange={(e) => setFormData({ ...formData, children: Number(e.target.value) })}
                      className="w-full px-2.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none rounded-xl"
                    >
                      {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="numRooms" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                      Rooms
                    </label>
                    <select
                      id="numRooms"
                      value={formData.numRooms}
                      onChange={(e) => setFormData({ ...formData, numRooms: Number(e.target.value) })}
                      className="w-full px-2.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none rounded-xl"
                    >
                      {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                {/* Guest Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="guestName" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                      Full Name *
                    </label>
                    <input
                      id="guestName"
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none focus:border-cozy-forest rounded-xl"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none focus:border-cozy-forest rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 79081 92498"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none focus:border-cozy-forest rounded-xl"
                  />
                </div>

                <div>
                  <label htmlFor="specialRequests" className="text-[11px] uppercase tracking-wider font-semibold text-cozy-muted block mb-1 font-sans">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    id="specialRequests"
                    rows={2}
                    placeholder="Dietary preferences, Bolero taxi pickup, quiet room..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-cozy-border text-sm text-cozy-charcoal focus:outline-none focus:border-cozy-forest rounded-xl resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full cozy-btn-forest text-xs tracking-wider justify-center py-3.5 shadow-md"
                  >
                    <span>{submitting ? 'Submitting Request...' : 'Confirm Booking Request'}</span>
                    <CozySparkle className="w-3.5 h-3.5 text-cozy-sand" />
                  </button>
                  <p className="text-[10px] text-cozy-muted font-sans text-center mt-2.5 leading-relaxed">
                    ✦ Note: Submitting an inquiry does not constitute a guaranteed reservation. Our host desk confirms availability based on mountain seasonal schedule.
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column: Room Card & Price Breakdown */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-cozy-border flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-cozy-sandDark block mb-3 font-semibold">
                  SELECTED ACCOMMODATION
                </span>

                <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 bg-cozy-creamDark border border-cozy-border">
                  <img
                    src={selectedRoom.images?.[0] || '/images/mineral-springs/room-double-sharing-balcony.jpg'}
                    alt={selectedRoom.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-serif text-2xl text-cozy-forest mb-1 font-normal">
                  {selectedRoom.name}
                </h3>
                <p className="font-sans text-xs text-cozy-muted mb-6">
                  {selectedRoom.bed || 'Comfortable Bedding'} · Up to {selectedRoom.maxGuests || selectedRoom.capacity || 2} Guests
                </p>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs sm:text-sm border-t border-cozy-border pt-4 text-cozy-muted font-sans">
                  <div className="flex justify-between">
                    <span>Package Rate:</span>
                    <span className="font-medium text-cozy-forest tabular-nums whitespace-nowrap">₹{ratePerPerson.toLocaleString('en-IN')} / person / night</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stay Duration:</span>
                    <span className="font-medium text-cozy-forest tabular-nums whitespace-nowrap">{calculatedNights} night{calculatedNights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="font-medium text-cozy-forest tabular-nums whitespace-nowrap">{formData.adults} Guest{formData.adults > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-cozy-forest font-medium pt-1">
                    <span className="flex items-center space-x-1.5">
                      <UtensilsCrossed className="w-3 h-3 text-cozy-sandDark" />
                      <span>4 Daily Meals:</span>
                    </span>
                    <span className="text-cozy-sandDark font-semibold">Included</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-cozy-border flex justify-between items-baseline">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-cozy-forest block font-sans">
                      Estimated Total
                    </span>
                    <span className="text-[10px] text-cozy-muted font-sans">
                      Indicative tariff (4 meals included)
                    </span>
                  </div>
                  <span className="font-serif text-3xl font-normal text-cozy-forest num-price tabular-nums whitespace-nowrap">
                    ₹{estimatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-6 text-xs text-cozy-muted space-y-1 font-sans">
                <div>✓ No immediate deposit required</div>
                <div>✓ Instant host coordination via WhatsApp</div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

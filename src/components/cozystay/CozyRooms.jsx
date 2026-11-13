import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Bed, Bath, Flame, CloudFog, UtensilsCrossed, Calendar, Users, Home } from 'lucide-react';

const defaultRoomList = [
  {
    id: 'double-sharing',
    title: 'Double Sharing Eco Room',
    subtitle: 'Couples & Travel Pairs',
    tag: 'APPROX. ₹1,500 / PERSON',
    rate: '₹1,500',
    unit: 'per person / night (4 meals included)',
    image: '/images/mineral-springs/room-double-sharing-balcony.jpg',
    specs: [
      { label: 'Double Bed', icon: Bed },
      { label: 'Attached Toilet', icon: Bath },
      { label: 'Hot Geyser', icon: Flame },
      { label: 'Mist Balcony', icon: CloudFog },
      { label: '4 Daily Meals', icon: UtensilsCrossed }
    ]
  },
  {
    id: 'group-sharing',
    title: 'Triple / Group Sharing Room',
    subtitle: 'Families & Trekking Groups',
    tag: 'APPROX. ₹1,200 – ₹1,350 / PERSON',
    rate: '₹1,200 – ₹1,350',
    unit: 'per person / night (4 meals included)',
    image: '/images/mineral-springs/room-group-family-suite.jpg',
    specs: [
      { label: 'Multiple Beds', icon: Bed },
      { label: 'Attached Toilet', icon: Bath },
      { label: 'Hot Geyser', icon: Flame },
      { label: 'Valley View', icon: CloudFog },
      { label: '4 Daily Meals', icon: UtensilsCrossed }
    ]
  }
];

export default function CozyRooms({ setActivePage }) {
  const { openBooking, rooms: dynamicRooms } = useApp();
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);

  // Booking bar state
  const [checkIn, setCheckIn] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(() => new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestsCount, setGuestsCount] = useState(2);

  const roomList = (dynamicRooms && dynamicRooms.length > 0)
    ? dynamicRooms.map((r, i) => ({
        id: r.id,
        title: r.name || r.title,
        subtitle: r.tagline || (i === 0 ? 'Couples & Travel Pairs' : 'Families & Trekking Groups'),
        tag: r.sharingType ? r.sharingType.toUpperCase() : `APPROX. ₹${r.pricePerPerson || 1500} / PERSON`,
        rate: r.pricePerPerson ? `₹${r.pricePerPerson.toLocaleString()}` : (r.rate || '₹1,500'),
        unit: 'per person / night (4 meals included)',
        image: (r.images && r.images[0]) || r.image || '/images/mineral-springs/room-double-sharing-balcony.jpg',
        specs: [
          { label: r.bed || 'Double Bed', icon: Bed },
          { label: 'Attached Toilet', icon: Bath },
          { label: 'Hot Geyser', icon: Flame },
          { label: 'Private Balcony', icon: CloudFog },
          { label: '4 Daily Meals', icon: UtensilsCrossed }
        ]
      }))
    : defaultRoomList;

  const handlePrev = () => {
    setActiveRoomIdx((prev) => (prev === 0 ? roomList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveRoomIdx((prev) => (prev === roomList.length - 1 ? 0 : prev + 1));
  };

  const handleSearchBooking = (e) => {
    e.preventDefault();
    openBooking({
      checkIn,
      checkOut,
      guests: guestsCount,
      roomId: roomList[activeRoomIdx].id
    });
  };

  const currentRoom = roomList[activeRoomIdx];

  return (
    <section id="stay" className="py-24 sm:py-32 bg-[#F3EFEA] select-none border-t border-[#EAE4DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row: Title on Left, Link on Right (Exact CozyStay Reference) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 reveal-init">
          <div>
            <span className="typo-eyebrow block mb-3">
              DISCOVER OUR ACCOMMODATIONS
            </span>
            <h2 className="typo-section-heading uppercase tracking-[0.05em] font-normal text-[#1A1A1A]">
              ROOMS & COTTAGES
            </h2>
          </div>

          <button
            onClick={() => setActivePage('stay')}
            className="group inline-flex items-center space-x-3 typo-nav text-[#1A1A1A] hover:text-[#B89D77] transition-colors self-start md:self-end"
          >
            <span>Explore All Accommodations</span>
            <span className="w-8 h-[1px] bg-[#1A1A1A] group-hover:bg-[#B89D77] group-hover:w-12 transition-all duration-300" />
          </button>
        </div>

        {/* Interactive Room Showcase Slider (Exact CozyStay Composition) */}
        <div className="relative mb-12 sm:mb-16 reveal-init reveal-delay-1">
          <div className="relative rounded-2xl overflow-hidden min-h-[520px] sm:min-h-[460px] md:min-h-0 md:aspect-[16/9] max-h-[600px] w-full bg-[#111613] shadow-2xl border border-white/10">
            <img
              src={currentRoom.image}
              alt={currentRoom.title}
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

            {/* Top-Left Price Tag (Refined Champagne Gold Badge) */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 bg-gradient-to-r from-[#CBB08B] via-[#B89D77] to-[#A6875E] text-white typo-eyebrow px-4 py-2 rounded-full shadow-lg border border-white/25 font-semibold tracking-[0.14em] num-badge whitespace-nowrap">
              {currentRoom.tag}
            </div>

            {/* Center Room Details & Specs Bar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 z-20 py-8">
              <span className="typo-eyebrow text-[#EFE8DC] mb-1.5 sm:mb-2 font-medium">
                {currentRoom.subtitle}
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white uppercase tracking-wider mb-4 sm:mb-6 drop-shadow-md max-w-3xl">
                {currentRoom.title}
              </h3>

              {/* Specs Icons Row (Exact CozyStay Format) */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 lg:gap-8 bg-black/40 backdrop-blur-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-full border border-white/20 typo-small tracking-wider text-white/90 max-w-full">
                {currentRoom.specs.map((sp, idx) => {
                  const Icon = sp.icon;
                  return (
                    <div key={idx} className="flex items-center space-x-1.5 sm:space-x-2 text-[11px] sm:text-xs">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B89D77] shrink-0" />
                      <span className="whitespace-nowrap">{sp.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Instant Book CTA */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => openBooking({ roomId: currentRoom.id })}
                  className="cozy-btn-gold typo-btn px-6 sm:px-8 py-2.5 sm:py-3.5 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Book This Room
                </button>
                <button
                  onClick={() => setActivePage('stay')}
                  className="cozy-btn-outline-box typo-btn px-5 sm:px-6 py-2.5 sm:py-3 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Circular Slider Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1A1A1A] hover:bg-black hover:text-white transition-all duration-200 z-30 focus:outline-none"
              aria-label="Previous Room"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-[#1A1A1A] hover:bg-black hover:text-white transition-all duration-200 z-30 focus:outline-none"
              aria-label="Next Room"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Slider Dots */}
          <div className="flex items-center justify-center space-x-2.5 mt-6">
            {roomList.map((_, dot) => (
              <button
                key={dot}
                onClick={() => setActiveRoomIdx(dot)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeRoomIdx === dot ? 'bg-[#B89D77] w-8' : 'bg-[#C9BFB0]'
                }`}
                aria-label={`Go to room ${dot + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Exact Horizontal Booking Bar (Signature CozyStay Feature - Refined Velvet Forest Finish) */}
        <div className="bg-gradient-to-b from-[#1B271F] to-[#121914] text-white p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/10 border-t-white/20 reveal-init reveal-delay-2">
          <form onSubmit={handleSearchBooking} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            
            {/* Check In */}
            <div className="border border-white/15 p-3.5 bg-black/25 backdrop-blur-sm rounded-xl hover:border-[#B89D77]/60 focus-within:border-[#B89D77] transition-all duration-300">
              <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#CBB08B] mb-1 font-medium">
                CHECK IN
              </label>
              <div className="flex items-center space-x-2 text-xs font-sans text-white">
                <Calendar className="w-4 h-4 text-[#B89D77] shrink-0" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-white text-xs w-full focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="border border-white/15 p-3.5 bg-black/25 backdrop-blur-sm rounded-xl hover:border-[#B89D77]/60 focus-within:border-[#B89D77] transition-all duration-300">
              <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#CBB08B] mb-1 font-medium">
                CHECK OUT
              </label>
              <div className="flex items-center space-x-2 text-xs font-sans text-white">
                <Calendar className="w-4 h-4 text-[#B89D77] shrink-0" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-white text-xs w-full focus:outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Rooms */}
            <div className="border border-white/15 p-3.5 bg-black/25 backdrop-blur-sm rounded-xl hover:border-[#B89D77]/60 focus-within:border-[#B89D77] transition-all duration-300">
              <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#CBB08B] mb-1 font-medium">
                ROOMS
              </label>
              <div className="flex items-center space-x-2 text-xs font-sans text-white">
                <Home className="w-4 h-4 text-[#B89D77] shrink-0" />
                <select
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(Number(e.target.value))}
                  className="bg-transparent text-white text-xs w-full focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-[#111111] text-white">1 Room</option>
                  <option value={2} className="bg-[#111111] text-white">2 Rooms</option>
                  <option value={3} className="bg-[#111111] text-white">3 Rooms</option>
                  <option value={4} className="bg-[#111111] text-white">Entire Homestay</option>
                </select>
              </div>
            </div>

            {/* Guests */}
            <div className="border border-white/15 p-3.5 bg-black/25 backdrop-blur-sm rounded-xl hover:border-[#B89D77]/60 focus-within:border-[#B89D77] transition-all duration-300">
              <label className="block text-[10px] font-sans uppercase tracking-[0.2em] text-[#CBB08B] mb-1 font-medium">
                GUESTS
              </label>
              <div className="flex items-center space-x-2 text-xs font-sans text-white">
                <Users className="w-4 h-4 text-[#B89D77] shrink-0" />
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="bg-transparent text-white text-xs w-full focus:outline-none cursor-pointer"
                >
                  <option value={1} className="bg-[#111111] text-white">1 Guest</option>
                  <option value={2} className="bg-[#111111] text-white">2 Guests</option>
                  <option value={3} className="bg-[#111111] text-white">3 Guests</option>
                  <option value={4} className="bg-[#111111] text-white">4 Guests</option>
                  <option value={6} className="bg-[#111111] text-white">6+ Guests (Group)</option>
                </select>
              </div>
            </div>

            {/* Check Availability Button */}
            <div>
              <button
                type="submit"
                className="w-full cozy-btn-gold text-xs font-semibold tracking-widest py-4 rounded-xl justify-center shadow-lg hover:shadow-xl transition-all"
              >
                Check Availability
              </button>
            </div>

          </form>
        </div>

      </div>
    </section>
  );
}

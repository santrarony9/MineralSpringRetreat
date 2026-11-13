import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Users } from 'lucide-react';

export default function CozyBookingCTA() {
  const { openBooking, pages } = useApp();
  const sectionRef = useRef(null);
  const [parallaxY, setParallaxY] = useState(0);

  const ctaData = pages?.home?.bookingCTA;
  const ctaImage = ctaData?.image || '/images/mineral-springs/retreat-wooden-balcony-guitar.jpg';
  const eyebrow = ctaData?.eyebrow || 'BOOK YOUR STAY NOW';
  const statement = ctaData?.statement || ctaData?.heading || 'Escape to the beautiful mountains where peace comes alive. Immerse yourself in the restorative qualities of nature, far from the disturbances of everyday life.';
  const buttonLabel = ctaData?.buttonText || 'Check Availability';

  const [checkIn, setCheckIn] = useState(() => new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(() => new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
  const [guestsCount, setGuestsCount] = useState(2);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        // Slow subtle parallax shift
        const offset = (windowHeight / 2 - (rect.top + rect.height / 2)) * 0.15;
        setParallaxY(offset);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    openBooking({
      checkIn,
      checkOut,
      guests: guestsCount
    });
  };

  return (
    <section ref={sectionRef} className="relative py-28 sm:py-36 lg:py-44 select-none overflow-hidden text-center text-white">
      
      {/* Background Image with Dark Vignette & Gentle Parallax (Exact CozyStay Reference) */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallaxY}px, 0) scale(1.12)` }}
      >
        <img
          src={ctaImage}
          alt="Mineral Springs Retreat peaceful wooden balcony and valley vistas"
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Subtitle */}
        <span className="typo-eyebrow block mb-4 reveal-init">
          {eyebrow}
        </span>

        {/* Poetic Centered Statement (Exact CozyStay Reference Typography) */}
        <h2 className="typo-section-heading text-white font-light max-w-3xl mx-auto mb-10 sm:mb-12 drop-shadow-md reveal-init reveal-delay-1">
          {statement}
        </h2>

        {/* Horizontal Booking Bar (Exact CozyStay Reference - Luxury Glassmorphic Finish) */}
        <div className="w-full max-w-5xl mx-auto bg-black/60 backdrop-blur-xl p-4 sm:p-5 lg:p-6 rounded-2xl border border-white/20 border-t-white/35 shadow-[0_24px_60px_rgba(0,0,0,0.55)] reveal-init reveal-delay-2">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_0.95fr_1.55fr] gap-3 sm:gap-3.5 items-stretch">
            
            {/* Check In */}
            <div className="h-[62px] px-3.5 sm:px-4 py-2 bg-black/40 hover:bg-black/55 border border-white/20 hover:border-[#CBB08B]/70 focus-within:border-[#CBB08B] rounded-xl text-left transition-all duration-300 flex flex-col justify-center shadow-inner">
              <label className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#D5B990] font-semibold block leading-none mb-1.5 select-none">
                CHECK IN
              </label>
              <div className="flex items-center space-x-2 text-xs font-sans text-white">
                <Calendar className="w-3.5 h-3.5 text-[#B89D77] shrink-0" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="bg-transparent text-white text-xs font-medium w-full focus:outline-none cursor-pointer leading-none"
                  required
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="h-[62px] px-3.5 sm:px-4 py-2 bg-black/40 hover:bg-black/55 border border-white/20 hover:border-[#CBB08B]/70 focus-within:border-[#CBB08B] rounded-xl text-left transition-all duration-300 flex flex-col justify-center shadow-inner">
              <label className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#D5B990] font-semibold block leading-none mb-1.5 select-none">
                CHECK OUT
              </label>
              <div className="flex items-center space-x-2 text-xs font-sans text-white">
                <Calendar className="w-3.5 h-3.5 text-[#B89D77] shrink-0" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="bg-transparent text-white text-xs font-medium w-full focus:outline-none cursor-pointer leading-none"
                  required
                />
              </div>
            </div>

            {/* Guests */}
            <div className="h-[62px] px-3.5 sm:px-4 py-2 bg-black/40 hover:bg-black/55 border border-white/20 hover:border-[#CBB08B]/70 focus-within:border-[#CBB08B] rounded-xl text-left transition-all duration-300 flex flex-col justify-center shadow-inner">
              <label className="text-[10px] font-sans uppercase tracking-[0.22em] text-[#D5B990] font-semibold block leading-none mb-1.5 select-none">
                GUESTS
              </label>
              <div className="flex items-center space-x-2 text-xs font-sans text-white">
                <Users className="w-3.5 h-3.5 text-[#B89D77] shrink-0" />
                <select
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="bg-transparent text-white text-xs font-medium w-full focus:outline-none cursor-pointer leading-none"
                >
                  <option value={1} className="bg-[#1B271F] text-white">1 Guest</option>
                  <option value={2} className="bg-[#1B271F] text-white">2 Guests</option>
                  <option value={3} className="bg-[#1B271F] text-white">3 Guests</option>
                  <option value={4} className="bg-[#1B271F] text-white">4 Guests</option>
                  <option value={6} className="bg-[#1B271F] text-white">6+ Guests (Group)</option>
                </select>
              </div>
            </div>

            {/* Reserve Button */}
            <div className="flex items-center">
              <button
                type="submit"
                className="h-[62px] w-full px-4 sm:px-5 rounded-xl bg-gradient-to-r from-[#CBB08B] via-[#B89D77] to-[#A6875E] hover:from-[#D6BC97] hover:via-[#C5A880] hover:to-[#B29267] text-white font-sans text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase shadow-[0_4px_16px_rgba(184,157,119,0.35)] hover:shadow-[0_8px_24px_rgba(184,157,119,0.5)] transition-all duration-300 flex items-center justify-center text-center cursor-pointer select-none active:scale-[0.99] border border-[#D4AF37]/40 leading-snug"
              >
                <span className="whitespace-nowrap truncate xl:whitespace-normal xl:truncate-none">
                  {buttonLabel}
                </span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </section>
  );
}

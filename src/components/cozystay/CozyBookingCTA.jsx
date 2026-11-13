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
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Subtitle */}
        <span className="typo-eyebrow block mb-4 reveal-init">
          {eyebrow}
        </span>

        {/* Poetic Centered Statement (Exact CozyStay Reference Typography) */}
        <h2 className="typo-section-heading text-white font-light max-w-3xl mx-auto mb-12 drop-shadow-md reveal-init reveal-delay-1">
          {statement}
        </h2>

        {/* Horizontal Booking Bar (Exact CozyStay Reference - Luxury Glassmorphic Finish) */}
        <div className="max-w-3xl mx-auto bg-black/55 backdrop-blur-lg p-5 sm:p-7 rounded-2xl border border-white/20 border-t-white/35 shadow-2xl reveal-init reveal-delay-2">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            
            {/* Check In */}
            <div className="border border-white/20 p-3.5 bg-black/30 backdrop-blur-sm rounded-xl text-left hover:border-[#B89D77]/60 focus-within:border-[#B89D77] transition-all duration-300">
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
            <div className="border border-white/20 p-3.5 bg-black/30 backdrop-blur-sm rounded-xl text-left hover:border-[#B89D77]/60 focus-within:border-[#B89D77] transition-all duration-300">
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

            {/* Guests */}
            <div className="border border-white/20 p-3.5 bg-black/30 backdrop-blur-sm rounded-xl text-left hover:border-[#B89D77]/60 focus-within:border-[#B89D77] transition-all duration-300">
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

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full cozy-btn-gold typo-btn py-4 rounded-xl justify-center shadow-lg hover:shadow-xl transition-all"
              >
                {buttonLabel}
              </button>
            </div>

          </form>
        </div>

      </div>

    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';

export default function CozyHero({ setActivePage }) {
  const { openBooking, settings, pages } = useApp();
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const heroData = pages?.home?.hero;
  const heroImage = heroData?.image || settings?.heroImage || '/images/mineral-springs/dawaipani-balcony-sunset-clouds.jpg';
  const heroBadge = heroData?.badge || 'BOUTIQUE RETREAT OFFERING TIMELESS HIMALAYAN TRANQUILITY';
  const heroTitle = heroData?.title || 'A Peaceful Escape in the\nHeart of the Mountains';
  const heroStats = heroData?.stats || [
    { value: '6,500', unit: 'ft', label: 'RETREAT ALTITUDE' },
    { value: '4', unit: 'Meals', label: 'DAILY INCLUDED' },
    { value: '70', unit: 'km', label: 'FROM NJP & BAGDOGRA' }
  ];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Refined CozyStay entrance animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-item',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          stagger: 0.16,
          ease: 'power3.out',
          delay: 0.15
        }
      );
    }, heroRef);

    // Parallax scroll listener
    const handleScroll = () => {
      if (window.scrollY < window.innerHeight) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToIntro = () => {
    const el = document.getElementById('introduction');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen min-h-[700px] max-h-[1080px] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Background Image with Exact Cinematic Mountain Treatment & Subtle Parallax Drift */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.28}px, 0)` }}
      >
        <img
          src={heroImage}
          alt="Mineral Springs Retreat - Mountain vistas and tea garden slopes in Dawaipani"
          className="w-full h-full object-cover object-center scale-105 animate-hero-drift"
        />
        {/* Subtle Dark Vignette Matching CozyStay */}
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
      </div>

      {/* Generous Clearance Spacer for Fixed Header */}
      <div className="pt-32 sm:pt-36 lg:pt-40 xl:pt-44" />

      {/* Center Cinematic Typography (Exact CozyStay Composition) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white my-auto">
        
        {/* Dedicated Gold Retreat Tagline Badge */}
        <div className="hero-item mb-5 sm:mb-6">
          <span className="inline-flex items-center justify-center text-[#DFCCA8] font-sans font-medium text-[10px] sm:text-[11px] lg:text-xs tracking-[0.24em] sm:tracking-[0.28em] uppercase px-5 py-2 rounded-full bg-black/45 backdrop-blur-md border border-[#B89D77]/45 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-center max-w-full">
            {heroBadge}
          </span>
        </div>

        {/* Main Hero Headline: 64–76px (Desktop), 38–44px (Mobile), Line-height: 1.05–1.15 */}
        <h1 className="hero-item typo-hero font-normal text-white uppercase drop-shadow-md whitespace-pre-line">
          {heroTitle}
        </h1>

      </div>

      {/* Bottom Stats Row (Exact Signature CozyStay Reference: 3 Numbers + Uppercase Labels) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
        <div className="hero-stats-grid grid grid-cols-3 gap-4 sm:gap-8 text-center text-white border-t border-white/20 pt-6 sm:pt-8">
          
          {heroStats.map((stat, idx) => (
            <div key={idx} className={`space-y-1 ${idx === 1 ? 'border-x border-white/15 px-2' : ''}`}>
              <div className="num-stat-hero font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-normal text-white drop-shadow-sm tabular-nums flex items-baseline justify-center space-x-1.5 whitespace-nowrap">
                <span>{stat.value}</span>
                <span className="num-unit-label text-xl sm:text-2xl md:text-3xl font-serif text-white/85 font-light">{stat.unit}</span>
              </div>
              <span className="typo-eyebrow text-[#CBB08B] block font-medium mt-1 tracking-[0.16em] sm:tracking-[0.2em]">
                {stat.label}
              </span>
            </div>
          ))}

        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToIntro}
          className="mx-auto mt-6 flex flex-col items-center text-white/50 hover:text-white transition-colors focus:outline-none"
          aria-label="Scroll to Introduction"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>

    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';

export default function CozyHero({ setActivePage }) {
  const { openBooking, settings, pages } = useApp();
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const heroData = pages?.home?.hero;
  
  // Mobile / Tablet photograph (< 1024px) - completely unchanged
  const mobileHeroImage = heroData?.image || settings?.heroImage || '/images/mineral-springs/dawaipani-balcony-sunset-clouds.jpg';
  
  // Desktop / Laptop Drone Footage (>= 1024px) - original Google Drive drone asset
  const desktopHeroVideo = heroData?.video || settings?.heroVideo || '/videos/dawaipani-reel.mp4';
  const desktopPoster = heroData?.poster || settings?.heroPoster || '/images/mineral-springs/dawaipani-reel-poster.webp';

  const heroBadge = heroData?.badge || 'BOUTIQUE RETREAT OFFERING TIMELESS HIMALAYAN TRANQUILITY';
  const heroTitle = (heroData?.title && heroData.title.trim()) || 'A Peaceful Escape in the\nHeart of the Mountains';
  const heroStats = heroData?.stats || [
    { value: '6,500', unit: 'ft', label: 'RETREAT ALTITUDE' },
    { value: '4', unit: 'Meals', label: 'DAILY INCLUDED' },
    { value: '70', unit: 'km approx.', label: 'FROM NJP & BAGDOGRA' }
  ];

  // Listen for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Ensure unblocked autoplay on desktop and laptop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicitly enforce muted properties on DOM node for guaranteed browser autoplay
    video.defaultMuted = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const playVideo = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          // If browser policy delays until user interaction:
          const onInteract = () => {
            video.play().catch(() => {});
            ['click', 'touchstart', 'scroll'].forEach((evt) =>
              window.removeEventListener(evt, onInteract)
            );
          };
          ['click', 'touchstart', 'scroll'].forEach((evt) =>
            window.addEventListener(evt, onInteract, { once: true, passive: true })
          );
        });
      }
    };

    if (!prefersReducedMotion) {
      playVideo();
    }
  }, [prefersReducedMotion, desktopHeroVideo]);

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
      className="relative w-full h-[100dvh] min-h-[580px] sm:min-h-[680px] max-h-[1080px] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Background Media with Exact Cinematic Mountain Treatment & Subtle Parallax Drift */}
      <div
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.28}px, 0)` }}
      >
        {/* Unified Cinematic Drone Video Background on All Viewports */}
        {!videoError && !prefersReducedMotion ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster={desktopPoster}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover object-[center_35%]"
            preload="auto"
          >
            <source src={desktopHeroVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={desktopPoster}
            alt="Mineral Springs Retreat - Drone Himalayan Mountain Panorama"
            className="w-full h-full object-cover object-[center_35%]"
          />
        )}

        {/* Subtle Dark Overlay for Natural Luxury Retreat Aesthetics & Text Legibility */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Responsive Clearance Spacer for Fixed Header */}
      <div className="pt-20 sm:pt-28 lg:pt-36" />

      {/* Center Cinematic Typography */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white my-auto">
        
        {/* Dedicated Gold Retreat Tagline Badge */}
        <div className="hero-item mb-3.5 sm:mb-5 lg:mb-6 px-2">
          <span className="inline-flex items-center justify-center text-[#DFCCA8] font-sans font-medium text-[9px] sm:text-[11px] lg:text-xs tracking-[0.16em] sm:tracking-[0.24em] lg:tracking-[0.28em] uppercase px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-black/45 backdrop-blur-md border border-[#B89D77]/45 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-center max-w-[92%] sm:max-w-none leading-relaxed">
            {heroBadge}
          </span>
        </div>

        {/* Main Hero Headline: Responsive, balanced 4-line presentation on mobile */}
        <h1 className="hero-item typo-hero font-normal text-white uppercase drop-shadow-md text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.14] sm:leading-[1.1] max-w-[280px] sm:max-w-2xl md:max-w-4xl mx-auto sm:whitespace-pre-line text-balance">
          {heroTitle}
        </h1>

      </div>

      {/* Bottom Stats Row (3 Columns with Clean Dividers + Down Arrow) */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pb-6 sm:pb-10 lg:pb-14">
        <div className="hero-stats-grid grid grid-cols-3 gap-2 sm:gap-6 lg:gap-8 text-center text-white border-t border-white/20 pt-3.5 sm:pt-6 lg:pt-8">
          
          {heroStats.map((stat, idx) => (
            <div key={idx} className={`space-y-0.5 sm:space-y-1 ${idx === 1 ? 'border-x border-white/20 px-1 sm:px-4' : 'px-1'}`}>
              <div className="num-stat-hero text-lg min-[360px]:text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-normal text-white drop-shadow-sm tabular-nums flex items-baseline justify-center space-x-1 whitespace-nowrap">
                <span>{stat.value}</span>
                <span className="num-unit-label text-[10px] min-[360px]:text-xs sm:text-xl md:text-2xl lg:text-3xl font-light text-white/85">{stat.unit}</span>
              </div>
              <span className="typo-eyebrow text-[#CBB08B] block font-medium mt-0.5 text-[8.5px] sm:text-[10px] md:text-xs tracking-[0.1em] sm:tracking-[0.16em] leading-tight">
                {stat.label}
              </span>
            </div>
          ))}

        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToIntro}
          className="mx-auto mt-3 sm:mt-5 flex flex-col items-center text-white/60 hover:text-white transition-colors focus:outline-none"
          aria-label="Scroll to Introduction"
        >
          <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" />
        </button>
      </div>

    </section>
  );
}

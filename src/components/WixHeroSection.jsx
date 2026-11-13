import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WixHeroSection() {
  const { settings, openBooking } = useApp();

  const eyebrow = settings?.eyebrow || 'MINERAL SPRINGS RETREAT · DAWAIPANI';
  const heroTitle = settings?.heroTitle || 'Where the Clouds\nRest Upon the\nMountain Mist';
  const heroImage = settings?.heroImage || '/images/mineral-springs/hero-mountain-ridge.jpg';

  const titleLines = heroTitle.split('\n');

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const eyebrowRef = useRef(null);
  const linesRef = useRef([]);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Cinematic Hero Image Zoom-out on Load
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { scale: 1.15 },
          { scale: 1.0, duration: 2.2, ease: 'power2.out' }
        );

        // Parallax on Scroll
        gsap.to(imageRef.current, {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 2. Staggered Text Reveal
      const tl = gsap.timeline({ delay: 0.2 });

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      }

      if (linesRef.current.length > 0) {
        tl.fromTo(
          linesRef.current,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
          '-=0.5'
        );
      }

      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.4'
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [heroTitle]);

  return (
    <section
      ref={sectionRef}
      className="relative px-3 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-3 sm:pb-4 max-w-[1440px] mx-auto select-none"
    >
      {/* Giant Rounded Hero Card (Exact Wix 3561 Layout) */}
      <div className="relative w-full h-[82vh] sm:h-[88vh] min-h-[580px] max-h-[920px] rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-col items-center justify-center text-center shadow-md">
        
        {/* Background Image with Cinematic Crop & Scale */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={imageRef}
            src={heroImage}
            alt={eyebrow}
            className="w-full h-full object-cover will-change-transform"
            loading="eager"
          />
          {/* Atmospheric Dark Tint Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-brightness-95" />
        </div>

        {/* Decorative Golden Ambient Sticker (Matching Wix Reference Right Side) */}
        <div
          className="absolute right-6 sm:right-16 top-1/3 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#8A7636]/50 backdrop-blur-sm pointer-events-none hidden sm:block animate-pulse"
          style={{ animationDuration: '4s' }}
        />

        {/* Hero Content (Centered) */}
        <div ref={contentRef} className="relative z-10 max-w-4xl px-4 flex flex-col items-center">
          
          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            className="text-white text-lg sm:text-2xl md:text-3xl font-light tracking-wide mb-3 sm:mb-4 drop-shadow-sm font-sans"
          >
            {eyebrow}
          </p>

          {/* Monumental Title */}
          <h1 className="text-white text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-light leading-[0.92] tracking-tight mb-8 sm:mb-12 font-sans drop-shadow-md">
            {titleLines.map((line, idx) => (
              <span
                key={idx}
                ref={(el) => (linesRef.current[idx] = el)}
                className="block will-change-transform"
              >
                {line}
              </span>
            ))}
          </h1>

          {/* CTA Link / Button */}
          <div ref={ctaRef}>
            <button
              onClick={() => openBooking()}
              className="group flex items-center space-x-2.5 text-white text-sm sm:text-base font-normal tracking-wide hover:opacity-85 transition-all duration-300 cursor-pointer py-2 px-6 rounded-full border border-white/60 hover:border-white hover:bg-white/10 backdrop-blur-sm shadow-sm"
            >
              <span>Book Your Stay</span>
              <WixStarburst className="w-3.5 h-3.5 text-white transition-transform duration-300 group-hover:rotate-45" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WixSectionSleep() {
  const { settings, openBooking } = useApp();

  const heading = settings?.section3Heading || 'Sleeping In or Staying Up Late';
  const text = settings?.section3Text || 'This is a space to welcome visitors to the retreat. As the first text readers encounter, this copy should clearly convey what the sanctuary is about. Grab their attention with captivating and inviting text, and add an image or video for extra engagement.';
  const image = settings?.section3Image || '/images/wix/sleep-late.jpg';

  const sectionRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftCardRef.current,
        { opacity: 0, x: -35, y: 20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        rightCardRef.current,
        { opacity: 0, x: 35, y: 20 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 max-w-[1440px] mx-auto select-none"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
        
        {/* Left Column: Bedroom Lifestyle Photo Card (Matching Wix 3561) */}
        <div
          ref={leftCardRef}
          className="rounded-[24px] sm:rounded-[32px] overflow-hidden min-h-[460px] sm:min-h-[560px] relative bg-neutral-200 group shadow-sm will-change-transform"
        >
          <img
            src={image}
            alt={heading}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Right Column: Deep Olive Green Card (#525624) */}
        <div
          ref={rightCardRef}
          className="bg-[#525624] text-white rounded-[24px] sm:rounded-[32px] p-8 sm:p-14 md:p-16 flex flex-col items-center justify-center text-center min-h-[460px] sm:min-h-[560px] shadow-sm will-change-transform"
        >
          <h2 className="text-white text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[0.98] mb-6 font-sans">
            Sleeping In or
            <span className="block mt-1">Staying Up Late</span>
          </h2>

          <p className="text-white text-xs sm:text-sm font-normal max-w-[360px] leading-relaxed mb-8 opacity-85 font-sans">
            {text}
          </p>

          <button
            onClick={() => openBooking()}
            className="group flex items-center space-x-2 text-white text-sm font-normal tracking-wide hover:opacity-85 transition-all duration-200 cursor-pointer py-2 px-5 rounded-full border border-white/30 hover:border-white"
          >
            <span>Book Your Stay</span>
            <WixStarburst className="w-3.5 h-3.5 text-white transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>

      </div>
    </section>
  );
}

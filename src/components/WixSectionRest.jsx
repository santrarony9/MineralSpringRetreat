import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WixSectionRest() {
  const { settings, openBooking } = useApp();

  const heading = settings?.section1Heading || 'Rest and Decompress in Style';
  const text = settings?.section1Text || 'This is a space to welcome visitors to the retreat. As the first text readers encounter, this copy should clearly convey what the sanctuary is about. Grab their attention with captivating and inviting text, and add an image or video for extra engagement.';
  const image = settings?.section1Image || '/images/wix/rest-decompress.jpg';

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
        
        {/* Left Column: Sky Blue Card (Matching Wix 3561 #8DC3DF) */}
        <div
          ref={leftCardRef}
          className="bg-[#8DC3DF] rounded-[24px] sm:rounded-[32px] p-8 sm:p-14 md:p-16 flex flex-col items-center justify-center text-center min-h-[460px] sm:min-h-[560px] shadow-sm will-change-transform"
        >
          <h2 className="text-black text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[0.98] mb-6 font-sans">
            {heading.split(' in ')[0]}
            {heading.includes(' in ') && (
              <span className="block mt-1">in {heading.split(' in ')[1]}</span>
            )}
          </h2>

          <p className="text-black text-xs sm:text-sm font-normal max-w-[360px] leading-relaxed mb-8 opacity-85 font-sans">
            {text}
          </p>

          <button
            onClick={() => openBooking()}
            className="group flex items-center space-x-2 text-black text-sm font-normal tracking-wide hover:opacity-75 transition-all duration-200 cursor-pointer py-2 px-5 rounded-full border border-black/25 hover:border-black/60"
          >
            <span>Book Your Stay</span>
            <WixStarburst className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>

        {/* Right Column: Hotel Bedroom Image Card */}
        <div
          ref={rightCardRef}
          className="rounded-[24px] sm:rounded-[32px] overflow-hidden min-h-[460px] sm:min-h-[560px] relative bg-neutral-200 group shadow-sm will-change-transform"
        >
          <img
            src={image}
            alt={heading}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  );
}

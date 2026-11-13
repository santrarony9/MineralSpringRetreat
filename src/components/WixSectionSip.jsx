import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WixSectionSip() {
  const { settings, openBooking } = useApp();

  const heading = settings?.section2Heading || 'Take a Sip and Savor';
  const text = settings?.section2Text || 'This is a space to welcome visitors to the retreat. As the first text readers encounter, this copy should clearly convey what the sanctuary is about. Grab their attention with captivating and inviting text, and add an image or video for extra engagement.';
  const image = settings?.section2Image || '/images/wix/sip-savor.jpg';

  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const headingRef = useRef(null);
  const ovalRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1.0, duration: 0.9, ease: 'power3.out' }
      )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        ovalRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1.0, duration: 0.9, ease: 'power2.out' },
        '-=0.5'
      )
      .fromTo(
        bottomRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-3 sm:px-6 md:px-8 py-2 sm:py-3 max-w-[1440px] mx-auto select-none"
    >
      {/* Full-Width Pink Card with Oval Masked Image (Exact Wix 3561 #EC6A9B) */}
      <div
        ref={cardRef}
        className="bg-[#EC6A9B] rounded-[24px] sm:rounded-[32px] p-8 sm:p-14 md:p-16 flex flex-col justify-between items-center text-center min-h-[580px] sm:min-h-[700px] shadow-sm relative overflow-hidden will-change-transform"
      >
        {/* Heading at Top */}
        <h2
          ref={headingRef}
          className="text-black text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[0.98] mb-8 sm:mb-12 font-sans"
        >
          {heading}
        </h2>

        {/* Centerpiece: Iconic Oval / Ellipse Masked Image */}
        <div
          ref={ovalRef}
          className="w-full max-w-[560px] h-[260px] sm:h-[350px] rounded-[50%] overflow-hidden shadow-sm mx-auto mb-10 sm:mb-14 relative group bg-black/10 will-change-transform"
        >
          <img
            src={image}
            alt={heading}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </div>

        {/* Bottom Row: Paragraph on Left, Book Button on Right */}
        <div
          ref={bottomRef}
          className="w-full max-w-5xl flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6"
        >
          <p className="text-black text-xs sm:text-sm font-normal text-left max-w-[400px] leading-relaxed opacity-90 font-sans">
            {text}
          </p>

          <button
            onClick={() => openBooking()}
            className="group flex items-center space-x-2 text-black text-sm font-normal tracking-wide hover:opacity-75 transition-all duration-200 cursor-pointer py-2 px-5 rounded-full border border-black/25 hover:border-black/60 shrink-0"
          >
            <span>Book Your Stay</span>
            <WixStarburst className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>

      </div>
    </section>
  );
}

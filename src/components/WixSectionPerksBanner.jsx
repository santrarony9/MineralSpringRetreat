import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WixSectionPerksBanner() {
  const { settings } = useApp();

  const title = settings?.perksHeading || 'Fuel Your Hustle\nwith Our Perks';
  const lines = title.split('\n');

  const bannerRef = useRef(null);
  const titleRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Title entrance
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Starburst gentle floating & rotation
      starsRef.current.forEach((star, i) => {
        if (!star) return;
        gsap.to(star, {
          y: i % 2 === 0 ? -12 : 14,
          rotation: i % 2 === 0 ? 30 : -25,
          duration: 3 + i * 0.7,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, bannerRef);

    return () => ctx.revert();
  }, []);

  // Floating starburst positions (Matching Wix Template 3561 dark olive stars)
  const starPositions = [
    { left: '16%', top: '22%', size: 'w-6 h-6 sm:w-8 sm:h-8' },
    { left: '49%', top: '12%', size: 'w-7 h-7 sm:w-9 sm:h-9' },
    { right: '18%', top: '26%', size: 'w-7 h-7 sm:w-9 sm:h-9' },
    { left: '20%', bottom: '18%', size: 'w-6 h-6 sm:w-8 sm:h-8' },
    { right: '22%', bottom: '22%', size: 'w-7 h-7 sm:w-10 sm:h-10' },
  ];

  return (
    <section
      ref={bannerRef}
      className="relative pt-24 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-8 max-w-[1440px] mx-auto text-center select-none overflow-hidden"
    >
      {/* Floating Dark Olive 8-Point Starbursts (Wix 3561 #525624) */}
      {starPositions.map((pos, idx) => (
        <div
          key={idx}
          ref={(el) => (starsRef.current[idx] = el)}
          className="absolute pointer-events-none will-change-transform"
          style={{
            left: pos.left,
            right: pos.right,
            top: pos.top,
            bottom: pos.bottom,
          }}
        >
          <WixStarburst className={`${pos.size} text-[#525624]`} color="#525624" />
        </div>
      ))}

      {/* Monumental Headline */}
      <div ref={titleRef} className="relative z-10 max-w-4xl mx-auto will-change-transform">
        <h2 className="text-black text-5xl sm:text-7xl md:text-8xl lg:text-[104px] font-light tracking-tight leading-[0.94] font-sans">
          {lines.map((line, idx) => (
            <span key={idx} className="block">
              {line}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}

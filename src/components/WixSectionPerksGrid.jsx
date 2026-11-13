import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WixSectionPerksGrid() {
  const { perks: contextPerks } = useApp();

  const defaultPerks = [
    {
      id: 'medicinal-springs',
      title: 'Medicinal Water Springs',
      description: 'The name Dawaipani translates to "medicated water" in local heritage. Associated with local streams and natural mineral water springs historically believed by local communities to have rejuvenating properties.',
      image: '/images/mineral-springs/nature-mountain-sanctuary.jpg',
      color: '#F2DC8D', // Yellow
      align: 'right',
    },
    {
      id: 'waterfalls-trekking',
      title: 'Trekking & Hidden Waterfalls',
      description: 'Explore winding village trails, discover pristine natural waterfalls, and trek along nearby riverbanks such as the Rung Dung River with local guidance.',
      image: '/images/mineral-springs/village-trail-vista.jpg',
      color: '#F55956', // Coral Red
      align: 'left',
    },
    {
      id: 'kanchenjunga-views',
      title: 'Panoramic Kanchenjunga',
      description: 'On clear days, visitors can enjoy spectacular panoramic views of Mount Kanchenjunga. At night, marvel at the glittering lights of Darjeeling town and Namchi across the valley.',
      image: '/images/mineral-springs/kanchenjunga-valley-vista.jpg',
      color: '#8A7636', // Golden Olive
      align: 'center-right',
    },
    {
      id: 'tea-garden-walks',
      title: 'Tea Garden & Village Walks',
      description: 'The retreat is surrounded by the broader Lebong and Mineral Spring Tea Garden landscape. Enjoy morning walks through tea gardens, bird-watching, and peaceful village paths.',
      image: '/images/mineral-springs/tea-garden-landscape.jpg',
      color: '#8DC3DF', // Sky Blue
      align: 'left-center',
    },
    {
      id: 'bonfire-gatherings',
      title: 'Bonfire & Barbecue Nights',
      description: 'Gather beneath the crisp mountain night sky. Bonfire and barbecue arrangements are available on request, subject to weather conditions and availability.',
      image: '/images/exp-bonfire.jpg',
      color: '#EC6A9B', // Hot Pink
      align: 'right',
    },
  ];

  const perks = (contextPerks && contextPerks.length > 0)
    ? defaultPerks.map((dp, i) => ({ ...dp, ...contextPerks[i] }))
    : defaultPerks;

  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const xOffset = i % 2 === 0 ? 30 : -30;
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, x: xOffset, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [perks]);

  return (
    <section
      ref={sectionRef}
      className="pb-24 sm:pb-36 px-4 sm:px-8 max-w-[1440px] mx-auto select-none"
    >
      <div className="space-y-16 sm:space-y-24 md:space-y-32">
        {perks.map((perk, idx) => {
          let alignClasses = 'justify-end md:pr-10 lg:pr-16';
          if (perk.align === 'left') {
            alignClasses = 'justify-start md:pl-8 lg:pl-14';
          } else if (perk.align === 'center-right') {
            alignClasses = 'justify-center md:justify-end md:pr-32 lg:pr-48';
          } else if (perk.align === 'left-center') {
            alignClasses = 'justify-start md:pl-16 lg:pl-28';
          } else if (perk.align === 'right') {
            alignClasses = 'justify-end md:pr-8 lg:pr-14';
          }

          return (
            <div
              key={perk.id || idx}
              className={`flex w-full ${alignClasses}`}
            >
              {/* Asymmetrical Colored Card Container (Matching Wix 3561) */}
              <div
                ref={(el) => (cardRefs.current[idx] = el)}
                className="w-full max-w-[360px] sm:max-w-[420px] rounded-[24px] sm:rounded-[28px] overflow-hidden p-3.5 sm:p-4 pb-6 sm:pb-8 flex flex-col shadow-sm group will-change-transform"
                style={{ backgroundColor: perk.color }}
              >
                {/* Photo at Top of Card with Rounded Inner Corners */}
                <div className="w-full h-64 sm:h-72 md:h-80 rounded-[18px] sm:rounded-[22px] overflow-hidden mb-5 sm:mb-6 bg-black/10 relative">
                  <img
                    src={perk.image}
                    alt={perk.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Card Title with Starburst */}
                <div className="px-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-black text-xl font-medium leading-none select-none">*</span>
                    <h3 className="text-black text-2xl sm:text-3xl font-light tracking-tight leading-tight font-sans">
                      {perk.title}
                    </h3>
                  </div>

                  {/* Card Description */}
                  <p className="text-black text-xs sm:text-sm font-normal leading-relaxed opacity-90 font-sans">
                    {perk.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

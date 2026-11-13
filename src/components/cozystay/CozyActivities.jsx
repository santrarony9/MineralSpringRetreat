import React from 'react';
import { useApp } from '../../context/AppContext';

const defaultActivities = [
  {
    id: 'medicinal-lore',
    title: 'Mountain Balcony Contemplation',
    image: '/images/mineral-springs/retreat-balcony-cushion-corner.jpg',
    desc: 'Settle into our quiet balcony seating corners with plush ethnic cushions, warm Himalayan tea, and sweeping views of mist flowing across the ridges.',
    linkText: 'Discover More',
    page: 'experiences'
  },
  {
    id: 'tea-garden-walks',
    title: 'Cozy Reading & Fireside Solitude',
    image: '/images/mineral-springs/room-reading-nook-corner.jpg',
    desc: 'Spend unhurried hours in peaceful wooden corners with warm reading lamps, handpicked books, and pure mountain quietude.',
    linkText: 'Discover More',
    page: 'experiences'
  },
  {
    id: 'gorkha-dining',
    title: 'Deck Gatherings & Gorkha Dining',
    image: '/images/mineral-springs/retreat-patio-deck-lounge.jpg',
    desc: 'Savor our inclusive 4-meal daily plan featuring home-cooked Nepali thalis, crisp evening pakoras, and cozy open-air deck bonfire sessions on request.',
    linkText: 'Discover More',
    page: 'stay'
  }
];

export default function CozyActivities({ setActivePage }) {
  const { pages } = useApp();
  const actData = pages?.home?.activities;

  const eyebrow = actData?.eyebrow || 'LOCAL ACTIVITIES & MOUNTAIN LIFE';
  const heading = actData?.heading || 'IMMERSE YOURSELF IN A PEACEFUL MOUNTAIN LIFE';

  const defaultImgs = [
    '/images/mineral-springs/retreat-balcony-cushion-corner.jpg',
    '/images/mineral-springs/room-reading-nook-corner.jpg',
    '/images/mineral-springs/retreat-patio-deck-lounge.jpg'
  ];

  const activities = (actData?.items && actData.items.length > 0)
    ? actData.items.map((item, idx) => ({
        id: `act-${idx}`,
        title: item.title,
        desc: item.desc,
        image: item.image || defaultImgs[idx % defaultImgs.length],
        linkText: item.linkText || 'Discover More',
        page: item.page || (idx === 2 ? 'stay' : 'experiences')
      }))
    : defaultActivities;

  return (
    <section className="py-24 sm:py-32 bg-white select-none border-t border-[#EAE4DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Exact CozyStay Composition) */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="typo-eyebrow block mb-3 reveal-init">
            {eyebrow}
          </span>
          <h2 className="typo-section-heading uppercase tracking-[0.05em] font-normal text-[#1A1A1A] reveal-init reveal-delay-1">
            {heading}
          </h2>
        </div>

        {/* 3 Editorial Cards with Inset Gold Frames (Exact CozyStay Reference) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {activities.map((act, idx) => (
            <div
              key={act.id}
              onClick={() => setActivePage(act.page)}
              className={`group cursor-pointer flex flex-col justify-between h-full reveal-init reveal-delay-${idx + 1}`}
            >
              <div className="flex flex-col flex-1">
                {/* Photo with Thin Inset Frame */}
                <div className="relative overflow-hidden aspect-[4/3] bg-[#111613] shadow-md mb-6 shrink-0">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="cozy-inset-frame" />
                </div>

                {/* Title */}
                <h3 className="typo-card-heading text-[#1A1A1A] font-normal mb-3 group-hover:text-[#B89D77] transition-colors md:min-h-[3.75rem] flex items-start">
                  {act.title}
                </h3>

                {/* Paragraph */}
                <p className="typo-small text-[#666666] leading-relaxed font-light mb-5 flex-1">
                  {act.desc}
                </p>
              </div>

              {/* Underlined Link (Exact CozyStay Style with Hover Micro-interaction) */}
              <div className="pt-2">
                <span className="inline-flex items-center space-x-1.5 typo-nav text-xs text-[#1A1A1A] group-hover:text-[#B89D77] border-b border-[#1A1A1A] group-hover:border-[#B89D77] pb-1 transition-all duration-300">
                  <span>{act.linkText}</span>
                  <span className="arrow-glide text-xs">›</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

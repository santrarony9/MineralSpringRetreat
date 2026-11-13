import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

const defaultExperiences = [
  {
    id: 'kanchenjunga',
    tag: 'PANORAMIC VISTAS',
    category: 'OUTDOORS',
    title: 'Panoramic Mountain Vistas',
    desc: 'Gaze across layered blue Himalayan ridges from private balconies, with rolling clouds and distant Darjeeling lights.',
    image: '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg',
    isStaggered: false
  },
  {
    id: 'verandah-living',
    tag: 'HOMESTAY LIFE',
    category: 'RELAXATION',
    title: 'Mountain Verandah Walk',
    desc: 'Stroll along wooden verandahs framed by potted palms, heritage rugs, and crisp alpine air overlooking the forest.',
    image: '/images/mineral-springs/retreat-verandah-corridor-view.jpg',
    isStaggered: true
  },
  {
    id: 'hillside-cottages',
    tag: 'ECO ARCHITECTURE',
    category: 'RETREAT GROUNDS',
    title: 'Pine Hillside Cottages',
    desc: 'Experience rustic timber living nestled directly on the mountain slope surrounded by towering Himalayan pines.',
    image: '/images/mineral-springs/retreat-hillside-eco-cottage.jpg',
    isStaggered: false
  },
  {
    id: 'garden-cottages',
    tag: 'TERRACED GARDENS',
    category: 'FLORA & TRAILS',
    title: 'Terraced Garden Lodges',
    desc: 'Wander among red-roofed cottages connected by rustic stone steps, blooming hydrangeas, and organic mountain greenery.',
    image: '/images/mineral-springs/retreat-cottages-mountain-slope.jpg',
    isStaggered: true
  }
];

export default function CozyExperiences({ setActivePage }) {
  const { openBooking, experiences: appExperiences, pages } = useApp();

  const expData = pages?.experiences || pages?.home?.experiences;
  const eyebrow = expData?.eyebrow || 'ENJOY AUTHENTIC MOUNTAIN EXPERIENCES';
  const heading = expData?.heading || expData?.title || 'YOUR MOUNTAIN PARADISE';

  const experiences = (appExperiences && appExperiences.length > 0)
    ? appExperiences.slice(0, 4).map((exp, idx) => ({
        id: exp.id,
        tag: (exp.highlight || exp.tag || 'CURATED EXPERIENCE').toUpperCase(),
        category: (exp.category || 'NATURE').toUpperCase(),
        title: exp.title,
        desc: exp.description || exp.desc,
        image: exp.image || '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg',
        isStaggered: idx % 2 === 1
      }))
    : defaultExperiences;

  return (
    <section id="experiences" className="py-24 sm:py-32 lg:py-36 bg-white select-none border-t border-[#EAE4DB]">
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

        {/* 4 Tall Staggered Portrait Cards (Exact CozyStay Reference) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
          {experiences.map((exp, idx) => (
            <div
              key={exp.id}
              onClick={() => setActivePage('experiences')}
              className={`group relative overflow-hidden aspect-[3/4.5] bg-[#111613] cursor-pointer shadow-lg transition-all duration-500 hover:-translate-y-1.5 reveal-init reveal-delay-${(idx % 4) + 1} ${
                exp.isStaggered ? 'lg:mt-10' : 'lg:mt-0'
              }`}
            >
              {/* Background Image */}
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Inset Gold Frame Line (Exact Signature CozyStay Detail) */}
              <div className="cozy-inset-frame" />

              {/* Top-Left White Tag Box (Exact CozyStay Style) */}
              <div className="absolute top-5 left-5 z-30 bg-white text-[#1A1A1A] text-[10px] font-sans font-semibold uppercase tracking-[0.14em] px-3.5 py-1.5 shadow-sm">
                {exp.tag}
              </div>

              {/* Bottom Dark Gradient & Text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />

              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <span className="typo-eyebrow text-[#B89D77] block mb-1.5">
                  {exp.category}
                </span>

                <h3 className="typo-card-heading font-normal text-white mb-2 group-hover:text-[#B89D77] transition-colors min-h-[2.8rem] sm:min-h-[3.25rem] flex items-start">
                  {exp.title}
                </h3>

                <div className="inline-flex items-center space-x-1.5 typo-nav text-xs text-white/90 group-hover:text-[#B89D77] transition-colors">
                  <span>DISCOVER TRIP</span>
                  <span className="text-xs transition-transform duration-300 group-hover:translate-x-1.5">›</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

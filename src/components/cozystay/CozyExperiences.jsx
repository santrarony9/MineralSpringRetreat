import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

const defaultExperiences = [
  {
    id: 'waterfall-trek',
    tag: 'NATURAL WONDER',
    category: 'TREKKING',
    title: 'Mineral Springs Waterfall Trek',
    desc: 'Hike through cardamom forests down to natural cascades and crystal stream pools deep in the Himalayan valley.',
    image: '/images/mineral-springs/meditation-waterfall-river-rocks.webp',
    objectPosition: 'center 35%',
    isStaggered: false
  },
  {
    id: 'tea-gardens',
    tag: 'ESTATE HERITAGE',
    category: 'ORGANIC TASTING',
    title: 'Tea Garden Walk & Tasting',
    desc: 'Stroll through terraced mountain tea slopes, discover two-leaves-and-a-bud plucking, and sample fresh brews.',
    image: '/images/mineral-springs/darjeeling-tea-gardens-panoramic.jpg',
    isStaggered: true
  },
  {
    id: 'kanchenjunga',
    tag: 'PANORAMIC VISTAS',
    category: 'OUTDOORS',
    title: 'Kanchenjunga Sunrise & Clouds',
    desc: 'Witness golden hour dawn over the Sleeping Buddha snow peaks with floating sea-of-clouds right from your verandah.',
    image: '/images/mineral-springs/dawaipani-balcony-sunset-clouds.jpg',
    isStaggered: false
  },
  {
    id: 'forest-trails',
    tag: 'GENTLE TRAILS',
    category: 'HAMLET WALKS',
    title: 'Cardamom Forest & Ridge Trails',
    desc: 'Follow quiet stone pathways past fluttering prayer flags, traditional stilt cottages, and lush mountain slopes.',
    image: '/images/mineral-springs/dawaipani-forest-trail-walk.jpg',
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
        image: (exp.id === 'waterfall-trek' || exp.id === 'exp-1')
          ? '/images/mineral-springs/meditation-waterfall-river-rocks.webp'
          : (exp.image || '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg'),
        objectPosition: exp.objectPosition || ((exp.id === 'waterfall-trek' || exp.id === 'exp-1') ? 'center 35%' : 'center'),
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
                style={{ objectPosition: exp.objectPosition || 'center' }}
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

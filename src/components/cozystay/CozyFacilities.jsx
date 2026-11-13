import React from 'react';
import { useApp } from '../../context/AppContext';
import { Car, Sparkles, Bath, Flame, Utensils, Mountain } from 'lucide-react';

const defaultEssentials = [
  {
    title: 'Local 4WD Pick-up Guidance',
    desc: 'Pre-trip coordination for trusted local Bolero or Sumo 4WD taxi transfers on mountain roads.',
    icon: Car
  },
  {
    title: 'Housekeeping & Fresh Linen',
    desc: 'Clean, comfortable bedding, fresh mountain towels, and daily housekeeping care.',
    icon: Sparkles
  },
  {
    title: 'Attached Western Toilets',
    desc: 'Every guest room features a clean, private, attached Western-style bathroom.',
    icon: Bath
  },
  {
    title: '24/7 Hot Water Geysers',
    desc: 'Individual electric geysers in each bathroom ensuring steaming hot showers in the chill.',
    icon: Flame
  },
  {
    title: 'Home-Cooked Daily Meals',
    desc: 'Hearty Breakfast, wholesome Lunch, Evening Snacks with Himalayan tea, and warming Dinner prepared fresh daily.',
    icon: Utensils
  },
  {
    title: 'Private Mist Balcony',
    desc: 'Step out onto your private balcony and experience afternoon mountain clouds drifting peacefully through your room.',
    icon: Mountain
  }
];

export default function CozyFacilities() {
  const { pages } = useApp();
  const facData = pages?.home?.facilities;

  const eyebrow = facData?.eyebrow || 'DISCOVER THE SERVICES WE OFFER';
  const heading = facData?.heading || 'THE ESSENTIALS';

  const iconMap = [Car, Sparkles, Bath, Flame, Utensils, Mountain];

  const essentials = (facData?.items && facData.items.length > 0)
    ? facData.items.map((item, idx) => ({
        title: item.title,
        desc: item.desc,
        icon: iconMap[idx % iconMap.length]
      }))
    : defaultEssentials;

  const image1 = facData?.images?.[0] || '/images/mineral-springs/retreat-covered-porch-lantern.jpg';
  const image2 = facData?.images?.[1] || '/images/mineral-springs/room-cozy-pine-bedroom.jpg';

  return (
    <section id="facilities" className="py-20 sm:py-28 lg:py-32 bg-white select-none border-t border-[#EAE4DB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Heading + 2-Column Standardized Feature Cards */}
          <div className="lg:col-span-7">
            <span className="typo-eyebrow block mb-3">
              {eyebrow}
            </span>
            <h2 className="typo-section-heading uppercase tracking-[0.05em] font-normal text-[#1A1A1A] mb-8 sm:mb-10">
              {heading}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {essentials.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 bg-[#FAF8F5] border border-[#EAE4DB] hover:border-[#B89D77]/70 rounded-2xl flex flex-col justify-start h-full group shadow-[0_4px_20px_-4px_rgba(27,36,30,0.05)] hover:shadow-[0_14px_30px_-6px_rgba(27,36,30,0.1)] transition-all duration-400"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#E8E2D8] text-[#B89D77] flex items-center justify-center mb-3.5 shrink-0 shadow-xs group-hover:scale-105 group-hover:border-[#B89D77]/60 group-hover:shadow-[0_4px_12px_rgba(184,157,119,0.2)] transition-all duration-300">
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl text-[#1A1A1A] font-normal mb-2 leading-snug group-hover:text-[#B89D77] transition-colors break-words sm:min-h-[3.25rem] flex items-start">
                      {item.title}
                    </h3>
                    <p className="typo-small text-xs sm:text-[13px] text-[#555E57] leading-relaxed font-light flex-1">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Editorial Photography Pair */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 sm:gap-6 items-start pt-2 lg:pt-14">
            <div className="relative overflow-hidden aspect-[3/4] rounded-2xl bg-[#111613] shadow-xl group border border-[#EAE4DB] hover:border-[#B89D77]/40 transition-all duration-500">
              <img
                src={image1}
                alt="Covered wooden porch with hanging lantern and mountain seating"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
            </div>

            <div className="relative overflow-hidden aspect-[3/4] rounded-2xl bg-[#111613] shadow-xl mt-6 sm:mt-8 group border border-[#EAE4DB] hover:border-[#B89D77]/40 transition-all duration-500">
              <img
                src={image2}
                alt="Homestay bedroom with natural pine wood finishes"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

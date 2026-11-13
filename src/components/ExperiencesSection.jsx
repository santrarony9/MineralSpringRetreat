import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Clock, CheckCircle2, Sparkles, Utensils, Mountain, Heart, Flame, Landmark } from 'lucide-react';

export default function ExperiencesSection() {
  const { experiences } = useApp();

  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('dining')) return Utensils;
    if (cat.includes('outdoor')) return Mountain;
    if (cat.includes('wellness')) return Heart;
    if (cat.includes('evening') || cat.includes('bonfire')) return Flame;
    if (cat.includes('culture') || cat.includes('tea')) return Landmark;
    return Compass;
  };

  return (
    <section id="experiences" className="py-20 md:py-32 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <span className="text-xs uppercase tracking-widest-xl font-medium text-moss-600 block mb-3">
            IMMERSIVE EXPERIENCES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-earth-900 font-normal leading-tight mb-6">
            Life at The Sanctuary
          </h2>
          <p className="text-sm sm:text-base text-earth-900/75 font-light leading-relaxed">
            Every moment at our homestay is curated to rekindle wonder—from slow morning tea harvests to starlit dinners beside the whispering pines.
          </p>
          <div className="w-12 h-[1px] bg-sand-400 mx-auto mt-6" />
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {experiences.map((exp, idx) => {
            const IconComponent = getCategoryIcon(exp.category);

            return (
              <div
                key={exp.id || idx}
                className="group bg-white border border-sand-200/90 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-sand-200">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover img-hover-zoom"
                  />
                  <div className="absolute top-4 left-4 bg-earth-950/80 backdrop-blur-md text-cream-100 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 flex items-center space-x-1.5 border border-white/20">
                    <IconComponent className="w-3 h-3 text-brass-400" />
                    <span>{exp.category}</span>
                  </div>

                  {exp.highlight && (
                    <div className="absolute bottom-3 left-3 right-3 bg-cream-50/95 backdrop-blur-md px-3 py-1.5 border border-sand-200 text-[11px] text-earth-900 font-medium flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-moss-600 shrink-0" />
                      <span className="truncate">{exp.highlight}</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-serif text-2xl text-earth-900 font-normal mb-3 leading-snug group-hover:text-moss-700 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-earth-900/75 leading-relaxed font-light mb-6">
                      {exp.description}
                    </p>
                  </div>

                  {exp.timing && (
                    <div className="pt-4 border-t border-sand-200 flex items-center space-x-2 text-xs text-sand-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-moss-600 shrink-0" />
                      <span className="truncate">{exp.timing}</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Editorial Callout */}
        <div className="mt-16 p-8 sm:p-10 bg-sand-100 border border-sand-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-moss-700 block mb-1">
              CUSTOM ITINERARIES
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-earth-900 font-normal">
              Looking for something bespoke?
            </h3>
            <p className="text-xs sm:text-sm text-earth-900/75 font-light mt-1">
              Our hosts are delighted to curate private picnics, sunrise valley hikes, or quiet wellness retreats tailored to your desires.
            </p>
          </div>
          <a
            href="#contact"
            className="px-6 py-3 bg-earth-900 hover:bg-moss-700 text-cream-50 uppercase tracking-widest text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            Inquire With Host
          </a>
        </div>

      </div>
    </section>
  );
}

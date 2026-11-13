import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Leaf, Heart, Coffee, Sun } from 'lucide-react';

export default function AboutSection() {
  const { settings } = useApp();

  const storyHeading = settings?.storyHeading || 'A Place to Feel at Home';
  const p1 = settings?.storyParagraph1 || 'Tucked away in the emerald foothills, Mineral Springs Retreat was conceived not merely as a boutique stay, but as an intimate haven for travelers seeking peace, poetry, and presence.';
  const p2 = settings?.storyParagraph2 || 'Here, time slows to the rhythm of rustling pines and morning mist. Every corner of our property reflects artisanal craftsmanship—hand-hewn timber beams, local slate masonry, organic linen, and warm hearths.';
  const p3 = settings?.storyParagraph3 || 'Wake up to birdsong and freshly roasted estate coffee, spend afternoons wandering tea trails or immersed in books, and gather at dusk around the crackling bonfire beneath a sky strewn with stars.';

  const image1 = settings?.aboutImage1 || '/images/about-story.jpg';
  const image2 = settings?.aboutImage2 || '/images/about-detail.jpg';

  const scrollToRooms = () => {
    const elem = document.querySelector('#accommodation');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const highlights = [
    { icon: Leaf, title: 'Preserved Nature', desc: 'Surrounded by 5 private acres of untouched pine canopy and wildflowers.' },
    { icon: Heart, title: 'Homely Warmth', desc: 'Intimate hospitality with personalized care and home-cooked artisanal meals.' },
    { icon: Coffee, title: 'Farm to Veranda', desc: 'Locally grown organic produce, artisan sourdough, and single-origin teas.' },
    { icon: Sun, title: 'Mindful Sanctuary', desc: 'Designed for restorative rest, creative inspiration, and deep decompression.' },
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="text-xs uppercase tracking-widest-xl font-medium text-moss-600 mb-3">
            OUR PHILOSOPHY & STORY
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-earth-900 font-normal max-w-2xl leading-tight">
            {storyHeading}
          </h2>
          <div className="w-12 h-[1px] bg-sand-400 mt-6" />
        </div>

        {/* Editorial Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Layered Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative z-10 overflow-hidden shadow-2xl">
              <img
                src={image1}
                alt="Mineral Springs Retreat property story"
                className="w-full h-[450px] sm:h-[540px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Overlapping secondary photo */}
            <div className="hidden sm:block absolute -bottom-10 -right-8 w-60 sm:w-72 h-64 sm:h-76 z-20 shadow-2xl p-2.5 bg-white border border-sand-200">
              <img
                src={image2}
                alt="Sanctuary details"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Subtle decorative quote box */}
            <div className="absolute -top-6 -left-6 z-0 w-32 h-32 border-t-2 border-l-2 border-brass-500/40 pointer-events-none" />
          </div>

          {/* Right Column: Editorial Text & Story */}
          <div className="lg:col-span-6 flex flex-col justify-center lg:pl-6">
            <span className="text-[11px] uppercase tracking-widest text-sand-500 font-medium mb-3">
              SANCTUARY OF QUIET LUXURY
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl text-earth-900 mb-6 leading-snug">
              "We built this space as an antidote to modern hurry—a home where silence is welcome and nature takes center stage."
            </h3>

            <div className="space-y-4 text-earth-900/80 text-sm sm:text-base leading-relaxed font-light mb-8">
              <p>{p1}</p>
              <p>{p2}</p>
              <p>{p3}</p>
            </div>

            {/* Pillars / Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-sand-200/80 mb-8">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="p-2 bg-cream-100 border border-sand-200 text-moss-600 rounded-none shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-earth-900 mb-0.5">{h.title}</h4>
                      <p className="text-xs text-earth-900/70 leading-relaxed font-light">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={scrollToRooms}
                className="inline-flex items-center space-x-3 px-8 py-3.5 bg-earth-900 hover:bg-moss-700 text-cream-50 uppercase tracking-widest text-xs font-semibold transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <span>EXPLORE OUR ACCOMMODATIONS</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

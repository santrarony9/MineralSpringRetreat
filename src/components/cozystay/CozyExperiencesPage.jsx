import React from 'react';
import { useApp } from '../../context/AppContext';
import { CozySparkle } from './CozyIcons';
import { Mountain, Waves, Compass, Footprints, Sparkles, Flame, Check, ArrowRight } from 'lucide-react';

const defaultExperiences = [
  {
    id: 'kanchenjunga',
    title: 'Panoramic Himalayan Vistas from Balcony',
    subtitle: 'Sunrise Majesty & Layered Blue Ridges',
    icon: Mountain,
    image: '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg',
    description: 'Step onto the wooden homestay balcony and gaze across endless mist-shrouded mountain ridges stretching toward Darjeeling. On clear mornings, amber dawn illuminates the distant peaks, while twilight turns the valley into a sparkling constellation of village and city lights.',
    points: [
      'Sweeping layered mountain ridge visibility directly from property balconies',
      'Spectacular twinkling valley lights of Darjeeling & Namchi at night',
      'Direct mountain views from private room balconies',
      'Tranquil sunrise contemplation spots with fresh morning air'
    ]
  },
  {
    id: 'medicinal-springs',
    title: 'Verandah Corridors & Peaceful Alpine Living',
    subtitle: 'Handcrafted Heritage & Open Mountain Air',
    icon: Waves,
    image: '/images/mineral-springs/retreat-verandah-corridor-view.jpg',
    description: 'The retreat features long, open-air wooden verandah walkways bordered by potted palms, heritage woven rugs, and pine railings. It is the perfect place to sit with a cup of hot Darjeeling tea, read, or listen to the mountain breeze whispering through the pines.',
    points: [
      'Open-air wooden verandah corridors connecting the suites',
      'Authentic mountain architecture with heritage textiles',
      'Sheltered spots to enjoy mountain rain and drifting mist',
      'Peaceful environment for relaxation and creative contemplation'
    ]
  },
  {
    id: 'tea-gardens',
    title: 'Hillside Eco-Cottages in Pine Canopy',
    subtitle: 'Traditional Timber & Stilt Architecture',
    icon: Compass,
    image: '/images/mineral-springs/retreat-hillside-eco-cottage.jpg',
    description: 'Nestled directly against the steep mountain slope, our eco-cottages on stilts are built in harmony with nature. Shaded by towering Himalayan pines and lush ferns, each cottage offers total privacy and immersion in the mountain forest environment.',
    points: [
      'Traditional wooden stilt cottage architecture on the hillside',
      'Surrounded by evergreen pine forest and mountain vegetation',
      'Rich Himalayan bird-watching right from your cottage windows',
      'A truly peaceful escape far away from tourist congestion'
    ]
  },
  {
    id: 'trekking-waterfalls',
    title: 'Morning Mist Drifting Through Balcony',
    subtitle: 'The Signature Dawaipani Weather Phenomenon',
    icon: Footprints,
    image: '/images/mineral-springs/room-misty-balcony-morning.jpg',
    description: 'Experience the magical sensation of cool, silken mountain mist rolling right past your bedroom door. In the quiet morning hours, watch clouds flow like rivers across the valley canopy, filling the air with the scent of pine and wet earth.',
    points: [
      'Silken mountain mist drifting right past your bedroom doors',
      'Cool, refreshing Himalayan air every morning and afternoon',
      'Dramatic shifts in weather and cloud formations throughout the day',
      'Unmatched photography opportunities of changing mountain light'
    ]
  },
  {
    id: 'village-life',
    title: 'Dawaipani Village Walks & Bird-Watching',
    subtitle: 'Rural Warmth & Avian Sanctuary',
    icon: Sparkles,
    image: '/images/mineral-springs/retreat-cottages-mountain-slope.jpg',
    description: 'Dawaipani is a peaceful settlement characterized by warm Gorkha hospitality and serene mountain rhythms. Take quiet walks past traditional wooden cottages, vibrant flower gardens, and listen to melodious songs of laughingthrushes, sunbirds, and Himalayan barbets.',
    points: [
      'Immersive village strolls through authentic Gorkha communities',
      'Exceptional bird-watching in pine and rhododendron woods',
      'Slow down to the gentle pace of authentic Himalayan life',
      'Pure silence away from urban stress and commercial noise'
    ]
  },
  {
    id: 'bonfire-bbq',
    title: 'Evening Bonfire & Mountain Barbecue',
    subtitle: 'Starlight Gatherings on Request',
    icon: Flame,
    image: '/images/mineral-springs/retreat-patio-deck-lounge.jpg',
    description: 'As twilight falls and the mountain air turns pleasantly crisp, gather around crackling embers under a brilliant Himalayan night sky. Bonfire and barbecue sessions can be arranged on request, subject to weather conditions and local host availability.',
    points: [
      'Cozy wood fire in the outdoor open courtyard',
      'Delicious local barbecue treats prepared on request',
      'Unobstructed mountain stargazing free of light pollution',
      'Subject to clear weather and prior host coordination'
    ]
  }
];

export default function CozyExperiencesPage({ setActivePage }) {
  const { openBooking, experiences: appExperiences, pages } = useApp();

  const pageData = pages?.experiences;
  const eyebrow = pageData?.eyebrow || 'DAWAIPANI EXPERIENCES & NATURE TRAILS';
  const pageTitle = pageData?.title || 'The Mineral Springs Experience';
  const pageSubtitle = pageData?.subtitle || 'From majestic morning views of Mount Kanchenjunga to the rejuvenating lore of medicinal springs, immerse yourself in the untouched wonders of Dawaipani.';

  const icons = [Mountain, Waves, Compass, Footprints, Sparkles, Flame];

  const experiences = (appExperiences && appExperiences.length > 0)
    ? appExperiences.map((exp, idx) => {
        const def = defaultExperiences[idx] || {};
        return {
          id: exp.id,
          title: exp.title || def.title || 'Mountain Experience',
          subtitle: exp.highlight || exp.timing || def.subtitle || 'Curated Retreat Activity',
          icon: def.icon || icons[idx % icons.length],
          image: exp.image || def.image || '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg',
          description: exp.description || def.description || '',
          points: def.points || [
            'Direct mountain vistas and peaceful forest surroundings',
            'Authentic homestay hospitality and local host guidance',
            'Fresh Himalayan mountain air and quiet contemplation spots'
          ]
        };
      })
    : defaultExperiences;

  return (
    <div className="pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-28 bg-cozy-cream select-none min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="typo-eyebrow block mb-3">
            {eyebrow}
          </span>
          <h1 className="typo-page-title text-cozy-forest font-normal">
            {pageTitle}
          </h1>
          <p className="typo-body text-cozy-muted font-normal mt-4 max-w-2xl mx-auto">
            {pageSubtitle}
          </p>
        </div>

        {/* 6 Experience Cards */}
        <div className="space-y-12 sm:space-y-16 mb-20">
          {experiences.map((exp, idx) => {
            const isReversed = idx % 2 === 1;
            const Icon = exp.icon;
            return (
              <div
                key={exp.id}
                className="bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-[0_12px_36px_-10px_rgba(27,36,30,0.08)] border border-[#EAE3D8] hover:border-[#B89D77]/70 grid grid-cols-1 lg:grid-cols-12 items-stretch transition-all duration-500"
              >
                {/* Photo Side */}
                <div
                  className={`lg:col-span-6 relative min-h-[360px] sm:min-h-[440px] overflow-hidden ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-cozy-forest/90 backdrop-blur-md text-white typo-eyebrow px-4 py-1.5 rounded-full border border-white/10 flex items-center space-x-2">
                    <Icon className="w-3.5 h-3.5 text-cozy-sand" />
                    <span className="text-white">{exp.subtitle}</span>
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className={`lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="space-y-4">
                    <span className="font-serif text-base font-normal tracking-[0.2em] text-[#B89D77] num-lining">
                      0{idx + 1}
                    </span>
                    <h2 className="typo-subsection-heading text-cozy-forest font-normal">
                      {exp.title}
                    </h2>
                    <p className="typo-small text-cozy-muted font-light">
                      {exp.description}
                    </p>

                    <div className="space-y-2.5 pt-3">
                      {exp.points.map((pt, i) => (
                        <div key={i} className="flex items-start space-x-2.5 typo-small text-[13px] text-cozy-charcoal">
                          <Check className="w-3.5 h-3.5 text-cozy-sandDark shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-cozy-border flex items-center gap-4">
                    <button
                      onClick={() => openBooking()}
                      className="cozy-btn-forest typo-btn"
                    >
                      <span>Plan This Experience</span>
                      <CozySparkle className="w-3 h-3 text-cozy-sand" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

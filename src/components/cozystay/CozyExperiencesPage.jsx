import React from 'react';
import { useApp } from '../../context/AppContext';
import { CozySparkle } from './CozyIcons';
import { Mountain, Waves, Compass, Footprints, Sparkles, Flame, Check, ArrowRight } from 'lucide-react';

const defaultExperiences = [
  {
    id: 'exp-1',
    title: 'Mineral Springs Waterfall & River Trek',
    subtitle: 'Cascading natural waters, riverbed boulders & untouched wilderness',
    icon: Waves,
    image: '/images/mineral-springs/mineral-springs-waterfall-stream.jpg',
    description: 'Hike through cardamom groves and virgin subtropical forests down to the authentic Mineral Springs mountain waterfalls. Wade in crystal pools, sit on moss-covered boulders, and immerse in pristine Himalayan sounds.',
    points: [
      'Natural freshwater waterfall cascades and crystal mountain pools',
      'Peaceful river boulder meditation and pure running water sounds',
      'Dense subtropical pine canopy and Himalayan birdwatching'
    ]
  },
  {
    id: 'exp-2',
    title: 'Organic Tea Garden Walk & First Flush Tasting',
    subtitle: 'Hand-plucked tender leaves, dewdrop mornings & estate heritage',
    icon: Compass,
    image: '/images/mineral-springs/darjeeling-tea-gardens-panoramic.jpg',
    description: 'Stroll through the manicured contour slopes of nearby organic Darjeeling tea gardens. Witness traditional two-leaves-and-a-bud plucking and savor fresh-brewed aromatic Darjeeling tea back at the retreat.',
    points: [
      'Sweeping panoramas of terraced green tea slopes',
      'Insight into traditional organic harvesting & hand plucking',
      'Curated artisanal Darjeeling tea tasting session at the homestay'
    ]
  },
  {
    id: 'exp-3',
    title: 'Kanchenjunga Sunrise & Cloud Inversion Watch',
    subtitle: '180-degree Sleeping Buddha panorama above a silent sea of clouds',
    icon: Mountain,
    image: '/images/mineral-springs/dawaipani-balcony-sunset-clouds.jpg',
    description: 'Awaken with fresh mountain ginger tea on your private wooden verandah. Watch the first golden rays illuminate the snow peaks of Mt. Kanchenjunga while white cloud inversions flood the valley below.',
    points: [
      'Golden hour illumination of the Sleeping Buddha snow peaks',
      'Sea-of-clouds inversion phenomenon right from your balcony',
      'Fresh hot morning brew amidst total mountain tranquility'
    ]
  },
  {
    id: 'exp-4',
    title: 'Cardamom Forest & Village Ridge Trails',
    subtitle: 'Stone trails, fluttering prayer flags & peaceful hamlet life',
    icon: Footprints,
    image: '/images/mineral-springs/dawaipani-forest-trail-walk.jpg',
    description: 'Follow scenic stone pathways winding past hillside cottages, fluttering Buddhist prayer flags, and terraced organic farms. Breathe in pure mountain air and experience genuine Gorkha mountain culture.',
    points: [
      'Gentle stone trails passing terraced hill gardens and pine woods',
      'Traditional colorful prayer flags and village shrines',
      'Authentic cultural exchange with friendly local hosts'
    ]
  },
  {
    id: 'exp-5',
    title: 'UNESCO Darjeeling Toy Train Heritage Excursion',
    subtitle: 'Historic steam locomotive winding through misty pine forests',
    icon: Sparkles,
    image: '/images/mineral-springs/darjeeling-unesco-steam-locomotive.jpg',
    description: 'Take a scenic excursion to the Darjeeling Himalayan Railway (DHR). Watch authentic blue steam engines puff smoke along narrow-gauge tracks carved into steep mountain slopes—a UNESCO World Heritage landmark.',
    points: [
      'Historic 140-year-old steam locomotive heritage experience',
      'Iconic narrow-gauge railway photo opportunities',
      'Scenic journeys through Batasia Loop and misty mountain stations'
    ]
  },
  {
    id: 'exp-6',
    title: 'Evening Bonfire & Fireside Mountain Lounge',
    subtitle: 'Starlight Gatherings on Request',
    icon: Flame,
    image: '/images/mineral-springs/retreat-patio-deck-lounge.jpg',
    description: 'As twilight falls and the mountain air turns pleasantly crisp, gather around crackling embers under a brilliant Himalayan night sky. Bonfire and barbecue sessions can be arranged on request, subject to weather conditions and local host availability.',
    points: [
      'Cozy wood fire in the outdoor open timber courtyard',
      'Delicious local barbecue treats prepared on request',
      'Unobstructed mountain stargazing free of light pollution'
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
          points: exp.highlights || def.points || [
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

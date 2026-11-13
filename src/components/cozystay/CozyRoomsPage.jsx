import React from 'react';
import { useApp } from '../../context/AppContext';
import { CozySparkle } from './CozyIcons';
import { Users, Bed, Bath, Flame, CloudFog, UtensilsCrossed, Check, ShieldCheck, Sun, Sunset, Moon, Coffee } from 'lucide-react';

const defaultRooms = [
  {
    id: 'double-sharing',
    name: 'Double Sharing Eco Room',
    subtitle: 'Couples & Travel Pairs',
    rate: 'Approx. ₹1,500',
    unit: 'per person / night',
    capacity: '2 Guests',
    image: '/images/mineral-springs/room-double-sharing-balcony.jpg',
    badge: 'Most Popular for Pairs',
    description: 'An intimate, peaceful mountain room featuring authentic rustic wooden accents, pristine bed linen, and a private balcony where the afternoon mountain mist drifts gently right through your room.',
    features: [
      'Attached clean Western-style toilet',
      '24/7 Hot water electric geyser',
      'Private panoramic mountain balcony',
      'Afternoon mist experience',
      'Daily housekeeping & fresh mountain water',
      'All 4 daily home-cooked meals included'
    ]
  },
  {
    id: 'group-sharing',
    name: 'Triple / Group Sharing Room',
    subtitle: 'Families & Trekking Groups',
    rate: 'Approx. ₹1,200 – ₹1,350',
    unit: 'per person / night',
    capacity: '3 – 4 Guests',
    image: '/images/mineral-springs/room-group-family-suite.jpg',
    badge: 'Best Value for Groups',
    description: 'Spacious mountain accommodation designed for trekking companions, families, and travel groups. Offers breathtaking morning sunrise vistas over the Himalayan ridges and warm community atmosphere.',
    features: [
      'Attached clean Western-style toilet',
      '24/7 Hot water electric geyser',
      'Valley-facing private balcony',
      'Multiple comfortable cozy beds',
      'Local trekking and trail advice',
      'All 4 daily home-cooked meals included'
    ]
  }
];

export default function CozyRoomsPage({ setActivePage }) {
  const { openBooking, settings, rooms: appRooms, pages } = useApp();

  const stayData = pages?.stay;
  const eyebrow = stayData?.eyebrow || 'DAWAIPANI · RUSTIC ECO-STAY';
  const pageTitle = stayData?.title || 'Simple, Clean & Comfortable Accommodation';
  const pageSubtitle = stayData?.subtitle || 'Mineral Springs Retreat is an authentic rustic eco-stay. Every room includes attached Western toilets, 24/7 hot water geysers, private mountain balconies, and our inclusive 4-meal daily plan.';

  const rooms = (appRooms && appRooms.length > 0)
    ? appRooms.map((r, i) => {
        const def = defaultRooms[i] || defaultRooms[0];
        return {
          id: r.id,
          name: r.name || def.name,
          subtitle: r.tagline || def.subtitle,
          rate: r.pricePerPerson ? `Approx. ₹${r.pricePerPerson.toLocaleString()}` : def.rate,
          unit: r.sharingType ? r.sharingType.toLowerCase() : def.unit,
          capacity: `${r.maxGuests || r.capacity || 2} Guests`,
          image: (r.images && r.images[0]) || r.image || def.image,
          badge: r.badge || def.badge,
          description: r.description || def.description,
          features: (r.amenities && r.amenities.length > 0) ? r.amenities : def.features
        };
      })
    : defaultRooms;

  const meals = [
    {
      title: 'Morning Breakfast',
      time: '8:00 AM – 10:00 AM',
      icon: Sun,
      desc: 'Freshly prepared hot breakfast served with organic Darjeeling tea or mountain-brewed coffee.'
    },
    {
      title: 'Gorkha & Nepali Lunch',
      time: '1:00 PM – 2:30 PM',
      icon: UtensilsCrossed,
      desc: 'Authentic traditional thali with fresh farm greens, mountain dal, organic rice, and homestyle sides.'
    },
    {
      title: 'Evening Snacks & Tea',
      time: '5:00 PM – 6:30 PM',
      icon: Sunset,
      desc: 'Hot local fritters, savory pakoras, and freshly brewed first-flush tea as twilight settles.'
    },
    {
      title: 'Home-Cooked Dinner',
      time: '8:00 PM – 9:30 PM',
      icon: Moon,
      desc: 'Comforting, nourishing family recipes prepared fresh each evening using local ingredients.'
    }
  ];

  return (
    <div className="pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-28 bg-cozy-cream select-none min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 reveal-init">
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

        {/* Room Cards */}
        <div className="space-y-12 sm:space-y-16 mb-20 sm:mb-28">
          {rooms.map((room, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={room.id}
                className={`bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-[0_12px_36px_-10px_rgba(27,36,30,0.08)] border border-[#EAE3D8] hover:border-[#B89D77]/70 grid grid-cols-1 lg:grid-cols-12 items-stretch transition-all duration-500 reveal-init reveal-delay-${idx + 1}`}
              >
                {/* Photo Side */}
                <div
                  className={`lg:col-span-6 relative min-h-[360px] sm:min-h-[460px] overflow-hidden ${
                    isReversed ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-cozy-forest/90 backdrop-blur-md text-white typo-eyebrow px-4 py-1.5 rounded-full border border-white/10">
                    <span className="text-white">{room.badge}</span>
                  </div>
                </div>

                {/* Content Side */}
                <div
                  className={`lg:col-span-6 p-8 sm:p-12 lg:p-14 flex flex-col justify-between ${
                    isReversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="space-y-4">
                    
                    {/* Rate Display */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs uppercase tracking-[0.14em] text-cozy-muted font-medium font-sans">
                        Approx.
                      </span>
                      <span className="font-serif text-3xl sm:text-4xl text-cozy-forest font-normal num-price whitespace-nowrap">
                        {room.rate.replace(/^Approx\.\s*/, '')}
                      </span>
                      <span className="typo-eyebrow text-cozy-muted ml-1">
                        {room.unit}
                      </span>
                    </div>

                    <h2 className="typo-subsection-heading text-cozy-forest font-normal">
                      {room.name}
                    </h2>

                    <p className="typo-small text-cozy-muted font-normal">
                      {room.description}
                    </p>

                    {/* Meal Plan Included Callout */}
                    <div className="p-3.5 bg-cozy-creamDark rounded-xl border border-cozy-border flex items-center space-x-3 typo-small text-cozy-forest font-medium">
                      <UtensilsCrossed className="w-4 h-4 text-cozy-sandDark shrink-0" />
                      <span>Includes all 4 meals: Breakfast, Lunch, Evening Snacks & Tea, and Dinner.</span>
                    </div>

                    {/* Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 typo-small text-[13px] text-cozy-charcoal">
                      {room.features.map((feat, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Check className="w-3.5 h-3.5 text-cozy-sandDark shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="pt-8 border-t border-cozy-border flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => openBooking({ roomId: room.id, guests: idx === 0 ? 2 : 3 })}
                      className="cozy-btn-forest typo-btn"
                    >
                      <span>Enquire Now</span>
                      <CozySparkle className="w-3 h-3 text-cozy-sand" />
                    </button>

                    <button
                      onClick={() => openBooking()}
                      className="cozy-btn-outline-dark typo-btn"
                    >
                      <span>Check Dates</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* 4-Meal Plan Showcase */}
        <div className="bg-gradient-to-b from-[#1C281F] to-[#121914] text-white rounded-3xl p-8 sm:p-14 lg:p-16 border border-white/10 border-t-white/20 shadow-2xl mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="typo-eyebrow text-[#CBB08B] block mb-2 font-medium">
              AUTHENTIC GORKHA & NEPALI HOSPITALITY
            </span>
            <h2 className="typo-section-heading text-white font-normal">
              Included 4-Meal Schedule
            </h2>
            <p className="typo-body text-white/80 font-light mt-3">
              Every stay at Mineral Springs Retreat includes all 4 daily home-cooked meals prepared with love using organic valley ingredients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {meals.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="bg-white/[0.04] p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-[#B89D77]/40 h-full flex flex-col justify-start transition-all duration-300 group">
                  <div className="w-10 h-10 rounded-xl bg-[#B89D77]/15 border border-[#B89D77]/30 flex items-center justify-center text-[#B89D77] mb-4 shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-sans text-[#CBB08B] font-medium tracking-[0.05em] block mb-1 tabular-nums whitespace-nowrap">
                    {m.time}
                  </span>
                  <h3 className="typo-card-heading text-lg text-white font-normal mb-2 sm:min-h-[4.25rem] lg:min-h-[4.25rem] flex items-start">
                    {m.title}
                  </h3>
                  <p className="typo-small text-white/70 font-light flex-1">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center typo-small text-xs text-white/60 max-w-xl mx-auto">
            * Rates are indicative and may vary depending on season, availability and group size. Please contact us to confirm the latest tariff.
          </div>
        </div>

      </div>
    </div>
  );
}

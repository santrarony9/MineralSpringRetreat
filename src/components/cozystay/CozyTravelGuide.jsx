import React from 'react';
import { useApp } from '../../context/AppContext';
import { CozySparkle } from './CozyIcons';
import { MapPin, Navigation, AlertTriangle, Car, Clock, Phone, ExternalLink, ShoppingBag } from 'lucide-react';

const defaultRoutes = [
  {
    from: 'NJP Railway Station',
    distance: 'Approx. 70 km',
    time: '2.5 – 3 Hours',
    desc: 'Scenic drive ascending through Rohini or Pankhabari mountain routes. Bolero / Sumo transfer can be coordinated in advance.'
  },
  {
    from: 'Bagdogra Airport (IXB)',
    distance: 'Approx. 70 km',
    time: '2.5 – 3 Hours',
    desc: 'Direct scenic mountain climb into Darjeeling hills. Please notify us of your flight schedule for smooth taxi coordination.'
  },
  {
    from: 'Via Darjeeling Town',
    distance: 'Approx. 18 km',
    time: '45 – 60 Minutes',
    desc: 'Guests can first reach Darjeeling town and take a local 4WD taxi for the descent through picturesque tea garden trails into Dawaipani.'
  }
];

export default function CozyTravelGuide() {
  const { settings, pages } = useApp();
  const travelData = pages?.travel;

  const eyebrow = travelData?.eyebrow || 'DAWAIPANI, DARJEELING · TRAVEL ESSENTIALS';
  const heading = travelData?.title || 'Location & Travel Guide';
  const subtitle = travelData?.subtitle || 'Planning your journey to Mineral Springs Retreat. Please read our honest local travel guidance regarding mountain road conditions, vehicle choice, and distances.';

  const fullAddress = settings?.address || 'Mineral Springs, Yankoo, Dawaipani, Lebong and Mineral Spring Tea Garden, West Bengal – 734105, India.';
  const officialName = settings?.officialName || 'Mineral Springs Retreat';
  const propertyCategory = settings?.propertyCategory || 'Homestay in Lebong and Mineral Spring Tea Garden, West Bengal.';
  const directionsUrl = settings?.googleDirectionsUrl || 'https://www.google.com/search?sa=X&q=mineral+springs+retreat+dawaipani+address&ludocid=12917762238512786598';
  const phone = settings?.phone || '+91 98320 12345';

  const routes = (travelData?.distances && travelData.distances.length > 0)
    ? travelData.distances.slice(0, 3).map((d) => ({
        from: d.destination || d.from,
        distance: d.distance ? (d.distance.startsWith('Approx.') ? d.distance : `Approx. ${d.distance}`) : 'Approx. 70 km',
        time: d.time || '2.5 – 3 Hours',
        desc: d.route || d.desc || ''
      }))
    : defaultRoutes;

  return (
    <section id="travel" className="py-20 sm:py-28 lg:py-36 bg-cozy-cream select-none border-t border-cozy-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="cozy-eyebrow block mb-3">
            DAWAIPANI, DARJEELING · TRAVEL ESSENTIALS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-cozy-forest font-normal leading-[1.1] tracking-tight">
            Location & Travel Guide
          </h2>
          <p className="font-sans text-sm sm:text-base text-cozy-muted font-normal mt-3 leading-relaxed max-w-xl mx-auto">
            Planning your journey to Mineral Springs Retreat. Please read our honest local travel guidance regarding mountain road conditions, vehicle choice, and distances.
          </p>
        </div>

        {/* 1. Official Verified Property Location & Address Banner */}
        <div className="bg-gradient-to-b from-[#1C281F] to-[#121914] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl mb-12 border border-white/10 border-t-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-[#CBB08B] text-[11px] font-sans uppercase tracking-[0.2em] font-medium">
                <MapPin className="w-4 h-4 text-[#B89D77]" />
                <span>OFFICIAL PROPERTY LOCATION & ADDRESS</span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                {officialName}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-cozy-sandLight">
                {propertyCategory}
              </p>
              <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed font-light pt-1">
                {fullAddress}
              </p>
            </div>

            {/* Directions Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cozy-btn-sand text-xs tracking-wider font-semibold py-3.5 px-8 shadow-xl inline-flex items-center justify-center space-x-2 group"
              >
                <Navigation className="w-4 h-4 text-[#151F18]" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="cozy-btn-outline-light text-xs tracking-wider justify-center py-3.5 px-6"
              >
                <Phone className="w-3.5 h-3.5 text-cozy-sand" />
                <span>Call Host</span>
              </a>
            </div>

          </div>
        </div>

        {/* 2. Critical Road Guidance & Local Conveniences (2 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          
          {/* Road Conditions Card */}
          <div className="bg-[#FAF8F5] rounded-2xl p-8 sm:p-10 border border-[#EAE3D8] hover:border-[#B89D77]/70 shadow-[0_6px_24px_-6px_rgba(27,36,30,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(27,36,30,0.1)] transition-all duration-400 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-sans font-medium">
                <Car className="w-3.5 h-3.5" />
                <span>Mountain Road Advice</span>
              </div>
              <h4 className="font-serif text-2xl text-cozy-forest font-normal">
                Road Conditions & Rugged Vehicles
              </h4>
              <p className="font-sans text-xs sm:text-sm text-cozy-muted leading-relaxed font-light">
                The final approach road leading into Dawaipani village is steep, narrow, and rough in places. <strong>A high-clearance rugged vehicle such as a Bolero or Sumo is strongly recommended.</strong>
              </p>
              <p className="font-sans text-xs sm:text-sm text-cozy-muted leading-relaxed font-light">
                Standard city hatchbacks or low sedans are not suitable for the final unpaved village stretch. We kindly ask guests to coordinate with our retreat team prior to travelling to verify real-time road conditions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-cozy-border text-xs text-cozy-forest font-medium">
              ✓ Pre-travel transport coordination available on request.
            </div>
          </div>

          {/* Local Conveniences Card */}
          <div className="bg-[#FAF8F5] rounded-2xl p-8 sm:p-10 border border-[#EAE3D8] hover:border-[#B89D77]/70 shadow-[0_6px_24px_-6px_rgba(27,36,30,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(27,36,30,0.1)] transition-all duration-400 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full text-xs font-sans font-medium">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Village Essentials Advice</span>
              </div>
              <h4 className="font-serif text-2xl text-cozy-forest font-normal">
                Food & Local Conveniences
              </h4>
              <p className="font-sans text-xs sm:text-sm text-cozy-muted leading-relaxed font-light">
                Dawaipani is a peaceful, secluded mountain village preserved from commercial urban development. <strong>There are no major commercial markets, pharmacies, or luxury restaurants within easy walking distance.</strong>
              </p>
              <p className="font-sans text-xs sm:text-sm text-cozy-muted leading-relaxed font-light">
                Guests should plan ahead and purchase essential personal supplies, medications, or specialized items in Darjeeling, Siliguri, or NJP before ascending to the property.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#EAE3D8] text-xs text-cozy-forest font-medium">
              ✓ All 4 daily home-cooked meals are freshly prepared on-site.
            </div>
          </div>

        </div>

        {/* 3. Distance & Transit Cards */}
        <div className="border-t border-[#EAE3D8] pt-12 sm:pt-16">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-4xl text-cozy-forest font-normal">
              Transit Times & Distances
            </h3>
            <p className="text-xs sm:text-sm text-cozy-muted mt-2">
              Approximate road distances from transit hubs in North Bengal.
            </p>
          </div>

          <div className="travel-routes-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {routes.map((r, i) => (
              <div
                key={i}
                className="bg-[#FAF8F5] p-7 rounded-2xl border border-[#EAE3D8] hover:border-[#B89D77]/70 shadow-[0_4px_16px_-4px_rgba(27,36,30,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(27,36,30,0.08)] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-sans font-semibold text-cozy-sandDark tracking-[0.16em] uppercase tabular-nums whitespace-nowrap">
                    ROUTE 0{i + 1}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-sans text-cozy-forest font-medium tabular-nums whitespace-nowrap">
                    <Clock className="w-3 h-3 text-cozy-sandDark" />
                    <span>{r.time}</span>
                  </div>
                </div>
                <h4 className="font-serif text-xl text-cozy-forest font-medium mb-1">
                  {r.from}
                </h4>
                <div className="text-xs font-sans text-cozy-sandDark font-semibold mb-3 tabular-nums whitespace-nowrap">
                  {r.distance}
                </div>
                <p className="text-xs text-cozy-muted leading-relaxed font-light">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

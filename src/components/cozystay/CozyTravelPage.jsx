import React from 'react';
import { useApp } from '../../context/AppContext';
import { CozySparkle } from './CozyIcons';
import { MapPin, Navigation, AlertTriangle, Car, Clock, Phone, ExternalLink, ShoppingBag, ShieldCheck, Check } from 'lucide-react';

const defaultRoutes = [
  {
    from: 'NJP Railway Station (New Jalpaiguri)',
    distance: 'Approx. 70 km',
    time: '2.5 – 3 Hours',
    desc: 'Ascend through scenic hill highways via Rohini or Pankhabari. Bolero / Sumo 4WD transfer can be coordinated by contacting us before arrival.'
  },
  {
    from: 'Bagdogra Airport (IXB)',
    distance: 'Approx. 70 km',
    time: '2.5 – 3 Hours',
    desc: 'Direct scenic mountain climb into Darjeeling hills. Please notify us of your flight landing time so we can arrange smooth local taxi pick-up.'
  },
  {
    from: 'Via Darjeeling Town',
    distance: 'Approx. 18 km',
    time: '45 – 60 Minutes',
    desc: 'Travelers staying in or visiting Darjeeling can take a dedicated 4WD vehicle descending through the Lebong tea garden route into Dawaipani.'
  }
];

export default function CozyTravelPage({ setActivePage }) {
  const { settings, openBooking, pages } = useApp();
  const travelData = pages?.travel;

  const eyebrow = travelData?.eyebrow || 'DAWAIPANI, DARJEELING · TRAVEL ESSENTIALS';
  const pageTitle = travelData?.title || 'How to Reach & Travel Guide';
  const pageSubtitle = travelData?.subtitle || 'Honest advice, road conditions, recommended vehicles, and distance guides to ensure a smooth, worry-free journey to Mineral Springs Retreat.';

  const fullAddress = settings?.address || 'Mineral Springs, Yankoo, Dawaipani, Lebong and Mineral Spring Tea Garden, West Bengal – 734105, India.';
  const officialName = settings?.officialName || 'Mineral Springs Retreat';
  const propertyCategory = settings?.propertyCategory || 'Homestay in Lebong and Mineral Spring Tea Garden, West Bengal.';
  const directionsUrl = settings?.googleDirectionsUrl || 'https://www.google.com/search?sa=X&q=mineral+springs+retreat+dawaipani+address&ludocid=12917762238512786598';
  const phone1 = settings?.phone || '+91 79081 92498';
  const phone2 = settings?.phone2 || '+91 98303 55105';

  const routes = (travelData?.distances && travelData.distances.length > 0)
    ? travelData.distances.slice(0, 3).map((d) => ({
        from: d.destination || d.from,
        distance: d.distance ? (d.distance.startsWith('Approx.') ? d.distance : `Approx. ${d.distance}`) : 'Approx. 70 km',
        time: d.time || '2.5 – 3 Hours',
        desc: d.route || d.desc || ''
      }))
    : defaultRoutes;

  return (
    <div className="pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-28 bg-cozy-cream select-none min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="typo-eyebrow block mb-3">
            DAWAIPANI, DARJEELING · TRAVEL ESSENTIALS
          </span>
          <h1 className="typo-page-title text-cozy-forest font-normal">
            How to Reach &
            <span className="block italic text-cozy-sandDark mt-1">Travel Guide</span>
          </h1>
          <p className="typo-body text-cozy-muted font-normal mt-4 max-w-2xl mx-auto">
            Honest advice, road conditions, recommended vehicles, and distance guides to ensure a smooth, worry-free journey to Mineral Springs Retreat.
          </p>
        </div>

        {/* 1. Official Verified Property Location & Address Banner */}
        <div className="bg-[#1E2C22] text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl mb-12 sm:mb-16 border border-[#2D3B31]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 text-cozy-sand typo-eyebrow">
                <MapPin className="w-4 h-4" />
                <span className="text-cozy-sand">OFFICIAL PROPERTY LOCATION & ADDRESS</span>
              </div>
              <h2 className="typo-section-heading text-white font-normal">
                {officialName}
              </h2>
              <p className="typo-small text-cozy-sandLight">
                {propertyCategory}
              </p>
              <p className="typo-body text-white/90 font-light pt-1">
                {fullAddress}
              </p>
            </div>

            {/* Directions Action */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cozy-btn-sand typo-btn py-3.5 px-8 shadow-xl inline-flex items-center justify-center space-x-2 group"
              >
                <Navigation className="w-4 h-4 text-[#151F18]" />
                <span>Get Directions on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="cozy-btn-outline-light typo-btn justify-center py-3.5 px-6 inline-flex items-center space-x-2"
              >
                <Phone className="w-3.5 h-3.5 text-cozy-sand" />
                <span>Call Host</span>
              </a>
            </div>
          </div>
        </div>

        {/* Visual Property Arrival Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-cozy-forest border border-cozy-border shadow-md group">
            <img
              src="/images/mineral-springs/retreat-cottages-mountain-slope.jpg"
              alt="Arrival at Mineral Springs Retreat cottages on mountain slope"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
              <span className="typo-small text-white font-medium">Arrival along the scenic hillside cottages of Dawaipani</span>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-cozy-forest border border-cozy-border shadow-md group">
            <img
              src="/images/mineral-springs/retreat-covered-porch-lantern.jpg"
              alt="Welcoming covered porch entrance at Mineral Springs Retreat"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
              <span className="typo-small text-white font-medium">Welcoming sheltered entrance porch and garden courtyard</span>
            </div>
          </div>
        </div>

        {/* 2. Critical Road Conditions & Local Conveniences (2 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 sm:mb-20">
          
          {/* Road Conditions */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 border border-cozy-border shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Car className="w-6 h-6" />
            </div>
            <span className="typo-eyebrow text-cozy-sandDark block">
              MOUNTAIN APPROACH GUIDANCE
            </span>
            <h3 className="typo-subsection-heading text-cozy-forest font-normal">
              Road Conditions & Vehicle Choice
            </h3>
            <p className="typo-small text-cozy-muted font-normal">
              The final approach road descending into Dawaipani village is <strong>steep, narrow, and rough in several places</strong>.
            </p>
            <div className="space-y-3 pt-2 typo-small text-[13px] text-cozy-charcoal">
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Rugged 4WD / High Clearance Vehicle:</strong> A sturdy vehicle such as a Mahindra Bolero or Tata Sumo is strongly recommended.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Pre-Travel Host Coordination:</strong> Guests should coordinate with the retreat prior to travelling to confirm current road conditions and arrange local mountain pickup.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Experienced Mountain Drivers:</strong> Avoid low-clearance hatchbacks or sedans on the final village stretch.</span>
              </div>
            </div>
          </div>

          {/* Food & Local Conveniences */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 lg:p-12 border border-cozy-border shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="typo-eyebrow text-cozy-sandDark block">
              VILLAGE ENVIRONMENT
            </span>
            <h3 className="typo-subsection-heading text-cozy-forest font-normal">
              Food & Local Conveniences
            </h3>
            <p className="typo-small text-cozy-muted font-normal">
              The retreat offers authentic, wholesome <strong>traditional Gorkha and Nepali home-cooked meals</strong> prepared fresh with local organic ingredients.
            </p>
            <div className="space-y-3 pt-2 typo-small text-[13px] text-cozy-charcoal">
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Authentic Homestyle Cuisine:</strong> The dining experience is entirely home-style; there are no commercial luxury restaurants or fast-food outlets.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Remote Village Setting:</strong> There are no major commercial shopping markets within easy walking distance.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Carry Personal Essentials:</strong> Guests are advised to bring personal toiletries, specific medicines, and special packaged snacks before arriving.</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Distance & Travel Times */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cozy-border shadow-lg mb-16">
          <div className="max-w-2xl mb-8">
            <span className="typo-eyebrow block mb-2">TRANSIT MILESTONES</span>
            <h3 className="typo-subsection-heading text-cozy-forest font-normal">
              Key Travel Distances & Driving Times
            </h3>
          </div>

          <div className="travel-routes-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {routes.map((rt, i) => (
              <div key={i} className="p-6 rounded-2xl bg-cozy-cream border border-cozy-border flex flex-col justify-between h-full">
                <div className="flex flex-col flex-1">
                  <span className="text-[11px] font-sans font-semibold text-cozy-sandDark uppercase tracking-[0.16em] block mb-1 tabular-nums whitespace-nowrap">
                    ROUTE 0{i + 1}
                  </span>
                  <h4 className="typo-card-heading text-xl text-cozy-forest font-medium mb-3 md:min-h-[4rem] flex items-start">
                    {rt.from}
                  </h4>
                  <div className="flex items-center space-x-3 text-xs font-semibold text-cozy-forest mb-3">
                    <span className="bg-white px-2.5 py-1 rounded-md border border-cozy-border tabular-nums whitespace-nowrap">{rt.distance}</span>
                    <span className="bg-white px-2.5 py-1 rounded-md border border-cozy-border flex items-center space-x-1 tabular-nums whitespace-nowrap">
                      <Clock className="w-3 h-3 text-cozy-sandDark" />
                      <span>{rt.time}</span>
                    </span>
                  </div>
                  <p className="typo-small text-cozy-muted font-light flex-1">
                    {rt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. UNESCO World Heritage Excursion: Darjeeling Toy Train */}
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#EAE3D8] shadow-xl mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="typo-eyebrow text-[#B89D77] block mb-2 font-medium">HERITAGE EXCURSION</span>
            <h3 className="typo-section-heading text-cozy-forest font-normal">
              Darjeeling Himalayan Railway (Toy Train)
            </h3>
            <p className="typo-small text-cozy-muted font-light mt-2">
              Located just a short scenic drive from Dawaipani, the UNESCO World Heritage mountain railway offers an unforgettable journey through misty pine ridges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Steam Train Card */}
            <div className="rounded-3xl overflow-hidden border border-[#EAE3D8] bg-white shadow-md group flex flex-col">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-900">
                <img
                  src="/images/mineral-springs/darjeeling-unesco-steam-locomotive.jpg"
                  alt="UNESCO World Heritage Darjeeling Himalayan Railway steam locomotive"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B89D77] font-semibold block mb-1">
                    HISTORIC STEAM LOCOMOTIVE
                  </span>
                  <h4 className="typo-card-heading text-xl text-cozy-forest font-normal">
                    Living Himalayan Heritage
                  </h4>
                  <p className="typo-small text-cozy-muted font-light mt-2 leading-relaxed">
                    Operating continuously since 1881, the iconic blue B-Class steam engine climbs through the clouds, whistling past terraced villages and tea slopes.
                  </p>
                </div>
              </div>
            </div>

            {/* Trackside Trail Card */}
            <div className="rounded-3xl overflow-hidden border border-[#EAE3D8] bg-white shadow-md group flex flex-col">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-900">
                <img
                  src="/images/mineral-springs/darjeeling-toy-train-tracks.jpg"
                  alt="Historic narrow-gauge mountain railway tracks near Darjeeling"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:p-7 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#B89D77] font-semibold block mb-1">
                    NARROW-GAUGE TRACKSIDE TRAIL
                  </span>
                  <h4 className="typo-card-heading text-xl text-cozy-forest font-normal">
                    Hill Cart Road Excursion
                  </h4>
                  <p className="typo-small text-cozy-muted font-light mt-2 leading-relaxed">
                    Guests can coordinate half-day trips through our host to visit nearby Batasia Loop and Ghoom station, taking leisurely walks along the misty narrow-gauge tracks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Host Callout */}
        <div className="bg-[#151F18] text-white rounded-3xl p-8 sm:p-12 text-center border border-[#2D3B31]">
          <h3 className="typo-subsection-heading text-white font-normal mb-2">
            Need Help Arranging Transport?
          </h3>
          <p className="typo-small text-white/70 max-w-xl mx-auto mb-6">
            We work directly with reliable local 4WD drivers in Darjeeling, Siliguri, and Bagdogra. Call or WhatsApp our host concierge prior to your trip.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${phone1.replace(/[^0-9+]/g, '')}`}
              className="cozy-btn-sand typo-btn py-3 px-6 inline-flex items-center space-x-2"
            >
              <Phone className="w-4 h-4 text-[#151F18]" />
              <span>Call Host ({phone1})</span>
            </a>
            <a
              href={`tel:${phone2.replace(/[^0-9+]/g, '')}`}
              className="cozy-btn-sand typo-btn py-3 px-6 inline-flex items-center space-x-2"
            >
              <Phone className="w-4 h-4 text-[#151F18]" />
              <span>Call Host ({phone2})</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mountain,
  Compass,
  MapPin,
  Calendar,
  CloudSun,
  CloudRain,
  Sun,
  Wind,
  Navigation,
  Car,
  AlertTriangle,
  Heart,
  UtensilsCrossed,
  Footprints,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Home,
  Info
} from 'lucide-react';

export default function CozyDawaipani({ setActivePage, standalone = false }) {
  const { openBooking, settings, pages } = useApp();
  const dData = pages?.dawaipani;

  const badge = dData?.badge || 'OFFBEAT HIMALAYAN DESTINATION · DARJEELING';
  const title = dData?.title || 'Discover Dawaipani';
  const subtitle = dData?.subtitle || 'A Hidden Himalayan Hamlet Opposite Darjeeling';
  const bannerImage = dData?.image || '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg';
  const elevation = dData?.elevation || '6,500 ft';

  const handleExploreRetreat = () => {
    if (setActivePage) {
      setActivePage('stay');
    } else {
      const el = document.getElementById('rooms');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <article
      id="dawaipani"
      className={`select-none bg-[#FAF7F2] text-[#1F2220] scroll-mt-[68px] lg:scroll-mt-[120px] ${
        standalone ? 'pt-36 sm:pt-44 lg:pt-48 pb-24 sm:pb-32' : 'py-28 sm:py-36 lg:py-40 border-t border-black/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ========================================================================= */}
        {/* SECTION 1: ABOUT DAWAIPANI (EDITORIAL INTRODUCTION)                       */}
        {/* ========================================================================= */}
        <section aria-labelledby="dawaipani-intro-heading" className="mb-24 sm:mb-32">
          
          {/* Eyebrow & Main Headings */}
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 reveal-init">
            <span className="typo-eyebrow block mb-3">
              {badge}
            </span>
            <h1
              id="dawaipani-intro-heading"
              className="typo-section-heading text-[#1A241E] font-normal mb-3"
            >
              {title}
            </h1>
            <p className="typo-subsection-heading italic text-[#8E704F] font-light">
              {subtitle}
            </p>
          </div>

          {/* Editorial Lead Paragraphs */}
          <div className="max-w-3xl mx-auto text-center space-y-5 mb-14 reveal-init reveal-delay-1">
            {dData?.paragraphs && dData.paragraphs.length > 0 ? (
              dData.paragraphs.map((p, idx) => (
                <p key={idx} className="typo-body text-[#4A524D] font-light">
                  {p}
                </p>
              ))
            ) : (
              <>
                <p className="typo-body text-[#4A524D] font-light">
                  Dawaipani is a peaceful, high-altitude Himalayan hamlet situated directly opposite Darjeeling town in West Bengal. Surrounded by dense pine forests, rolling hills and tea gardens, this beautiful village has become a popular offbeat ecotourism destination for travellers seeking tranquillity, natural beauty and authentic mountain experiences.
                </p>
                <p className="typo-body text-[#4A524D] font-light">
                  Away from crowded tourist destinations, Dawaipani offers a refreshing escape into the Himalayas, where visitors can experience village life, traditional hospitality, home-cooked regional food and spectacular mountain scenery.
                </p>
              </>
            )}
          </div>

          {/* Full-Width Panoramic Editorial Photograph */}
          <div className="relative w-full overflow-hidden rounded-none shadow-sm group reveal-init reveal-delay-2">
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full bg-neutral-900">
              <img
                src={bannerImage}
                alt="Panoramic scenic mountain ridge of Dawaipani overlooking Himalayan valleys from retreat balcony"
                className="w-full h-full object-cover rounded-none transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              
              {/* Bottom Inset Banner */}
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                <div>
                  <span className="typo-eyebrow text-[#B89D77] block mb-1 font-semibold">
                    HIGH-ALTITUDE SANCTUARY
                  </span>
                  <p className="typo-subsection-heading text-white font-normal">
                    The Peaceful Mountain Ridge of Dawaipani
                  </p>
                </div>
                <div className="inline-flex items-center space-x-2 typo-eyebrow text-white/90 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 border border-white/15">
                  <Mountain className="w-3.5 h-3.5 text-[#B89D77]" />
                  <span className="tabular-nums whitespace-nowrap">{elevation} Elevation · West Bengal</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: GEOGRAPHY AND CLIMATE (EDITORIAL HIGHLIGHTS)                    */}
        {/* ========================================================================= */}
        <section aria-labelledby="dawaipani-geography-heading" className="mb-24 sm:mb-32">
          
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 reveal-init">
            <span className="typo-eyebrow block mb-3">
              GEOGRAPHY & MOUNTAIN VISTAS
            </span>
            <h2
              id="dawaipani-geography-heading"
              className="typo-section-heading text-[#1A241E] font-normal mb-4"
            >
              Above the Clouds, Close to Nature
            </h2>
            <p className="typo-body text-[#4A524D] font-light">
              Dawaipani sits at an approximate elevation of 6,500 feet (1,980 metres), on a scenic Himalayan ridge surrounded by pine forests and the natural landscape of the Senchal forest reserve. The village is known for its breathtaking mountain scenery, peaceful surroundings and spectacular views of the Eastern Himalayas.
            </p>
          </div>

          {/* 4 Editorial Image-and-Text Highlights */}
          <div className="space-y-16 sm:space-y-24">
            
            {/* Highlight 1: Sleeping Buddha */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center reveal-init">
              <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
                <span className="typo-eyebrow text-[#B89D77] block">
                  MOUNTAIN ICON
                </span>
                <h3 className="typo-subsection-heading text-[#1A241E] font-normal">
                  The Sleeping Buddha View
                </h3>
                <p className="typo-small text-[#4A524D] leading-relaxed font-light">
                  Dawaipani offers expansive panoramic views of the Kanchenjunga mountain range, often revealing the magnificent Sleeping Buddha formation on clear days.
                </p>
                <div className="pt-2 flex items-center space-x-2 typo-small text-xs text-[#8E704F]">
                  <Sparkles className="w-4 h-4 text-[#B89D77]" />
                  <span>Best observed during early crisp mornings in autumn and spring</span>
                </div>
              </div>
              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-900 group">
                  <img
                    src="/images/mineral-springs/dawaipani-kanchenjunga-snow-peaks.jpg"
                    alt="The Sleeping Buddha Mount Kanchenjunga vista from Dawaipani"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Highlight 2: Valley Landscapes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center reveal-init">
              <div className="lg:col-span-6 order-1">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-900 group">
                  <img
                    src="/images/mineral-springs/dawaipani-drone-canopy-aerial.jpg"
                    alt="Canopy and valley mist across Dawaipani mountain slopes"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="lg:col-span-6 order-2 space-y-4">
                <span className="typo-eyebrow text-[#B89D77] block">
                  VALLEY PANORAMAS
                </span>
                <h3 className="typo-subsection-heading text-[#1A241E] font-normal">
                  Beautiful Valley Landscapes
                </h3>
                <p className="typo-small text-[#4A524D] leading-relaxed font-light">
                  On clear days, visitors may be able to spot the Chardham temple complex in Namchi, Sikkim, and Samdruptse Monastery across the valley.
                </p>
                <div className="pt-2 flex items-center space-x-2 typo-small text-xs text-[#8E704F]">
                  <Compass className="w-4 h-4 text-[#B89D77]" />
                  <span>Sweeping vistas spanning West Bengal and Sikkim hills</span>
                </div>
              </div>
            </div>

            {/* Highlight 3: Darjeeling at Night */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center reveal-init">
              <div className="lg:col-span-6 order-2 lg:order-1 space-y-4">
                <span className="typo-eyebrow text-[#B89D77] block">
                  EVENING SPECTACLE
                </span>
                <h3 className="typo-subsection-heading text-[#1A241E] font-normal">
                  Darjeeling at Night
                </h3>
                <p className="typo-small text-[#4A524D] leading-relaxed font-light">
                  After sunset, the distant lights of Darjeeling town create a beautiful view across the valley, shimmering like a jewel box in the quiet Himalayan night.
                </p>
                <div className="pt-2 flex items-center space-x-2 typo-small text-xs text-[#8E704F]">
                  <Sparkles className="w-4 h-4 text-[#B89D77]" />
                  <span>Unbroken silence with glittering ridgeline city lights</span>
                </div>
              </div>
              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-900 group">
                  <img
                    src="/images/mineral-springs/dawaipani-darjeeling-night-lights.jpg"
                    alt="Evening mountain vista looking across to shimmering Darjeeling lights over cloud sea"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Highlight 4: Surrounded by Tea Gardens */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center reveal-init">
              <div className="lg:col-span-6 order-1">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-900 group">
                  <img
                    src="/images/mineral-springs/darjeeling-tea-gardens-panoramic.jpg"
                    alt="Retreat cottages and manicured emerald tea garden slopes surrounding Dawaipani"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="lg:col-span-6 order-2 space-y-4">
                <span className="typo-eyebrow text-[#B89D77] block">
                  ORGANIC TEA HERITAGE
                </span>
                <h3 className="typo-subsection-heading text-[#1A241E] font-normal">
                  Surrounded by Tea Gardens
                </h3>
                <p className="typo-small text-[#4A524D] leading-relaxed font-light">
                  Dawaipani is surrounded by the beautiful landscapes of the Eastern Himalayan tea-growing region, with nearby estates including Lamahatta, Glenburn and Takdah.
                </p>
                <div className="pt-2 flex items-center space-x-2 typo-small text-xs text-[#8E704F]">
                  <Footprints className="w-4 h-4 text-[#B89D77]" />
                  <span>Peaceful walking trails winding directly through emerald tea slopes</span>
                </div>
              </div>
            </div>

          </div>

          {/* Visibility Disclaimer Callout */}
          <div className="mt-14 max-w-2xl mx-auto text-center p-4 bg-white border border-[#E5DFD5]">
            <p className="typo-small text-xs text-[#6B726C] italic leading-relaxed">
              * Note: Landmark visibility and mountain views depend on atmospheric conditions, seasonal weather, and cloud formations. Views cannot be guaranteed at all times.
            </p>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: ACCESS AND CONNECTIVITY (GETTING TO DAWAIPANI)                 */}
        {/* ========================================================================= */}
        <section
          id="dawaipani-access"
          aria-labelledby="dawaipani-access-heading"
          className="mb-24 sm:mb-32 scroll-mt-36"
        >
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="typo-eyebrow block mb-3">
              JOURNEY & ACCESSIBILITY
            </span>
            <h2
              id="dawaipani-access-heading"
              className="typo-section-heading text-[#1A241E] font-normal mb-4"
            >
              Getting to Dawaipani
            </h2>
            <p className="typo-body text-[#4A524D] font-light">
              Dawaipani is accessible from Darjeeling and Siliguri through scenic mountain roads winding through pine ridges and tea terraces.
            </p>
          </div>

          {/* Approximate Distances Grid (5 Standardized Equal-Height Cards) */}
          <div className="travel-dist-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mb-12">
            {((dData?.distanceCards && dData.distanceCards.length > 0)
              ? dData.distanceCards
              : (pages?.travel?.distances && pages.travel.distances.length >= 5)
                ? pages.travel.distances.slice(0, 5).map(d => ({
                    title: d.destination ? d.destination.replace(/\s*\(.*?\)/, '') : d.title,
                    distance: d.distance,
                    desc: d.route || d.time || d.desc
                  }))
                : [
                    {
                      title: 'Darjeeling Town',
                      distance: '15 km',
                      desc: 'Scenic mountain drive'
                    },
                    {
                      title: 'Jorebunglow Junction',
                      distance: '7 km',
                      desc: 'Connecting ridge point'
                    },
                    {
                      title: 'Siliguri',
                      distance: '~50 km',
                      desc: 'Foothills gateway'
                    },
                    {
                      title: 'NJP Railway Station',
                      distance: '~75 km',
                      desc: 'Major rail terminus'
                    },
                    {
                      title: 'Bagdogra Airport (IXB)',
                      distance: '~78 km',
                      desc: 'Regional flight terminal'
                    }
                  ]
            ).map((card, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-5 sm:p-6 border border-[#EAE3D8] hover:border-[#B89D77]/80 rounded-2xl text-center flex flex-col items-center justify-between h-full shadow-[0_4px_16px_-4px_rgba(27,36,30,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(27,36,30,0.08)] transition-all duration-300"
              >
                {/* 1. Location Heading: Identical font family, size, weight, letter-spacing, height and alignment */}
                <h3 className="travel-dist-heading text-xs sm:text-[12px] font-sans uppercase tracking-[0.18em] text-[#8E704F] font-semibold h-[2.85rem] sm:h-[3.25rem] flex items-center justify-center text-center leading-snug w-full px-1 m-0">
                  {card.title}
                </h3>

                {/* 2 & 3. Distance Figure: Identical font family, size, weight, height and exact vertical alignment */}
                <div className="travel-dist-figure num-card-distance font-serif text-2xl sm:text-3xl lg:text-[1.875rem] text-[#1A241E] font-normal h-[2.75rem] flex items-center justify-center tabular-nums whitespace-nowrap leading-none my-1 w-full text-center">
                  {card.distance}
                </div>

                {/* 5. Horizontal Divider: Same width and vertical position */}
                <div className="travel-dist-divider w-12 sm:w-14 h-[1px] bg-[#E5DFD5] my-2 shrink-0 mx-auto" />

                {/* 4 & 8. Description: Consistent font size, line height, color, centered and visible */}
                <p className="travel-dist-desc text-xs text-[#5E6660] font-sans leading-relaxed font-light text-center m-0 h-[2.5rem] flex items-center justify-center w-full px-1">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Road Connectivity Description & Travel Advisory */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-[#E8E2D8] space-y-4 flex flex-col justify-center reveal-init">
              <div className="flex items-center space-x-2 text-[#8E704F]">
                <Car className="w-5 h-5 text-[#B89D77]" />
                <span className="text-xs font-sans uppercase tracking-widest font-semibold text-[#1A241E]">
                  Road Connectivity & Vehicle Recommendation
                </span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#4A524D] leading-relaxed font-light">
                Visitors can reach the area via the Hill Cart Road (NH10) from Siliguri or through the Peshok and Lamahatta route.
              </p>
              <p className="font-sans text-xs sm:text-sm text-[#4A524D] leading-relaxed font-light">
                The final approach into the inner village includes steep, narrow and partly unpaved mountain tracks. A suitable four-wheel-drive vehicle is recommended, depending on current road conditions.
              </p>
              <p className="text-[11px] font-sans text-[#7E8580] italic pt-2">
                * Note: Approximate distances and journey times are provided for general reference and are not guaranteed.
              </p>
            </div>

            {/* Highlighted Travel Tip Callout */}
            <div className="lg:col-span-5 bg-[#1F2C23] text-white p-8 sm:p-10 border border-[#2B3B30] flex flex-col justify-between space-y-6 reveal-init reveal-delay-1">
              <div className="space-y-3">
                <div className="inline-flex items-center space-x-2 text-[#B89D77] text-[11px] font-sans uppercase tracking-widest font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>IMPORTANT TRAVEL TIP</span>
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug">
                  Confirm Current Road Conditions Before Departure
                </h4>
                <p className="font-sans text-xs sm:text-sm text-white/85 leading-relaxed font-light">
                  "Before starting your journey, contact Mineral Springs Retreat to confirm the latest road conditions and arrange suitable local transportation if required."
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href={`tel:${(settings?.phone || '+91 79081 92498').replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center space-x-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#B89D77] hover:text-white transition-colors"
                >
                  <span>Call {settings?.phone || '+91 79081 92498'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${(settings?.phone2 || '+91 98303 55105').replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center space-x-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#B89D77] hover:text-white transition-colors"
                >
                  <span>Call {settings?.phone2 || '+91 98303 55105'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: TOURISM AND LOCAL LIFESTYLE                                    */}
        {/* ========================================================================= */}
        <section aria-labelledby="dawaipani-lifestyle-heading" className="mb-24 sm:mb-32">
          
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 reveal-init">
            <span className="typo-eyebrow block mb-3">
              AUTHENTIC RUSTIC LIVING
            </span>
            <h2
              id="dawaipani-lifestyle-heading"
              className="typo-section-heading text-[#1A241E] font-normal mb-4"
            >
              Experience the Simplicity of Mountain Life
            </h2>
            <p className="typo-body text-[#4A524D] font-light">
              Dawaipani's local lifestyle is closely connected to nature, traditional village culture, terraced farming and community-based ecotourism.
            </p>
          </div>

          {/* 4 Lifestyle Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-8 border border-[#E8E2D8] flex flex-col justify-start h-full space-y-3 hover:border-[#B89D77] transition-all duration-300 hover:-translate-y-1 reveal-init reveal-delay-1">
              <div className="w-12 h-12 bg-[#FAF4ED] text-[#B89D77] flex items-center justify-center shrink-0">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="typo-card-heading text-[#1A1A1A] font-normal sm:min-h-[2.5rem] lg:min-h-[3rem] flex items-start">
                Traditional Homestays
              </h3>
              <p className="typo-small text-[#4A524D] leading-relaxed font-light flex-1">
                Experience warm local hospitality in traditional mountain homestays rather than commercial luxury hotels.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 border border-[#E8E2D8] flex flex-col justify-start h-full space-y-3 hover:border-[#B89D77] transition-all duration-300 hover:-translate-y-1 reveal-init reveal-delay-2">
              <div className="w-12 h-12 bg-[#FAF4ED] text-[#B89D77] flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="typo-card-heading text-[#1A1A1A] font-normal sm:min-h-[2.5rem] lg:min-h-[3rem] flex items-start">
                Organic Mountain Food
              </h3>
              <p className="typo-small text-[#4A524D] leading-relaxed font-light flex-1">
                Enjoy simple, freshly prepared regional meals inspired by traditional Gorkha and Nepali home cooking.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 border border-[#E8E2D8] flex flex-col justify-start h-full space-y-3 hover:border-[#B89D77] transition-all duration-300 hover:-translate-y-1 reveal-init reveal-delay-3">
              <div className="w-12 h-12 bg-[#FAF4ED] text-[#B89D77] flex items-center justify-center shrink-0">
                <Footprints className="w-6 h-6" />
              </div>
              <h3 className="typo-card-heading text-[#1A1A1A] font-normal sm:min-h-[2.5rem] lg:min-h-[3rem] flex items-start">
                Village Walks & Trails
              </h3>
              <p className="typo-small text-[#4A524D] leading-relaxed font-light flex-1">
                Explore peaceful village paths, terraced farms, pine forests and surrounding mountain landscapes.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 border border-[#E8E2D8] flex flex-col justify-start h-full space-y-3 hover:border-[#B89D77] transition-all duration-300 hover:-translate-y-1 reveal-init reveal-delay-4">
              <div className="w-12 h-12 bg-[#FAF4ED] text-[#B89D77] flex items-center justify-center shrink-0">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="typo-card-heading text-[#1A1A1A] font-normal sm:min-h-[2.5rem] lg:min-h-[3rem] flex items-start">
                A Slower Way of Life
              </h3>
              <p className="typo-small text-[#4A524D] leading-relaxed font-light flex-1">
                Enjoy quiet mornings, fresh mountain air, birdsong, mist-covered hills and peaceful evenings.
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: BEST TIME TO VISIT (SEASONAL TRAVEL GUIDE)                     */}
        {/* ========================================================================= */}
        <section aria-labelledby="dawaipani-season-heading" className="mb-24 sm:mb-32">
          
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 reveal-init">
            <span className="typo-eyebrow block mb-3">
              SEASONAL TRAVEL GUIDE
            </span>
            <h2
              id="dawaipani-season-heading"
              className="typo-section-heading text-[#1A241E] font-normal mb-4"
            >
              When Should You Visit Dawaipani?
            </h2>
            <p className="typo-body text-[#4A524D] font-light">
              Each season brings its own distinct rhythm to the Eastern Himalayas. Plan your journey according to the mountain experience you seek.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Season 1 */}
            <div className="bg-white p-8 sm:p-10 border border-[#E8E2D8] space-y-4 flex flex-col justify-between h-full hover:border-[#B89D77] transition-all duration-300 hover:-translate-y-1 reveal-init reveal-delay-1">
              <div className="flex flex-col flex-1">
                <div className="space-y-2 md:min-h-[6.75rem] flex flex-col justify-start">
                  <div className="inline-flex items-center space-x-2 text-[#8E704F]">
                    <Sun className="w-5 h-5 text-[#B89D77]" />
                    <span className="typo-eyebrow text-[#1A241E]">
                      AUTUMN
                    </span>
                  </div>
                  <h3 className="typo-card-heading text-[#1A1A1A] font-normal">
                    October – November
                  </h3>
                  <span className="typo-eyebrow text-[#B89D77] block font-semibold">
                    Clear Mountain Views
                  </span>
                </div>
                <p className="typo-small text-[#4A524D] leading-relaxed font-light flex-1 pt-2">
                  A popular period for crisp mountain weather and improved chances of clear Himalayan views.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0EAE1] typo-small text-xs text-[#7E8580]">
                Peak season for Kanchenjunga sunrise viewing
              </div>
            </div>

            {/* Season 2 */}
            <div className="bg-white p-8 sm:p-10 border border-[#E8E2D8] space-y-4 flex flex-col justify-between h-full hover:border-[#B89D77] transition-all duration-300 hover:-translate-y-1 reveal-init reveal-delay-2">
              <div className="flex flex-col flex-1">
                <div className="space-y-2 md:min-h-[6.75rem] flex flex-col justify-start">
                  <div className="inline-flex items-center space-x-2 text-[#8E704F]">
                    <CloudSun className="w-5 h-5 text-[#B89D77]" />
                    <span className="typo-eyebrow text-[#1A241E]">
                      SPRING
                    </span>
                  </div>
                  <h3 className="typo-card-heading text-[#1A1A1A] font-normal">
                    March – May
                  </h3>
                  <span className="typo-eyebrow text-[#B89D77] block font-semibold">
                    Spring in the Hills
                  </span>
                </div>
                <p className="typo-small text-[#4A524D] leading-relaxed font-light flex-1 pt-2">
                  Pleasant daytime temperatures, fresh greenery and seasonal spring blooms make this a lovely time to explore the village.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0EAE1] typo-small text-xs text-[#7E8580]">
                Ideal for forest walking and tea garden strolls
              </div>
            </div>

            {/* Season 3 */}
            <div className="bg-white p-8 sm:p-10 border border-[#E8E2D8] space-y-4 flex flex-col justify-between h-full hover:border-[#B89D77] transition-all duration-300 hover:-translate-y-1 reveal-init reveal-delay-3">
              <div className="flex flex-col flex-1">
                <div className="space-y-2 md:min-h-[6.75rem] flex flex-col justify-start">
                  <div className="inline-flex items-center space-x-2 text-[#8E704F]">
                    <CloudRain className="w-5 h-5 text-[#B89D77]" />
                    <span className="typo-eyebrow text-[#1A241E]">
                      MONSOON
                    </span>
                  </div>
                  <h3 className="typo-card-heading text-[#1A1A1A] font-normal">
                    June – September
                  </h3>
                  <span className="typo-eyebrow text-[#8E704F] block font-semibold">
                    Lush Green & Misty Valleys
                  </span>
                </div>
                <p className="typo-small text-[#4A524D] leading-relaxed font-light flex-1 pt-2">
                  The monsoon brings heavy rainfall, mist and lush green landscapes. However, landslides and difficult road conditions can disrupt travel, particularly on steep and unpaved village roads. Visitors should check local conditions before travelling.
                </p>
              </div>
              <div className="pt-4 border-t border-[#F0EAE1] typo-small text-xs text-[#8E704F] italic">
                * Check latest road alerts with retreat before travel
              </div>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: CLOSING CALL TO ACTION                                         */}
        {/* ========================================================================= */}
        <section aria-labelledby="dawaipani-cta-heading" className="relative overflow-hidden bg-[#121613] text-white p-10 sm:p-16 lg:p-20 text-center reveal-init">
          
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="typo-eyebrow text-[#B89D77] block">
              YOUR HIMALAYAN ESCAPE AWAITS
            </span>

            <h2
              id="dawaipani-cta-heading"
              className="typo-section-heading text-white font-normal"
            >
              Find Your Peace in the Mountains
            </h2>

            <p className="typo-body text-white/85 max-w-2xl mx-auto font-light">
              "Discover the quiet beauty of Dawaipani, experience the warmth of local hospitality and enjoy a peaceful stay surrounded by the Eastern Himalayas."
            </p>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleExploreRetreat}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/40 hover:border-white text-white hover:bg-white hover:text-[#111111] transition-all duration-300 typo-btn"
              >
                Explore Mineral Springs Retreat
              </button>

              <button
                onClick={openBooking}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#B89D77] hover:bg-[#A3855F] text-white transition-all duration-300 typo-btn shadow-lg"
              >
                Plan Your Stay
              </button>
            </div>
          </div>

        </section>

      </div>
    </article>
  );
}

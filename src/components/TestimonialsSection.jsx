import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import { Star, ExternalLink, MapPin, Quote, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Clean Google 'G' Icon
function GoogleGIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function TestimonialsSection() {
  const { settings, testimonials: contextTestimonials } = useApp();
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from('.review-card-anim', {
        y: 25,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const verifiedReviews = [
    {
      id: 'rev-1',
      author: 'Joyeeta Guha',
      initials: 'JG',
      quote: 'The food was so good, home like.',
      tag: 'Home-Cooked Meals',
      accentColor: '#8DC3DF', // Wix Sky Blue
      rating: 5,
      date: 'Google Review'
    },
    {
      id: 'rev-2',
      author: 'Milton Music',
      initials: 'MM',
      quote: 'Highly recommended for anyone looking for a relaxing and enjoyable getaway!',
      tag: 'Relaxing Getaway',
      accentColor: '#F2DC8D', // Wix Yellow
      rating: 5,
      date: 'Google Review'
    },
    {
      id: 'rev-3',
      author: 'Sanju Sur',
      initials: 'SS',
      quote: 'If u want to spend some time with urself amidst nature, its the place.',
      tag: 'Nature & Serenity',
      accentColor: '#EC6A9B', // Wix Hot Pink
      rating: 5,
      date: 'Google Review'
    }
  ];

  const googleReviewsUrl = settings?.googleReviewsUrl || 'https://www.google.com/travel/search?q=mineral+springs+retreat+dawaipani';
  const directionsUrl = settings?.googleDirectionsUrl || 'https://www.google.com/search?sa=X&q=mineral+springs+retreat+dawaipani+address&ludocid=12917762238512786598';
  const propertyCategory = settings?.propertyCategory || 'Homestay in Lebong and Mineral Spring Tea Garden, West Bengal.';
  const officialName = settings?.officialName || 'Mineral Springs Retreat';
  const fullAddress = settings?.address || 'Mineral Springs, Yankoo, Dawaipani, Lebong and Mineral Spring Tea Garden, West Bengal – 734105, India.';

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="px-3 sm:px-6 md:px-8 py-4 sm:py-6 max-w-[1440px] mx-auto select-none space-y-4 sm:space-y-6"
    >
      {/* 1. Main Guest Reviews Container */}
      <div className="review-card-anim bg-[#FAF8F5] border border-[#E2DEC9] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 md:p-16 shadow-sm">
        
        {/* Section Header with Google Reviews Metric */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 sm:pb-12 border-b border-black/10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-black/70 mb-3 font-medium">
              <GoogleGIcon className="w-4 h-4" />
              <span>VERIFIED GUEST EXPERIENCES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight font-sans text-black leading-[1.05]">
              Google Guest Reviews
            </h2>
            <p className="text-black/80 text-xs sm:text-sm md:text-base font-normal mt-3 max-w-xl font-sans leading-relaxed">
              Read authentic feedback from travelers who have experienced the peaceful mountain atmosphere, wholesome home-cooked meals, and misty morning balconies at Mineral Springs Retreat.
            </p>
          </div>

          {/* Google Review Badge & CTA Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-full border border-black/10 shadow-sm">
              <GoogleGIcon className="w-5 h-5 shrink-0" />
              <div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC05] text-[#FBBC05]" />
                  ))}
                  <span className="text-xs font-semibold text-black ml-1">4.9</span>
                </div>
                <span className="text-[11px] font-mono text-black/70 block">
                  19 Google reviews
                </span>
              </div>
            </div>

            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wix-pill-button wix-pill-button-black shadow-sm group inline-flex"
            >
              <span>View All 19 Reviews on Google</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 2. Three Elegant Review Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12">
          {verifiedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E2DEC9] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Subtle top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: rev.accentColor }}
              />

              <div>
                {/* Top Row: Stars & Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                  <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-black/5 rounded-full text-[10px] font-mono text-black/80 font-medium">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Quote Icon & Text */}
                <div className="relative mb-6">
                  <Quote className="w-6 h-6 text-black/15 rotate-180 mb-2" />
                  <blockquote className="text-base sm:text-lg font-light text-black leading-snug font-sans">
                    "{rev.quote}"
                  </blockquote>
                </div>
              </div>

              {/* Author Footer (No people photos: elegant initials monogram) */}
              <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold text-black shadow-inner"
                    style={{ backgroundColor: rev.accentColor }}
                  >
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-black font-sans leading-tight">
                      {rev.author}
                    </h4>
                    <span className="text-[11px] text-black/60 font-mono">
                      {rev.date}
                    </span>
                  </div>
                </div>

                <GoogleGIcon className="w-4 h-4 opacity-75" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 3. Verified Property Location & Get Directions Card (Matching Wix 3561 Palette #525624) */}
      <div className="review-card-anim bg-[#525624] text-white rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 md:p-14 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-2 text-white/80 text-xs font-mono uppercase tracking-widest font-medium">
              <MapPin className="w-4 h-4 text-[#F2DC8D]" />
              <span>OFFICIAL PROPERTY LOCATION & ADDRESS</span>
            </div>
            
            <h3 className="text-2xl sm:text-4xl font-light tracking-tight font-sans text-white">
              {officialName}
            </h3>

            <p className="text-[#F2DC8D] text-xs sm:text-sm font-mono tracking-wide">
              {propertyCategory}
            </p>

            <p className="text-white/90 text-sm sm:text-base font-light leading-relaxed pt-1 font-sans">
              {fullAddress}
            </p>
          </div>

          {/* Prominent "Get Directions" Pill Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#F2DC8D] hover:bg-white text-black px-6 sm:px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-md"
            >
              <MapPin className="w-4 h-4 text-black" />
              <span>Get Directions</span>
              <WixStarburst className="w-3.5 h-3.5 text-black transition-transform duration-300 group-hover:rotate-45" />
            </a>

            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 hover:border-white text-white hover:text-black hover:bg-white px-5 sm:px-6 py-3.5 rounded-full text-xs font-normal transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <GoogleGIcon className="w-3.5 h-3.5" />
              <span>19 Google Reviews</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

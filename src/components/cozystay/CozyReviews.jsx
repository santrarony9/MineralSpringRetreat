import React from 'react';
import { useApp } from '../../context/AppContext';
import { GoogleGIcon, CozySparkle } from './CozyIcons';
import { Star, ExternalLink, Quote, ShieldCheck } from 'lucide-react';

export default function CozyReviews() {
  const { settings } = useApp();

  const googleReviewsUrl = settings?.googleReviewsUrl || 'https://www.google.com/travel/search?q=mineral+springs+retreat+dawaipani';

  const reviews = [
    {
      id: 'rev-1',
      name: 'Joyeeta Guha',
      initials: 'JG',
      quote: 'The food was so good, home like.',
      highlight: 'Home-Cooked Food',
      rating: 5,
      date: 'Verified Google Review'
    },
    {
      id: 'rev-2',
      name: 'Milton Music',
      initials: 'MM',
      quote: 'Highly recommended for anyone looking for a relaxing and enjoyable getaway!',
      highlight: 'Relaxing Getaway',
      rating: 5,
      date: 'Verified Google Review'
    },
    {
      id: 'rev-3',
      name: 'Sanju Sur',
      initials: 'SS',
      quote: 'If u want to spend some time with urself amidst nature, its the place.',
      highlight: 'Nature & Solitude',
      rating: 5,
      date: 'Verified Google Review'
    }
  ];

  return (
    <section id="reviews" className="py-20 sm:py-28 lg:py-36 bg-cozy-creamDark select-none border-t border-cozy-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 reveal-init">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 typo-eyebrow text-cozy-sandDark mb-2">
              <GoogleGIcon className="w-3.5 h-3.5" />
              <span>GUEST EXPERIENCES & REVIEWS</span>
            </div>
            <h2 className="typo-section-heading text-cozy-forest font-normal">
              Words From Our
              <span className="block italic text-cozy-sandDark mt-1">Mountain Guests</span>
            </h2>
            <p className="typo-small text-cozy-muted mt-3 max-w-lg leading-relaxed">
              Read verified highlights from travelers who have immersed themselves in the quiet nature, home-cooked mountain meals, and scenic balconies of Mineral Springs Retreat.
            </p>
          </div>

          {/* Google 19 Reviews Badge + Link Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
            <div className="flex items-center space-x-3 bg-white px-4 py-2.5 rounded-full border border-cozy-border shadow-sm">
              <GoogleGIcon className="w-4 h-4 shrink-0" />
              <div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#FBBC05] text-[#FBBC05]" />
                  ))}
                  <span className="text-xs font-semibold text-cozy-forest ml-1 font-sans tabular-nums whitespace-nowrap">4.9</span>
                </div>
                <span className="text-[10px] font-sans text-cozy-muted block tabular-nums whitespace-nowrap">
                  19 Google reviews
                </span>
              </div>
            </div>

            <a
              href={googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cozy-btn-forest typo-btn py-2.5 px-6 shadow-sm inline-flex items-center space-x-2 group transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Read 19 Google Reviews</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={rev.id}
              className={`bg-[#FAF8F5] rounded-2xl p-8 sm:p-10 border border-[#EAE3D8] hover:border-[#B89D77]/70 shadow-[0_10px_30px_-10px_rgba(27,36,30,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(27,36,30,0.12)] hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between relative group reveal-init reveal-delay-${idx + 1}`}
            >
              <div>
                {/* Top: 5 Stars + Verified Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FBBC05] text-[#FBBC05]" />
                    ))}
                  </div>
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white border border-[#EAE3D8] text-[10px] font-sans text-[#1E2C22] font-medium shadow-xs">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>

                {/* Big Elegant Quote Icon */}
                <Quote className="w-8 h-8 text-[#B89D77]/40 rotate-180 mb-3 group-hover:text-[#B89D77]/70 transition-colors" />

                {/* Review Quote */}
                <blockquote className="font-serif italic text-xl sm:text-2xl text-cozy-forest font-light leading-snug mb-6 md:min-h-[6.5rem] flex items-start">
                  "{rev.quote}"
                </blockquote>
              </div>

              {/* Author Footer (No people photos: elegant monogram) */}
              <div className="pt-6 border-t border-[#EAE3D8] flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#151F18] border border-[#B89D77]/40 text-[#D4BA95] flex items-center justify-center font-serif text-sm font-medium shadow-inner">
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="font-serif text-base text-cozy-forest font-medium leading-tight">
                      {rev.name}
                    </h4>
                    <span className="text-[11px] font-sans text-cozy-muted">
                      {rev.date}
                    </span>
                  </div>
                </div>

                <GoogleGIcon className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

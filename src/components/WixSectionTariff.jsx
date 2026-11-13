import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import { UtensilsCrossed, Users, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function WixSectionTariff({ setActivePage }) {
  const { tariff, openBooking } = useApp();
  const sectionRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.tariff-card-anim',
        { opacity: 0, y: 35, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-3 sm:px-6 md:px-8 py-4 sm:py-6 max-w-[1440px] mx-auto select-none"
    >
      {/* Yellow Card (Matching Wix 3561 #F2DC8D) */}
      <div className="tariff-card-anim bg-[#F2DC8D] text-black rounded-[24px] sm:rounded-[32px] p-8 sm:p-14 md:p-16 shadow-sm">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-black/80 text-xs font-mono uppercase tracking-widest block mb-2 font-medium">
            DAWAIPANI · ALL-INCLUSIVE MEAL PACKAGES
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight mb-4 font-sans text-black">
            Tariff & 4-Meal Plan
          </h2>
          <p className="text-black/85 text-xs sm:text-sm md:text-base font-normal leading-relaxed max-w-xl mx-auto font-sans">
            We charge per person, per day, which includes clean, comfortable accommodation and all four home-cooked mountain meals prepared fresh from local ingredients.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8">
          
          {/* Double Sharing */}
          <div className="bg-white/70 backdrop-blur-sm border border-black/10 rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 flex flex-col justify-between hover:bg-white/90 transition-all shadow-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-black/70 block mb-2 font-semibold">
                COUPLES & PAIRS
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-black mb-1 font-sans">
                Double Sharing
              </h3>
              <div className="my-3 flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-light text-black tabular-nums whitespace-nowrap">₹1,500</span>
                <span className="text-xs text-black/70">/ person / night</span>
              </div>
              <p className="text-xs sm:text-sm text-black/80 leading-relaxed mb-4">
                Attached Western toilet, hot water geyser, and private balcony with afternoon mist views. Includes all 4 meals.
              </p>
            </div>
            <button
              onClick={() => openBooking('double-sharing')}
              className="w-full bg-black text-white font-normal py-3 rounded-full text-xs sm:text-sm hover:bg-[#525624] transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Book Double Sharing</span>
              <WixStarburst className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Triple / Group Sharing */}
          <div className="bg-white/70 backdrop-blur-sm border border-black/10 rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 flex flex-col justify-between hover:bg-white/90 transition-all shadow-sm">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-black/70 block mb-2 font-semibold">
                FAMILIES & GROUPS
              </span>
              <h3 className="text-2xl sm:text-3xl font-light text-black mb-1 font-sans">
                Triple / Group Sharing
              </h3>
              <div className="my-3 flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-black tabular-nums whitespace-nowrap">₹1,200 – ₹1,350</span>
                <span className="text-xs text-black/70">/ person / night</span>
              </div>
              <p className="text-xs sm:text-sm text-black/80 leading-relaxed mb-4">
                Spacious mountain room for groups and families with attached Western bathroom, geyser, and valley balcony. Includes all 4 meals.
              </p>
            </div>
            <button
              onClick={() => openBooking('group-sharing')}
              className="w-full bg-black text-white font-normal py-3 rounded-full text-xs sm:text-sm hover:bg-[#525624] transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Book Group Sharing</span>
              <WixStarburst className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

        </div>

        {/* 4-Meal Plan Row */}
        <div className="max-w-4xl mx-auto bg-black/5 rounded-2xl p-5 sm:p-6 border border-black/10 mb-6">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-black mb-3">
            <UtensilsCrossed className="w-4 h-4 text-[#525624]" />
            <span>4 Daily Meals Included with Every Stay</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-black/85">
            <div className="bg-white/50 p-2.5 rounded-lg border border-black/5 font-medium">
              1. Fresh Breakfast
            </div>
            <div className="bg-white/50 p-2.5 rounded-lg border border-black/5 font-medium">
              2. Traditional Lunch
            </div>
            <div className="bg-white/50 p-2.5 rounded-lg border border-black/5 font-medium">
              3. Evening Tea & Snacks
            </div>
            <div className="bg-white/50 p-2.5 rounded-lg border border-black/5 font-medium">
              4. Warming Dinner
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-[11px] sm:text-xs text-black/75 max-w-2xl mx-auto leading-relaxed">
          * Rates are indicative and may vary depending on season, availability and group size. Please contact us to confirm the latest tariff.
        </p>

      </div>
    </section>
  );
}

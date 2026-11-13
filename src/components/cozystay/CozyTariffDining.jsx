import React from 'react';
import { useApp } from '../../context/AppContext';
import { CozySparkle } from './CozyIcons';
import { Utensils, Coffee, Sun, Sunset, Moon, ArrowRight } from 'lucide-react';

export default function CozyTariffDining({ setActivePage }) {
  const { openBooking } = useApp();

  const meals = [
    {
      num: '01',
      title: 'Morning Breakfast',
      time: '8:00 AM – 10:00 AM',
      icon: Sun,
      desc: 'Freshly prepared hot breakfast served with steaming organic Darjeeling tea or mountain-brewed coffee.'
    },
    {
      num: '02',
      title: 'Traditional Gorkha Lunch',
      time: '1:00 PM – 2:30 PM',
      icon: Utensils,
      desc: 'Authentic Nepali and Gorkha thali featuring freshly harvested farm vegetables, dal, organic rice, and local pickles.'
    },
    {
      num: '03',
      title: 'Evening Snacks & Tea',
      time: '5:00 PM – 6:30 PM',
      icon: Sunset,
      desc: 'Crisp mountain pakoras or local savories served with a fresh pot of fragrant Darjeeling tea as the mist rolls in.'
    },
    {
      num: '04',
      title: 'Warming Home-Cooked Dinner',
      time: '8:00 PM – 9:30 PM',
      icon: Moon,
      desc: 'A comforting, freshly made dinner prepared home-style by our local host family to end your day in warmth.'
    }
  ];

  return (
    <section className="py-20 sm:py-28 lg:py-36 bg-[#1E2C22] text-white select-none relative overflow-hidden">
      
      {/* Decorative background border */}
      <div className="absolute inset-x-8 top-8 bottom-8 border border-white/5 pointer-events-none rounded-3xl hidden md:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-cozy-sand font-semibold block mb-3">
            ALL-INCLUSIVE MOUNTAIN MEALS
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08] tracking-tight">
            Tariff & 4-Meal Plan
          </h2>
          <p className="font-sans text-sm sm:text-base text-white/80 font-light mt-4 leading-relaxed max-w-xl mx-auto">
            At Mineral Springs Retreat, our tariff is charged per person per night and includes your clean, comfortable accommodation along with all four home-cooked meals every day.
          </p>
        </div>

        {/* 2 Tariff Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          
          {/* Double Sharing */}
          <div className="bg-[#151F18] border border-[#2D3B31] rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-cozy-sand font-medium block mb-2">
                COUPLES & PAIRS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2">
                Double Sharing
              </h3>
              <div className="flex items-baseline space-x-2 my-4">
                <span className="text-xs uppercase tracking-[0.14em] text-cozy-sand font-medium mr-1 font-sans">
                  Approx.
                </span>
                <span className="font-serif text-4xl sm:text-5xl text-cozy-sandLight font-light num-price whitespace-nowrap">
                  ₹1,500
                </span>
                <span className="text-xs text-white/70 font-sans ml-1">/ person / night</span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light mb-6">
                Clean comfortable double bedroom, attached Western toilet, hot water geyser, private balcony overlooking the mist, and all 4 daily meals included.
              </p>
            </div>

            <button
              onClick={() => openBooking({ roomId: 'double-sharing', guests: 2 })}
              className="w-full cozy-btn-sand text-xs tracking-wider justify-center py-3"
            >
              <span>Book Double Sharing</span>
              <CozySparkle className="w-3 h-3 text-[#151F18]" />
            </button>
          </div>

          {/* Group Sharing */}
          <div className="bg-[#151F18] border border-[#2D3B31] rounded-2xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-cozy-sand font-medium block mb-2">
                FAMILIES & TREKKERS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2">
                Triple / Group Sharing
              </h3>
              <div className="flex items-baseline space-x-2 my-4">
                <span className="text-xs uppercase tracking-[0.14em] text-cozy-sand font-medium mr-1 font-sans">
                  Approx.
                </span>
                <span className="font-serif text-4xl sm:text-5xl text-cozy-sandLight font-light num-price whitespace-nowrap">
                  ₹1,200 – ₹1,350
                </span>
                <span className="text-xs text-white/70 font-sans ml-1">/ person / night</span>
              </div>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light mb-6">
                Spacious mountain room for families and trekking companions. Includes attached Western toilet, hot water geyser, mountain balcony, and all 4 daily meals.
              </p>
            </div>

            <button
              onClick={() => openBooking({ roomId: 'group-sharing', guests: 3 })}
              className="w-full cozy-btn-sand text-xs tracking-wider justify-center py-3"
            >
              <span>Book Group Sharing</span>
              <CozySparkle className="w-3 h-3 text-[#151F18]" />
            </button>
          </div>

        </div>

        {/* 4 Daily Meals Schedule Grid */}
        <div className="mt-8 border-t border-white/10 pt-12 sm:pt-16">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-4xl text-white font-normal">
              Included Daily Meal Schedule
            </h3>
            <p className="text-xs sm:text-sm text-white/75 mt-2">
              Wholesome Gorkha home cooking prepared fresh from seasonal local farm harvests.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {meals.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.num}
                  className="bg-[#151F18]/80 border border-[#2D3B31] rounded-xl p-6 relative group hover:border-cozy-sand/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-sm font-normal tracking-[0.2em] text-[#CBB08B] num-lining">
                      {m.num}
                    </span>
                    <Icon className="w-4 h-4 text-cozy-sand" />
                  </div>
                  <h4 className="font-serif text-lg text-white font-medium mb-1">
                    {m.title}
                  </h4>
                  <span className="inline-block text-[11px] font-sans text-cozy-sand font-medium mb-2 tabular-nums whitespace-nowrap">
                    {m.time}
                  </span>
                  <p className="text-xs text-white/75 leading-relaxed font-light">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-center text-xs text-white/60 font-sans">
            * Please inform our hosts of any vegetarian, non-vegetarian, or dietary preferences prior to arrival.
          </p>
        </div>

      </div>
    </section>
  );
}

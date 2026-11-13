import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixStarburst } from './WixIcons';
import gsap from 'gsap';

export default function MenusPage() {
  const { openBooking, settings } = useApp();
  const pageRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.menu-anim-card',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const menuSections = [
    {
      category: "Signature Libations",
      items: [
        { name: "Mineral Springs Smoked Old Fashioned", desc: "Small-batch rye, orange bitters, smoked maple syrup, charred pine", price: "$18" },
        { name: "Sanctuary Botanical Spritz", desc: "Artisanal vermouth, wild elderflower, fresh cucumber, sparkling tonic", price: "$16" },
        { name: "Valley Herbal Highball", desc: "Estate lavender infused gin, yuzu, pressed green apple, club soda", price: "$17" },
        { name: "Cold Brew Espresso Martini", desc: "House roast espresso, single-origin vodka, Madagascar vanilla liqueur", price: "$19" },
      ]
    },
    {
      category: "Artisanal Kitchen Plates",
      items: [
        { name: "Warm Sourdough & Cultured Butter", desc: "Stone-milled loaf, flaky sea salt, organic whipped herb butter", price: "$12" },
        { name: "Valley Heirloom Burrata", desc: "Vine-ripened tomatoes, torn basil, 12-year balsamic glaze, grilled focaccia", price: "$22" },
        { name: "Wild Mushroom & Truffle Flatbread", desc: "Roasted chanterelles, fontina, shaved black truffle, fresh thyme", price: "$24" },
        { name: "Pan-Seared Pacific Salmon", desc: "Crispy skin salmon, charred broccolini, lemon caper emulsion", price: "$32" },
      ]
    }
  ];

  return (
    <div
      ref={pageRef}
      className="pt-24 sm:pt-28 pb-16 px-3 sm:px-6 md:px-8 max-w-[1440px] mx-auto select-none space-y-3 sm:space-y-4"
    >
      {/* 1. Dark Olive Hero Banner Card (Matching Wix 3561 #525624) */}
      <div className="menu-anim-card bg-[#525624] text-white rounded-[24px] sm:rounded-[32px] p-8 sm:p-16 md:p-20 text-center flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] shadow-sm">
        <h1 className="text-white text-4xl sm:text-6xl md:text-8xl font-light tracking-tight leading-[0.98] mb-4 sm:mb-6 font-sans">
          Take a Sip and Savor
        </h1>
        <p className="text-white text-base sm:text-xl md:text-2xl font-light tracking-normal max-w-2xl font-sans opacity-90">
          Craft Cocktails, Single-Origin Roasts & Local Harvests
          <span className="block mt-1">Open Daily for Hotel Guests & Neighborhood Walk-Ins</span>
        </p>
      </div>

      {/* 2. Featured Image Card with Oval Graphic */}
      <div className="menu-anim-card bg-[#EC6A9B] rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-sm">
        <div className="w-full max-w-[560px] h-[260px] sm:h-[340px] rounded-[50%] overflow-hidden shadow-sm mx-auto group bg-black/10">
          <img
            src="/images/wix/sip-savor.jpg"
            alt="Bar and Dining Table"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            loading="lazy"
          />
        </div>
      </div>

      {/* 3. Menus Grid: Two Cards (Yellow & Blue) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-stretch">
        {/* Cocktails Card: Yellow (#F2DC8D) */}
        <div className="menu-anim-card bg-[#F2DC8D] text-black rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 md:p-14 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-black text-3xl sm:text-4xl font-light tracking-tight leading-tight mb-8 font-sans border-b border-black/15 pb-4">
              {menuSections[0].category}
            </h3>

            <div className="space-y-6">
              {menuSections[0].items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-medium text-base sm:text-lg text-black font-sans">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-black/75 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-black shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fare Card: Blue (#8DC3DF) */}
        <div className="menu-anim-card bg-[#8DC3DF] text-black rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 md:p-14 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-black text-3xl sm:text-4xl font-light tracking-tight leading-tight mb-8 font-sans border-b border-black/15 pb-4">
              {menuSections[1].category}
            </h3>

            <div className="space-y-6">
              {menuSections[1].items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-medium text-base sm:text-lg text-black font-sans">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-black/75 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-black shrink-0">{item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Hours & Reservation Callout Card */}
      <div className="menu-anim-card bg-[#F55956] text-black rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div>
          <h3 className="text-2xl sm:text-3xl font-normal text-black mb-1.5 font-sans">
            Bar & Lounge Opening Hours
          </h3>
          <p className="text-sm text-black/85">
            {settings?.hours || "Mon - Fri: 8am - 8pm"} · Saturday: 9am - 7pm · Sunday: 9am - 8pm
          </p>
        </div>

        <button
          onClick={() => openBooking()}
          className="group flex items-center space-x-2 text-black text-sm font-normal tracking-wide hover:bg-black hover:text-white transition-all duration-200 cursor-pointer py-3 px-7 rounded-full border border-black shrink-0 shadow-sm"
        >
          <span>Reserve a Table</span>
          <WixStarburst className="w-3.5 h-3.5 text-black group-hover:text-white transition-transform duration-300 group-hover:rotate-45" />
        </button>
      </div>
    </div>
  );
}

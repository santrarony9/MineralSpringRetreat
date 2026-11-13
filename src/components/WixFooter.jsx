import React from 'react';
import { useApp } from '../context/AppContext';
import { WixLogo, WixStarburst } from './WixIcons';
import { Shield, MapPin, ExternalLink } from 'lucide-react';

export default function WixFooter({ setActivePage }) {
  const { settings, openBooking, setPolicyModal, setAdminOpen, adminToken } = useApp();

  const homestayName = settings?.homestayName || 'MINERAL SPRINGS RETREAT';
  const officialName = settings?.officialName || 'Mineral Springs Retreat';
  const propertyCategory = settings?.propertyCategory || 'Homestay in Lebong and Mineral Spring Tea Garden, West Bengal.';
  const fullAddress = settings?.address || 'Mineral Springs, Yankoo, Dawaipani, Lebong and Mineral Spring Tea Garden, West Bengal – 734105, India.';
  const directionsUrl = settings?.googleDirectionsUrl || 'https://www.google.com/search?sa=X&q=mineral+springs+retreat+dawaipani+address&ludocid=12917762238512786598';
  const email = settings?.email || 'stay@mineralspringsretreat.com';

  return (
    <footer className="px-3 sm:px-6 md:px-8 mt-12 sm:mt-20 select-none">
      {/* Massive Coral Red Rounded Footer Container (Matching Wix 3561 #F55956) */}
      <div className="bg-[#F55956] text-black rounded-t-[32px] sm:rounded-t-[48px] px-6 sm:px-12 md:px-16 pt-12 sm:pt-16 pb-10 max-w-[1440px] mx-auto shadow-sm">
        
        {/* Top Row: Large Brand Logo & Book Your Stay Pill Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-12 sm:pb-16 border-b border-black/15 gap-6">
          
          {/* Logo & Name */}
          <div
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group"
          >
            <WixLogo className="w-10 h-10 sm:w-12 sm:h-12 transition-transform group-hover:scale-105 duration-200" footer={true} />
            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight font-sans">
              {homestayName}
            </span>
          </div>

          {/* Book Your Stay Button with Starburst */}
          <div>
            <button
              onClick={() => openBooking()}
              className="group border border-black rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-black font-normal text-sm sm:text-base hover:bg-black hover:text-white transition-all duration-300 flex items-center space-x-2.5 shadow-sm"
            >
              <span>Book Your Stay</span>
              <WixStarburst className="w-3.5 h-3.5 text-black group-hover:text-white transition-transform duration-300 group-hover:rotate-45" />
            </button>
          </div>

        </div>

        {/* 3 Main Information Columns (Exact Wix Reference Structure) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 py-12 sm:py-16 text-xs sm:text-sm font-normal leading-relaxed">
          
          {/* Col 1: Contact & Location */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm sm:text-base mb-2 text-black font-sans">Contact & Location</h4>
            <p className="font-semibold text-xs text-black">{officialName}</p>
            <p className="text-[11px] font-mono text-black/80">{propertyCategory}</p>
            <p className="text-xs text-black/90 leading-relaxed pt-1">
              {fullAddress}
            </p>
            <div className="pt-2">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-black/30 hover:border-black bg-black/10 hover:bg-black hover:text-white transition-all text-xs font-medium"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Get Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="pt-2 text-xs opacity-90">
              Mail: <a href={`mailto:${email}`} className="underline hover:opacity-75">{email}</a>
            </p>
          </div>

          {/* Col 2: Meal & Hosting Hours */}
          <div className="space-y-1.5">
            <h4 className="font-medium text-sm sm:text-base mb-3 text-black font-sans">Meal & Hosting Hours</h4>
            <p className="opacity-90">Breakfast: 8:00am - 10:00am</p>
            <p className="opacity-90">Lunch: 1:00pm - 2:30pm</p>
            <p className="opacity-90">Evening Tea: 5:00pm - 6:30pm</p>
            <p className="opacity-90">Dinner: 8:00pm - 9:30pm</p>
          </div>

          {/* Col 3: Menu */}
          <div className="space-y-1.5">
            <h4 className="font-medium text-sm sm:text-base mb-3 text-black font-sans">Menu</h4>
            <ul className="space-y-1 opacity-90">
              <li>
                <button
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:underline transition-all"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:underline transition-all"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('rooms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:underline transition-all"
                >
                  Rooms & Tariff
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('experiences'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:underline transition-all"
                >
                  Experiences
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('travel'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:underline transition-all"
                >
                  Travel Guide
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Policies & Copyright Row */}
        <div className="pt-8 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs opacity-80 gap-4">
          
          {/* Policy Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button onClick={() => setPolicyModal('terms')} className="hover:underline">
              Terms & Conditions
            </button>
            <button onClick={() => setPolicyModal('privacy')} className="hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => setPolicyModal('accessibility')} className="hover:underline">
              Accessibility Statement
            </button>
          </div>

          {/* Copyright & Admin Trigger */}
          <div className="flex items-center space-x-4">
            <p>© 2035 by {homestayName}. Built on Wix Studio</p>
            <button
              onClick={() => setAdminOpen(true)}
              className="p-1 hover:text-white transition-colors"
              title={adminToken ? "Admin Dashboard" : "Admin Sign-in"}
              aria-label="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}

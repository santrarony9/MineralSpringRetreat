import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { WixLogo, WixStarburst } from './WixIcons';
import { Menu, X, Shield } from 'lucide-react';
import gsap from 'gsap';

export default function Header({ activePage, setActivePage }) {
  const { settings, openBooking, setAdminOpen, adminToken } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animation for mobile menu
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current.querySelectorAll('.mobile-nav-item'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'rooms', label: 'Rooms & Tariff' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'travel', label: 'Travel Guide' },
  ];

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const homestayName = settings?.homestayName || 'MINERAL SPRINGS RETREAT';
  const cleanName = homestayName;

  return (
    <>
      {/* Floating Olive-Green Pill Header (Matching Wix Template 3561) */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none px-3 sm:px-6 md:px-8 pt-3 sm:pt-4">
        <header
          ref={navRef}
          className={`pointer-events-auto max-w-[1400px] mx-auto bg-[#525624] text-white rounded-full px-5 sm:px-8 py-3 transition-all duration-300 flex items-center justify-between shadow-md ${
            scrolled ? 'shadow-xl bg-[#525624]/95 backdrop-blur-md py-2.5' : 'py-3.5'
          }`}
        >
          {/* Left: Brand Logo & Title */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none"
          >
            <WixLogo className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-105 duration-200" footer={false} />
            <span className="font-sans font-medium text-sm sm:text-base md:text-lg lg:text-xl tracking-tight text-white whitespace-nowrap">
              {cleanName}
            </span>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <nav className="flex items-center space-x-3 lg:space-x-5">
              {navItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-sm tracking-normal transition-all duration-200 ${
                      isActive
                        ? 'border border-white/90 rounded-full px-4 py-1 text-white font-normal'
                        : 'text-white/80 hover:text-white px-3 py-1 font-normal'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center space-x-3">
              {/* Book Now Button with 8-Point Starburst */}
              <button
                onClick={() => openBooking()}
                className="group border border-white rounded-full px-4 sm:px-5 py-1.5 text-white font-normal text-xs sm:text-sm hover:bg-white hover:text-[#525624] transition-all duration-200 flex items-center space-x-2 shadow-sm"
              >
                <span>Book Now</span>
                <WixStarburst className="w-3 h-3 text-white group-hover:text-[#525624] transition-transform duration-300 group-hover:rotate-45" />
              </button>

              {/* Admin Portal Shortcut */}
              <button
                onClick={() => setAdminOpen(true)}
                title={adminToken ? "Admin Dashboard (Logged In)" : "Admin Portal"}
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  adminToken
                    ? 'text-[#F2DC8D] bg-white/10 hover:bg-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                aria-label="Admin Portal"
              >
                <Shield className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Action Controls */}
          <div className="flex items-center space-x-2.5 lg:hidden">
            <button
              onClick={() => openBooking()}
              className="border border-white rounded-full px-3.5 py-1 text-white text-xs sm:text-sm font-normal flex items-center space-x-1.5"
            >
              <span>Book</span>
              <WixStarburst className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white hover:opacity-80 transition-opacity"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>
      </div>

      {/* Mobile & Tablet Full-Screen Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 bg-[#525624] text-white flex flex-col justify-between p-6 sm:p-10 lg:hidden animate-fade-in"
        >
          {/* Header row in mobile drawer */}
          <div className="flex items-center justify-between border-b border-white/20 pb-5">
            <div className="flex items-center space-x-3">
              <WixLogo className="w-6 h-6" footer={false} />
              <span className="font-sans font-medium text-2xl tracking-tight text-white">
                {cleanName}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-white hover:opacity-80 transition-opacity"
              aria-label="Close Navigation Menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col space-y-5 my-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-item text-left text-3xl sm:text-4xl font-light tracking-tight transition-colors py-2 flex items-center justify-between border-b border-white/10 ${
                  activePage === item.id ? 'text-white font-medium pl-2 border-l-2 border-l-white' : 'text-white/75 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {activePage === item.id && <WixStarburst className="w-4 h-4 text-[#F2DC8D]" />}
              </button>
            ))}
          </nav>

          {/* Bottom actions in mobile drawer */}
          <div className="pt-6 border-t border-white/20 flex flex-col space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBooking();
              }}
              className="w-full bg-white text-[#525624] font-medium py-3.5 rounded-full text-base flex items-center justify-center space-x-2 shadow-lg hover:bg-neutral-100 transition-colors"
            >
              <span>Book Your Stay</span>
              <WixStarburst className="w-3.5 h-3.5 text-[#525624]" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAdminOpen(true);
              }}
              className="text-xs text-white/60 hover:text-white flex items-center justify-center space-x-1.5 py-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Host & Admin Panel</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

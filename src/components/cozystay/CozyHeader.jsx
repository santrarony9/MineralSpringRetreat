import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, Shield, User, LogOut, Calendar } from 'lucide-react';

export default function CozyHeader({ activePage, setActivePage }) {
  const {
    openBooking,
    settings,
    setAdminOpen,
    pages,
    guestUser,
    guestLogout,
    setGuestAuthModalOpen,
    setMyBookingsModalOpen,
    myBookings
  } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close guest dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setGuestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const phone = settings?.phone || '+91 98320 12345';
  const headerData = pages?.header;
  const brandTitle = headerData?.brandTitle || 'MINERAL SPRINGS';
  const brandSubtitle = headerData?.brandSubtitle || 'RETREAT';

  const navItems = (headerData?.navItems && headerData.navItems.length > 0)
    ? headerData.navItems.filter(item => item.visible !== false)
    : [
        { id: 'home', label: 'HOME' },
        { id: 'about', label: 'ABOUT' },
        { id: 'dawaipani', label: 'DAWAIPANI' },
        { id: 'stay', label: 'STAY' },
        { id: 'experiences', label: 'EXPERIENCES' },
        { id: 'gallery', label: 'GALLERY' },
        { id: 'travel', label: 'TRAVEL GUIDE' },
      ];

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    if (id === 'dawaipani') {
      if (activePage === 'home') {
        const el = document.getElementById('dawaipani');
        if (el) {
          const header = document.querySelector('header');
          const headerOffset = header ? header.offsetHeight + 24 : 120;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, elementPosition - headerOffset),
            behavior: 'smooth'
          });
          return;
        }
      }
    }
    setActivePage(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 select-none bg-[#17251D] border-b border-[#B89A70]/20 ${
          isScrolled ? 'shadow-xl' : 'shadow-md'
        }`}
      >
        {/* Desktop Navigation Row: Brand Logo FAR LEFT, All Navigation Items Grouped FAR RIGHT */}
        <div className="hidden lg:flex items-center justify-between w-full max-w-[1600px] mx-auto px-4 sm:px-6 xl:px-8 2xl:px-12 py-3.5 xl:py-4.5 gap-6">
          
          {/* LEFT: Complete Logo Brand Lockup */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex flex-col items-start text-left group focus:outline-none shrink-0 py-1"
          >
            <span className="font-roman text-lg sm:text-xl lg:text-[20px] xl:text-[23px] font-normal tracking-[0.18em] xl:tracking-[0.2em] text-[#FAF7F2] uppercase group-hover:text-[#B89A70] transition-colors whitespace-nowrap leading-tight">
              {brandTitle}
            </span>
            <span className="font-roman text-[10px] sm:text-xs tracking-[0.32em] text-[#B89A70] uppercase font-light mt-1 whitespace-nowrap leading-none">
              {brandSubtitle}
            </span>
            {/* 5 Subtle Gold Stars */}
            <div className="flex items-center space-x-1.5 mt-1.5 text-[#B89A70] text-[8px] tracking-[0.25em] opacity-90 leading-none">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
          </button>

          {/* RIGHT: Complete Group of All Navigation Links, Reserve Now & Admin Icon */}
          <nav aria-label="Main Navigation" className="flex items-center justify-end gap-x-2.5 xl:gap-x-4 2xl:gap-x-6 typo-nav whitespace-nowrap min-w-0">
            {navItems.map((item) => {
              const isActive = activePage === item.id || (item.id === 'stay' && activePage === 'rooms');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link-cozy py-1 whitespace-nowrap text-[11px] xl:text-[12px] 2xl:text-[13px] font-medium tracking-[0.1em] xl:tracking-[0.13em] 2xl:tracking-[0.15em] transition-colors duration-200 ${
                    isActive ? 'text-[#B89A70] is-active' : 'text-[#FAF7F2] hover:text-[#B89A70]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* 8. Refined Reserve Now Button */}
            <button
              onClick={() => openBooking()}
              className="btn-header-reserve ml-1 xl:ml-2"
            >
              <span className="whitespace-nowrap">Reserve Now</span>
            </button>

            {/* Customer Authentication: Guest Profile or Sign In */}
            {guestUser ? (
              <div className="relative shrink-0 ml-1" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}
                  className="flex items-center space-x-1.5 py-1 px-2.5 rounded-full border border-[#B89A70]/50 hover:border-[#B89A70] bg-[#17251D] transition-colors focus:outline-none"
                  title="Guest Account"
                >
                  {guestUser.picture ? (
                    <img
                      src={guestUser.picture}
                      alt={guestUser.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#B89A70] shrink-0"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#B89A70] text-[#17251D] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {guestUser.name?.charAt(0) || 'G'}
                    </div>
                  )}
                  <span className="text-[11px] font-sans font-medium text-[#FAF7F2] max-w-[85px] truncate">
                    {guestUser.name?.split(' ')[0] || 'Guest'}
                  </span>
                </button>

                {guestDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#17251D] border border-[#B89A70]/30 rounded-2xl shadow-2xl py-2 text-xs font-sans text-[#FAF7F2] z-50">
                    <div className="px-4 py-2 border-b border-[#B89A70]/20">
                      <p className="font-semibold text-white truncate">{guestUser.name}</p>
                      <p className="text-[10px] text-[#B89A70] truncate">{guestUser.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setGuestDropdownOpen(false);
                        setMyBookingsModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#B89A70]/15 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-[#B89A70]" />
                        <span>My Bookings</span>
                      </span>
                      {myBookings?.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-[#B89A70] text-[#17251D] text-[10px] font-bold rounded-full">
                          {myBookings.length}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGuestDropdownOpen(false);
                        guestLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-rose-300 hover:bg-rose-950/30 border-t border-[#B89A70]/20 flex items-center space-x-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setGuestAuthModalOpen(true)}
                className="nav-link-cozy py-1 whitespace-nowrap text-[11px] xl:text-[12px] 2xl:text-[13px] font-medium tracking-[0.1em] xl:tracking-[0.13em] 2xl:tracking-[0.15em] text-[#FAF7F2] hover:text-[#B89A70] transition-colors duration-200 ml-1"
                title="Sign in with Google"
              >
                SIGN IN
              </button>
            )}

            {/* 9. Admin Portal Icon */}
            <button
              onClick={() => setAdminOpen(true)}
              className="p-1 rounded-full text-[#B89A70]/60 hover:text-[#B89A70] transition-colors shrink-0 ml-0.5"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
          </nav>

        </div>

        {/* Mobile & Tablet Navigation Row: Logo Left, Reserve & Hamburger Menu Right */}
        <div className="lg:hidden flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 w-full bg-[#17251D]">
          
          {/* Left: Scaled Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex flex-col items-start text-left group focus:outline-none shrink-0"
          >
            <span className="font-roman text-base sm:text-lg font-normal tracking-[0.14em] sm:tracking-[0.16em] text-[#FAF7F2] uppercase group-hover:text-[#B89A70] transition-colors whitespace-nowrap leading-tight">
              MINERAL SPRINGS
            </span>
            <span className="font-roman text-[9px] sm:text-[10px] tracking-[0.28em] text-[#B89A70] uppercase font-light mt-0.5 whitespace-nowrap leading-none">
              RETREAT
            </span>
            {/* 5 Subtle Gold Stars */}
            <div className="flex items-center space-x-1 mt-1 text-[#B89A70] text-[7px] tracking-[0.2em] opacity-90 leading-none">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
          </button>

          {/* Right: Reserve Button + Hamburger Menu Toggle */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 shrink-0">
            <button
              onClick={() => openBooking()}
              className="btn-header-reserve !py-1 !px-2.5 !text-[10px] sm:!text-[11px] whitespace-nowrap"
            >
              Reserve
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 text-[#FAF7F2] hover:text-[#B89A70] transition-colors flex items-center justify-center shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-over Drawer with Smooth Eased Transition */}
      <div
        className={`fixed inset-0 z-50 lg:hidden flex transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`relative ml-auto w-full max-w-xs bg-[#17251D] text-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between p-6 sm:p-8 border-l border-[#B89A70]/20 transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#B89A70]/20">
              <div className="flex flex-col">
                <span className="font-roman text-lg text-[#FAF7F2] tracking-[0.18em] uppercase">
                  {brandTitle}
                </span>
                <span className="text-[10px] tracking-[0.25em] text-[#B89A70] uppercase font-light">
                  {brandSubtitle}
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#FAF7F2]/70 hover:text-[#FAF7F2] transition-colors"
                aria-label="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="py-6 space-y-3">
              {navItems.map((item) => {
                const isActive = activePage === item.id || (item.id === 'stay' && activePage === 'rooms');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full text-left font-roman text-xl tracking-wider py-1.5 transition-colors uppercase ${
                      isActive ? 'text-[#B89A70]' : 'text-[#FAF7F2]/90 hover:text-[#FAF7F2]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Guest Account Section */}
            <div className="pt-4 pb-2 border-t border-[#B89A70]/20 font-sans">
              {guestUser ? (
                <div className="p-3.5 bg-white/5 border border-[#B89A70]/30 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-3">
                    {guestUser.picture ? (
                      <img
                        src={guestUser.picture}
                        alt={guestUser.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#B89A70]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#B89A70] text-[#17251D] text-xs font-bold flex items-center justify-center">
                        {guestUser.name?.charAt(0) || 'G'}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="text-xs font-medium text-white truncate">{guestUser.name}</p>
                      <p className="text-[10px] text-[#B89A70] truncate">{guestUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMyBookingsModalOpen(true);
                      }}
                      className="flex-1 py-1.5 bg-[#B89A70] text-[#17251D] font-semibold text-center rounded-xl"
                    >
                      My Bookings ({myBookings?.length || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        guestLogout();
                      }}
                      className="px-3 py-1.5 bg-white/10 text-rose-300 rounded-xl"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setGuestAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-[#B89A70]/40 rounded-2xl flex items-center justify-center space-x-2 text-xs text-[#FAF7F2] font-medium"
                >
                  <User className="w-4 h-4 text-[#B89A70]" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>
          </div>

          {/* Drawer Bottom CTA */}
          <div className="space-y-4 pt-6 border-t border-[#B89A70]/20 text-center">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBooking();
              }}
              className="w-full cozy-btn-gold text-xs tracking-widest py-3.5"
            >
              Reserve Your Stay
            </button>

            <div className="text-[11px] text-[#FAF7F2]/60 font-sans tracking-wider pt-2">
              <p>DAWAIPANI · DARJEELING</p>
              <p className="mt-1 text-[#B89A70]">{phone}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

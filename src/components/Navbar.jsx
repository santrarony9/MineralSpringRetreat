import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, X, Calendar, Shield, Phone, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { settings, openBooking, setAdminOpen, adminToken } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About Us', href: '#about' },
    { name: 'Accommodation', href: '#accommodation' },
    { name: 'Experiences', href: '#experiences' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const homestayName = settings?.homestayName || 'MINERAL SPRINGS RETREAT';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'glass-nav py-3.5 shadow-sm border-b border-sand-200/60'
            : 'bg-gradient-to-b from-black/60 via-black/20 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo / Brand Name */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="group flex flex-col items-start focus:outline-none"
          >
            <span
              className={`font-serif text-2xl md:text-3xl font-normal tracking-wide transition-colors duration-300 ${
                scrolled ? 'text-earth-900 group-hover:text-moss-600' : 'text-white group-hover:text-cream-200'
              }`}
            >
              {homestayName.toUpperCase()}
            </span>
            <span
              className={`text-[9px] uppercase tracking-widest-xl font-medium transition-colors duration-300 ${
                scrolled ? 'text-sand-500' : 'text-cream-200/80'
              }`}
            >
              BOUTIQUE NATURE RETREAT
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-xs uppercase tracking-widest font-medium transition-all duration-200 hover:scale-105 ${
                  scrolled
                    ? 'text-earth-900/80 hover:text-moss-700'
                    : 'text-white/90 hover:text-white hover:drop-shadow-sm'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action: Book Button & Admin Access */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => openBooking()}
              className={`px-6 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-sm flex items-center space-x-2 ${
                scrolled
                  ? 'bg-earth-900 text-cream-50 hover:bg-moss-700 hover:shadow-md'
                  : 'bg-white/95 text-earth-900 hover:bg-white hover:shadow-lg backdrop-blur-sm'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK YOUR STAY</span>
            </button>

            {/* Admin Dashboard shortcut */}
            <button
              onClick={() => setAdminOpen(true)}
              title={adminToken ? "Admin Dashboard (Logged In)" : "Admin Portal"}
              className={`p-2 rounded-full transition-colors ${
                adminToken
                  ? 'text-moss-600 bg-moss-50 hover:bg-moss-100 ring-1 ring-moss-500'
                  : scrolled
                  ? 'text-sand-500 hover:text-earth-900 hover:bg-sand-100'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => openBooking()}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold ${
                scrolled
                  ? 'bg-earth-900 text-cream-50'
                  : 'bg-white text-earth-900'
              }`}
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 transition-colors ${
                scrolled ? 'text-earth-900' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-earth-950/95 backdrop-blur-md flex flex-col justify-between p-8 text-cream-50 animate-fade-in lg:hidden">
          <div className="flex items-center justify-between border-b border-sand-400/20 pb-6">
            <div>
              <span className="font-serif text-2xl tracking-wider">{homestayName}</span>
              <p className="text-[10px] uppercase tracking-widest text-sand-300">Boutique Homestay</p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-sand-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-6 my-auto py-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-serif text-3xl tracking-wide text-cream-100 hover:text-brass-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-6 border-t border-sand-400/20 flex flex-col space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openBooking();
              }}
              className="w-full py-3.5 bg-cream-50 text-earth-900 font-medium tracking-widest uppercase text-xs flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK YOUR STAY</span>
            </button>

            <div className="flex flex-col gap-1.5 text-xs text-sand-400 pt-2 border-t border-[#B89A70]/15">
              <div className="flex items-center justify-between">
                <a href={`tel:${(settings?.phone || '+91 79081 92498').replace(/[^0-9+]/g, '')}`} className="flex items-center space-x-1.5 hover:text-white">
                  <Phone className="w-3.5 h-3.5 text-brass-400" />
                  <span>{settings?.phone || '+91 79081 92498'}</span>
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAdminOpen(true);
                  }}
                  className="flex items-center space-x-1.5 hover:text-brass-400"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
              <div>
                <a href={`tel:${(settings?.phone2 || '+91 98303 55105').replace(/[^0-9+]/g, '')}`} className="flex items-center space-x-1.5 hover:text-white">
                  <Phone className="w-3.5 h-3.5 text-brass-400" />
                  <span>{settings?.phone2 || '+91 98303 55105'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

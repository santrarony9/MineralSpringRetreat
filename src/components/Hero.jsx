import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, ArrowRight, Calendar, Sparkles } from 'lucide-react';

export default function Hero() {
  const { settings, openBooking } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = settings?.heroImages?.length > 0 
    ? settings.heroImages 
    : ['/images/hero-main.jpg', '/images/hero-slide-2.jpg', '/images/hero-slide-3.jpg'];

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const scrollToAbout = () => {
    const elem = document.querySelector('#about');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const homestayName = settings?.homestayName || 'MINERAL SPRINGS RETREAT';
  const tagline = settings?.tagline || 'A Luxury Boutique Nature Retreat & Homestay';
  const subtagline = settings?.subtagline || 'Reconnect with what matters in a peaceful sanctuary carved by nature, mindful architecture and timeless hospitality.';

  return (
    <section id="home" className="relative w-full h-screen min-h-[680px] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel with Cross-fade */}
      {heroImages.map((img, idx) => (
        <div
          key={img + idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          } transition-transform duration-[8000ms] ease-out`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
      ))}

      {/* Cinematic Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-black/40 to-black/35" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center">
        {/* Subtle Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-100 text-xs tracking-widest-xl uppercase mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-brass-400" />
          <span>BOUTIQUE SANCTUARY · EST. 2021</span>
        </div>

        {/* Main Title & Tagline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.08] tracking-tight mb-6 drop-shadow-md">
          {homestayName}
        </h1>

        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-cream-200/90 font-light mb-6 max-w-2xl">
          "{tagline}"
        </p>

        <p className="text-sm sm:text-base text-cream-100/80 max-w-xl font-light leading-relaxed mb-10">
          {subtagline}
        </p>

        {/* Two CTAs */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 w-full sm:w-auto">
          <button
            onClick={scrollToAbout}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/15 text-white border border-white/80 uppercase tracking-widest text-xs font-semibold transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-2 hover:border-white"
          >
            <span>EXPLORE OUR HOMESTAY</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => openBooking()}
            className="w-full sm:w-auto px-8 py-3.5 bg-cream-50 hover:bg-white text-earth-900 uppercase tracking-widest text-xs font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Calendar className="w-3.5 h-3.5 text-earth-900" />
            <span>BOOK YOUR STAY</span>
          </button>
        </div>

        {/* Slide Indicators if multi-image */}
        {heroImages.length > 1 && (
          <div className="flex items-center space-x-2 mt-12">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Small Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 text-white/70 hover:text-white transition-colors group cursor-pointer"
        aria-label="Scroll down to About section"
      >
        <span className="text-[10px] tracking-widest-xl uppercase">SCROLL</span>
        <div className="w-5 h-8 border border-white/40 rounded-full flex justify-center p-1 group-hover:border-white">
          <div className="w-1 h-2 bg-white/80 rounded-full animate-bounce" />
        </div>
      </button>
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Eye, Filter } from 'lucide-react';

export default function GallerySection() {
  const { gallery, lightboxState, openLightbox, closeLightbox, nextLightbox, prevLightbox } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Extract categories dynamically
  const categories = ['All', ...new Set(gallery.map(g => g.category || 'Architecture'))];

  const filteredGallery = activeCategory === 'All'
    ? gallery
    : gallery.filter(g => g.category === activeCategory);

  // Keyboard controls for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxState.open) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxState.open, nextLightbox, prevLightbox, closeLightbox]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const currentItem = lightboxState.open && lightboxState.items?.[lightboxState.index];

  return (
    <section id="gallery" className="py-20 md:py-32 bg-cream-100 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest-xl font-medium text-moss-600 block mb-3">
              VISUAL CHRONICLES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-earth-900 font-normal leading-tight">
              A Quiet Symphony
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-2 mt-6 md:mt-0 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-widest py-2 px-3.5 transition-all duration-300 font-medium whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-earth-900 text-cream-50 shadow-sm'
                    : 'text-earth-900/70 hover:text-earth-900 hover:bg-sand-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Image Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => openLightbox(idx, filteredGallery)}
              className="break-inside-avoid group relative cursor-pointer overflow-hidden bg-sand-200 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-auto object-cover img-hover-zoom"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-earth-950/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest text-brass-400 font-semibold mb-1">
                  {item.category}
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-normal leading-snug drop-shadow-sm mb-2">
                  {item.title}
                </h4>
                <div className="inline-flex items-center space-x-1.5 text-xs text-cream-200/90 font-light">
                  <Eye className="w-3.5 h-3.5 text-moss-500" />
                  <span>Click to expand</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxState.open && currentItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white z-20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center space-x-3">
              <span className="text-[11px] uppercase tracking-widest text-brass-400 font-semibold">
                {currentItem.category || 'Gallery'}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-xs text-white/80">
                {lightboxState.index + 1} of {lightboxState.items.length}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={closeLightbox}
                className="p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Photo & Nav Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={prevLightbox}
              className="absolute left-2 sm:left-6 z-20 p-3 bg-black/50 hover:bg-black/90 text-white rounded-full transition-all hover:scale-110 shadow-lg border border-white/10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="max-h-[78vh] max-w-[90vw] object-contain shadow-2xl transition-transform duration-300"
            />

            <button
              onClick={nextLightbox}
              className="absolute right-2 sm:right-6 z-20 p-3 bg-black/50 hover:bg-black/90 text-white rounded-full transition-all hover:scale-110 shadow-lg border border-white/10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Caption */}
          <div className="text-center text-white pb-2 z-20" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-2xl font-normal text-cream-100">
              {currentItem.title}
            </h3>
            <p className="text-xs text-sand-400 font-light mt-1">
              Use arrow keys or swipe to navigate · Esc to close
            </p>
          </div>

        </div>
      )}
    </section>
  );
}

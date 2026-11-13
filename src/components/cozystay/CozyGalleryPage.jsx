import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CozySparkle } from './CozyIcons';
import { X, ChevronLeft, ChevronRight, Eye, Camera, Mountain, Sparkles } from 'lucide-react';

export default function CozyGalleryPage({ setActivePage }) {
  const { openBooking, gallery: appGallery, pages } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryData = pages?.gallery;
  const eyebrow = galleryData?.eyebrow || 'RETREAT PHOTOGRAPHS & VISUAL GLIMPSES';
  const pageTitle = galleryData?.title || 'Retreat & Landscape Gallery';
  const pageSubtitle = galleryData?.subtitle || 'Visual glimpses of our wooden cottages, mountain balconies, misty sunrises, and peaceful Himalayan settings in Dawaipani.';

  const defaultPhotos = [
    {
      id: 1,
      title: 'Double Sharing Bedroom with Balcony Doors',
      category: 'rooms',
      categoryLabel: 'Rooms & Suites',
      image: '/images/mineral-springs/room-double-sharing-balcony.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Warm wooden bedroom with floral bedding and double glass doors opening directly onto the mist and mountain canopy.'
    },
    {
      id: 2,
      title: 'Twin Sharing Room with Scenic Balcony Access',
      category: 'rooms',
      categoryLabel: 'Rooms & Suites',
      image: '/images/mineral-springs/room-twin-balcony-view.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Comfortable twin-bed accommodation featuring polished wood flooring, cozy fleece quilts, and walkout balcony.'
    },
    {
      id: 3,
      title: 'Spacious Family & Group Sharing Suite',
      category: 'rooms',
      categoryLabel: 'Rooms & Suites',
      image: '/images/mineral-springs/room-group-family-suite.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Large family suite with carpeted wooden floors, multiple comfortable beds, reading lamps, and scenic private balcony.'
    },
    {
      id: 4,
      title: 'Open Verandah with Acoustic Guitar & Valley View',
      category: 'property',
      categoryLabel: 'Property & Verandahs',
      image: '/images/mineral-springs/retreat-wooden-balcony-guitar.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Long wooden balcony with warm red woven runner rug, acoustic guitar, and panoramic vistas overlooking the valley below.'
    },
    {
      id: 5,
      title: 'Bedside Reading Nook with Warm Lamp',
      category: 'rooms',
      categoryLabel: 'Rooms & Suites',
      image: '/images/mineral-springs/room-reading-nook-corner.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Peaceful corner bedroom with handcrafted side table, brass reading lamp, curated books, and soft natural light.'
    },
    {
      id: 6,
      title: 'Balcony View of Layered Blue Himalayan Ridges',
      category: 'mountains',
      categoryLabel: 'Himalayan Vistas',
      image: '/images/mineral-springs/dawaipani-balcony-valley-vista.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Looking out from the homestay balcony across endless mist-shrouded mountain ridges stretching toward Darjeeling.'
    },
    {
      id: 7,
      title: 'Misty Balcony Morning from Bedroom',
      category: 'rooms',
      categoryLabel: 'Rooms & Suites',
      image: '/images/mineral-springs/room-misty-balcony-morning.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Stepping out from your bed into the cool, silent morning air as gentle clouds flow right across the wooden railing.'
    },
    {
      id: 8,
      title: 'Verandah Corridor with Potted Palm & Runner',
      category: 'property',
      categoryLabel: 'Property & Verandahs',
      image: '/images/mineral-springs/retreat-verandah-corridor-view.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Long wooden verandah walkway framed by potted greens, heritage red rug, and open mountain vistas.'
    },
    {
      id: 9,
      title: 'Cottages Along the Stone Garden Slope',
      category: 'property',
      categoryLabel: 'Property & Verandahs',
      image: '/images/mineral-springs/retreat-cottages-mountain-slope.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Red-roofed cottages connected by rustic stone steps and native blooming flowers along the terraced hillside.'
    },
    {
      id: 10,
      title: 'Open Wooden Patio Deck & Mountain Lounge',
      category: 'property',
      categoryLabel: 'Property & Verandahs',
      image: '/images/mineral-springs/retreat-patio-deck-lounge.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Spacious outdoor timber deck with maroon-cushioned benches and coffee table — ideal for bonfire gatherings and stargazing.'
    },
    {
      id: 11,
      title: 'Forest Green Feature Wall Bedroom',
      category: 'rooms',
      categoryLabel: 'Rooms & Suites',
      image: '/images/mineral-springs/room-green-feature-wall.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Elegant bedroom accent wall in deep forest green, complemented by bamboo sconce lighting, maple curtains, and mountain views.'
    },
    {
      id: 12,
      title: 'Retreat Main Cottage & Forest Canopy',
      category: 'property',
      categoryLabel: 'Property & Verandahs',
      image: '/images/mineral-springs/retreat-main-cottage-facade.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Two-storey wooden lodge with traditional white lace eaves, mountain stonework, and towering pine forest backdrop.'
    },
    {
      id: 13,
      title: 'Hillside Eco-Cottage Tucked in Pine Forest',
      category: 'property',
      categoryLabel: 'Property & Verandahs',
      image: '/images/mineral-springs/retreat-hillside-eco-cottage.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Traditional wooden cottage on stilts surrounded by towering pines and lush Himalayan vegetation on the quiet mountain slope.'
    },
    {
      id: 14,
      title: 'Covered Porch with Lantern & Garden Seating',
      category: 'property',
      categoryLabel: 'Property & Verandahs',
      image: '/images/mineral-springs/retreat-covered-porch-lantern.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Charming sheltered entry porch with vintage hanging lantern, deep red benches, and potted plants for evening tea.'
    },
    {
      id: 15,
      title: 'Cozy Pine Wood Panelled Bedroom',
      category: 'rooms',
      categoryLabel: 'Rooms & Suites',
      image: '/images/mineral-springs/room-cozy-pine-bedroom.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Natural pine wood plank walls and cozy mountain bedding with private walkout balcony overlooking the pines.'
    },
    {
      id: 16,
      title: 'Balcony Sitting Corner with Valley Canopy',
      category: 'property',
      categoryLabel: 'Property & Verandahs',
      image: '/images/mineral-springs/retreat-balcony-cushion-corner.jpg',
      aspect: 'aspect-[4/3]',
      caption: 'Intimate balcony sitting corner with ethnic patterned cushions, bamboo accents, and sweeping views of the valley.'
    }
  ];

  const photos = (appGallery && appGallery.length > 0)
    ? appGallery.map((g, idx) => ({
        id: g.id || idx,
        title: g.title || 'Retreat View',
        category: (g.category || 'property').toLowerCase(),
        categoryLabel: g.category || 'Property & Verandahs',
        image: g.image,
        aspect: g.aspect || 'aspect-[4/3]',
        caption: g.altText || g.caption || g.title
      }))
    : defaultPhotos;

  const categories = [
    { id: 'all', label: `All Photos (${photos.length})` },
    { id: 'rooms', label: `Rooms & Suites (${photos.filter(p => p.category === 'rooms').length})` },
    { id: 'property', label: `Property & Verandahs (${photos.filter(p => p.category === 'property' || p.category === 'general' || p.category === 'landscape').length})` },
    { id: 'mountains', label: `Himalayan Ridge View (${photos.filter(p => p.category === 'mountains' || p.category === 'views').length})` },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter(p => {
        if (activeCategory === 'rooms') return p.category === 'rooms';
        if (activeCategory === 'property') return p.category === 'property' || p.category === 'general' || p.category === 'landscape';
        if (activeCategory === 'mountains') return p.category === 'mountains' || p.category === 'views';
        return p.category === activeCategory;
      });

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  return (
    <div className="pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-28 bg-cozy-cream select-none min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="typo-eyebrow block mb-3">
            {eyebrow}
          </span>
          <h1 className="typo-page-title text-cozy-forest font-normal">
            {pageTitle}
          </h1>
          <p className="typo-body text-cozy-muted font-normal mt-4 max-w-xl mx-auto">
            {pageSubtitle}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 sm:mt-10">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`typo-nav text-xs px-5 py-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-cozy-forest text-cozy-sand shadow-md'
                      : 'bg-white text-cozy-charcoal hover:bg-cozy-creamDark border border-cozy-border'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => handleOpenLightbox(index)}
              className="group relative bg-white rounded-2xl overflow-hidden border border-cozy-border shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col"
            >
              <div className="relative overflow-hidden aspect-[4/3] bg-cozy-forestDark">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Eye className="w-5 h-5 text-white" />
                  </span>
                </div>

                <div className="absolute top-3.5 left-3.5 bg-cozy-forest/80 backdrop-blur-md text-white typo-eyebrow text-[10px] px-3 py-1 rounded-full border border-white/10">
                  <span className="text-white">{photo.categoryLabel}</span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div className="flex flex-col flex-1">
                  <h3 className="typo-card-heading text-cozy-forest font-normal mb-2 group-hover:text-cozy-sandDark transition-colors md:min-h-[3.25rem] flex items-start">
                    {photo.title}
                  </h3>
                  <p className="typo-small text-cozy-muted font-light flex-1">
                    {photo.caption}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-cozy-border flex items-center justify-between typo-eyebrow text-[11px] text-cozy-sandDark font-medium">
                  <span>View High-Res Photo</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Booking Invitation */}
        <div className="mt-16 sm:mt-24 bg-[#1E2C22] text-white rounded-3xl p-8 sm:p-14 text-center border border-[#2D3B31] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="typo-eyebrow text-cozy-sand block">
              EXPERIENCE IT IN PERSON
            </span>
            <h2 className="typo-section-heading text-white font-normal">
              Wake Up to These Mountain Vistas
            </h2>
            <p className="typo-body text-white/80 font-light">
              Double sharing at approx. ₹1,500 and triple sharing at ₹1,200 – ₹1,350 per person per night — including all four home-cooked meals every day.
            </p>
            <div className="pt-4">
              <button
                onClick={() => openBooking()}
                className="cozy-btn-sand typo-btn py-3.5 px-8 shadow-xl"
              >
                <span>Book Your Stay</span>
                <CozySparkle className="w-3.5 h-3.5 text-[#151F18]" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={handleCloseLightbox}
        >
          {/* Close Button */}
          <button
            onClick={handleCloseLightbox}
            className="absolute top-5 right-5 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-4 sm:left-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={handleNextPhoto}
            className="absolute right-4 sm:right-6 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image Container */}
          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].image}
              alt={filteredPhotos[lightboxIndex].title}
              className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
            />
            <div className="mt-4 text-center text-white max-w-2xl px-4">
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-cozy-sand block mb-1">
                {filteredPhotos[lightboxIndex].categoryLabel} · {lightboxIndex + 1} of {filteredPhotos.length}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal">
                {filteredPhotos[lightboxIndex].title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/80 font-light mt-1">
                {filteredPhotos[lightboxIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

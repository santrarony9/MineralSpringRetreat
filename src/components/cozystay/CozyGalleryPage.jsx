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
    "id": "gal-1",
    "title": "Double Sharing Bedroom with Balcony Doors",
    "category": "rooms",
    "categoryLabel": "Rooms",
    "image": "/images/mineral-springs/room-double-sharing-balcony.jpg",
    "aspect": "aspect-[16/9]",
    "caption": "Double Sharing Bedroom with Balcony Doors"
  },
  {
    "id": "gal-2",
    "title": "Retreat Main Cottage & Forest Canopy",
    "category": "property",
    "categoryLabel": "Property",
    "image": "/images/mineral-springs/retreat-main-cottage-facade.jpg",
    "aspect": "aspect-[3/4]",
    "caption": "Retreat Main Cottage & Forest Canopy"
  },
  {
    "id": "gal-3",
    "title": "Verandah with Acoustic Guitar & Valley View",
    "category": "property",
    "categoryLabel": "Property",
    "image": "/images/mineral-springs/retreat-wooden-balcony-guitar.jpg",
    "aspect": "aspect-[16/9]",
    "caption": "Verandah with Acoustic Guitar & Valley View"
  },
  {
    "id": "gal-4",
    "title": "Balcony View of Layered Himalayan Ridges",
    "category": "surroundings",
    "categoryLabel": "Surroundings",
    "image": "/images/mineral-springs/dawaipani-balcony-valley-vista.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Balcony View of Layered Himalayan Ridges"
  },
  {
    "id": "gal-5",
    "title": "Covered Porch with Vintage Lantern",
    "category": "property",
    "categoryLabel": "Property",
    "image": "/images/mineral-springs/retreat-covered-porch-lantern.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Covered Porch with Vintage Lantern"
  },
  {
    "id": "gal-6",
    "title": "Outdoor Patio Deck & Mountain Lounge",
    "category": "property",
    "categoryLabel": "Property",
    "image": "/images/mineral-springs/retreat-patio-deck-lounge.jpg",
    "aspect": "aspect-[3/4]",
    "caption": "Outdoor Patio Deck & Mountain Lounge"
  },
  {
    "id": "gal-7",
    "title": "Family Suite with Balcony Doors",
    "category": "rooms",
    "categoryLabel": "Rooms",
    "image": "/images/mineral-springs/room-group-family-suite.jpg",
    "aspect": "aspect-[16/9]",
    "caption": "Family Suite with Balcony Doors"
  },
  {
    "id": "gal-8",
    "title": "Cottages Along the Garden Slope",
    "category": "property",
    "categoryLabel": "Property",
    "image": "/images/mineral-springs/retreat-cottages-mountain-slope.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Cottages Along the Garden Slope"
  },
  {
    "id": "gal-9",
    "title": "Golden Sunset & Sea of Clouds from Balcony",
    "category": "scenery",
    "categoryLabel": "Scenery",
    "image": "/images/mineral-springs/dawaipani-balcony-sunset-clouds.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Golden Sunset & Sea of Clouds from Balcony"
  },
  {
    "id": "gal-10",
    "title": "Mineral Springs Retreat Complex & Hillside Slopes",
    "category": "stay",
    "categoryLabel": "Stay",
    "image": "/images/mineral-springs/mineral-springs-retreat-complex-facade.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Mineral Springs Retreat Complex & Hillside Slopes"
  },
  {
    "id": "gal-11",
    "title": "Mt. Kanchenjunga Sleeping Buddha over Dawaipani Ridges",
    "category": "scenery",
    "categoryLabel": "Scenery",
    "image": "/images/mineral-springs/dawaipani-kanchenjunga-snow-peaks.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Mt. Kanchenjunga Sleeping Buddha over Dawaipani Ridges"
  },
  {
    "id": "gal-12",
    "title": "Darjeeling Town Night Lights over Floating Cloud Sea",
    "category": "scenery",
    "categoryLabel": "Scenery",
    "image": "/images/mineral-springs/dawaipani-darjeeling-night-lights.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Darjeeling Town Night Lights over Floating Cloud Sea"
  },
  {
    "id": "gal-13",
    "title": "Natural Mineral Springs Mountain Waterfall",
    "category": "experiences",
    "categoryLabel": "Experiences",
    "image": "/images/mineral-springs/mineral-springs-waterfall-stream.jpg",
    "aspect": "aspect-[3/4]",
    "caption": "Natural Mineral Springs Mountain Waterfall"
  },
  {
    "id": "gal-14",
    "title": "Mindful Meditation on Mountain River Rocks",
    "category": "experiences",
    "categoryLabel": "Experiences",
    "image": "/images/mineral-springs/guest-mindfulness-mountain-river.jpg",
    "aspect": "aspect-[3/4]",
    "caption": "Mindful Meditation on Mountain River Rocks"
  },
  {
    "id": "gal-15",
    "title": "90° Drone Canopy Aerial of Retreat Cottages",
    "category": "scenery",
    "categoryLabel": "Scenery",
    "image": "/images/mineral-springs/dawaipani-drone-canopy-aerial.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "90° Drone Canopy Aerial of Retreat Cottages"
  },
  {
    "id": "gal-16",
    "title": "Golden Sunrise over Terraced Tea Garden Slopes",
    "category": "scenery",
    "categoryLabel": "Scenery",
    "image": "/images/mineral-springs/dawaipani-golden-tea-slopes-sunrise.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Golden Sunrise over Terraced Tea Garden Slopes"
  },
  {
    "id": "gal-17",
    "title": "UNESCO World Heritage DHR Steam Toy Train with Floral Garlands",
    "category": "culture",
    "categoryLabel": "Culture",
    "image": "/images/mineral-springs/darjeeling-unesco-steam-locomotive.jpg",
    "aspect": "aspect-[3/4]",
    "caption": "UNESCO World Heritage DHR Steam Toy Train with Floral Garlands"
  },
  {
    "id": "gal-18",
    "title": "Narrow-Gauge Heritage Mountain Railway Trail",
    "category": "experiences",
    "categoryLabel": "Experiences",
    "image": "/images/mineral-springs/darjeeling-toy-train-tracks.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Narrow-Gauge Heritage Mountain Railway Trail"
  },
  {
    "id": "gal-19",
    "title": "Tibetan Prayer Flags Fluttering over Hillside Grounds",
    "category": "culture",
    "categoryLabel": "Culture",
    "image": "/images/mineral-springs/dawaipani-tibetan-prayer-flags.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Tibetan Prayer Flags Fluttering over Hillside Grounds"
  },
  {
    "id": "gal-20",
    "title": "Morning Dewdrops on Organic Darjeeling Tea Leaves",
    "category": "nature",
    "categoryLabel": "Nature",
    "image": "/images/mineral-springs/darjeeling-tea-macro-dewdrops.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Morning Dewdrops on Organic Darjeeling Tea Leaves"
  },
  {
    "id": "gal-21",
    "title": "Rolling Green Contour Slopes of Darjeeling Tea Terraces",
    "category": "scenery",
    "categoryLabel": "Scenery",
    "image": "/images/mineral-springs/darjeeling-tea-gardens-panoramic.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Rolling Green Contour Slopes of Darjeeling Tea Terraces"
  },
  {
    "id": "gal-22",
    "title": "Cardamom Forest Trail Leading to Hillside Cottages",
    "category": "experiences",
    "categoryLabel": "Experiences",
    "image": "/images/mineral-springs/dawaipani-forest-trail-walk.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Cardamom Forest Trail Leading to Hillside Cottages"
  },
  {
    "id": "gal-23",
    "title": "Pine Timber Verandah & Mountain Valley Breeze",
    "category": "stay",
    "categoryLabel": "Stay",
    "image": "/images/mineral-springs/retreat-wooden-verandah-balcony.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Pine Timber Verandah & Mountain Valley Breeze"
  },
  {
    "id": "gal-24",
    "title": "Red-Roofed Eco-Cottage Surrounded by Canopy Foliage",
    "category": "stay",
    "categoryLabel": "Stay",
    "image": "/images/mineral-springs/retreat-cottage-hillside-canopy.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Red-Roofed Eco-Cottage Surrounded by Canopy Foliage"
  },
  {
    "id": "gal-25",
    "title": "Transparent Crystal Mountain Stream & Riverbed Moss",
    "category": "nature",
    "categoryLabel": "Nature",
    "image": "/images/mineral-springs/mineral-springs-crystal-stream.jpg",
    "aspect": "aspect-[3/4]",
    "caption": "Transparent Crystal Mountain Stream & Riverbed Moss"
  },
  {
    "id": "gal-26",
    "title": "Retreat Founder & Host in Homestay Studio",
    "category": "culture",
    "categoryLabel": "Culture",
    "image": "/images/mineral-springs/host-founder-portrait.jpg",
    "aspect": "aspect-[16/9]",
    "caption": "Retreat Founder & Host in Homestay Studio"
  },
  {
    "id": "gal-27",
    "title": "Warm Himalayan Hospitality - Resident Hostess",
    "category": "culture",
    "categoryLabel": "Culture",
    "image": "/images/mineral-springs/host-co-founder-portrait.jpg",
    "aspect": "aspect-[16/9]",
    "caption": "Warm Himalayan Hospitality - Resident Hostess"
  },
  {
    "id": "gal-28",
    "title": "Misty Morning Valley Drift from Room Balcony",
    "category": "scenery",
    "categoryLabel": "Scenery",
    "image": "/images/mineral-springs/dawaipani-misty-valley-morning.jpg",
    "aspect": "aspect-[4/3]",
    "caption": "Misty Morning Valley Drift from Room Balcony"
  }
];

  const getCategoryGroup = (cat = '') => {
    const c = String(cat).toLowerCase();
    if (['rooms', 'stay', 'property'].includes(c)) return 'stay';
    if (['scenery', 'surroundings', 'mountains', 'views', 'landscape'].includes(c)) return 'scenery';
    if (['experiences', 'activities', 'trails'].includes(c)) return 'experiences';
    if (['culture', 'hosts', 'heritage'].includes(c)) return 'culture';
    if (['nature', 'flora', 'streams'].includes(c)) return 'nature';
    return 'other';
  };

  const photos = (appGallery && appGallery.length > 0)
    ? appGallery.map((g, idx) => ({
        id: g.id || idx,
        title: g.title || 'Retreat View',
        category: (g.category || 'property').toLowerCase(),
        categoryLabel: g.category || 'Property & Verandahs',
        image: g.image,
        aspect: g.aspect === 'tall' ? 'aspect-[3/4]' : g.aspect === 'wide' ? 'aspect-[16/9]' : (g.aspect || 'aspect-[4/3]'),
        caption: g.altText || g.caption || g.title
      }))
    : defaultPhotos;

  const categories = [
    { id: 'all', label: `All Photos (${photos.length})` },
    { id: 'scenery', label: `Scenery & Vistas (${photos.filter(p => getCategoryGroup(p.category) === 'scenery').length})` },
    { id: 'stay', label: `Rooms & Verandahs (${photos.filter(p => getCategoryGroup(p.category) === 'stay').length})` },
    { id: 'experiences', label: `Experiences & Trails (${photos.filter(p => getCategoryGroup(p.category) === 'experiences').length})` },
    { id: 'culture', label: `Culture & Heritage (${photos.filter(p => getCategoryGroup(p.category) === 'culture').length})` },
    { id: 'nature', label: `Nature & Streams (${photos.filter(p => getCategoryGroup(p.category) === 'nature').length})` },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter(p => getCategoryGroup(p.category) === activeCategory);

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

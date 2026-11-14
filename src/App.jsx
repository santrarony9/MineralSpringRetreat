import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';

// CozyStay Luxury Mountain Components (Exact Reference Match)
import CozyHeader from './components/cozystay/CozyHeader';
import CozyHero from './components/cozystay/CozyHero';
import CozyAbout from './components/cozystay/CozyAbout';
import CozyExperiences from './components/cozystay/CozyExperiences';
import CozyFacilities from './components/cozystay/CozyFacilities';
import CozyRooms from './components/cozystay/CozyRooms';
import CozyActivities from './components/cozystay/CozyActivities';
import CozyReviews from './components/cozystay/CozyReviews';
import CozyBookingCTA from './components/cozystay/CozyBookingCTA';
import CozyFooter from './components/cozystay/CozyFooter';
import CozyDawaipani from './components/cozystay/CozyDawaipani';

// Dedicated Subpages
import CozyRoomsPage from './components/cozystay/CozyRoomsPage';
import CozyExperiencesPage from './components/cozystay/CozyExperiencesPage';
import CozyGalleryPage from './components/cozystay/CozyGalleryPage';
import CozyAboutPage from './components/cozystay/CozyAboutPage';
import CozyTravelPage from './components/cozystay/CozyTravelPage';

// Canonical SEO metadata per public page
const PAGE_SEO = {
  home: {
    title: 'Mineral Springs Retreat | Authentic Himalayan Homestay in Dawaipani, Darjeeling',
    description: 'Experience peaceful Himalayan tranquility at Mineral Springs Retreat in Dawaipani, Darjeeling. Panoramic Kanchenjunga snow peak vistas, organic farm dining, and cardamom forest trails at 6,500 ft.',
    canonical: 'https://mineralspringretreat.com/'
  },
  stay: {
    title: 'Rooms & Wooden Cottages | Mineral Springs Retreat, Dawaipani',
    description: 'Discover handcrafted pine wood bedrooms, private verandahs with Himalayan mountain vistas, and traditional eco-cottages nestled amidst Dawaipani\'s mountain slopes.',
    canonical: 'https://mineralspringretreat.com/stay'
  },
  experiences: {
    title: 'Mountain Experiences & Nature Trails | Mineral Springs Retreat',
    description: 'Explore natural mineral springs waterfalls, mindful river rock meditation, organic tea garden tastings, and UNESCO Toy Train excursions in the Darjeeling hills.',
    canonical: 'https://mineralspringretreat.com/experiences'
  },
  about: {
    title: 'Our Story & Himalayan Hosts | Mineral Springs Retreat, Dawaipani',
    description: 'Meet your local hosts and discover the heritage of Mineral Springs Retreat in Dawaipani—a sustainable Himalayan sanctuary founded on warm Gorkha hospitality.',
    canonical: 'https://mineralspringretreat.com/about'
  },
  travel: {
    title: 'Dawaipani & Darjeeling Travel Guide | Weather, How to Reach & FAQ',
    description: 'Complete travel guide for reaching Dawaipani from NJP & Bagdogra (70 km). Mountain route directions, seasonal climate guide, packing essentials, and UNESCO Toy Train history.',
    canonical: 'https://mineralspringretreat.com/travel'
  },
  gallery: {
    title: 'Photo Gallery | Scenic Vistas & Mountain Life at Mineral Springs Retreat',
    description: 'Explore authentic photographs of Mt. Kanchenjunga sunrise, rolling sea-of-clouds inversions, cozy pine cottages, and pristine mountain stream trails.',
    canonical: 'https://mineralspringretreat.com/gallery'
  },
  dawaipani: {
    title: 'About Dawaipani Hamlet | Hidden Himalayan Village Opposite Darjeeling',
    description: 'Learn about Dawaipani, the peaceful mountain hamlet renowned for medicinal mineral springs, unobstructed Kanchenjunga panoramas, and virgin pine forests.',
    canonical: 'https://mineralspringretreat.com/dawaipani'
  }
};

// Modals & Administrative CMS Overlays
import BookingModal from './components/BookingModal';
import PolicyModals from './components/PolicyModals';
import AdminPanel from './components/AdminPanel';
import GuestAuthModal from './components/cozystay/GuestAuthModal';
import MyBookingsModal from './components/cozystay/MyBookingsModal';
import { Loader2, Sparkles, X } from 'lucide-react';
import { initScrollObserver } from './utils/scrollReveal';

function MainWebsite() {
  const {
    loading, error, loadData, settings,
    previewMode, setPreviewMode, publishAllContent
  } = useApp();

  const isDirectAdmin = typeof window !== 'undefined' &&
    (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/'));

  const [activePage, setActivePage] = useState(() => {
    if (isDirectAdmin) return 'admin';
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').toLowerCase();
      if (['about', 'rooms', 'stay', 'experiences', 'travel', 'gallery', 'menus', 'dawaipani'].includes(path)) {
        return path === 'rooms' ? 'stay' : path;
      }
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'about', 'rooms', 'stay', 'experiences', 'travel', 'gallery', 'menus', 'dawaipani', 'admin'].includes(hash)) {
        return hash === 'rooms' ? 'stay' : hash;
      }
    }
    return 'home';
  });

  const handleNavigate = (page) => {
    const normalizedPage = page === 'rooms' ? 'stay' : page;
    setActivePage(normalizedPage);
    if (normalizedPage === 'admin') {
      window.location.hash = 'admin';
    } else if (normalizedPage === 'home') {
      if (window.location.hash) window.location.hash = '';
      if (window.location.pathname !== '/') window.history.pushState(null, '', '/');
    } else {
      window.history.pushState(null, '', `/${normalizedPage}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with browser navigation (popstate & hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '').toLowerCase();
      if (['about', 'rooms', 'stay', 'experiences', 'travel', 'gallery', 'menus', 'dawaipani'].includes(path)) {
        setActivePage(path === 'rooms' ? 'stay' : path);
        window.scrollTo(0, 0);
        return;
      }
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'about', 'rooms', 'stay', 'experiences', 'travel', 'gallery', 'menus', 'dawaipani', 'admin'].includes(hash)) {
        setActivePage(hash === 'rooms' ? 'stay' : hash);
      } else if (!hash) {
        if (!isDirectAdmin) setActivePage('home');
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [isDirectAdmin]);

  // Dynamic Document SEO (Title, Meta Description, Canonical Link)
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const seo = PAGE_SEO[activePage] || PAGE_SEO.home;
    document.title = seo.title;

    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', seo.description);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', seo.canonical);

    // Update OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', seo.description);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', seo.canonical);
  }, [activePage]);

  useEffect(() => {
    const cleanup = initScrollObserver();
    return cleanup;
  }, [activePage, loading]);

  useEffect(() => {
    if (!loading && (window.location.hash === '#reviews' || window.location.hash === '#dawaipani')) {
      const targetId = window.location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const header = document.querySelector('header');
          const offset = header ? header.offsetHeight + 24 : 110;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-6 text-white select-none">
        <Loader2 className="w-10 h-10 text-[#B89D77] animate-spin mb-4" />
        <h2 className="font-roman text-2xl font-light tracking-[0.16em] uppercase text-white">
          {settings?.homestayName || 'MINERAL SPRINGS RETREAT'}
        </h2>
        <p className="text-xs font-sans text-white/50 uppercase tracking-[0.22em] mt-2">
          DAWAIPANI · DARJEELING HILLS
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center p-6 text-white text-center max-w-md mx-auto select-none">
        <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-4 text-[#B89D77] font-bold">
          !
        </div>
        <h2 className="font-roman text-2xl font-normal mb-2 uppercase">Connection Notice</h2>
        <p className="font-sans text-xs text-white/70 mb-6">{error}</p>
        <button
          onClick={loadData}
          className="cozy-btn-gold text-xs tracking-wider"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // If visiting /admin directly or #admin
  if (isDirectAdmin || activePage === 'admin') {
    return (
      <AdminPanel
        isStandalone={true}
        onClose={() => {
          if (isDirectAdmin) window.location.href = '/';
          else handleNavigate('home');
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-white text-[#1A1A1A] selection:bg-[#B89D77] selection:text-white">
      
      {/* Draft Preview Mode Warning Bar (Phase 11) */}
      {previewMode && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-600 text-white px-4 py-2.5 text-xs flex items-center justify-between font-sans shadow-lg select-none">
          <div className="flex items-center space-x-2">
            <span className="font-bold uppercase tracking-wider">✦ DRAFT PREVIEW MODE ACTIVE:</span>
            <span className="hidden sm:inline">Viewing unpublished website content.</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={publishAllContent}
              className="px-3 py-1 bg-white text-amber-900 rounded font-semibold text-[11px] uppercase tracking-wider hover:bg-white/90 shadow-sm"
            >
              Publish Live
            </button>
            <button
              onClick={() => setPreviewMode(false)}
              className="underline text-[11px] uppercase tracking-wider hover:text-white/80"
            >
              Exit Preview
            </button>
          </div>
        </div>
      )}

      {/* 1. Exact CozyStay Header */}
      <CozyHeader activePage={activePage} setActivePage={handleNavigate} />

      {/* Conditional Subpage / Homepage Render */}
      {activePage === 'home' && (
        <main>
          {/* 2. Exact CozyStay Cinematic Hero with Bottom Stats Row */}
          <CozyHero setActivePage={handleNavigate} />

          {/* 3. Exact CozyStay Introduction with Centered Statement & 3-Image Carousel */}
          <CozyAbout setActivePage={handleNavigate} />

          {/* 4. Exact CozyStay Experiences with Staggered 4-Card Inset-Frame Layout */}
          <CozyExperiences setActivePage={handleNavigate} />

          {/* 5. Exact CozyStay Essentials: 2-Column Icon Grid + Paired Photography */}
          <CozyFacilities />

          {/* 6. Exact CozyStay Accommodation: Room Slider with Specs Bar + Horizontal Booking Bar */}
          <CozyRooms setActivePage={handleNavigate} />

          {/* 7. Exact CozyStay Activities & Lifestyle: 3 Editorial Cards with Inset Frames */}
          <CozyActivities setActivePage={handleNavigate} />

          {/* 7A. Complete About Dawaipani Editorial Section */}
          <CozyDawaipani setActivePage={handleNavigate} />

          {/* 7B. Verified Google Guest Reviews Fold */}
          <CozyReviews />

          {/* 8. Exact CozyStay Booking CTA: Evening Panorama + Poetic Statement + Booking Bar */}
          <CozyBookingCTA />
        </main>
      )}

      {(activePage === 'stay' || activePage === 'rooms') && (
        <main>
          <CozyRoomsPage setActivePage={handleNavigate} />
        </main>
      )}

      {(activePage === 'experiences' || activePage === 'menus') && (
        <main>
          <CozyExperiencesPage setActivePage={handleNavigate} />
        </main>
      )}

      {activePage === 'gallery' && (
        <main>
          <CozyGalleryPage setActivePage={handleNavigate} />
        </main>
      )}

      {activePage === 'about' && (
        <main>
          <CozyAboutPage setActivePage={handleNavigate} />
        </main>
      )}

      {activePage === 'travel' && (
        <main>
          <CozyTravelPage setActivePage={handleNavigate} />
        </main>
      )}

      {activePage === 'dawaipani' && (
        <main>
          <CozyDawaipani standalone={true} setActivePage={handleNavigate} />
        </main>
      )}

      {/* 9. Exact CozyStay Footer: 3 Multi-Columns + Bottom Policies & Floating Up Button */}
      <CozyFooter setActivePage={handleNavigate} />

      {/* Interactive Booking Modal */}
      <BookingModal />

      {/* Guest Authentication & Bookings Area */}
      <GuestAuthModal />
      <MyBookingsModal />

      {/* Policy Modals */}
      <PolicyModals />

      {/* Admin Panel Modal Overlay */}
      <AdminPanel />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainWebsite />
    </AppProvider>
  );
}

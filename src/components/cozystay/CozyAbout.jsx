import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultImages = [
  {
    src: '/images/mineral-springs/mineral-springs-retreat-complex-facade.jpg',
    alt: 'Mineral Springs Retreat complex facade overlooking lush valley and misty hills',
    caption: 'Retreat Complex & Mountain View'
  },
  {
    src: '/images/mineral-springs/retreat-wooden-verandah-balcony.jpg',
    alt: 'Peaceful timber verandah and covered balcony overlooking misty valley',
    caption: 'Verandah Overlooking the Valley'
  },
  {
    src: '/images/mineral-springs/retreat-cottage-hillside-canopy.jpg',
    alt: 'Retreat cottage terrace perched high on hillside surrounded by pine canopy',
    caption: 'Cottages Along the Pine Canopy'
  },
  {
    src: '/images/mineral-springs/retreat-main-cottage-facade.jpg',
    alt: 'Mineral Springs Retreat wooden cottage with lace trim nestled in pine hills',
    caption: 'Main Mountain Cottage Facade'
  },
  {
    src: '/images/mineral-springs/retreat-patio-deck-lounge.jpg',
    alt: 'Outdoor timber patio deck with cushioned lounge seating',
    caption: 'Patio Deck & Fireside Lounge'
  }
];

export default function CozyAbout({ setActivePage }) {
  const { pages } = useApp();
  const introData = pages?.home?.intro;
  const eyebrow = introData?.eyebrow || 'HIMALAYAN SERENITY MEETS RUSTIC COMFORT';
  const heading = introData?.heading || 'Mineral Springs Retreat in the heart of the mountains is an authentic sanctuary offering simple, clean accommodations with unrivaled tea garden walks and valley peace.';
  const paragraph = introData?.paragraph || 'Perched at 6,500 feet in the serene village of Dawaipani, overlooking Mount Kanchenjunga and the expansive Lebong tea gardens. Unwind in quiet rustic rooms, savor traditional home-cooked meals, and experience the spellbinding afternoon clouds drifting through your private balcony.';
  const images = (introData?.images && introData.images.length > 0) ? introData.images : defaultImages;

  // Extended clones array: 5 clones before + 5 real + 5 clones after = 15 items
  // Ensures 100% seamless, infinite looping without blank spaces or sudden jumps
  const extendedImages = [
    ...images.map((img, i) => ({ ...img, uniqueId: `clone-pre-${i}` })),
    ...images.map((img, i) => ({ ...img, uniqueId: `real-${i}` })),
    ...images.map((img, i) => ({ ...img, uniqueId: `clone-post-${i}` }))
  ];

  const [currentIndex, setCurrentIndex] = useState(images.length); // starts at index 5 (real image 0)
  const [visibleCount, setVisibleCount] = useState(3);
  const [enableTransition, setEnableTransition] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isTouching, setIsTouching] = useState(false);

  const isAnimating = useRef(false);
  const animationSafetyTimeout = useRef(null);
  const autoplayTimerRef = useRef(null);
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  // Touch and mouse swipe states
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndX = useRef(null);
  const touchEndY = useRef(null);
  const isDragging = useRef(false);
  const mouseStartX = useRef(null);
  const minSwipeThreshold = 40;

  // Responsive visible count: Desktop = 3, Tablet = 2, Mobile = 1
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload genuine images
  useEffect(() => {
    images.forEach((img) => {
      const pic = new Image();
      pic.src = img.src;
    });
  }, []);

  // Tab visibility listener
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Reduced motion preference
  const prefersReduced = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced.current = mq.matches;
    const handler = (e) => {
      prefersReduced.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Slide navigation handlers with safety timeout
  const handleNext = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev + 1);

    clearTimeout(animationSafetyTimeout.current);
    animationSafetyTimeout.current = setTimeout(() => {
      isAnimating.current = false;
    }, 1100);
  }, []);

  const handlePrev = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setEnableTransition(true);
    setCurrentIndex((prev) => prev - 1);

    clearTimeout(animationSafetyTimeout.current);
    animationSafetyTimeout.current = setTimeout(() => {
      isAnimating.current = false;
    }, 1100);
  }, []);

  const onManualNext = () => {
    handleNext();
    resetAutoplayTimer();
  };

  const onManualPrev = () => {
    handlePrev();
    resetAutoplayTimer();
  };

  const handleDotClick = (dotIdx) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setEnableTransition(true);
    setCurrentIndex(images.length + dotIdx);
    resetAutoplayTimer();

    clearTimeout(animationSafetyTimeout.current);
    animationSafetyTimeout.current = setTimeout(() => {
      isAnimating.current = false;
    }, 1100);
  };

  // Seamless infinite loop on transition end
  const handleTransitionEnd = (e) => {
    if (e.target !== trackRef.current || e.propertyName !== 'transform') return;
    clearTimeout(animationSafetyTimeout.current);

    if (currentIndex >= images.length * 2) {
      // Reached the clones at end -> snap back to corresponding real item without animation
      setEnableTransition(false);
      const resetIdx = currentIndex - images.length;
      setCurrentIndex(resetIdx);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          isAnimating.current = false;
        });
      });
    } else if (currentIndex < images.length) {
      // Reached the clones at start -> snap to corresponding real item without animation
      setEnableTransition(false);
      const resetIdx = currentIndex + images.length;
      setCurrentIndex(resetIdx);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          isAnimating.current = false;
        });
      });
    } else {
      isAnimating.current = false;
    }
  };

  // Autoplay management: advances every 4 seconds, pausing on hover/tab hidden/touch
  const stopAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!isHovered && isTabVisible && !isTouching && !prefersReduced.current) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 4000);
    }
  }, [isHovered, isTabVisible, isTouching, handleNext, stopAutoplay]);

  const resetAutoplayTimer = () => {
    startAutoplay();
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  // Native hover listener on container to ensure desktop hover always pauses reliably
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onEnter = () => setIsHovered(true);
    const onLeave = () => {
      setIsHovered(false);
      setIsTouching(false);
      isDragging.current = false;
      mouseStartX.current = null;
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setIsTouching(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current !== null && touchEndY.current !== null
      ? Math.abs(touchStartY.current - touchEndY.current)
      : 0;

    if (Math.abs(diffX) > diffY && Math.abs(diffX) > minSwipeThreshold) {
      if (diffX > 0) {
        onManualNext();
      } else {
        onManualPrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    touchEndY.current = null;
  };

  // Mouse drag support for desktop/trackpad
  const handleMouseDown = (e) => {
    setIsTouching(true);
    isDragging.current = true;
    mouseStartX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    setIsTouching(false);
    if (!isDragging.current || mouseStartX.current === null) return;
    const diffX = mouseStartX.current - e.clientX;
    if (Math.abs(diffX) > minSwipeThreshold) {
      if (diffX > 0) {
        onManualNext();
      } else {
        onManualPrev();
      }
    }
    isDragging.current = false;
    mouseStartX.current = null;
  };

  // Active dot index calculation
  const activeDot = ((currentIndex - images.length) % images.length + images.length) % images.length;

  return (
    <section id="introduction" className="py-24 sm:py-32 lg:py-36 bg-white select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Introduction Text */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <span className="typo-eyebrow block mb-4 reveal-init">
            {eyebrow}
          </span>
          
          {/* Main Section Heading: 44–54px (Desktop), Line-height: 1.15–1.25 */}
          <h2 className="typo-section-heading text-[#1A1A1A] font-light mb-6 reveal-init reveal-delay-1">
            {heading}
          </h2>

          <p className="typo-body text-[#555D56] max-w-2xl mx-auto font-light reveal-init reveal-delay-2">
            {paragraph}
          </p>
        </div>

        {/* Completely Borderless Nature Photography Carousel with Seamless Infinite Autoplay */}
        <div
          ref={containerRef}
          className="relative w-full reveal-init reveal-delay-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsTouching(false);
            isDragging.current = false;
            mouseStartX.current = null;
          }}
        >
          
          {/* Slider Container with Touch Swipe & Mouse Drag Support */}
          <div
            className="overflow-hidden w-full touch-pan-y cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <div
              ref={trackRef}
              className="flex -mx-1.5 sm:-mx-2 md:-mx-2.5 will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                transition: enableTransition ? 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedImages.map((img) => (
                <div
                  key={img.uniqueId}
                  className="flex-shrink-0 px-1.5 sm:px-2 md:px-2.5"
                  style={{ width: `${100 / visibleCount}%` }}
                >
                  {/* Completely Borderless Card: 0 radius, 0 shadow, 0 border, 0 frame */}
                  <div className="relative overflow-hidden aspect-[4/5] w-full rounded-none border-0 shadow-none outline-none group bg-neutral-900">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover rounded-none border-0 shadow-none outline-none transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none"
                      loading="lazy"
                      draggable="false"
                    />

                    {/* Subtle Dark Gradient Overlay for Crisp Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none rounded-none border-0 shadow-none" />

                    {/* Bottom Text Overlay */}
                    <div className="absolute bottom-5 sm:bottom-6 left-5 sm:left-6 right-5 sm:right-6 text-white pointer-events-none z-10">
                      <span className="typo-eyebrow text-[#B89D77] block mb-1 font-medium">
                        DAWAIPANI SCENERY
                      </span>
                      <p className="typo-card-heading text-white font-normal">
                        {img.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Navigation Arrow */}
          <button
            onClick={onManualPrev}
            className="absolute left-2 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white/95 hover:bg-[#111111] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-colors duration-200 z-20 focus:outline-none rounded-full shadow-sm"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Navigation Arrow */}
          <button
            onClick={onManualNext}
            className="absolute right-2 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white/95 hover:bg-[#111111] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-colors duration-200 z-20 focus:outline-none rounded-full shadow-sm"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Pagination Indicators */}
          <div className="flex items-center justify-center space-x-2 mt-8">
            {images.map((_, dot) => (
              <button
                key={dot}
                onClick={() => handleDotClick(dot)}
                className={`h-2 transition-all duration-300 rounded-full focus:outline-none ${
                  activeDot === dot ? 'bg-[#B89D77] w-6' : 'bg-[#D1C7BA] hover:bg-[#B89D77]/60 w-2'
                }`}
                aria-label={`Go to slide ${dot + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

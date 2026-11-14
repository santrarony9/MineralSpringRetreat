import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Premium Stacking Cards Scroll Engine
 * 
 * Provides hardware-accelerated, natural scroll-based stacking card animations:
 * - Uses CSS position: sticky for solid native browser layout positioning.
 * - Progressively overlaps cards with distinct z-indices and calculated sticky tops.
 * - Dynamically computes the overlap factor of succeeding cards to gently scale down
 *   underlying cards (e.g. from 1.0 -> 0.96 -> 0.92) with authentic optical depth.
 * - Automatically adjusts base top and stacking step offsets for Desktop, Tablet, and Mobile.
 * - Respects prefers-reduced-motion for complete accessibility.
 */

export function StackingCardsContainer({
  children,
  className = '',
  baseTopDesktop = 112,
  baseTopTablet = 86,
  baseTopMobile = 74,
  stepDesktop = 14,
  stepTablet = 10,
  stepMobile = 8,
  gapDesktop = 56,
  gapTablet = 40,
  gapMobile = 28
}) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [offsets, setOffsets] = useState({
    baseTop: baseTopDesktop,
    step: stepDesktop,
    gap: gapDesktop,
    scaleStep: 0.035
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rafId = useRef(null);

  // Responsive breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setOffsets({
          baseTop: baseTopMobile,
          step: stepMobile,
          gap: gapMobile,
          scaleStep: 0.02
        });
      } else if (width < 1024) {
        setOffsets({
          baseTop: baseTopTablet,
          step: stepTablet,
          gap: gapTablet,
          scaleStep: 0.025
        });
      } else {
        setOffsets({
          baseTop: baseTopDesktop,
          step: stepDesktop,
          gap: gapDesktop,
          scaleStep: 0.035
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [baseTopDesktop, baseTopTablet, baseTopMobile, stepDesktop, stepTablet, stepMobile, gapDesktop, gapTablet, gapMobile]);

  // Reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update card transform scales on scroll
  const updateCardTransforms = useCallback(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const cards = cardRefs.current.filter(Boolean);
    const total = cards.length;
    if (total <= 1) return;

    const { baseTop, step, scaleStep } = offsets;

    // Calculate overlap and scale for each card
    for (let i = 0; i < total; i++) {
      const currentCard = cards[i];
      if (!currentCard) continue;

      const currentStickyTop = baseTop + i * step;

      // Count how many subsequent cards are currently stacked on top of card i
      let totalOverlap = 0;

      for (let j = i + 1; j < total; j++) {
        const nextCard = cards[j];
        if (!nextCard) continue;

        const nextRect = nextCard.getBoundingClientRect();
        const nextTargetTop = baseTop + j * step;

        // Transition window: card j is moving from (nextTargetTop + 350px) down to nextTargetTop
        const transitionRange = Math.min(380, Math.max(200, nextRect.height * 0.7));
        const distanceToTarget = nextRect.top - nextTargetTop;

        if (distanceToTarget < transitionRange) {
          const progress = Math.max(0, Math.min(1, 1 - (distanceToTarget / transitionRange)));
          totalOverlap += progress;
        }
      }

      // Compute scale: smoothly scales down as cards stack on top
      const targetScale = Math.max(0.88, 1 - (totalOverlap * scaleStep));
      // Subtle depth darkening: from 0 up to 0.15
      const scrimOpacity = Math.min(0.18, totalOverlap * 0.07);

      // Apply transform and scrim opacity to inner element
      const inner = currentCard.querySelector('.stacking-card-inner');
      const scrim = currentCard.querySelector('.stacking-card-scrim');

      if (inner) {
        inner.style.transform = `scale(${targetScale.toFixed(4)})`;
        // Deepen shadow as cards layer
        if (totalOverlap > 0.05) {
          inner.style.boxShadow = `0 -2px 14px rgba(0,0,0,0.04), 0 ${Math.round(14 + totalOverlap * 10)}px ${Math.round(36 + totalOverlap * 14)}px -10px rgba(27,36,30,${(0.12 + totalOverlap * 0.05).toFixed(3)})`;
        } else {
          inner.style.boxShadow = '';
        }
      }

      if (scrim) {
        scrim.style.opacity = scrimOpacity.toFixed(3);
      }
    }
  }, [offsets, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        updateCardTransforms();
        rafId.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger initial calculation
    updateCardTransforms();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [updateCardTransforms, prefersReducedMotion]);

  // Clone children to inject index, total, and ref
  const childrenArray = React.Children.toArray(children);
  const totalCards = childrenArray.length;

  return (
    <div
      ref={containerRef}
      className={`stacking-cards-container relative w-full ${className}`}
      style={{
        '--stack-base-top': `${offsets.baseTop}px`,
        '--stack-step': `${offsets.step}px`,
        '--stack-gap': `${offsets.gap}px`
      }}
    >
      {childrenArray.map((child, idx) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          index: idx,
          total: totalCards,
          ref: (el) => { cardRefs.current[idx] = el; },
          offsets
        });
      })}
    </div>
  );
}

/**
 * Individual Stacking Card Wrapper
 */
export const StackingCard = React.forwardRef(function StackingCard(
  {
    children,
    index = 0,
    total = 1,
    className = '',
    innerClassName = '',
    offsets = {},
    ...props
  },
  ref
) {
  const isLast = index === total - 1;
  const baseTop = offsets.baseTop ?? 112;
  const step = offsets.step ?? 14;
  const gap = offsets.gap ?? 56;

  const stickyTop = baseTop + index * step;
  const zIndex = 10 + index;

  return (
    <div
      ref={ref}
      className={`stacking-card-item relative w-full ${className}`}
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        zIndex,
        marginBottom: isLast ? 0 : `${gap}px`
      }}
      {...props}
    >
      {/* Inner scaling container with origin top center */}
      <div
        className={`stacking-card-inner relative w-full will-change-transform ${innerClassName}`}
        style={{
          transformOrigin: 'top center',
          transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease'
        }}
      >
        {children}

        {/* Ambient Dark Scrim for Layer Depth */}
        <div
          className="stacking-card-scrim absolute inset-0 bg-black pointer-events-none rounded-3xl transition-opacity duration-200"
          style={{ opacity: 0 }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
});

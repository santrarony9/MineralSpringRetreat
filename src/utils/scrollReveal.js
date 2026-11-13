/**
 * CozyStay Scroll Reveal Engine
 * Automatically observes elements with `.reveal-init` and triggers
 * smooth hardware-accelerated entrance animations with stagger support.
 */
export function initScrollObserver() {
  if (typeof window === 'undefined') return () => {};

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal-init').forEach((el) => {
      el.classList.add('reveal-active');
    });
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  const observeElements = () => {
    document.querySelectorAll('.reveal-init:not(.reveal-active)').forEach((el) => {
      observer.observe(el);
    });
  };

  observeElements();

  // Watch for subpage navigation / DOM updates
  const mutationObserver = new MutationObserver(() => {
    observeElements();
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    mutationObserver.disconnect();
  };
}

'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 760px)');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal, .company-pages .service-card, .company-pages .value-item, .company-pages .office-card, .company-pages .about-story > div, .company-pages .about-specialism > *, .company-pages .page-cta'));
    const revealed = new WeakSet<Element>();
    let observer: IntersectionObserver | undefined;

    function show(element: HTMLElement) {
      revealed.add(element);
      if (mobile.matches) element.dataset.scrollReveal = 'shown';
      else element.classList.add('is-visible');
    }

    function observe() {
      observer?.disconnect();
      observer = undefined;
      if (reducedMotion.matches || !('IntersectionObserver' in window)) {
        targets.forEach(element => { element.dataset.scrollReveal = 'shown'; });
        return;
      }
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        show(entry.target as HTMLElement);
        observer?.unobserve(entry.target);
      }), { threshold: .03, rootMargin: '0px 0px -16px 0px' });

      // Read positions once, before setting reveal styles. Above-fold content stays visible.
      const positions = targets.map(element => element.getBoundingClientRect());
      targets.forEach((element, index) => {
        const position = positions[index];
        if (revealed.has(element) || (position.top < innerHeight && position.bottom > 0)) {
          revealed.add(element);
          element.dataset.scrollReveal = 'shown';
          return;
        }
        if (mobile.matches) element.dataset.scrollReveal = 'pending';
        else delete element.dataset.scrollReveal;
        observer?.observe(element);
      });
    }

    observe();
    reducedMotion.addEventListener('change', observe);
    mobile.addEventListener('change', observe);
    return () => {
      observer?.disconnect();
      reducedMotion.removeEventListener('change', observe);
      mobile.removeEventListener('change', observe);
      targets.forEach(element => { delete element.dataset.scrollReveal; });
    };
  }, [pathname]);

  return null;
}

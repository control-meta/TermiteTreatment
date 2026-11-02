'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { home2Reviews } from './content';
import styles from './home2.module.css';

export default function ReviewsCarousel() {
  const viewport = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const cycle = useRef(0);
  const hovering = useRef(false);
  const touching = useRef(false);
  const navigating = useRef(false);
  const reducedMotion = useRef(false);
  const [allowMotion, setAllowMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reducedMotion.current = media.matches; setAllowMotion(!media.matches); };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = viewport.current;
    const original = group.current;
    if (!el || !original) return;
    const measure = () => {
      const previous = cycle.current;
      const progress = previous ? (el.scrollLeft % previous) / previous : 0;
      cycle.current = original.getBoundingClientRect().width;
      el.scrollLeft = cycle.current * (1 + progress);
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(original);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el || !allowMotion) return;
    let frame = 0;
    let previous = 0;
    let visible = false;
    let offset = el.scrollLeft;
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
    observer.observe(el);
    const tick = (now: number) => {
      const elapsed = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      if (visible && !document.hidden && !hovering.current && !touching.current && !navigating.current && cycle.current) {
        // Keep fractional pixels between frames for smooth motion on high-refresh screens.
        if (Math.abs(el.scrollLeft - offset) > 2) offset = el.scrollLeft;
        offset += elapsed * .026;
        if (offset >= cycle.current * 2) offset -= cycle.current;
        el.scrollLeft = offset;
      } else {
        offset = el.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [allowMotion]);

  function move(direction: number) {
    const el = viewport.current;
    const card = group.current?.querySelector('figure');
    if (!el || !card) return;
    const step = card.getBoundingClientRect().width + 18;
    const target = direction > 0 ? Math.floor(el.scrollLeft / step + 1) * step : Math.ceil(el.scrollLeft / step - 1) * step;
    navigating.current = !reducedMotion.current;
    el.scrollTo({ left: target, behavior: reducedMotion.current ? 'instant' : 'smooth' });
  }

  function normalize() {
    const el = viewport.current;
    const width = cycle.current;
    if (!el || !width || touching.current) return;
    if (el.scrollLeft < width * .5) el.scrollLeft += width;
    else if (el.scrollLeft > width * 2.5) el.scrollLeft -= width;
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  }

  return <section className={`${styles.shell} ${styles.reviews}`} id="reviews" aria-labelledby="home2-reviews-title" aria-roledescription="carousel">
    <h2 className={styles.ruledTitle} id="home2-reviews-title"><span>What Our Customers Say</span></h2>
    <div className={styles.reviewStage}
      onPointerEnter={event => { if (event.pointerType === 'mouse') hovering.current = true; }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') hovering.current = false; }}>
    <div className={styles.reviewViewport} id="home2-review-track" ref={viewport} tabIndex={0} role="group" aria-label="Reviews. Swipe or use the left and right arrow keys to browse."
      onTouchStart={() => { touching.current = true; navigating.current = false; }}
      onTouchEnd={() => { touching.current = false; }} onTouchCancel={() => { touching.current = false; }}
      onScroll={normalize} onScrollEnd={() => { navigating.current = false; }} onKeyDown={keyboard}>
      <div className={styles.reviewTrack}>{[0, 1, 2].map(copy => <div className={styles.reviewGroup} key={copy} ref={copy === 1 ? group : undefined} aria-hidden={copy !== 1 || undefined}>
        {home2Reviews.map((review, index) => <figure key={review.name} className={`${styles.review} ${styles.carouselCard}`}>
          <div className={styles.reviewBody}>{review.sample && <span className={styles.sampleReview}>Sample review</span>}<blockquote>“{review.quote}”</blockquote></div>
          <div className={styles.reviewPerson}><span className={styles.avatar} data-tone={index % 3} aria-hidden="true">{review.initials}</span><figcaption><strong>{review.name}</strong><span>{review.city}</span></figcaption><span className={styles.stars} aria-label={`${review.sample ? 'Sample rating: ' : ''}5 out of 5 stars`}>{Array.from({ length: 5 }, (_, star) => <Star key={star} size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />)}</span></div>
        </figure>)}
      </div>)}</div>
    </div>
      <button className={`${styles.reviewArrow} ${styles.reviewPrevious}`} type="button" onClick={() => move(-1)} aria-label="Previous review" aria-controls="home2-review-track"><ArrowLeft size={19} aria-hidden="true" /></button>
      <button className={`${styles.reviewArrow} ${styles.reviewNext}`} type="button" onClick={() => move(1)} aria-label="Next review" aria-controls="home2-review-track"><ArrowRight size={19} aria-hidden="true" /></button>
    </div>
  </section>;
}

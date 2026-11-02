'use client';

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Phone, Star } from 'lucide-react';
import { company } from '../lib/company';
import { locationReviews } from '../lib/location-reviews';
import styles from './LocationReviewsCarousel.module.css';

export default function LocationReviewsCarousel() {
  const viewport = useRef<HTMLDivElement>(null);
  const active = useRef(0);
  const hovering = useRef(false);
  const touching = useRef(false);
  const visible = useRef(false);
  const reducedMotion = useRef(false);
  const resumeAutoplay = useRef(() => {});
  const [current, setCurrent] = useState(0);

  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const measure = () => { el.scrollLeft = (locationReviews.length + active.current) * el.getBoundingClientRect().width; };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { reducedMotion.current = media.matches; };
    updateMotion();
    media.addEventListener('change', updateMotion);
    const observer = new IntersectionObserver(entries => { visible.current = entries[0].isIntersecting; });
    observer.observe(el);
    const advance = () => {
      if (!reducedMotion.current && visible.current && !document.hidden && !hovering.current && !touching.current) {
        const width = el.getBoundingClientRect().width;
        const next = Math.round(el.scrollLeft / width) + 1;
        el.scrollTo({ left: next * width, behavior: 'smooth' });
      }
    };
    let timer = window.setInterval(advance, 5000);
    resumeAutoplay.current = () => {
      window.clearInterval(timer);
      advance();
      timer = window.setInterval(advance, 5000);
    };
    return () => { window.clearInterval(timer); resumeAutoplay.current = () => {}; observer.disconnect(); media.removeEventListener('change', updateMotion); };
  }, []);

  function move(direction: number) {
    const el = viewport.current;
    if (!el) return;
    const width = el.getBoundingClientRect().width;
    const next = Math.round(el.scrollLeft / width) + direction;
    el.scrollTo({ left: next * width, behavior: reducedMotion.current ? 'instant' : 'smooth' });
  }

  function updateCurrent() {
    const el = viewport.current;
    if (!el || !el.clientWidth) return;
    active.current = Math.round(el.scrollLeft / el.getBoundingClientRect().width) % locationReviews.length;
    setCurrent(active.current);
  }

  function normalize() {
    const el = viewport.current;
    if (!el || touching.current) return;
    const cycle = el.getBoundingClientRect().width * locationReviews.length;
    if (el.scrollLeft < cycle - 1) el.scrollLeft += cycle;
    else if (el.scrollLeft >= cycle * 2 - 1) el.scrollLeft -= cycle;
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? -1 : 1);
  }

  return <aside className={styles.card} aria-labelledby="location-reviews-title" aria-roledescription="carousel">
    <header><h2 id="location-reviews-title">What Our Customers Say</h2><p className={styles.preview}>Preview reviews · Awaiting approved feedback</p></header>
    <div className={styles.stage}
      onPointerEnter={event => { if (event.pointerType === 'mouse') hovering.current = true; }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') { hovering.current = false; resumeAutoplay.current(); } }}>
      <div className={styles.viewport} ref={viewport} id="location-review-track" tabIndex={0} role="group" aria-label="Five preview reviews. Swipe or use the left and right arrow keys."
        onScroll={updateCurrent} onScrollEnd={normalize} onKeyDown={keyboard}
        onTouchStart={() => { touching.current = true; }} onTouchEnd={() => { touching.current = false; }} onTouchCancel={() => { touching.current = false; }}>
        <div className={styles.track}>{[0, 1, 2].flatMap(copy => locationReviews.map((review, index) => <figure className={styles.slide} key={`${copy}-${review.name}`} aria-hidden={copy !== 1 || undefined}>
          <div className={styles.stars} aria-label="Sample rating: five out of five stars">{Array.from({ length: 5 }, (_, star) => <Star key={star} size={17} fill="currentColor" strokeWidth={0} aria-hidden="true" />)}</div>
          <blockquote>“{review.text}”</blockquote>
          <figcaption><span className={styles.avatar} data-tone={index % 3} aria-hidden="true">{review.initials}</span><div><strong>{review.name}</strong><span>{review.service}</span></div></figcaption>
        </figure>))}</div>
      </div>
      <button className={`${styles.arrow} ${styles.previous}`} type="button" aria-label="Previous review" aria-controls="location-review-track" onClick={() => move(-1)}><ArrowLeft size={17} aria-hidden="true" /></button>
      <button className={`${styles.arrow} ${styles.next}`} type="button" aria-label="Next review" aria-controls="location-review-track" onClick={() => move(1)}><ArrowRight size={17} aria-hidden="true" /></button>
    </div>
    <footer><span className={styles.counter} aria-label={`Review ${current + 1} of ${locationReviews.length}`}>{String(current + 1).padStart(2, '0')} / {String(locationReviews.length).padStart(2, '0')}</span><a href={company.telephone}><Phone size={14} aria-hidden="true" />Talk to our team <ArrowRight size={15} aria-hidden="true" /></a></footer>
  </aside>;
}

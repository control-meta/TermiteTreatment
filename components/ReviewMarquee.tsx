'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import styles from './ReviewMarquee.module.css';

// Temporary examples. Replace with customer-approved reviews before publication.
const reviews = [
  { name: 'Asha M.', initials: 'AM', service: 'Residential termite care', text: 'The inspection helped us understand what was happening behind our wooden cupboards. The team explained the treatment clearly and left everything tidy.' },
  { name: 'Rahul S.', initials: 'RS', service: 'Commercial termite care', text: 'We needed a plan that worked around our office hours. Communication was straightforward, and the visit was organised with very little disruption.' },
  { name: 'Neha P.', initials: 'NP', service: 'Pre-construction treatment', text: 'We wanted to think about termite protection while building our home. Having the steps and timing explained made planning much easier.' },
  { name: 'Vikram K.', initials: 'VK', service: 'Post-construction treatment', text: 'After noticing mud tubes near a door frame, we finally knew where to start. We appreciated the careful inspection and the practical aftercare advice.' },
  { name: 'Meera R.', initials: 'MR', service: 'Annual maintenance', text: 'Regular checks give us one less thing to keep track of. It is reassuring to have someone explain what to watch for between visits.' },
];

export default function ReviewMarquee({ onInspect }: { onInspect: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideFrame = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; offset: number; horizontal: boolean; animation: Animation; startTime: number; duration: number; groupWidth: number; step: number; lastAt: number; lastOffset: number; velocity: number } | null>(null);

  useEffect(() => {
    const viewport = trackRef.current?.parentElement;
    if (!viewport) return;
    let intersecting = false;
    const update = () => setInView(intersecting && !document.hidden);
    const observer = new IntersectionObserver(entries => { intersecting = entries[0].isIntersecting; update(); });
    observer.observe(viewport);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      if (slideFrame.current !== null) cancelAnimationFrame(slideFrame.current);
    };
  }, []);

  function slideBy(pixels: number) {
    if (slideFrame.current !== null) {
      cancelAnimationFrame(slideFrame.current);
      slideFrame.current = null;
    }
    const track = trackRef.current;
    const group = track?.firstElementChild;
    if (!track || !group || Math.abs(pixels) < .5) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.parentElement?.scrollBy({ left: pixels, behavior: 'instant' });
      return;
    }
    const animation = track.getAnimations()[0];
    const duration = Number(animation?.effect?.getTiming().duration);
    if (!animation || !duration) return;
    const currentTime = Number(animation.currentTime) || 0;
    const distance = pixels / group.getBoundingClientRect().width * duration;
    const startedAt = performance.now();
    const settleDuration = Math.min(520, Math.max(240, Math.abs(pixels) * 1.35));
    function slide(now: number) {
      const progress = Math.min((now - startedAt) / settleDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const time = currentTime + distance * eased;
      animation.currentTime = ((time % duration) + duration) % duration;
      slideFrame.current = progress < 1 ? requestAnimationFrame(slide) : null;
    }
    slideFrame.current = requestAnimationFrame(slide);
  }

  function moveReview(direction: -1 | 1) {
    const group = trackRef.current?.firstElementChild;
    const card = group?.firstElementChild;
    if (!group || !card) return;
    const gap = parseFloat(getComputedStyle(group).columnGap) || 0;
    slideBy(direction * (card.getBoundingClientRect().width + gap));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const track = trackRef.current;
    const group = track?.firstElementChild;
    const card = group?.firstElementChild;
    const animation = track?.getAnimations()[0];
    const duration = Number(animation?.effect?.getTiming().duration);
    if (!group || !card || !animation || !duration) return;
    if (slideFrame.current !== null) cancelAnimationFrame(slideFrame.current);
    slideFrame.current = null;
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, offset: 0, horizontal: false, animation, startTime: Number(animation.currentTime) || 0, duration, groupWidth: group.getBoundingClientRect().width, step: card.getBoundingClientRect().width + (parseFloat(getComputedStyle(group).columnGap) || 0), lastAt: event.timeStamp, lastOffset: 0, velocity: 0 };
    setDragging(true);
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const gesture = dragRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.horizontal) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) { dragRef.current = null; setDragging(false); return; }
      gesture.horizontal = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    gesture.offset = -dx;
    const elapsed = Math.max(1, event.timeStamp - gesture.lastAt);
    gesture.velocity = (gesture.offset - gesture.lastOffset) / elapsed;
    gesture.lastAt = event.timeStamp;
    gesture.lastOffset = gesture.offset;
    const time = gesture.startTime + gesture.offset / gesture.groupWidth * gesture.duration;
    gesture.animation.currentTime = ((time % gesture.duration) + gesture.duration) % gesture.duration;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = dragRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    if (!gesture.horizontal) return;
    const flick = event.timeStamp - gesture.lastAt < 120 && Math.abs(gesture.velocity) > .3 && Math.abs(gesture.offset) > 12;
    const cards = Math.abs(gesture.offset) < 35 && !flick ? 0 : Math.sign(gesture.offset) * Math.max(1, Math.round(Math.abs(gesture.offset) / gesture.step));
    slideBy(cards * gesture.step - gesture.offset);
  }

  function cancelDrag() { dragRef.current = null; setDragging(false); }

  return <section className={styles.section} id="reviews" aria-labelledby="reviews-title">
    <div className={`container ${styles.heading} reveal`}>
      <div><p className="eyebrow"><span className="tiny-line" /> CUSTOMER REVIEWS</p><h2 id="reviews-title">Good care leaves<br /><span>a lasting impression.</span></h2></div>
      <div className={styles.headingAside}><p>A little attention.<br />A lot of peace of mind.</p><span className={styles.sampleLabel}>Sample reviews · Preview content</span></div>
    </div>

    <div className={styles.carousel}>
    <div className={styles.viewport} data-dragging={dragging} data-active={inView} aria-label="Five sample customer reviews. Swipe left or right to browse." onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag}>
      <div className={styles.track} id="review-marquee" ref={trackRef}>
        {[false, true].map(duplicate => <div className={`${styles.group} ${duplicate ? styles.duplicate : ''}`} key={String(duplicate)} aria-hidden={duplicate || undefined} role="list">
          {reviews.map((review, index) => <article className={styles.card} key={review.name} role="listitem">
            <div className={styles.cardTop}><span className={styles.stars} aria-label="Sample rating: 5 out of 5 stars">{Array.from({ length: 5 }, (_, i) => <Star size={14} fill="currentColor" strokeWidth={0} key={i} />)}</span><Quote size={27} strokeWidth={1.3} aria-hidden="true" /></div>
            <blockquote>“{review.text}”</blockquote>
            <span className={styles.service}>{review.service}</span>
            <div className={styles.person}><span className={styles.avatar} data-tone={index % 3} aria-hidden="true">{review.initials}</span><div><strong>{review.name}</strong><span>Sample customer review</span></div></div>
          </article>)}
        </div>)}
      </div>
    </div>
    <div className={`container ${styles.controls}`}><button className={styles.moveButton} type="button" aria-label="Previous review" aria-controls="review-marquee" onClick={() => moveReview(-1)}><ArrowLeft size={19} /></button><button className={styles.moveButton} type="button" aria-label="Next review" aria-controls="review-marquee" onClick={() => moveReview(1)}><ArrowRight size={19} /></button></div>
    </div>

    <div className={`container ${styles.footer} reveal`}><button className={styles.cta} type="button" onClick={onInspect}>Let’s care for your space <ArrowRight size={18} /></button></div>
  </section>;
}

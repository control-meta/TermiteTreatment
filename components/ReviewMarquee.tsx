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
  const [dragging, setDragging] = useState(false);

  // References for animation and gesture coordination
  const offsetRef = useRef(0);
  const groupWidthRef = useRef(0);
  const cardStepRef = useRef(0);
  const autoScrollPausedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isSnappingRef = useRef(false);
  const inViewRef = useRef(false);
  const snapRafRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Gesture state
  const gestureRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startOffset: number;
    isHorizontal: boolean;
    lastX: number;
    lastTime: number;
    velocity: number;
  } | null>(null);

  // Direct GPU transform update
  const renderTrack = (offset: number) => {
    const track = trackRef.current;
    if (!track) return;
    const groupWidth = groupWidthRef.current;
    // Anchor to the middle group (Group 1) so swiping left or right always has full buffer cards
    const translateX = -(groupWidth + offset);
    track.style.transform = `translate3d(${translateX}px, 0, 0)`;
  };

  const pauseAutoScrollTemporarily = (durationMs = 2800) => {
    autoScrollPausedRef.current = true;
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }
    pauseTimerRef.current = setTimeout(() => {
      autoScrollPausedRef.current = false;
    }, durationMs);
  };

  const animateTo = (targetOffset: number) => {
    if (snapRafRef.current !== null) {
      cancelAnimationFrame(snapRafRef.current);
      snapRafRef.current = null;
    }
    isSnappingRef.current = true;

    const start = offsetRef.current;
    const distance = targetOffset - start;
    const groupWidth = groupWidthRef.current;

    if (Math.abs(distance) < 0.5 || groupWidth <= 0) {
      offsetRef.current = ((targetOffset % groupWidth) + groupWidth) % groupWidth;
      renderTrack(offsetRef.current);
      isSnappingRef.current = false;
      return;
    }

    const duration = Math.min(420, Math.max(220, Math.abs(distance) * 0.9));
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic-out easing for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + distance * eased;
      renderTrack(current);

      if (progress < 1) {
        snapRafRef.current = requestAnimationFrame(step);
      } else {
        snapRafRef.current = null;
        // Seamlessly normalize into [0, groupWidth) since all 3 groups are clones
        const normalized = ((targetOffset % groupWidth) + groupWidth) % groupWidth;
        offsetRef.current = normalized;
        renderTrack(normalized);
        isSnappingRef.current = false;
      }
    };

    snapRafRef.current = requestAnimationFrame(step);
  };

  const moveReview = (direction: -1 | 1) => {
    const cardStep = cardStepRef.current;
    if (cardStep <= 0) return;
    pauseAutoScrollTemporarily(3200);
    const currentIndex = Math.round(offsetRef.current / cardStep);
    const targetIndex = currentIndex + direction;
    animateTo(targetIndex * cardStep);
  };

  useEffect(() => {
    const track = trackRef.current;
    const viewport = track?.parentElement;
    if (!track || !viewport) return;

    const measure = () => {
      const group = track.children[1] as HTMLElement;
      if (!group) return;
      const firstCard = group.firstElementChild as HTMLElement;
      const gap = parseFloat(getComputedStyle(group).columnGap) || 14;
      const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 282;
      groupWidthRef.current = group.getBoundingClientRect().width;
      cardStepRef.current = cardWidth + gap;
      renderTrack(offsetRef.current);
    };

    measure();
    window.addEventListener('resize', measure);

    // Setup intersection observer for performance
    let isIntersecting = false;
    const updateVisibility = () => {
      inViewRef.current = isIntersecting && !document.hidden;
    };

    const observer = new IntersectionObserver(entries => {
      isIntersecting = entries[0].isIntersecting;
      updateVisibility();
    });
    observer.observe(viewport);
    document.addEventListener('visibilitychange', updateVisibility);

    // Continuous auto-scroll loop (at ~24px/s for gentle marquee drift)
    const speed = 24;
    let lastTime = performance.now();
    let loopRafId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (
        !prefersReducedMotion &&
        inViewRef.current &&
        !isDraggingRef.current &&
        !isSnappingRef.current &&
        !autoScrollPausedRef.current &&
        !isHoveredRef.current &&
        groupWidthRef.current > 0
      ) {
        offsetRef.current = (offsetRef.current + speed * dt) % groupWidthRef.current;
        renderTrack(offsetRef.current);
      }

      loopRafId = requestAnimationFrame(loop);
    };

    loopRafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', measure);
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
      cancelAnimationFrame(loopRafId);
      if (snapRafRef.current !== null) cancelAnimationFrame(snapRafRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (snapRafRef.current !== null) {
      cancelAnimationFrame(snapRafRef.current);
      snapRafRef.current = null;
      isSnappingRef.current = false;
    }

    isDraggingRef.current = true;
    autoScrollPausedRef.current = true;

    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      isHorizontal: false,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };
    setDragging(true);
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;

    if (!gesture.isHorizontal) {
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Wait until gesture has traveled enough distance to distinguish intent
      if (Math.hypot(dx, dy) < 7) return;

      // If vertical movement dominates, user is scrolling down/up the page
      if (absDy > absDx) {
        gestureRef.current = null;
        isDraggingRef.current = false;
        autoScrollPausedRef.current = false;
        setDragging(false);
        return;
      }

      // Horizontal swipe confirmed
      gesture.isHorizontal = true;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {}
    }

    // Measure velocity for flick detection
    const now = performance.now();
    const dt = now - gesture.lastTime;
    if (dt > 8) {
      gesture.velocity = (event.clientX - gesture.lastX) / dt;
      gesture.lastX = event.clientX;
      gesture.lastTime = now;
    }

    // Direct 1:1 hardware-accelerated tracking
    const current = gesture.startOffset - dx;
    offsetRef.current = current;
    renderTrack(current);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    gestureRef.current = null;
    isDraggingRef.current = false;
    setDragging(false);

    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {}

    if (!gesture.isHorizontal) {
      autoScrollPausedRef.current = false;
      return;
    }

    const cardStep = cardStepRef.current;
    if (cardStep <= 0) return;

    const dx = event.clientX - gesture.startX;
    const isFlick = Math.abs(gesture.velocity) > 0.28 && Math.abs(dx) > 15;
    let targetIndex: number;

    if (isFlick) {
      // velocity > 0 means finger swiped right -> show previous card (decrease offset)
      // velocity < 0 means finger swiped left -> show next card (increase offset)
      if (gesture.velocity < 0) {
        targetIndex = Math.ceil(gesture.startOffset / cardStep);
        if (targetIndex * cardStep <= gesture.startOffset) targetIndex += 1;
      } else {
        targetIndex = Math.floor(gesture.startOffset / cardStep);
        if (targetIndex * cardStep >= gesture.startOffset) targetIndex -= 1;
      }
    } else {
      targetIndex = Math.round(offsetRef.current / cardStep);
    }

    pauseAutoScrollTemporarily(2800);
    animateTo(targetIndex * cardStep);
  }

  function cancelDrag() {
    const gesture = gestureRef.current;
    if (!gesture) return;
    gestureRef.current = null;
    isDraggingRef.current = false;
    setDragging(false);

    const cardStep = cardStepRef.current;
    if (cardStep > 0 && gesture.isHorizontal) {
      const targetIndex = Math.round(offsetRef.current / cardStep);
      pauseAutoScrollTemporarily(2800);
      animateTo(targetIndex * cardStep);
    } else {
      autoScrollPausedRef.current = false;
    }
  }

  return (
    <section className={styles.section} id="reviews" aria-labelledby="reviews-title">
      <div className={`container ${styles.heading} reveal`}>
        <div>
          <p className="eyebrow"><span className="tiny-line" /> CUSTOMER REVIEWS</p>
          <h2 id="reviews-title">Good care leaves<br /><span>a lasting impression.</span></h2>
        </div>
        <div className={styles.headingAside}>
          <p>A little attention.<br />A lot of peace of mind.</p>
          <span className={styles.sampleLabel}>Sample reviews · Preview content</span>
        </div>
      </div>

      <div
        className={styles.carousel}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
      >
        <div
          className={styles.viewport}
          data-dragging={dragging}
          aria-label="Five customer reviews. Swipe left or right to browse."
          onPointerDown={startDrag}
          onPointerMove={drag}
          onPointerUp={endDrag}
          onPointerCancel={cancelDrag}
        >
          <div className={styles.track} id="review-marquee" ref={trackRef}>
            {[0, 1, 2].map(groupIndex => {
              const isMain = groupIndex === 1;
              return (
                <div
                  className={`${styles.group} ${!isMain ? styles.duplicate : ''}`}
                  key={groupIndex}
                  aria-hidden={!isMain || undefined}
                  role="list"
                >
                  {reviews.map((review, index) => (
                    <article className={styles.card} key={`${groupIndex}-${review.name}`} role="listitem">
                      <div className={styles.cardTop}>
                        <span className={styles.stars} aria-label="Sample rating: 5 out of 5 stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star size={14} fill="currentColor" strokeWidth={0} key={i} />
                          ))}
                        </span>
                        <Quote size={27} strokeWidth={1.3} aria-hidden="true" />
                      </div>
                      <blockquote>“{review.text}”</blockquote>
                      <span className={styles.service}>{review.service}</span>
                      <div className={styles.person}>
                        <span className={styles.avatar} data-tone={index % 3} aria-hidden="true">
                          {review.initials}
                        </span>
                        <div>
                          <strong>{review.name}</strong>
                          <span>Sample customer review</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div className={`container ${styles.controls}`}>
          <button
            className={styles.moveButton}
            type="button"
            aria-label="Previous review"
            aria-controls="review-marquee"
            onClick={() => moveReview(-1)}
          >
            <ArrowLeft size={19} />
          </button>
          <button
            className={styles.moveButton}
            type="button"
            aria-label="Next review"
            aria-controls="review-marquee"
            onClick={() => moveReview(1)}
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>

      <div className={`container ${styles.footer} reveal`}>
        <button className={styles.cta} type="button" onClick={onInspect}>
          Let’s care for your space <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

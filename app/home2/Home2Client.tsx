'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, HardHat, House, Leaf, ShieldCheck } from 'lucide-react';
import ServiceEnquiryForm from '../../components/ServiceEnquiryForm';
import { home2Locations, home2Projects, home2Services } from './content';
import SheetImage from './SheetImage';
import styles from './home2.module.css';

export function Home2ServicesMarquee() {
  const viewport = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const cycle = useRef(0);
  const touching = useRef(false);
  const hovering = useRef(false);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);
  const pointerStart = useRef({ x: 0, scrollLeft: 0 });
  const isDragging = useRef(false);
  const dragDistance = useRef(0);

  useEffect(() => {
    const el = viewport.current;
    const original = group.current;
    if (!el || !original) return;
    const measure = () => {
      const prev = cycle.current;
      const progress = prev ? (el.scrollLeft % prev) / prev : 0;
      cycle.current = original.getBoundingClientRect().width;
      if (cycle.current > 0 && el.scrollLeft === 0) {
        el.scrollLeft = cycle.current * (1 + progress);
      }
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(original);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    let frame = 0;
    let prevTime = 0;
    let offset = el.scrollLeft;
    let visible = true;

    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    observer.observe(el);

    const tick = (now: number) => {
      const elapsed = prevTime ? Math.min(now - prevTime, 50) : 0;
      prevTime = now;

      if (visible && !document.hidden && !hovering.current && !touching.current && !isDragging.current && cycle.current > 0) {
        if (Math.abs(el.scrollLeft - offset) > 3) {
          offset = el.scrollLeft;
        }
        offset += elapsed * 0.035;
        if (offset >= cycle.current * 2) {
          offset -= cycle.current;
        }
        el.scrollLeft = offset;
      } else {
        offset = el.scrollLeft;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const handleScroll = () => {
    const el = viewport.current;
    const width = cycle.current;
    if (!el || !width || isDragging.current) return;
    if (el.scrollLeft < width * 0.5) {
      el.scrollLeft += width;
    } else if (el.scrollLeft > width * 2.5) {
      el.scrollLeft -= width;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    const el = viewport.current;
    if (!el) return;
    isDragging.current = true;
    touching.current = true;
    dragDistance.current = 0;
    pointerStart.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const el = viewport.current;
    if (!el) return;
    const dx = e.clientX - pointerStart.current.x;
    dragDistance.current = Math.abs(dx);
    el.scrollLeft = pointerStart.current.scrollLeft - dx;
  };

  const stopDragging = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      touching.current = false;
    }, 1200);
  };

  const serviceIconMap: Record<string, typeof House> = {
    home: House,
    building: Building2,
    shield: ShieldCheck,
    hardhat: HardHat,
    leaf: Leaf,
  };

  const renderGroup = (copyIndex: number) => {
    const isReference = copyIndex === 1;
    return (
      <div
        className={`${styles.serviceGrid} ${styles.serviceGroup}`}
        key={copyIndex}
        ref={isReference ? group : undefined}
        aria-hidden={!isReference || undefined}
      >
        {home2Services.map((service) => {
          const Icon = serviceIconMap[service.icon] || ShieldCheck;
          return (
            <article
              className={styles.serviceCard}
              key={`${service.slug}-${copyIndex}`}
              aria-hidden={!isReference ? 'true' : undefined}
            >
              <img
                src={service.image}
                alt={!isReference ? '' : service.imageAlt}
                className={styles.serviceImage}
                style={{ objectPosition: service.imagePosition || 'center' }}
                width={450}
                height={300}
                loading="lazy"
                draggable={false}
              />
              <div className={styles.serviceCardBody}>
                <div>
                  <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                  <h3>{service.title}</h3>
                </div>
                <a
                  className={styles.smallAccentButton}
                  href={`/services/${service.slug}`}
                  aria-label={`Know more about ${service.title}`}
                  tabIndex={!isReference ? -1 : undefined}
                  onClick={(e) => {
                    if (dragDistance.current > 8) e.preventDefault();
                  }}
                >
                  Know More <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={styles.serviceMarquee}
      id="home2-services-marquee"
      ref={viewport}
      onScroll={handleScroll}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') hovering.current = true;
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') {
          hovering.current = false;
          stopDragging();
        }
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onTouchStart={() => {
        touching.current = true;
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
      }}
      onTouchEnd={() => {
        if (resumeTimer.current) clearTimeout(resumeTimer.current);
        resumeTimer.current = setTimeout(() => {
          touching.current = false;
        }, 1200);
      }}
      tabIndex={0}
      role="region"
      aria-label="Our Termite Control Services. Swipe or scroll horizontally to browse."
    >
      <div className={styles.serviceTrack}>
        {[0, 1, 2].map((copy) => renderGroup(copy))}
      </div>
    </div>
  );
}

export function Home2Projects() {
  const [expanded, setExpanded] = useState(false);
  const projects = home2Projects.slice(0, expanded ? 6 : 4);
  const cards = (duplicate = false) => projects.map((project, index) => <figure key={`${project.title}-${index}${duplicate ? '-dup' : ''}`}><SheetImage src="/images/services/property-types-v4.webp" index={project.image} alt={`${project.title} — illustrative architectural project`} /><figcaption>{project.title}</figcaption></figure>);
  return <section className={styles.projectSection} id="projects" aria-labelledby="home2-projects-title">
    <div className={styles.projectHeading}><h2 id="home2-projects-title">Our Recent Projects</h2><button type="button" aria-expanded={expanded} aria-controls="home2-project-gallery" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show Fewer' : 'View All Projects'} <ArrowRight size={14} aria-hidden="true" /></button></div>
    <div className={expanded ? undefined : styles.projectMarquee} id="home2-project-gallery">
      {expanded ? <div className={styles.projectGrid}>{cards()}</div> : <div className={styles.projectTrack}>
        <div className={`${styles.projectGrid} ${styles.projectGroup}`}>{cards()}</div>
        <div className={`${styles.projectGrid} ${styles.projectGroup} ${styles.projectDuplicate}`} aria-hidden="true">{cards(true)}</div>
      </div>}
    </div>
  </section>;
}

export function Home2Enquiry() {
  return <ServiceEnquiryForm id="home2-enquiry" className={styles.enquiryForm} suggestedLocations={home2Locations} />;
}

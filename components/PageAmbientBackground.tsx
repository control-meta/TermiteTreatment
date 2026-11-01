'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Mote = {
  id: number;
  top: number;
  left: number;
  size: number;
  tone: 'gold' | 'emerald' | 'white';
  duration: number;
  delay: number;
  drift: number;
};

const HOME_MOTES: Mote[] = [
  { id: 1, top: 12, left: 8, size: 4, tone: 'gold', duration: 26, delay: -4, drift: 16 },
  { id: 2, top: 22, left: 76, size: 3, tone: 'emerald', duration: 32, delay: -11, drift: -20 },
  { id: 3, top: 31, left: 18, size: 5, tone: 'white', duration: 28, delay: -7, drift: 22 },
  { id: 4, top: 38, left: 88, size: 4, tone: 'gold', duration: 35, delay: -15, drift: -14 },
  { id: 5, top: 46, left: 42, size: 3, tone: 'emerald', duration: 24, delay: -2, drift: 18 },
  { id: 6, top: 54, left: 66, size: 5, tone: 'gold', duration: 30, delay: -19, drift: 12 },
  { id: 7, top: 62, left: 12, size: 4, tone: 'white', duration: 27, delay: -6, drift: -18 },
  { id: 8, top: 69, left: 82, size: 3, tone: 'emerald', duration: 33, delay: -13, drift: 24 },
  { id: 9, top: 77, left: 34, size: 5, tone: 'gold', duration: 29, delay: -9, drift: -16 },
  { id: 10, top: 85, left: 58, size: 4, tone: 'white', duration: 31, delay: -21, drift: 14 },
  { id: 11, top: 91, left: 24, size: 3, tone: 'emerald', duration: 25, delay: -3, drift: 20 },
  { id: 12, top: 16, left: 52, size: 3, tone: 'white', duration: 34, delay: -17, drift: -12 },
  { id: 13, top: 58, left: 7, size: 4, tone: 'gold', duration: 23, delay: -5, drift: 15 },
  { id: 14, top: 73, left: 92, size: 4, tone: 'white', duration: 36, delay: -23, drift: -22 },
];

const ABOUT_MOTES: Mote[] = [
  { id: 101, top: 8, left: 14, size: 5, tone: 'gold', duration: 24, delay: -3, drift: 18 },
  { id: 102, top: 15, left: 82, size: 4, tone: 'emerald', duration: 28, delay: -9, drift: -15 },
  { id: 103, top: 24, left: 28, size: 5, tone: 'white', duration: 30, delay: -6, drift: 22 },
  { id: 104, top: 32, left: 91, size: 4, tone: 'gold', duration: 34, delay: -14, drift: -18 },
  { id: 105, top: 41, left: 12, size: 4, tone: 'emerald', duration: 26, delay: -5, drift: 16 },
  { id: 106, top: 49, left: 75, size: 5, tone: 'gold', duration: 31, delay: -18, drift: -12 },
  { id: 107, top: 57, left: 22, size: 4, tone: 'white', duration: 29, delay: -8, drift: 20 },
  { id: 108, top: 66, left: 86, size: 5, tone: 'emerald', duration: 33, delay: -12, drift: -22 },
  { id: 109, top: 74, left: 38, size: 4, tone: 'gold', duration: 27, delay: -7, drift: 14 },
  { id: 110, top: 83, left: 70, size: 5, tone: 'white', duration: 32, delay: -16, drift: -16 },
  { id: 111, top: 92, left: 18, size: 4, tone: 'emerald', duration: 25, delay: -4, drift: 18 },
  { id: 112, top: 20, left: 62, size: 3, tone: 'gold', duration: 35, delay: -10, drift: -14 },
  { id: 113, top: 52, left: 48, size: 4, tone: 'white', duration: 28, delay: -15, drift: 12 },
  { id: 114, top: 88, left: 84, size: 5, tone: 'gold', duration: 30, delay: -2, drift: -20 },
];

const CONTACT_MOTES: Mote[] = [
  { id: 201, top: 6, left: 22, size: 5, tone: 'gold', duration: 22, delay: -2, drift: 15 },
  { id: 202, top: 12, left: 78, size: 4, tone: 'white', duration: 29, delay: -8, drift: -18 },
  { id: 203, top: 22, left: 10, size: 5, tone: 'emerald', duration: 26, delay: -5, drift: 20 },
  { id: 204, top: 28, left: 90, size: 4, tone: 'gold', duration: 33, delay: -13, drift: -16 },
  { id: 205, top: 38, left: 32, size: 4, tone: 'white', duration: 28, delay: -7, drift: 14 },
  { id: 206, top: 46, left: 84, size: 5, tone: 'emerald', duration: 31, delay: -16, drift: -20 },
  { id: 207, top: 55, left: 15, size: 4, tone: 'gold', duration: 25, delay: -4, drift: 18 },
  { id: 208, top: 63, left: 72, size: 5, tone: 'white', duration: 34, delay: -11, drift: -15 },
  { id: 209, top: 72, left: 26, size: 4, tone: 'emerald', duration: 27, delay: -9, drift: 16 },
  { id: 210, top: 81, left: 88, size: 5, tone: 'gold', duration: 30, delay: -15, drift: -18 },
  { id: 211, top: 90, left: 20, size: 4, tone: 'white', duration: 26, delay: -3, drift: 14 },
  { id: 212, top: 18, left: 45, size: 4, tone: 'gold', duration: 32, delay: -12, drift: 12 },
  { id: 213, top: 50, left: 52, size: 3, tone: 'emerald', duration: 27, delay: -6, drift: -14 },
  { id: 214, top: 85, left: 60, size: 5, tone: 'white', duration: 35, delay: -19, drift: 22 },
];

interface PageAmbientProps {
  variant?: 'home' | 'about' | 'contact';
}

export default function PageAmbientBackground({ variant = 'home' }: PageAmbientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    setMounted(true);
    const motionPref = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPref.matches || window.matchMedia('(max-width: 760px), (hover: none), (pointer: coarse)').matches) {
      setInteractive(false);
      return;
    }

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const relX = e.clientX / window.innerWidth - 0.5;
      const relY = e.clientY / window.innerHeight - 0.5;
      targetX = relX * 24;
      targetY = relY * 20;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--cursor-x', currentX.toFixed(2));
        containerRef.current.style.setProperty('--cursor-y', currentY.toFixed(2));
      }
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const motes = variant === 'about' ? ABOUT_MOTES : variant === 'contact' ? CONTACT_MOTES : HOME_MOTES;

  return (
    <div
      ref={containerRef}
      className={`page-ambient page-ambient-${variant}`}
      aria-hidden="true"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {/* SVG Definitions for Gradients & Filters */}
      <svg className="sr-only" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="page-contour-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6fa35f" stopOpacity="0" />
            <stop offset="30%" stopColor="#6fa35f" stopOpacity=".24" />
            <stop offset="68%" stopColor="#8cb56f" stopOpacity=".16" />
            <stop offset="100%" stopColor="#6fa35f" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="page-leaf-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7cb964" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#48903e" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#2b6b25" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="page-leaf-grad-2" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#9acd7e" stopOpacity="0.72" />
            <stop offset="60%" stopColor="#589b44" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#317226" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="page-leaf-grad-3" x1="0%" y1="10%" x2="100%" y2="90%">
            <stop offset="0%" stopColor="#b9e07b" stopOpacity="0.78" />
            <stop offset="60%" stopColor="#6ea94d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#417930" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="page-komorebi-beam-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#eefae7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="page-komorebi-beam-2" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#fdf6db" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layer 0: Soft Luminous Washes / Floating Orbs */}
      <div className={`page-ambient-orbs ${interactive ? 'page-ambient-interactive' : ''}`}>
        {variant === 'home' && (
          <>
            <span className="page-orb page-orb-sage" />
            <span className="page-orb page-orb-honey" />
            <span className="page-orb page-orb-mint" />
            <span className="page-orb page-orb-cream" />
          </>
        )}

        {variant === 'about' && (
          <>
            <span className="page-orb page-orb-about-sage" />
            <span className="page-orb page-orb-about-sunlight" />
            <span className="page-orb page-orb-about-emerald" />
            <span className="page-orb page-orb-about-honey" />
            <span className="page-orb page-orb-about-halo" />
          </>
        )}

        {variant === 'contact' && (
          <>
            <span className="page-orb page-orb-contact-hero" />
            <span className="page-orb page-orb-contact-aside" />
            <span className="page-orb page-orb-contact-form" />
            <span className="page-orb page-orb-contact-offices" />
            <span className="page-orb page-orb-contact-faq" />
          </>
        )}
      </div>

      {/* Layer 1: Komorebi Dappled Sunlight Rays (Visible on About & Contact) */}
      {(variant === 'about' || variant === 'contact') && (
        <svg
          className={`page-ambient-komorebi ${interactive ? 'page-ambient-interactive' : ''}`}
          viewBox="0 0 1440 900"
          fill="none"
          preserveAspectRatio="none"
          focusable="false"
        >
          <polygon points="160,-40 380,-40 720,950 500,950" fill="url(#page-komorebi-beam-1)" filter="blur(38px)" />
          <polygon points="580,-40 760,-40 1180,950 1000,950" fill="url(#page-komorebi-beam-2)" filter="blur(44px)" />
          <polygon points="40,-40 180,-40 440,950 300,950" fill="url(#page-komorebi-beam-1)" opacity="0.6" filter="blur(32px)" />
          <circle cx="450" cy="240" r="220" fill="url(#page-komorebi-beam-1)" filter="blur(65px)" opacity="0.25" />
          <circle cx="920" cy="460" r="190" fill="url(#page-komorebi-beam-2)" filter="blur(70px)" opacity="0.2" />
        </svg>
      )}

      {/* Layer 2: Organic Contours */}
      <svg
        className={`page-ambient-contours ${interactive ? 'page-ambient-interactive' : ''}`}
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path className="page-contour" d="M-80 140 C220 70 420 210 720 140 S1200 60 1520 150" />
        <path className="page-contour" d="M-60 236 C260 176 480 310 760 240 S1220 170 1500 260" />
        <path className="page-contour" d="M-40 554 C250 494 520 638 800 558 S1240 488 1520 578" />
        <path className="page-contour" d="M-20 652 C280 592 540 726 840 656 S1260 586 1540 676" />
      </svg>

      {/* Layer 3: Floating Botanical Leaves */}
      <div className={`page-ambient-leaves ${interactive ? 'page-ambient-leaves-interactive' : ''}`}>
        <span className="page-leaf page-leaf-1">
          <svg viewBox="0 0 40 60" fill="none">
            <path d="M20 2C28 14 36 26 36 38C36 49 29 57 20 58C11 57 4 49 4 38C4 26 12 14 20 2Z" fill="url(#page-leaf-grad-1)" />
            <path d="M20 6C20 24 20 42 20 57" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M20 22C24 19 28 20 30 22M20 28C16 25 12 26 10 28M20 36C24 33 28 34 31 37M20 42C16 39 12 40 9 43" stroke="rgba(255,255,255,.3)" strokeWidth=".8" strokeLinecap="round" />
          </svg>
        </span>
        <span className="page-leaf page-leaf-2">
          <svg viewBox="0 0 32 64" fill="none">
            <path d="M16 2C25 16 28 36 21 54C19 59 15 62 14 62C13 62 11 58 11 52C9 36 9 18 16 2Z" fill="url(#page-leaf-grad-2)" />
            <path d="M16 4C15 24 14 44 14 62" stroke="rgba(255,255,255,.48)" strokeWidth="1" strokeLinecap="round" />
            <path d="M15 22C19 20 23 23 24 26M15 34C11 31 8 33 7 37" stroke="rgba(255,255,255,.3)" strokeWidth=".75" />
          </svg>
        </span>
        <span className="page-leaf page-leaf-3">
          <svg viewBox="0 0 36 48" fill="none">
            <path d="M18 4C27 12 32 24 29 35C26 44 18 46 16 46C11 44 6 36 7 26C8 15 14 7 18 4Z" fill="url(#page-leaf-grad-3)" />
            <path d="M18 6C17 20 16 34 16 46" stroke="rgba(255,255,255,.45)" strokeWidth="1" strokeLinecap="round" />
            <path d="M17 21C21 19 24 21 26 23M17 29C13 27 10 28 8 31" stroke="rgba(255,255,255,.28)" strokeWidth=".75" />
          </svg>
        </span>
        <span className="page-leaf page-leaf-4">
          <svg viewBox="0 0 40 60" fill="none">
            <path d="M20 2C28 14 36 26 36 38C36 49 29 57 20 58C11 57 4 49 4 38C4 26 12 14 20 2Z" fill="url(#page-leaf-grad-1)" />
            <path d="M20 6C20 24 20 42 20 57" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
        {(variant === 'about' || variant === 'contact') && (
          <>
            <span className="page-leaf page-leaf-5">
              <svg viewBox="0 0 32 64" fill="none">
                <path d="M16 2C25 16 28 36 21 54C19 59 15 62 14 62C13 62 11 58 11 52C9 36 9 18 16 2Z" fill="url(#page-leaf-grad-2)" />
                <path d="M16 4C15 24 14 44 14 62" stroke="rgba(255,255,255,.4)" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
            <span className="page-leaf page-leaf-6">
              <svg viewBox="0 0 36 48" fill="none">
                <path d="M18 4C27 12 32 24 29 35C26 44 18 46 16 46C11 44 6 36 7 26C8 15 14 7 18 4Z" fill="url(#page-leaf-grad-3)" />
              </svg>
            </span>
          </>
        )}
      </div>

      {/* Layer 4: Sunlit Pollen Motes */}
      <div className={`page-ambient-motes ${interactive ? 'page-ambient-motes-interactive' : ''}`}>
        {motes.map(mote => (
          <span
            key={mote.id}
            className={`page-mote page-mote-${mote.tone}`}
            style={{
              top: `${mote.top}%`,
              left: `${mote.left}%`,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              ['--mote-duration' as string]: `${mote.duration}s`,
              ['--mote-delay' as string]: `${mote.delay}s`,
              ['--mote-x' as string]: `${mote.drift}px`,
            } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

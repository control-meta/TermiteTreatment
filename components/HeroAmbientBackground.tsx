'use client';

import { useEffect, useRef, useState } from 'react';

type PollenMote = {
  id: number;
  top: number;
  left: number;
  size: number;
  type: 'gold' | 'emerald' | 'white';
  duration: number;
  delay: number;
  driftX: number;
};

const SEED_MOTES: PollenMote[] = [
  { id: 1, top: 22, left: 16, size: 5, type: 'gold', duration: 11, delay: -2, driftX: 18 },
  { id: 2, top: 38, left: 28, size: 6, type: 'emerald', duration: 14, delay: -6, driftX: -14 },
  { id: 3, top: 52, left: 12, size: 4, type: 'white', duration: 10, delay: -4, driftX: 22 },
  { id: 4, top: 18, left: 36, size: 7, type: 'gold', duration: 16, delay: -8, driftX: 15 },
  { id: 5, top: 48, left: 44, size: 5, type: 'emerald', duration: 13, delay: -1, driftX: -20 },
  { id: 6, top: 29, left: 48, size: 4, type: 'gold', duration: 12, delay: -7, driftX: 12 },
  { id: 7, top: 64, left: 22, size: 6, type: 'gold', duration: 15, delay: -3, driftX: -16 },
  { id: 8, top: 72, left: 34, size: 5, type: 'emerald', duration: 17, delay: -9, driftX: 25 },
  { id: 9, top: 15, left: 24, size: 4, type: 'white', duration: 9, delay: -5, driftX: -10 },
  { id: 10, top: 33, left: 8, size: 6, type: 'emerald', duration: 14, delay: -11, driftX: 19 },
  { id: 11, top: 58, left: 48, size: 7, type: 'gold', duration: 13, delay: -4, driftX: -12 },
  { id: 12, top: 82, left: 18, size: 5, type: 'white', duration: 12, delay: -7, driftX: 16 },
  { id: 13, top: 42, left: 38, size: 4, type: 'gold', duration: 15, delay: -10, driftX: -18 },
  { id: 14, top: 26, left: 42, size: 6, type: 'emerald', duration: 11, delay: -2, driftX: 20 },
  { id: 15, top: 68, left: 40, size: 5, type: 'gold', duration: 16, delay: -8, driftX: 14 },
  { id: 16, top: 12, left: 32, size: 4, type: 'emerald', duration: 13, delay: -6, driftX: -15 },
];

export default function HeroAmbientBackground() {
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

    // Parallax mouse interaction
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (e.clientY < rect.top - 100 || e.clientY > rect.bottom + 100) return;
      
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = relX * 22; // max 11px drift
      targetY = relY * 20;
    };

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

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

  return (
    <div
      ref={containerRef}
      className="hero-ambient"
      aria-hidden="true"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {/* SVG Definitions for Gradients */}
      <svg className="sr-only" aria-hidden="true" focusable="false">
        <defs>
          {/* Main Leaf Gradient: Natural fresh spring to forest green */}
          <linearGradient id="ambient-leaf-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#76b85e" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#438c38" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#256620" stopOpacity="0.5" />
          </linearGradient>

          {/* Slender Willow Leaf Gradient: Soft sage & olive */}
          <linearGradient id="ambient-leaf-grad-2" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#96cc7a" stopOpacity="0.72" />
            <stop offset="55%" stopColor="#559942" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2e6d23" stopOpacity="0.45" />
          </linearGradient>

          {/* Golden Warm Leaf Accent */}
          <linearGradient id="ambient-leaf-grad-3" x1="0%" y1="10%" x2="100%" y2="90%">
            <stop offset="0%" stopColor="#b4dc76" stopOpacity="0.78" />
            <stop offset="60%" stopColor="#67a647" stopOpacity="0.62" />
            <stop offset="100%" stopColor="#3d752c" stopOpacity="0.48" />
          </linearGradient>

          {/* Contour Lines Gradients */}
          <linearGradient id="contour-gradient" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#437d4f" stopOpacity="0.03" />
            <stop offset="35%" stopColor="#5d9e52" stopOpacity="0.22" />
            <stop offset="75%" stopColor="#87bb67" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#5d9e52" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="contour-gradient-soft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78ad60" stopOpacity="0" />
            <stop offset="45%" stopColor="#5a9854" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#78ad60" stopOpacity="0" />
          </linearGradient>

          {/* Komorebi Light Ray Gradients */}
          <linearGradient id="komorebi-beam-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff9e6" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#effbe8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="komorebi-beam-2" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#fdf6db" stopOpacity="0.26" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Layer 0: Soft Ambient Luminous Orbs */}
      <div className={`ambient-orbs ${interactive ? 'hero-ambient-interactive' : ''}`}>
        <div className="ambient-orb orb-sage" />
        <div className="ambient-orb orb-sunlight" />
        <div className="ambient-orb orb-mint" />
        <div className="ambient-orb orb-honey" />
        <div className="ambient-orb orb-halo" />
      </div>

      {/* Layer 1: Komorebi Dappled Sunlight Rays */}
      <svg
        className={`ambient-komorebi ${interactive ? 'hero-ambient-interactive' : ''}`}
        viewBox="0 0 900 600"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="120,-30 260,-30 460,630 320,630" fill="url(#komorebi-beam-1)" filter="blur(26px)" />
        <polygon points="340,-30 460,-30 720,630 600,630" fill="url(#komorebi-beam-2)" filter="blur(32px)" />
        <polygon points="20,-30 110,-30 290,630 200,630" fill="url(#komorebi-beam-1)" opacity="0.65" filter="blur(22px)" />
        <circle cx="280" cy="180" r="140" fill="url(#komorebi-beam-1)" filter="blur(48px)" opacity="0.28" />
        <circle cx="520" cy="320" r="120" fill="url(#komorebi-beam-2)" filter="blur(55px)" opacity="0.22" />
      </svg>

      {/* Layer 2: Organic Growth Contour Wave Lines */}
      <svg
        className={`ambient-contours ${interactive ? 'hero-ambient-interactive' : ''}`}
        viewBox="0 0 700 500"
        fill="none"
        aria-hidden="true"
      >
        <path d="M-50,150 C120,90 280,220 450,140 C560,90 650,170 750,130" className="contour-path" />
        <path d="M-40,210 C140,160 310,280 480,210 C590,160 670,240 760,200" className="contour-path-solid" />
        <path d="M-30,270 C160,230 330,340 510,270 C620,220 690,300 780,270" className="contour-path" />
        <path d="M-20,330 C180,300 350,400 540,330 C650,290 710,360 800,340" className="contour-path-solid" />
      </svg>

      {/* Layer 3: Floating Botanical Leaves */}
      <div className={`ambient-leaves ${interactive ? 'hero-ambient-leaves-interactive' : ''}`}>
        {/* Leaf 1: Broad Elm Leaf near Top Eyebrow */}
        <div className="floating-leaf leaf-pos-1">
          <svg viewBox="0 0 40 60" fill="none">
            <path
              d="M20 2 C28 14 36 26 36 38 C36 49 29 57 20 58 C11 57 4 49 4 38 C4 26 12 14 20 2 Z"
              fill="url(#ambient-leaf-grad-1)"
            />
            <path d="M20 6 C20 24 20 42 20 57" stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M20 22 C24 19 28 20 30 22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M20 28 C16 25 12 26 10 28" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M20 36 C24 33 28 34 31 37" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M20 42 C16 39 12 40 9 43" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </div>

        {/* Leaf 2: Slender Willow Leaf near Middle Right */}
        <div className="floating-leaf leaf-pos-2">
          <svg viewBox="0 0 32 64" fill="none">
            <path
              d="M16 2 C25 16 28 36 21 54 C19 59 15 62 14 62 C13 62 11 58 11 52 C9 36 9 18 16 2 Z"
              fill="url(#ambient-leaf-grad-2)"
            />
            <path d="M16 4 C15 24 14 44 14 62" stroke="rgba(255,255,255,0.48)" strokeWidth="1" strokeLinecap="round" />
            <path d="M15 22 C19 20 23 23 24 26" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
            <path d="M15 34 C11 31 8 33 7 37" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
          </svg>
        </div>

        {/* Leaf 3: Soft Blurred Background Leaf on Far Left */}
        <div className="floating-leaf leaf-pos-3">
          <svg viewBox="0 0 40 60" fill="none">
            <path
              d="M20 2 C28 14 36 26 36 38 C36 49 29 57 20 58 C11 57 4 49 4 38 C4 26 12 14 20 2 Z"
              fill="url(#ambient-leaf-grad-3)"
            />
            <path d="M20 6 C20 24 20 42 20 57" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Leaf 4: Sprout Leaf near Action Buttons */}
        <div className="floating-leaf leaf-pos-4">
          <svg viewBox="0 0 36 48" fill="none">
            <path
              d="M18 4 C27 12 32 24 29 35 C26 44 18 46 16 46 C11 44 6 36 7 26 C8 15 14 7 18 4 Z"
              fill="url(#ambient-leaf-grad-1)"
            />
            <path d="M18 6 C17 20 16 34 16 46" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round" />
            <path d="M17 21 C21 19 24 21 26 23" stroke="rgba(255,255,255,0.28)" strokeWidth="0.75" />
            <path d="M17 29 C13 27 10 28 8 31" stroke="rgba(255,255,255,0.28)" strokeWidth="0.75" />
          </svg>
        </div>

        {/* Leaf 5: Graceful Curved Leaf near Review Strip */}
        <div className="floating-leaf leaf-pos-5">
          <svg viewBox="0 0 32 64" fill="none">
            <path
              d="M16 2 C25 16 28 36 21 54 C19 59 15 62 14 62 C13 62 11 58 11 52 C9 36 9 18 16 2 Z"
              fill="url(#ambient-leaf-grad-3)"
            />
            <path d="M16 4 C15 24 14 44 14 62" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </div>

        {/* Leaf 6: Delicate Floating Leaflet in Central White Space */}
        <div className="floating-leaf leaf-pos-6">
          <svg viewBox="0 0 36 48" fill="none">
            <path
              d="M18 4 C27 12 32 24 29 35 C26 44 18 46 16 46 C11 44 6 36 7 26 C8 15 14 7 18 4 Z"
              fill="url(#ambient-leaf-grad-2)"
            />
            <path d="M18 6 C17 20 16 34 16 46" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
          </svg>
        </div>

        {/* Leaf 7: Tiny Accent Leaf near Top Right */}
        <div className="floating-leaf leaf-pos-7">
          <svg viewBox="0 0 40 60" fill="none">
            <path
              d="M20 2 C28 14 36 26 36 38 C36 49 29 57 20 58 C11 57 4 49 4 38 C4 26 12 14 20 2 Z"
              fill="url(#ambient-leaf-grad-1)"
            />
          </svg>
        </div>
      </div>

      {/* Layer 4: Floating Sunlit Pollen / Light Dust Motes */}
      <div className={`ambient-pollen-field ${interactive ? 'hero-ambient-pollen-interactive' : ''}`}>
        {SEED_MOTES.map(mote => (
          <span
            key={mote.id}
            className={`pollen-mote pollen-${mote.type}`}
            style={{
              top: `${mote.top}%`,
              left: `${mote.left}%`,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              animation: `pollenDrift ${mote.duration}s ease-in-out infinite`,
              animationDelay: `${mote.delay}s`,
              ['--drift-x' as string]: `${mote.driftX}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

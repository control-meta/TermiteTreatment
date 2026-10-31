import type { CSSProperties } from 'react';

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

const MOTES: Mote[] = [
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

export default function PageAmbientBackground() {
  return (
    <div className="page-ambient" aria-hidden="true">
      <div className="page-ambient-orbs">
        <span className="page-orb page-orb-sage" />
        <span className="page-orb page-orb-honey" />
        <span className="page-orb page-orb-mint" />
        <span className="page-orb page-orb-cream" />
      </div>

      <svg className="page-ambient-contours" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="page-contour-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6fa35f" stopOpacity="0" />
            <stop offset="30%" stopColor="#6fa35f" stopOpacity=".24" />
            <stop offset="68%" stopColor="#8cb56f" stopOpacity=".15" />
            <stop offset="100%" stopColor="#6fa35f" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="page-contour" d="M-80 140 C220 70 420 210 720 140 S1200 60 1520 150" />
        <path className="page-contour" d="M-60 236 C260 176 480 310 760 240 S1220 170 1500 260" />
        <path className="page-contour" d="M-40 554 C250 494 520 638 800 558 S1240 488 1520 578" />
        <path className="page-contour" d="M-20 652 C280 592 540 726 840 656 S1260 586 1540 676" />
      </svg>

      <div className="page-ambient-leaves">
        <span className="page-leaf page-leaf-1">
          <svg viewBox="0 0 40 60" fill="none">
            <path d="M20 2C28 14 36 26 36 38C36 49 29 57 20 58C11 57 4 49 4 38C4 26 12 14 20 2Z" fill="currentColor" />
            <path d="M20 6C20 24 20 42 20 57" stroke="rgba(255,255,255,.45)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M20 22C24 19 28 20 30 22M20 28C16 25 12 26 10 28M20 36C24 33 28 34 31 37M20 42C16 39 12 40 9 43" stroke="rgba(255,255,255,.3)" strokeWidth=".8" strokeLinecap="round" />
          </svg>
        </span>
        <span className="page-leaf page-leaf-2">
          <svg viewBox="0 0 32 64" fill="none">
            <path d="M16 2C25 16 28 36 21 54C19 59 15 62 14 62C13 62 11 58 11 52C9 36 9 18 16 2Z" fill="currentColor" />
            <path d="M16 4C15 24 14 44 14 62" stroke="rgba(255,255,255,.48)" strokeWidth="1" strokeLinecap="round" />
            <path d="M15 22C19 20 23 23 24 26M15 34C11 31 8 33 7 37" stroke="rgba(255,255,255,.3)" strokeWidth=".75" />
          </svg>
        </span>
        <span className="page-leaf page-leaf-3">
          <svg viewBox="0 0 36 48" fill="none">
            <path d="M18 4C27 12 32 24 29 35C26 44 18 46 16 46C11 44 6 36 7 26C8 15 14 7 18 4Z" fill="currentColor" />
            <path d="M18 6C17 20 16 34 16 46" stroke="rgba(255,255,255,.45)" strokeWidth="1" strokeLinecap="round" />
            <path d="M17 21C21 19 24 21 26 23M17 29C13 27 10 28 8 31" stroke="rgba(255,255,255,.28)" strokeWidth=".75" />
          </svg>
        </span>
        <span className="page-leaf page-leaf-4">
          <svg viewBox="0 0 40 60" fill="none">
            <path d="M20 2C28 14 36 26 36 38C36 49 29 57 20 58C11 57 4 49 4 38C4 26 12 14 20 2Z" fill="currentColor" />
            <path d="M20 6C20 24 20 42 20 57" stroke="rgba(255,255,255,.35)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      </div>

      <div className="page-ambient-motes">
        {MOTES.map(mote => (
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

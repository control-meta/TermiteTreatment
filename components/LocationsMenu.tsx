'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import { locations } from '../lib/locations';
import styles from './LocationsMenu.module.css';

export default function LocationsMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const path = usePathname();
  useEffect(() => { if (details.current) details.current.open = false; }, [path]);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !details.current?.contains(event.target) && details.current) details.current.open = false;
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && details.current?.open) { details.current.open = false; summary.current?.focus(); }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);
  function cancelClose() { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } }
  function close() { cancelClose(); if (details.current) details.current.open = false; onNavigate?.(); }
  return <details className={`${styles.menu} ${mobile ? styles.mobile : ''}`} ref={details}
    onPointerEnter={event => {
      if (mobile || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
      cancelClose();
      if (details.current) details.current.open = true;
    }}
    onPointerLeave={event => {
      if (mobile || event.pointerType !== 'mouse') return;
      cancelClose();
      closeTimer.current = setTimeout(() => {
        if (details.current && !details.current.contains(document.activeElement)) details.current.open = false;
      }, 150);
    }}
    onBlur={event => {
      if (!mobile && !event.currentTarget.contains(event.relatedTarget)) { cancelClose(); event.currentTarget.open = false; }
    }}>
    <summary ref={summary} className={path.startsWith('/locations') ? styles.active : ''}><MapPin size={mobile ? 20 : 14} aria-hidden="true" /><span>Locations</span><ChevronDown size={14} aria-hidden="true" /></summary>
    <div className={styles.panel}>
      <p>LOCAL TEAMS. WIDER COVERAGE.</p>
      {locations.map(city => <a key={city.slug} href={`/locations/${city.slug}`} aria-current={path === `/locations/${city.slug}` ? 'page' : undefined} onClick={close}><span className={styles.pin}><MapPin size={17} aria-hidden="true" /></span><span><strong>{city.name}</strong><small>{city.state}</small></span><ArrowRight size={15} aria-hidden="true" /></a>)}
      <a className={styles.all} href="/locations" onClick={close}>Explore all locations <ArrowRight size={15} aria-hidden="true" /></a>
    </div>
  </details>;
}

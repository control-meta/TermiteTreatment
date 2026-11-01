'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, House, Building2, HardHat, CalendarCheck, LayoutGrid } from 'lucide-react';
import { termiteServices } from '../lib/company';
import { serviceVisuals } from '../lib/service-presentation';
import styles from '../app/(company)/services/services.module.css';

const filters = [
  { id: 'all', label: 'All services', icon: LayoutGrid },
  { id: 'home', label: 'Homes', icon: House },
  { id: 'business', label: 'Businesses', icon: Building2 },
  { id: 'build', label: 'New builds', icon: HardHat },
  { id: 'care', label: 'Ongoing care', icon: CalendarCheck },
] as const;

type Filter = typeof filters[number]['id'];

function matchesFilter(slug: string, filter: Filter) {
  if (filter === 'all') return true;
  if (filter === 'build') return slug === 'pre-construction-termite-treatment';
  if (filter === 'care') return slug === 'annual-maintenance-contract';
  return slug === 'post-construction-termite-treatment' || slug === 'annual-maintenance-contract' || slug === `${filter === 'home' ? 'residential' : 'commercial'}-termite-control`;
}

export default function ServicesExplorer() {
  const [filter, setFilter] = useState<Filter>('all');
  const shown = termiteServices.filter(service => matchesFilter(service.slug, filter));

  return <>
    <div className={styles.filters} role="group" aria-label="Filter termite services">
      {filters.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={filter === id} aria-controls="service-results" onClick={() => setFilter(id)}><Icon size={15} aria-hidden="true" />{label}</button>)}
    </div>
    <div className={styles.resultsMeta}><p role="status" aria-live="polite">{String(shown.length).padStart(2, '0')} {shown.length === 1 ? 'service' : 'services'} for {filter === 'all' ? 'every stage' : filters.find(item => item.id === filter)?.label.toLowerCase()}</p><span>One specialist focus. Your property.</span></div>
    <div className={styles.serviceGrid} id="service-results">
      {shown.map(service => {
        const index = termiteServices.indexOf(service);
        const visual = serviceVisuals[service.slug];
        return <article className={styles.serviceCard} key={service.slug}>
          <div className={styles.cardTop}>
            <div className={styles.servicePhoto}><img src={visual.src} alt={visual.alt} style={{ objectPosition: visual.position }} width={180} height={150} loading="lazy" /></div>
            <div><p className={styles.cardEyebrow}><span>0{index + 1}</span>{service.shortTitle}</p><h3><a href={`/services/${service.slug}`}>{service.title}</a></h3></div>
          </div>
          <p className={styles.cardDescription}>{service.text}</p>
          <div className={styles.tags}>{service.tags.map(tag => <span key={tag}><Check size={13} aria-hidden="true" />{tag}</span>)}</div>
          <a className={styles.cardLink} href={`/services/${service.slug}`}>View service details <ArrowUpRight size={18} aria-hidden="true" /></a>
        </article>;
      })}
    </div>
  </>;
}

'use client';

import { useState } from 'react';
import { ArrowUpRight, Check, ArrowRight } from 'lucide-react';
import { termiteServices } from '../lib/company';

export default function ServiceCards() {
  const [filter, setFilter] = useState('all');
  const shown = termiteServices.filter(item => filter === 'all' || item.type === 'both' || item.type === filter);
  return <>
    <div className="services-toolbar"><div className="filter-tabs" role="group" aria-label="Filter services">{[['all', 'All services'], ['home', 'For your home'], ['business', 'For your business']].map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{label}</button>)}</div><span className="toolbar-note">Specialist care. Every stage.</span></div>
    <div className={`services-grid specialist-services${shown.length < 5 ? ' is-centered' : ''}`}>{shown.map(item => <article className="service-card" key={item.slug}><a className="service-art" href={`/services/${item.slug}`} aria-label={`View ${item.title}`} tabIndex={-1} aria-hidden={false}><img className="service-photo" src={`/images/${item.image}.webp`} alt={item.alt} width={800} height={533} loading="lazy" /><span className="service-number">0{termiteServices.indexOf(item) + 1}</span><span className="art-caption">{item.shortTitle}</span></a><div className="service-content"><h3><a className="service-title-link" href={`/services/${item.slug}`}>{item.title}</a></h3><p>{item.text}</p><div className="service-tags">{item.tags.map(tag => <span key={tag}><Check size={12} />{tag}</span>)}</div><a className="text-link" href={`/services/${item.slug}`}>Explore service <ArrowUpRight size={19} /></a></div></article>)}</div>
    <div className="service-help"><span>Not sure where to start? We’ll help you find the right care.</span><a className="text-link" href="/contact-us">Talk to an expert <ArrowRight size={17} /></a></div>
  </>;
}

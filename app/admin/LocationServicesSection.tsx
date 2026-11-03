'use client';

import { useState } from 'react';
import { Building2, Edit3, ExternalLink, Search } from 'lucide-react';
import styles from './admin.module.css';

type LocalServiceItem = {
  key: string;
  citySlug: string;
  cityName: string;
  serviceSlug: string;
  serviceTitle: string;
  title: string;
  url: string;
  intro?: string;
};

type Props = {
  items: LocalServiceItem[];
  cities: { name: string; slug: string }[];
};

export default function LocationServicesSection({ items, cities }: Props) {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = items.filter(item => {
    const matchesCity = selectedCity === 'all' || item.citySlug === selectedCity;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <section className={styles.section} id="location-services">
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>
            <Building2 size={20} className={styles.titleIcon} />
            Location-Specific Service Pages ({items.length} Total)
          </h2>
          <p className={styles.sectionDesc}>
            Dedicated landing pages for each city and service combination (e.g. Residential Termite Control in Bangalore).
          </p>
        </div>

        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* City Filter Tabs */}
      <div className={styles.filterBar}>
        <button
          type="button"
          onClick={() => setSelectedCity('all')}
          className={`${styles.filterTab} ${selectedCity === 'all' ? styles.activeFilter : ''}`}
        >
          All Cities ({items.length})
        </button>
        {cities.map(c => {
          const count = items.filter(i => i.citySlug === c.slug).length;
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => setSelectedCity(c.slug)}
              className={`${styles.filterTab} ${selectedCity === c.slug ? styles.activeFilter : ''}`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid of Cards */}
      <div className={styles.cardGrid}>
        {filtered.map(item => (
          <article key={item.key} className={styles.pageCard}>
            <div className={styles.cardHeader}>
              <span className={styles.cityPill}>{item.cityName}</span>
              <span className={styles.routeTag}>{item.url}</span>
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            {item.intro && (
              <p className={styles.cardExcerpt}>{item.intro.slice(0, 110)}...</p>
            )}

            <div className={styles.cardFooter}>
              <a href={`/admin/edit/local_service/${item.key}`} className={styles.editBtn}>
                <Edit3 size={14} />
                <span>Edit Live &amp; Preview</span>
              </a>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewLink}
                title="View public page"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


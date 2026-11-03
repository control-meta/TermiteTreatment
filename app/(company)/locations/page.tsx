import ServiceBackground from '../../../components/ServiceBackground';
import type { Metadata } from 'next';
import { ArrowRight, MapPin, Phone } from 'lucide-react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import { company } from '../../../lib/company';
import { locations as staticLocations } from '../../../lib/locations';
import { getAllLocations } from '../../../lib/content-service';
import styles from './locations.module.css';

export const metadata: Metadata = {
  title: 'Our Locations | Termite Control in Six Cities',
  description: 'Find termite treatment in Mumbai, Bangalore, Pune, Delhi NCR, Goa and Noida. Explore five local services in each city and enquire about a free inspection.',
  alternates: { canonical: '/locations' },
  openGraph: { title: 'Our Locations | TermiteTreatment', description: 'Local termite control for homes, businesses and new construction in six Indian cities.', url: '/locations', type: 'website', locale: 'en_IN', images: [{ url: '/images/locations/bangalore-hero.webp', width: 1536, height: 1024, alt: 'Illustration of Vidhana Soudha and gardens in Bangalore, one of our six service locations' }] },
  twitter: { card: 'summary_large_image', title: 'Our Locations | TermiteTreatment', description: 'Find a local termite inspection and treatment service in your city.', images: [{ url: '/images/locations/bangalore-hero.webp', alt: 'Illustration of Vidhana Soudha and gardens in Bangalore' }] },
};

export default async function LocationsPage() {
  const locations = await getAllLocations();
  const schema = { '@context': 'https://schema.org', '@type': 'ItemList', name: 'TermiteTreatment service locations', itemListElement: locations.map((city, index) => ({ '@type': 'ListItem', position: index + 1, name: `Termite Treatment in ${city.name}`, url: `https://termitepestcontrol.co.in/locations/${city.slug}` })) };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <SiteHeader />
    <main id="main" className={styles.page}><ServiceBackground /><div className={styles.shell}>
      <header className={styles.indexIntro}><h1>Termite Treatment<br />in Your City</h1><p>Protect your home and business with expert termite control services. Choose your city to explore local inspections, treatment and ongoing care.</p></header>
      <section className={styles.cityGrid} aria-label="Our six service locations">{locations.map(city => <article className={styles.cityCard} key={city.slug}><img src={city.image} alt={city.imageAlt} width={1536} height={1024} loading="lazy" /><div><small><MapPin size={13} aria-hidden="true" />{city.state}</small><h2>{city.name}</h2><p>{city.areas.slice(0, 4).join(' · ')} and surrounding areas.</p><a href={`/locations/${city.slug}`}>Explore local services <ArrowRight size={17} aria-hidden="true" /></a></div></article>)}</section>
      <section className={styles.indexNote}><div><h2>Can’t find your area?</h2><p>Tell us where your property is. We’ll confirm service availability.</p></div><a className={styles.primaryButton} href={company.telephone}><Phone size={16} aria-hidden="true" />{company.phone}</a></section>
    </div></main>
    <SiteFooter />
  </>;
}

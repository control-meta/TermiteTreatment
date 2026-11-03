import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, ClipboardCheck, MapPin, Phone, Search, ShieldCheck, Sprout } from 'lucide-react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ServicesExplorer from '../../../components/ServicesExplorer';
import PageAmbientBackground from '../../../components/PageAmbientBackground';
import { company, regions, termiteServices } from '../../../lib/company';
import { serviceVisuals } from '../../../lib/service-presentation';
import styles from './services.module.css';

export const metadata: Metadata = {
  title: 'Termite Control Services | Residential, Commercial & Construction Protection',
  description: 'Explore 5 specialist termite control and prevention services: residential pest care, commercial protection, pre-construction soil treatment, post-construction drilling, and annual maintenance plans (AMC) across India.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Termite Control Services | Dedicated Property Protection',
    description: 'Explore 5 specialist termite care services for homes, businesses, and buildings under construction across India.',
    url: 'https://termitepestcontrol.co.in/services',
    siteName: 'TermiteTreatment',
    images: [
      {
        url: '/images/services/residential-v3.webp',
        width: 900,
        height: 600,
        alt: 'Specialist Termite Control Services in India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Termite Control Services | TermiteTreatment',
    description: 'Explore our 5 specialist termite inspection and treatment services for every property stage.',
    images: ['/images/services/residential-v3.webp'],
  },
};

const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Specialist Termite Control Services',
  description: 'Comprehensive termite control and prevention services for homes, businesses and construction projects in India.',
  itemListElement: termiteServices.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: service.title,
    description: service.text,
    url: `https://termitepestcontrol.co.in/services/${service.slug}`,
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://termitepestcontrol.co.in/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Our Services',
      item: 'https://termitepestcontrol.co.in/services',
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <PageAmbientBackground variant="services" />
      <main id="main" className={`${styles.page} services-page`}>
        <div className={styles.ambient} aria-hidden="true"><span className={styles.orbOne} /><span className={styles.orbTwo} /><span className={styles.orbThree} /><span className={styles.orbFour} /><span className={styles.heroSheen} /></div>
        <div className={styles.shell}>
          <section className={styles.hero} aria-labelledby="services-hero-title">
            <div className={styles.heroCopy}>
              <p className={styles.heroPill}><span /> SPECIALIST TERMITE SERVICES</p>
              <h1 id="services-hero-title">Care for your space.<br /><em>A plan that fits.</em></h1>
              <p className={styles.heroLead}>Five focused services for homes, businesses and new builds. Clear advice. Considered protection.</p>
              <div className={styles.heroActions}><a className={styles.primaryButton} href="#service-explorer">Find your service <ArrowRight size={18} aria-hidden="true" /></a><a className={styles.heroContact} href="/contact-us#enquiry">Book an inspection <ArrowUpRight size={17} aria-hidden="true" /></a></div>
              <div className={styles.heroAssurance}><ShieldCheck size={16} aria-hidden="true" /><span>Inspection first. A plan for your property.</span></div>
            </div>
            <figure className={styles.heroVisual}><img className={styles.heroImage} src={serviceVisuals['residential-termite-control'].src} alt={serviceVisuals['residential-termite-control'].alt} width={900} height={600} fetchPriority="high" /><figcaption><span className={styles.liveDot} /> Thoughtful care, from the first visit.</figcaption></figure>
          </section>

          <section className={styles.explorer} id="service-explorer" aria-labelledby="services-list-title">
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>FIND YOUR KIND OF CARE</p><h2 id="services-list-title">What does your<br className={styles.mobileBreak} /> <span>space need?</span></h2></div><p>Choose a property type or explore all five services.</p></div>
            <ServicesExplorer />
            <div className={styles.helpStrip}><span className={styles.helpIcon}><ShieldCheck size={23} aria-hidden="true" /></span><div><strong>A little unsure? That’s what we’re here for.</strong><p>Start with an inspection. We’ll help you choose the next step.</p></div><a href="/contact-us#enquiry">Let’s find your fit <ArrowUpRight size={18} aria-hidden="true" /></a></div>
          </section>

          <section className={styles.approach} aria-labelledby="approach-title">
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>A CLEAR WAY FORWARD</p><h2 id="approach-title">Considered care.<br /><span>Three simple steps.</span></h2></div><p>Know what happens next, from the first visit onwards.</p></div>
            <div className={styles.processGrid}>{[
              { icon: Search, title: 'First, we look closer.', text: 'We check the signs, the woodwork and the places termites could enter.' },
              { icon: ClipboardCheck, title: 'Then, a plan for you.', text: 'Understand the treatment, preparation and next steps before work begins.' },
              { icon: Sprout, title: 'Care beyond the visit.', text: 'Get practical aftercare and discuss follow-up suited to your property.' },
            ].map(({ icon: Icon, title, text }, index) => <article className={styles.processCard} key={title}><div><span className={styles.processIcon}><Icon size={24} aria-hidden="true" /></span><span className={styles.processNumber}>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div>
          </section>
        </div>

        <section className={styles.coverage} aria-labelledby="coverage-title"><div className={`${styles.shell} ${styles.coverageInner}`}><div><p className={styles.eyebrow}>LOCAL PEOPLE. SPECIALIST CARE.</p><h2 id="coverage-title">A wider reach.<br /><span>A personal approach.</span></h2><p>Tell us where you are. We’ll help you check service availability for your address.</p><a className={styles.coverageContact} href="/contact-us">Find care near you <ArrowUpRight size={18} aria-hidden="true" /></a></div><div className={styles.cityGrid}>{regions.map(city => <a href={`/contact-us?city=${encodeURIComponent(city)}#enquiry`} key={city}><MapPin size={14} aria-hidden="true" /><span>{city}</span><ArrowUpRight size={14} aria-hidden="true" /></a>)}</div></div></section>

        <section className={`${styles.shell} ${styles.finalSection}`} aria-labelledby="service-cta-title"><div className={styles.finalCard}><span className={styles.finalIcon}><ShieldCheck size={27} aria-hidden="true" /></span><div className={styles.finalCopy}><p className={styles.eyebrow}>LET’S FIND YOUR STARTING POINT</p><h2 id="service-cta-title">A little clarity.<br /><span>A good next step.</span></h2><p>Tell us what you’ve noticed. We’ll help you choose the right inspection.</p><div className={styles.finalActions}><a className={styles.primaryButton} href="/contact-us#enquiry">Book a free inspection <ArrowRight size={18} aria-hidden="true" /></a><a className={styles.phoneLink} href={company.telephone}><Phone size={16} aria-hidden="true" />{company.phone}</a></div><span className={styles.finalNote}>No pressure. Just a conversation.</span></div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}

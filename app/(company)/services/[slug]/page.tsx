import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Building2, CalendarCheck2, Check, ChevronRight, Drill, HardHat, House, Phone, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../../../components/SiteHeader';
import SiteFooter from '../../../../components/SiteFooter';
import { company, termiteServices } from '../../../../lib/company';
import { serviceVisuals } from '../../../../lib/service-presentation';
import styles from './service-detail.module.css';

export const dynamicParams = false;
export function generateStaticParams() {
  return termiteServices.map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = termiteServices.find(item => item.slug === slug);
  if (!service) return { title: 'Service Not Found' };

  const title = service.title;
  const description = `${service.headline} ${service.text} Suited for: ${service.suited}`;
  const visual = serviceVisuals[service.slug];

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://termitepestcontrol.co.in/services/${slug}`,
      siteName: 'TermiteTreatment',
      images: [
        {
          url: visual.src,
          width: 900,
          height: 600,
          alt: visual.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [visual.src],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = termiteServices.find(item => item.slug === slug);
  if (!service) notFound();
  const visual = serviceVisuals[service.slug];
  const enquiryHref = `/contact-us?service=${service.slug}#enquiry`;

  const ServiceIcon =
    service.slug === 'residential-termite-control'
      ? House
      : service.slug === 'commercial-termite-control'
      ? Building2
      : service.slug === 'pre-construction-termite-treatment'
      ? HardHat
      : service.slug === 'post-construction-termite-treatment'
      ? Drill
      : CalendarCheck2;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: `${service.headline} ${service.detail}`,
    serviceType: 'Pest Control - Termite Treatment',
    provider: {
      '@type': 'HomeAndConstructionBusiness',
      name: 'TermiteTreatment',
      telephone: company.phone,
      url: 'https://termitepestcontrol.co.in',
    },
    areaServed: 'India',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      description: 'Free Initial Termite Inspection and Custom Quote',
    },
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
        name: 'Services',
        item: 'https://termitepestcontrol.co.in/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `https://termitepestcontrol.co.in/services/${service.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main id="main" className={styles.page}>
        <div className={styles.ambient} aria-hidden="true"><span /><span /><i /></div>
        <div className={styles.shell}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <a href="/">Home</a><ChevronRight size={12} aria-hidden="true" />
            <a href="/services">Services</a><ChevronRight size={12} aria-hidden="true" />
            <span aria-current="page">{service.shortTitle}</span>
          </nav>

          <section className={styles.hero} aria-labelledby="service-title">
            <div className={styles.heroCopy}>
              <div className={styles.serviceLabel}>
                <span className={styles.serviceIcon}><ServiceIcon size={18} strokeWidth={1.6} aria-hidden="true" /></span>
                <p>{service.label}</p>
              </div>
              <h1 id="service-title">{service.title}</h1>
              <p className={styles.lead}>{service.text}</p>
              <div className={styles.tags}>{service.tags.map(tag => <span key={tag}><Check size={12} aria-hidden="true" />{tag}</span>)}</div>
              <div className={styles.heroActions}>
                <a href={enquiryHref} className={styles.primaryButton}>Book a free inspection <ArrowUpRight size={17} aria-hidden="true" /></a>
                <a className={styles.callLink} href={company.telephone}><Phone size={14} aria-hidden="true" />Talk to our team</a>
              </div>
            </div>
            <figure className={styles.heroVisual}>
              <img src={visual.src} alt={visual.alt} width={900} height={600} fetchPriority="high" style={{ objectPosition: visual.position }} />
              <figcaption><ShieldCheck size={16} aria-hidden="true" /><span>Care starts with a closer look.</span></figcaption>
            </figure>
          </section>

          <section className={styles.plan} aria-labelledby="plan-title">
            <header className={styles.sectionHeading}>
              <p className={styles.kicker}>PROPERTY-FIRST PROTECTION</p>
              <h2 id="plan-title">{service.headline}</h2>
              <p className={styles.sectionDescription}>{service.detail}</p>
            </header>
            <div className={styles.planGrid}>
              <article className={styles.includesCard}>
                <span className={styles.cardLabel}>WHAT’S INCLUDED</span>
                <h3>A clear, considered plan.</h3>
                <ul className={styles.inclusions}>{service.includes.map(item => <li key={item}><Check size={15} aria-hidden="true" /><span>{item}</span></li>)}</ul>
              </article>
              <aside className={styles.fitCard}>
                <div className={styles.fitHeading}><span className={styles.fitIcon}><ServiceIcon size={20} aria-hidden="true" /></span><span className={styles.cardLabel}>MADE FOR YOUR SPACE</span></div>
                <h3>A good fit for</h3>
                <p>{service.suited}</p>
                <a href={company.telephone}>Discuss your property <ArrowUpRight size={16} aria-hidden="true" /></a>
              </aside>
            </div>
          </section>

          <section className={styles.journey} aria-labelledby="journey-title">
            <header className={styles.inlineHeading}><div><p className={styles.kicker}>HOW IT WORKS</p><h2 id="journey-title">Simple steps. Thoughtful care.</h2></div><span>From first visit to follow-up.</span></header>
            <ol className={styles.steps}>{service.steps.map(([title, text], index) => <li key={title}><span className={styles.stepNumber}>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
          </section>

          <section className={styles.related} aria-labelledby="related-title">
            <header className={styles.inlineHeading}><div><p className={styles.kicker}>ALSO EXPLORE</p><h2 id="related-title">Care for every stage.</h2></div><a href="/services">All services <ArrowRight size={15} aria-hidden="true" /></a></header>
            <div className={styles.relatedGrid}>{termiteServices.filter(item => item.slug !== slug).map(item => {
              const relatedVisual = serviceVisuals[item.slug];
              return <a className={styles.relatedCard} href={`/services/${item.slug}`} key={item.slug}><img src={relatedVisual.src} alt={relatedVisual.alt} width={64} height={64} loading="lazy" style={{ objectPosition: relatedVisual.position }} /><span><small>{item.shortTitle}</small><strong>{item.title}</strong></span><ArrowUpRight size={17} aria-hidden="true" /></a>;
            })}</div>
          </section>

          <section className={styles.closing} aria-labelledby="inspection-title">
            <span className={styles.closingIcon}><ShieldCheck size={24} strokeWidth={1.5} aria-hidden="true" /></span>
            <div><p className={styles.kicker}>LET’S TAKE A CLOSER LOOK</p><h2 id="inspection-title">The right care starts here.</h2><p>A free inspection. A clear next step.</p></div>
            <a className={styles.primaryButton} href={enquiryHref}>Plan an inspection <ArrowUpRight size={17} aria-hidden="true" /></a>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Building2, CalendarCheck2, Check, Drill, HardHat, House, Phone, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../../../components/SiteHeader';
import SiteFooter from '../../../../components/SiteFooter';
import { company, termiteServices } from '../../../../lib/company';

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
          url: `/images/${service.image}.webp`,
          width: 1200,
          height: 630,
          alt: service.alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/images/${service.image}.webp`],
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = termiteServices.find(item => item.slug === slug);
  if (!service) notFound();

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
      <main id="main" className="inner-page service-detail-page service-detail-redesign">
        <section className="page-container service-hero-new">
          <nav className="breadcrumb service-crumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/services">Services</a>
            <span>/</span>
            <span aria-current="page">{service.shortTitle}</span>
          </nav>
          <div className="service-hero-copy">
            <span className="service-icon-badge">
              <ServiceIcon size={22} strokeWidth={1.8} />
            </span>
            <p className="eyebrow">{service.label}</p>
            <h1>{service.title}</h1>
            <p className="page-lead">{service.text}</p>
            <div className="service-hero-tags">
              {service.tags.map(tag => (
                <span key={tag}>
                  <Check size={14} />
                  {tag}
                </span>
              ))}
            </div>
            <div className="service-hero-actions">
              <a
                href={`/contact-us?service=${service.slug}#enquiry`}
                className="button button-primary"
              >
                Plan an inspection <ArrowRight size={18} />
              </a>
              <a className="service-call-link" href={company.telephone}>
                <Phone size={17} /> Talk to our team
              </a>
            </div>
          </div>
          <figure className="service-hero-art">
            <img
              src={`/images/${service.image}.webp`}
              alt={service.alt}
              width={1440}
              height={960}
              fetchPriority="high"
            />
            <figcaption>
              <span className="service-art-icon">
                <ShieldCheck size={19} />
              </span>
              <span>
                <strong>A thoughtful first step</strong>
                <small>Understand the property before choosing a plan.</small>
              </span>
            </figcaption>
          </figure>
        </section>

        <section className="service-plan-section">
          <div className="page-container service-plan-inner">
            <header className="service-section-heading">
              <p className="eyebrow">CARE THAT FITS YOUR PROPERTY</p>
              <h2>{service.headline}</h2>
              <p>{service.detail}</p>
            </header>
            <div className="service-detail-cards">
              <article className="service-includes-card">
                <p className="eyebrow">WHAT TO EXPECT</p>
                <h3>Care with a clear plan.</h3>
                <ul className="service-inclusions">
                  {service.includes.map(item => (
                    <li key={item}>
                      <span>
                        <Check size={15} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
              <aside className="service-fit-card">
                <span className="service-fit-icon">
                  <ServiceIcon size={23} />
                </span>
                <p className="eyebrow">A GOOD FIT FOR</p>
                <h3>Your kind of property.</h3>
                <p>{service.suited}</p>
                <a href={company.telephone}>
                  <span>
                    Talk through your space<strong>{company.phone}</strong>
                  </span>
                  <ArrowUpRight size={18} />
                </a>
              </aside>
            </div>
          </div>
        </section>

        <section className="service-journey-section">
          <div className="page-container service-journey-inner">
            <header className="service-section-heading">
              <p className="eyebrow">A CLEAR WAY FORWARD</p>
              <h2>
                Three considered steps.<br />
                <span>One less thing to wonder about.</span>
              </h2>
            </header>
            <ol className="service-journey">
              {service.steps.map(([title, text], index) => (
                <li key={title}>
                  <span className="journey-index">0{index + 1}</span>
                  <span className="journey-icon">
                    <ServiceIcon size={20} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            <a
              href={`/contact-us?service=${service.slug}#enquiry`}
              className="button button-primary service-journey-cta"
            >
              Start with an inspection <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="page-container related-services related-services-new">
          <header className="service-section-heading">
            <p className="eyebrow">EXPLORE SPECIALIST CARE</p>
            <h2>
              More ways to<br />
              <span>protect your property.</span>
            </h2>
            <a className="text-link" href="/services">
              See all services <ArrowRight size={18} />
            </a>
          </header>
          <div>
            {termiteServices
              .filter(item => item.slug !== slug)
              .map(item => (
                <a href={`/services/${item.slug}`} key={item.slug}>
                  <span>
                    {item.title}
                    <small>{item.shortTitle}</small>
                  </span>
                  <ArrowUpRight size={18} />
                </a>
              ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

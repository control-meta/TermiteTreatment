import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ServiceCards from '../../../components/ServiceCards';
import Coverage from '../../../components/Coverage';
import { termiteServices } from '../../../lib/company';

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
        url: '/images/service-residential-v1.webp',
        width: 1200,
        height: 630,
        alt: 'Specialist Termite Control Services in India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Termite Control Services | TermiteTreatment',
    description: 'Explore our 5 specialist termite inspection and treatment services for every property stage.',
    images: ['/images/service-residential-v1.webp'],
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
      <main id="main" className="inner-page services-page">
        <section className="page-container services-page-heading">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> <span>/</span> <span aria-current="page">Our services</span>
          </nav>
          <p className="eyebrow">
            <span className="tiny-line" /> FIVE SERVICES. ONE SPECIALIST FOCUS.
          </p>
          <h1>
            Every space. Every stage. <em>Thoughtfully protected.</em>
          </h1>
          <p className="page-lead">
            From the first foundation to the home you’ve made your own.<br />
            Find termite care that meets your property where it is.
          </p>
        </section>

        <section className="page-container services-page-grid" aria-labelledby="services-list-title">
          <h2 id="services-list-title" className="sr-only">
            Our Specialist Termite Control Services
          </h2>
          <ServiceCards />
        </section>

        <Coverage />

        <section className="page-container page-cta">
          <p className="eyebrow">WE’LL HELP YOU FIND YOUR STARTING POINT</p>
          <h2>
            Not sure which service<br />
            <span>your property needs?</span>
          </h2>
          <a href="/contact-us" className="button button-primary">
            Start with a free inspection <ArrowRight size={18} />
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

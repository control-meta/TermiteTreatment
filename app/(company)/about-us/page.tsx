import type { Metadata } from 'next';
import { ArrowRight, ShieldCheck, Search, HeartHandshake } from 'lucide-react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import Coverage from '../../../components/Coverage';

export const metadata: Metadata = {
  title: 'About Us | Dedicated Termite Control Specialists in India',
  description: 'Meet TermiteTreatment, India’s specialist termite inspection and pest control team. Proactive treatments, targeted protection, and trusted care for homes, businesses, and buildings across 9 major cities.',
  alternates: {
    canonical: '/about-us',
  },
  openGraph: {
    title: 'About Us | Dedicated Termite Control Specialists',
    description: 'Learn about our inspection-first termite care approach for homes, offices, and buildings under construction across India.',
    url: 'https://termitepestcontrol.co.in/about-us',
    siteName: 'TermiteTreatment',
    images: [
      {
        url: '/images/protected-home.webp',
        width: 1200,
        height: 630,
        alt: 'Protected Indian home exterior representing foundation-to-roof termite care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | TermiteTreatment Specialists',
    description: 'Dedicated termite inspection and treatment specialists serving homes and businesses across India.',
    images: ['/images/protected-home.webp'],
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
      name: 'About Us',
      item: 'https://termitepestcontrol.co.in/about-us',
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />
      <main id="main" className="inner-page about-page">
        <section className="page-container about-hero-redesign">
          <div className="ahr-banner">
            <div className="ahr-copy">
              <nav className="breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a> <span>/</span> <span aria-current="page">About us</span>
              </nav>
              <p className="ahr-eyebrow">
                <span className="ahr-dot" /> ABOUT TERMITEPESTCONTROL
              </p>
              <h1>
                We think about termites.<br />
                <em>So you don&apos;t have to.</em>
              </h1>
              <p className="page-lead">
                One specialist team for prevention, treatment and long-term care — for homes, businesses and buildings under construction across India.
              </p>
              <div className="ahr-actions">
                <a href="/contact-us" className="button button-primary">
                  Let’s talk about your space <ArrowRight size={18} />
                </a>
                <a href="/services" className="button ahr-secondary">
                  Discover our services
                </a>
              </div>
              <div className="ahr-trust">
                <div className="ahr-avatars">
                  <span className="ahr-initial">R</span>
                  <span className="ahr-initial">P</span>
                  <span className="ahr-initial">A</span>
                  <span className="ahr-rating">
                    <ShieldCheck size={14} /> 9 cities
                  </span>
                </div>
                <div>
                  <div className="ahr-stars">{'★★★★★'}</div>
                  <p>Trusted by homeowners, businesses and builders across India.</p>
                </div>
              </div>
            </div>
            <div className="ahr-visual">
              <img
                className="ahr-main"
                src="/images/protected-home.webp"
                alt="A protected Indian home exterior representing termite care from the foundation up"
                width={900}
                height={800}
                fetchPriority="high"
              />
              <img
                className="ahr-small"
                src="/images/termite-difference-inspection.webp"
                alt="Close inspection of termite activity through a magnifying glass"
                width={440}
                height={320}
                loading="lazy"
              />
              <div className="ahr-card ahr-card-top">
                <span>
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <strong>100% specialist</strong>
                  <p>Only termites. Nothing else.</p>
                </div>
              </div>
            </div>
            <div className="ahr-metrics">
              <div>
                <strong>01</strong>
                <span>
                  Clear focus<b>Termite protection</b>
                </span>
              </div>
              <div>
                <strong>05</strong>
                <span>
                  Specialist services<b>Every property stage</b>
                </span>
              </div>
              <div>
                <strong>09</strong>
                <span>
                  Major service regions<b>Across India</b>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="page-container about-story">
          <div>
            <p className="eyebrow">OUR STORY</p>
            <h2>
              Small signs deserve<br />
              <span>our full attention.</span>
            </h2>
          </div>
          <div className="story-copy">
            <p>
              Termites can go unnoticed while the damage grows. We help homeowners, businesses and builders understand the problem and find a practical way forward.
            </p>
            <p>
              Our work centres on termite prevention and treatment, from the foundation of a new building to the woodwork in a much-loved home. Every property is different. We begin by looking closely, then explain the care it needs.
            </p>
            <p>
              With teams serving major cities across India, our approach brings together specialist treatment, clear communication and continued support.
            </p>
            <a href="/services" className="text-link">
              Discover our five services <ArrowRight size={18} />
            </a>
          </div>
        </section>

        <section className="values-section">
          <div className="page-container">
            <div className="values-heading">
              <p className="eyebrow">THE WAY WE WORK</p>
              <h2>
                Good care starts<br />
                <span>with doing things properly.</span>
              </h2>
            </div>
            <div className="values-grid">
              {[
                [Search, 'Understand first.', 'A careful inspection helps us recommend treatment that fits your building and the signs we find.'],
                [HeartHandshake, 'Keep it clear.', 'Know the proposed work, preparation, price and applicable warranty before you choose a service.'],
                [ShieldCheck, 'Look ahead.', 'Prevention guidance, follow-up and maintenance options help you plan beyond a single visit.'],
              ].map(([Icon, title, text], index) => {
                const ValueIcon = Icon as typeof Search;
                return (
                  <article className="value-item" key={String(title)}>
                    <span className="value-icon">
                      <ValueIcon size={27} />
                    </span>
                    <span className="value-number">0{index + 1}</span>
                    <h3>{String(title)}</h3>
                    <p>{String(text)}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <Coverage />

        <section className="page-container page-cta">
          <p className="eyebrow">LET’S START WITH A CONVERSATION</p>
          <h2>
            A little care today.<br />
            <span>A more confident tomorrow.</span>
          </h2>
          <a className="button button-primary" href="/contact-us">
            Request a free inspection <ArrowRight size={18} />
          </a>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

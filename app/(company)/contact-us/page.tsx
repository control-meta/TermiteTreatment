import type { Metadata } from 'next';
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ContactForm from '../../../components/ContactForm';
import PageAmbientBackground from '../../../components/PageAmbientBackground';
import { company, offices, regions } from '../../../lib/company';

export const metadata: Metadata = {
  title: 'Contact Us | Book Free Termite Inspection',
  description: `Call ${company.phone} or schedule a free termite inspection. Connect with our dedicated pest control offices in Mumbai, Bengaluru, Pune, Delhi NCR, Goa, and Noida.`,
  alternates: {
    canonical: '/contact-us',
  },
  openGraph: {
    title: 'Contact Us | Book a Free Inspection | TermiteTreatment',
    description: 'Get in touch with our specialist termite control team across India. Free inspection, expert guidance, and custom treatment quotes.',
    url: 'https://termitepestcontrol.co.in/contact-us',
    siteName: 'TermiteTreatment',
    images: [
      {
        url: '/images/termiguard-family.webp',
        width: 1200,
        height: 630,
        alt: 'Contact TermiteTreatment - Customer Support and Local Offices',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | TermiteTreatment',
    description: 'Book a free termite inspection with our specialist teams across India.',
    images: ['/images/termiguard-family.webp'],
  },
};

const contactFaqs = [
  {
    q: 'Is the inspection free?',
    a: 'We offer free termite inspections. Contact the team to check availability for your location and arrange a suitable visit.',
  },
  {
    q: 'What should I share with the team?',
    a: 'Your city, property type, any termite signs and whether your building is new or already occupied. For construction projects, share the current stage of work.',
  },
  {
    q: 'Can I request care for an area not listed?',
    a: 'Yes. Tell us your city or area in the enquiry form, or call the team. We’ll confirm whether we can arrange service there.',
  },
];

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact TermiteTreatment',
  description: 'Contact details, phone numbers, WhatsApp, and office locations for TermiteTreatment across India.',
  url: 'https://termitepestcontrol.co.in/contact-us',
  mainEntity: {
    '@type': 'HomeAndConstructionBusiness',
    name: 'TermiteTreatment',
    telephone: company.phone,
    email: company.email,
    areaServed: offices.map(o => o.city),
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: contactFaqs.map(faq => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
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
      name: 'Contact Us',
      item: 'https://termitepestcontrol.co.in/contact-us',
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageAmbientBackground variant="contact" />
      <SiteHeader />
      <main id="main" className="inner-page contact-page">
        <section className="page-container contact-heading">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a> <span>/</span> <span aria-current="page">Contact us</span>
          </nav>
          <p className="eyebrow">
            <span className="tiny-line" /> WE’RE HERE TO HELP
          </p>
          <h1>
            Let’s take care <em>of your space.</em>
          </h1>
          <p className="page-lead">
            A question, a warning sign or a new project.<br />
            Start with a conversation. We’ll guide you from there.
          </p>
        </section>

        <section className="page-container contact-layout">
          <aside className="contact-aside">
            <div className="contact-direct">
              <p className="eyebrow">A REAL CONVERSATION</p>
              <h2>
                A little help.<br />
                Just a call away.
              </h2>
              <a className="contact-channel" href={company.telephone}>
                <span>
                  <Phone size={22} />
                </span>
                <div>
                  <small>CALL OUR TEAM</small>
                  <strong>{company.phone}</strong>
                </div>
                <ArrowUpRight size={20} />
              </a>
              <a className="contact-channel" href={`mailto:${company.email}`}>
                <span>
                  <Mail size={22} />
                </span>
                <div>
                  <small>WRITE TO US</small>
                  <strong>{company.email}</strong>
                </div>
                <ArrowUpRight size={20} />
              </a>
              <a
                className="contact-channel"
                href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
                  'Hello, I would like to discuss termite protection for my property.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <MessageCircle size={22} />
                </span>
                <div>
                  <small>KEEP IT SIMPLE</small>
                  <strong>Chat on WhatsApp</strong>
                </div>
                <ArrowUpRight size={20} />
              </a>
              <div className="contact-small-note">
                <MapPin size={18} />
                <p>
                  Local teams. Wider coverage.<br />
                  <a href="#locations">
                    Find our offices below <ArrowUpRight size={13} />
                  </a>
                </p>
              </div>
            </div>
            <div className="contact-next">
              <span>WHAT HAPPENS NEXT?</span>
              <ol>
                <li>
                  <b>01</b>
                  <div>
                    <strong>Tell us what you’ve noticed.</strong>
                    <p>Share your location and property details.</p>
                  </div>
                </li>
                <li>
                  <b>02</b>
                  <div>
                    <strong>Talk through the next step.</strong>
                    <p>Our team checks availability for an inspection.</p>
                  </div>
                </li>
                <li>
                  <b>03</b>
                  <div>
                    <strong>Understand your options.</strong>
                    <p>Get a proposed plan and quote after assessment.</p>
                  </div>
                </li>
              </ol>
            </div>
          </aside>
          <ContactForm />
        </section>

        <section className="office-section" id="locations">
          <div className="page-container">
            <div className="office-heading">
              <div>
                <p className="eyebrow">
                  <span className="tiny-line" /> CLOSER THAN YOU THINK
                </p>
                <h2>
                  Your city.
                  <br />
                  <span>Our local teams.</span>
                </h2>
              </div>
              <div className="office-heading-side">
                <p>Get in touch with our central team to arrange a visit or discuss service in your area.</p>
                <a className="office-helpline" href={company.telephone}>
                  <span className="office-helpline-icon">
                    <Phone size={18} />
                  </span>
                  <span className="office-helpline-text">
                    <small>Central helpline</small>
                    <strong>{company.phone}</strong>
                  </span>
                  <span className="office-helpline-arrow">
                    <ArrowUpRight size={17} />
                  </span>
                </a>
              </div>
            </div>
            <div className="offices-grid">
              {offices.map((office, index) => (
                <article className="office-card" key={office.city}>
                  <div className="office-top">
                    <span className="office-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="office-pin" aria-hidden="true">
                      <MapPin size={19} />
                    </span>
                  </div>
                  <p className="office-label">OFFICE &mdash; {office.city.toUpperCase()}</p>
                  <h3>{office.city}</h3>
                  <p className="office-address">
                    {office.location}. Contact our team for office details.
                  </p>
                  <div className="office-foot">
                    <a className="office-map-link" href={company.telephone}>
                      Contact {office.city} team <ArrowUpRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
              <article className="office-card office-cta">
                <div className="office-top office-cta-badge">
                  <span className="office-index office-index-light">+{regions.length}</span>
                  <span className="office-pin office-pin-light" aria-hidden="true">
                    <MessageCircle size={19} />
                  </span>
                </div>
                <div className="office-cta-copy">
                  <p className="office-label office-label-light">WIDER COVERAGE</p>
                  <h3>Outside these cities?</h3>
                  <p className="office-address office-address-light">
                    We arrange visits across neighbouring areas. Tell us where you are and we&rsquo;ll confirm
                    the fastest option.
                  </p>
                </div>
                <div className="office-cta-actions">
                  <a href="#enquiry" className="office-cta-primary">
                    Check your area <ArrowUpRight size={16} />
                  </a>
                  <a
                    href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
                      'Hello, I want to check service availability in my area.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="office-cta-secondary"
                  >
                    WhatsApp us
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="page-container contact-faq" id="contact-faq">
          <div>
            <p className="eyebrow">BEFORE WE SAY HELLO</p>
            <h2>A little clarity.</h2>
          </div>
          <div className="faq-list">
            {contactFaqs.map(faq => (
              <details key={faq.q}>
                <summary>
                  {faq.q}
                  <span>+</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

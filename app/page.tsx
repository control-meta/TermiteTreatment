import type { Metadata } from 'next';
import { ArrowRight, Building2, Check, CircleHelp, ClipboardCheck, House, Leaf, Phone, Search, ShieldCheck, SprayCan } from 'lucide-react';
import { company } from '../lib/company';
import { locations } from '../lib/locations';
import { Home2Enquiry, Home2Projects } from './home2/Home2Client';
import { home2Faqs, home2Services } from './home2/content';
import SheetImage from './home2/SheetImage';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import PageAmbientBackground from '../components/PageAmbientBackground';
import ReviewsCarousel from './home2/ReviewsCarousel';
import styles from './home2/home2.module.css';

const title = 'Termite Pest Control in Bangalore | Free Inspection';
const description = 'Professional termite control in Bangalore for homes and businesses. Explore pre-construction treatment, post-construction care and AMC plans. Book a free inspection.';
const heroAlt = 'Modern two-storey villa with a landscaped green lawn, glass balcony and bright blue sky';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: ['termite control Bangalore', 'termite pest control Bengaluru', 'anti-termite treatment', 'pre-construction termite control', 'post-construction termite treatment', 'residential termite control', 'commercial termite control', 'termite AMC'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'en_IN', url: '/', title, description, siteName: 'Termite Pest Control', images: [{ url: '/images/home2/hero-v1.webp', width: 1536, height: 1024, alt: heroAlt }] },
  twitter: { card: 'summary_large_image', title, description, images: [{ url: '/images/home2/hero-v1.webp', alt: heroAlt }] },
};

const process = [
  { title: 'Inspection', text: 'Detailed inspection of your property', icon: Search },
  { title: 'Customized Treatment', text: 'Tailored to your needs', icon: SprayCan },
  { title: 'Safety Assurance', text: 'Safe & effective methods', icon: ShieldCheck },
  { title: 'Ongoing Protection', text: 'Regular monitoring', icon: ClipboardCheck },
];
const reasons = ['Experienced & Trained Technicians', 'Safe & Eco-Friendly Treatment', 'Long-Lasting Protection', 'Affordable Pricing', 'Timely Service & Support'];
const serviceIcons = [House, ShieldCheck, Building2, Leaf];
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': 'https://termitepestcontrol.co.in/#webpage', url: 'https://termitepestcontrol.co.in/', name: title, description, inLanguage: 'en-IN', primaryImageOfPage: { '@type': 'ImageObject', url: 'https://termitepestcontrol.co.in/images/home2/hero-v1.webp', width: 1536, height: 1024, caption: heroAlt }, about: { '@type': 'Service', name: 'Termite Pest Control', areaServed: 'Bangalore', provider: { '@type': 'HomeAndConstructionBusiness', name: 'Termite Pest Control', telephone: company.phone, email: company.email, url: 'https://termitepestcontrol.co.in' } } },
    { '@type': 'FAQPage', mainEntity: home2Faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
  ],
};

export default function HomePage() {
  return <div className={styles.experience}><PageAmbientBackground /><div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <SiteHeader />
    <main id="main">
      <section className={styles.hero} id="home" aria-labelledby="home2-title">
        <img className={styles.heroImage} src="/images/home2/hero-v1.webp" alt={heroAlt} width={1536} height={1024} fetchPriority="high" />
        <div className={styles.heroWash} aria-hidden="true" />
        <div className={styles.shell}><div className={styles.heroCopy}>
          <h1 id="home2-title">Complete Termite<br className={styles.desktopBreak} /> Control Solutions <span>for Your Property</span></h1>
          <p className={styles.heroTagline}>Prevent. Protect. Peace of Mind.</p>
          <div className={styles.heroBenefits}><span><ShieldCheck size={30} strokeWidth={2.2} aria-hidden="true" /><strong>Expert<br />Team</strong></span><span><Leaf size={30} strokeWidth={2.2} aria-hidden="true" /><strong>Safe &<br />Eco-Friendly</strong></span><span><House size={30} strokeWidth={2.2} aria-hidden="true" /><strong>Long-Lasting<br />Protection</strong></span></div>
          <div className={styles.heroActions}><a className={styles.accentButton} href="#home2-enquiry">Get a Free Inspection <ArrowRight size={18} aria-hidden="true" /></a><a className={styles.primaryButton} href={company.telephone}><Phone size={17} fill="currentColor" aria-hidden="true" />Call Now</a></div>
        </div></div>
        <div className={styles.pestBadge} role="img" aria-label="Termites inside a red exclusion symbol"><SheetImage src="/images/home2/termites-v1.webp" index={0} columns={2} alt="Termite pest exclusion symbol" /><span aria-hidden="true" /></div>
      </section>

      <div className={styles.content}>
        <div className={`${styles.shell} ${styles.introGrid}`}>
          <section className={styles.about} id="about" aria-labelledby="home2-about-title"><h2 id="home2-about-title">About Our Company</h2><p>Termite Pest Control is a trusted provider of professional termite treatment services in Bangalore. We use advanced, odorless and safe methods to eliminate termites and protect your home and business for the long term.</p><a className={styles.textLink} href="/about-us">Know More About Us <ArrowRight size={16} aria-hidden="true" /></a></section>
          <section className={styles.services} id="services" aria-labelledby="home2-services-title"><h2 className={styles.ruledTitle} id="home2-services-title"><span>Our Termite Control Services</span></h2><div className={styles.serviceGrid}>{home2Services.map((service, index) => { const Icon = serviceIcons[index]; return <article className={styles.serviceCard} key={service.slug}><SheetImage src="/images/home2/termites-v1.webp" index={service.image} columns={2} alt={service.alt} className={styles.serviceImage} /><div className={styles.serviceCardBody}><div><Icon size={26} strokeWidth={1.8} aria-hidden="true" /><h3>{service.title}</h3></div><a className={styles.smallAccentButton} href={`/services/${service.slug}`} aria-label={`Know more about ${service.title}`}>Know More <ArrowRight size={14} aria-hidden="true" /></a></div></article>; })}</div></section>
        </div>

        <section className={`${styles.shell} ${styles.process}`} aria-labelledby="home2-process-title"><h2 className={styles.ruledTitle} id="home2-process-title"><span>Our Treatment Process</span></h2><ol>{process.map((step, index) => { const Icon = step.icon; return <li key={step.title}><div className={styles.processTop}><span>{index + 1}</span><ArrowRight size={21} strokeWidth={1.3} aria-hidden="true" /><Icon size={34} strokeWidth={2} aria-hidden="true" /></div><h3>{step.title}</h3><p>{step.text}</p>{index < 3 && <ArrowRight className={styles.processArrow} size={24} strokeWidth={1.5} aria-hidden="true" />}</li>; })}</ol></section>

        <section className={`${styles.shell} ${styles.solutions}`} aria-label="Residential and commercial termite solutions">
          <article className={styles.solution}><SheetImage src="/images/services/property-types-v4.webp" index={0} alt="Contemporary independent villa with a green garden" className={styles.solutionImage} /><div><h2>Residential{' '}<br />Termite Solutions</h2><ul>{['Apartments & Villas', 'Individual Houses', 'Rental Properties'].map(item => <li key={item}><Check size={14} strokeWidth={3} aria-hidden="true" />{item}</li>)}</ul><a className={styles.smallAccentButton} href="/services/residential-termite-control">Know More <ArrowRight size={15} aria-hidden="true" /></a></div></article>
          <article className={styles.solution}><SheetImage src="/images/services/property-types-v4.webp" index={2} alt="Modern glass-fronted commercial office building" className={styles.solutionImage} /><div><h2>Commercial{' '}<br />Termite Solutions</h2><ul>{['Offices & IT Parks', 'Retail Stores', 'Warehouses'].map(item => <li key={item}><Check size={14} strokeWidth={3} aria-hidden="true" />{item}</li>)}</ul><a className={styles.smallAccentButton} href="/services/commercial-termite-control">Know More <ArrowRight size={15} aria-hidden="true" /></a></div></article>
        </section>

        <div className={`${styles.shell} ${styles.proofGrid}`}>
          <section className={styles.why} id="why-us" aria-labelledby="home2-why-title"><img src="/images/home2/technician-v1.webp" alt="Protected technician in navy workwear carefully treating a timber door frame" width={1536} height={1024} loading="lazy" /><div><h2 id="home2-why-title">Why Choose Us?</h2><ul>{reasons.map(item => <li key={item}><Check size={14} strokeWidth={3} aria-hidden="true" />{item}</li>)}</ul></div></section>
          <Home2Projects />
        </div>

        <section className={`${styles.shell} ${styles.locationsSection}`} id="locations" aria-labelledby="home2-locations-title">
          <h2 className={styles.ruledTitle} id="home2-locations-title"><span>Our Locations</span></h2>
          <div className={styles.locationGrid}>{locations.map(city => <a className={styles.locationCard} href={`/locations/${city.slug}`} key={city.slug} aria-label={`Explore termite control in ${city.name}`}>
            <img src={city.image} alt={city.imageAlt} width={1536} height={1024} loading="lazy" />
            <div><span><strong>{city.name}</strong><small>{city.state}</small></span><ArrowRight size={17} aria-hidden="true" /></div>
          </a>)}</div>
        </section>

        <ReviewsCarousel />

        <div className={`${styles.shell} ${styles.faqSection}`}>
          <section className={styles.faqPanel} id="faqs" aria-labelledby="home2-faq-title">
            <div className={styles.faqIntro}>
              <p className={styles.faqKicker}><CircleHelp size={17} fill="#e3edda" aria-hidden="true" />Help without the guesswork</p>
              <h2 id="home2-faq-title">Termite questions,<br /><span>answered clearly.</span></h2>
              <p>Straight answers about treatment, safety and the care that follows. If your question is not here, our team is one conversation away.</p>
              <div className={styles.faqSupport}>
                <span className={styles.faqSupportIcon}><Phone size={19} aria-hidden="true" /></span>
                <div><small>Prefer to talk it through?</small><strong>Talk to a specialist</strong><a href={company.telephone}>{company.phone}</a></div>
              </div>
              <a className={styles.faqLink} href="/faqs">Browse all FAQs <ArrowRight size={15} aria-hidden="true" /></a>
            </div>
            <div className={styles.faqColumn}>
              <div className={styles.faqList}>
                {home2Faqs.map((faq, index) => <details key={faq.question} name="home2-faqs" open={index === 0}>
                  <summary><span className={styles.faqNumber}>0{index + 1}</span><span className={styles.faqQuestion}>{faq.question}</span><span className={styles.faqToggle} aria-hidden="true"><ChevronDownIcon /></span></summary>
                  <p>{faq.answer}</p>
                </details>)}
              </div>
              <div className={styles.faqFootnote}><ShieldCheck size={18} aria-hidden="true" /><p><strong>Not sure where to start?</strong> A free inspection is the simplest next step.</p><a href="#home2-enquiry">Book one <ArrowRight size={14} aria-hidden="true" /></a></div>
            </div>
          </section>
        </div>
      </div>

      <section className={styles.ctaSection} aria-labelledby="home2-cta-title"><div className={`${styles.shell} ${styles.ctaGrid}`}><div className={styles.ctaCopy}><ShieldCheck size={58} strokeWidth={2.2} aria-hidden="true" /><div><h2 id="home2-cta-title">Don’t Let Termites Damage Your Property!</h2><p>Get a free quote today and keep your home or business safe.</p></div><a className={styles.accentButton} href="#home2-enquiry">Get a Free Quote <ArrowRight size={17} aria-hidden="true" /></a></div><Home2Enquiry /></div></section>
    </main>

  </div><SiteFooter enquiryHref="#home2-enquiry" /></div>;
}

function ChevronDownIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;
}

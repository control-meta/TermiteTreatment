import AdminPreviewGuard from '../../../../components/AdminPreviewGuard';
import ServiceBackground from '../../../../components/ServiceBackground';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, BadgeCheck, Building2, CalendarCheck2, Check, ChevronDown, Clock3, Drill, HardHat, Headphones, House, Leaf, MapPin, Phone, ShieldCheck, ThumbsUp } from 'lucide-react';
import SiteHeader from '../../../../components/SiteHeader';
import SiteFooter from '../../../../components/SiteFooter';
import LocationEnquiryForm from '../../../../components/LocationEnquiryForm';
import LocationReviewsCarousel from '../../../../components/LocationReviewsCarousel';
import { company, termiteServices } from '../../../../lib/company';
import { getLocation, locations, locationServiceLabels, locationServiceUrl } from '../../../../lib/locations';
import { locationFaqs } from '../../../../lib/location-faqs';
import { getPageContent } from '../../../../lib/content-service';
import styles from '../locations.module.css';

export const dynamicParams = false;
export function generateStaticParams() { return locations.map(city => ({ city: city.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getLocation(slug);
  if (!city) return { title: 'Location Not Found' };
  const title = `Termite Treatment in ${city.name} | Local Pest Control Services`;
  const description = `Professional termite treatment in ${city.name}: residential, commercial, pre-construction, post-construction and AMC services. Call ${company.phone} for a free inspection.`;
  return { title, description, alternates: { canonical: `/locations/${city.slug}` }, openGraph: { title, description, url: `/locations/${city.slug}`, type: 'website', locale: 'en_IN', siteName: 'TermiteTreatment', images: [{ url: city.image, width: 1536, height: 1024, alt: city.imageAlt }] }, twitter: { card: 'summary_large_image', title, description, images: [{ url: city.image, alt: city.imageAlt }] } };
}

const serviceIcons = [House, Building2, HardHat, Drill, ShieldCheck];
const reasons = [[BadgeCheck, 'Trained & Certified Technicians'], [Leaf, 'Safe & Eco-Friendly Products'], [Clock3, 'Long-Lasting Protection'], [ThumbsUp, 'Affordable Pricing'], [Headphones, 'Prompt & Reliable Service']] as const;

export default async function CityLocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const city = getLocation(slug);
  if (!city) notFound();

  const content = await getPageContent('location', slug);
  const rawFaqs = content?.faqs;
  const faqs: [string, string][] = Array.isArray(rawFaqs) && rawFaqs.length > 0
    ? rawFaqs.map((item: any): [string, string] => (Array.isArray(item) ? [String(item[0] || ''), String(item[1] || '')] : [String(item.question || ''), String(item.answer || '')]))
    : locationFaqs(city);

  const heroLead = content?.heroLead ?? 'Protect Your Home & Business with Expert Termite Control Services';
  const aboutText = content?.about ?? city.about;
  const areas = content?.areas && Array.isArray(content.areas) && content.areas.length > 0 ? content.areas : city.areas;

  const url = `https://termitepestcontrol.co.in/locations/${city.slug}`;
  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: `Termite Treatment in ${city.name}`, description: aboutText, url, primaryImageOfPage: { '@type': 'ImageObject', url: `https://termitepestcontrol.co.in${city.image}`, caption: city.imageAlt } },
    { '@context': 'https://schema.org', '@type': 'Service', name: `Termite Control in ${city.name}`, areaServed: { '@type': 'City', name: city.officialName }, provider: { '@type': 'HomeAndConstructionBusiness', name: 'TermiteTreatment', telephone: company.phone, url: 'https://termitepestcontrol.co.in' }, hasOfferCatalog: { '@type': 'OfferCatalog', name: `Termite services in ${city.name}`, itemListElement: termiteServices.map(service => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: `${service.title} in ${city.name}`, url: `https://termitepestcontrol.co.in${locationServiceUrl(city, service.slug)}` } })) } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Our Locations', '/locations'], [city.name, `/locations/${city.slug}`]].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `https://termitepestcontrol.co.in${path}` })) },
  ];
  return <>
    <AdminPreviewGuard textOverrides={content?.textOverrides} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <SiteHeader />
    <main className={styles.page} id="main">
      <ServiceBackground />
      <section className={styles.hero} aria-labelledby="location-title">
        <img src={city.image} alt={city.imageAlt} width={1536} height={1024} fetchPriority="high" className={styles.heroImage} />
        <div className={styles.heroVeil} aria-hidden="true" />
        <ServiceBackground hero />
        <div className={styles.shell}><div className={styles.heroCopy}>
          <h1 id="location-title" data-edit-field="heroTitle">{content?.heroTitle != null ? content.heroTitle : <>Termite Treatment<br />in <span>{city.name}</span></>}</h1>
          <p className={styles.heroLead} data-edit-field="heroLead">{heroLead}</p>
          <ul className={styles.heroChecks}>{['Safe & Effective Treatment', 'Odorless & Eco-Friendly Solution', 'Experienced Local Experts'].map(text => <li key={text}><Check size={15} strokeWidth={3} aria-hidden="true" />{text}</li>)}</ul>
          <a className={styles.accentButton} href="#local-enquiry"><CalendarCheck2 size={18} aria-hidden="true" />Book a Free Inspection <ArrowRight size={17} aria-hidden="true" /></a>
        </div></div>
        <span className={styles.cityBadge}><MapPin size={21} fill="currentColor" aria-hidden="true" />{city.name}</span>
      </section>

      <div className={styles.shell}>
        <section className={styles.aboutServices} aria-labelledby="about-city-title" id="local-services">
          <div className={styles.about}><h2 id="about-city-title">About Termite Control{' '}<br />in {city.name}</h2><p data-edit-field="about">{aboutText}</p><a className={styles.primaryButton} href="/about-us">Know More About Us <ArrowRight size={16} aria-hidden="true" /></a></div>
          <div className={styles.servicesPanel}><h2>Our Termite Control Services in {city.name}</h2><div className={styles.serviceGrid}>{termiteServices.map((service, index) => { const Icon = serviceIcons[index]; const [title, sub] = locationServiceLabels[service.slug]; return <a className={styles.serviceCard} href={locationServiceUrl(city, service.slug)} key={service.slug}><Icon size={35} strokeWidth={1.7} aria-hidden="true" /><h3>{title}</h3><p>{sub}</p><span>Explore service <ArrowRight size={14} aria-hidden="true" /></span></a>; })}</div></div>
        </section>

        <section className={styles.whyStrip} aria-labelledby="why-city-title"><div><h2 id="why-city-title">Why Choose Our{' '}<br />Termite Pest Control{' '}<br />in {city.name}?</h2><p>Because your property deserves{' '}<br />the best care!</p></div><div className={styles.reasons}>{reasons.map(([Icon, title]) => <article key={title}><Icon size={34} strokeWidth={1.7} aria-hidden="true" /><h3>{title}</h3></article>)}</div></section>

        <section className={styles.coverageProjects} aria-labelledby="coverage-title">
          <div className={styles.coverage}><h2 id="coverage-title">Areas We Cover in {city.name}</h2><ul>{areas.map((area, index) => <li key={area}><Check size={12} strokeWidth={3} aria-hidden="true" /><span data-edit-area-index={index}>{area}</span></li>)}</ul><a className={styles.accentButton} href="#local-enquiry">Check Your Area <ArrowRight size={17} aria-hidden="true" /></a><div className={styles.skyline} aria-hidden="true"><Building2 /><Building2 /><House /><Building2 /><House /><Building2 /></div></div>
          <div className={styles.projectPanel}><div className={styles.projectHeading}><h2>Our Recent Termite Control Projects<br />in {city.name}</h2><span>Illustrative property gallery</span></div><div className={styles.projectGrid}>{[[1, `Apartment – ${city.areas[1]}`], [0, `Villa – ${city.areas[5]}`], [2, `Office – ${city.areas[0]}`]].map(([image, title]) => <figure key={title}><div role="img" aria-label={`${title}, illustrative architectural image`} className={styles.projectImage} style={{ backgroundPosition: `${Number(image) * 50}% 0%` }} /><figcaption>{title}</figcaption></figure>)}</div></div>
        </section>

        <section className={styles.supportGrid} aria-label={`Enquiries and frequently asked questions for ${city.name}`}>
          <div className={styles.supportStack}>
            <LocationReviewsCarousel />
          <div className={styles.faqs} id="local-faqs"><h2>Frequently Asked Questions</h2><div>{faqs.map(([q, a], index) => <details name={`faq-${city.slug}`} key={q}><summary data-edit-faq-index={index} data-edit-faq-part="question">{q}<ChevronDown size={15} aria-hidden="true" /></summary><p data-edit-faq-index={index} data-edit-faq-part="answer">{a}</p></details>)}</div><a className={styles.textLink} href="/faqs">View More FAQs <ArrowRight size={15} aria-hidden="true" /></a></div>
          </div>
          <div id="local-enquiry" className={styles.formAnchor}><LocationEnquiryForm citySlug={city.slug} /></div>
        </section>
        <aside className={styles.otherCities} aria-label="Other locations"><span>EXPLORE OUR OTHER LOCATIONS</span><div>{locations.filter(item => item.slug !== city.slug).map(item => <a href={`/locations/${item.slug}`} key={item.slug}>{item.name}<ArrowRight size={14} aria-hidden="true" /></a>)}</div></aside>
      </div>
    </main>
    <SiteFooter locationName={`${city.name}, India`} servicesHref={`/locations/${city.slug}#local-services`} enquiryHref="#local-enquiry" />
  </>;
}

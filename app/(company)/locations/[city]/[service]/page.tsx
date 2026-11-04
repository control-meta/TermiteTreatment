import AdminPreviewGuard from '../../../../../components/AdminPreviewGuard';
import ServiceHero from '../../../../../components/ServiceHero';
import ServiceBackground from '../../../../../components/ServiceBackground';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ClipboardCheck, Headphones, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../../../../components/SiteHeader';
import SiteFooter from '../../../../../components/SiteFooter';
import ServiceEnquiryForm from '../../../../../components/ServiceEnquiryForm';
import ServiceBenefitGrid from '../../../../../components/ServiceBenefitGrid';
import { company, termiteServices } from '../../../../../lib/company';
import { getLocation, locations, locationServiceUrl } from '../../../../../lib/locations';
import { getLocalizedService } from '../../../../../lib/location-services';
import type { ServiceDetail } from '../../../../../lib/service-details';
import { getLocalizedServiceContent } from '../../../../../lib/content-service';
import { serviceVisuals } from '../../../../../lib/service-presentation';
import styles from '../../../services/[slug]/service-detail.module.css';
import localStyles from './location-service.module.css';

export const dynamicParams = false;
export function generateStaticParams() { return locations.flatMap(city => termiteServices.map(service => ({ city: city.slug, service: service.slug }))); }

type RouteParams = { city: string; service: string };
export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getLocation(citySlug);
  const service = termiteServices.find(item => item.slug === serviceSlug);
  if (!city || !service) return { title: 'Service Not Found' };
  const detail = getLocalizedService(city, serviceSlug)!;
  const content = await getLocalizedServiceContent(citySlug, serviceSlug);
  const title = content?.title ?? detail.title;
  const rawDesc = content?.intro ?? `${title} for local homes and businesses. Enquire about inspection, treatment and aftercare in ${city.areas[0]}, ${city.areas[1]} and nearby areas. Call ${company.phone}.`;
  const description = rawDesc.length > 160 ? `${rawDesc.slice(0, 157).trim()}...` : rawDesc;
  const path = locationServiceUrl(city, serviceSlug);
  return { title, description, alternates: { canonical: path }, openGraph: { title, description, url: path, siteName: 'TermiteTreatment', type: 'website', locale: 'en_IN', images: [{ url: detail.hero, width: 1536, height: 1024, alt: detail.heroAlt }] }, twitter: { card: 'summary_large_image', title, description, images: [{ url: detail.hero, alt: detail.heroAlt }] } };
}


export default async function LocalServicePage({ params }: { params: Promise<RouteParams> }) {
  const { city: citySlug, service: serviceSlug } = await params;
  const city = getLocation(citySlug);
  const service = termiteServices.find(item => item.slug === serviceSlug);
  if (!city || !service) notFound();

  const baseDetail = getLocalizedService(city, serviceSlug);
  if (!baseDetail) notFound();

  const localContent = (await getLocalizedServiceContent(citySlug, serviceSlug)) as any;
  const normalizedFaqs: [string, string][] = localContent?.faqs
    ? (localContent.faqs as any[]).map((f: any): [string, string] =>
        Array.isArray(f) ? [String(f[0] || ''), String(f[1] || '')] : [String(f.question || ''), String(f.answer || '')]
      )
    : baseDetail.faqs;

  const detail: ServiceDetail = localContent
    ? {
        ...baseDetail,
        title: localContent.title ?? baseDetail.title,
        accent: localContent.accent ?? baseDetail.accent,
        intro: localContent.intro ?? baseDetail.intro,
        definitionTitle: localContent.definitionTitle ?? baseDetail.definitionTitle,
        definition: localContent.definition ?? baseDetail.definition,
        benefitTitle: localContent.benefitTitle ?? baseDetail.benefitTitle,
        benefits: (localContent.benefits as [string, string][]) || baseDetail.benefits,
        processTitle: localContent.processTitle ?? baseDetail.processTitle,
        processIntro: localContent.processIntro ?? baseDetail.processIntro,
        steps: (localContent.steps as [string, string][]) || baseDetail.steps,
        faqs: normalizedFaqs,
      }
    : baseDetail;

  const construction = serviceSlug === 'pre-construction-termite-treatment';
  const visual = serviceVisuals[serviceSlug];
  const title = detail.title;
  const url = `https://termitepestcontrol.co.in${locationServiceUrl(city, serviceSlug)}`;
  const whatsapp = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`Hello, I would like to discuss ${service.title} in ${city.name}.`)}`;
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Service', name: title, description: detail.definition, url, serviceType: service.title, areaServed: { '@type': 'City', name: city.officialName }, provider: { '@type': 'HomeAndConstructionBusiness', name: 'TermiteTreatment', telephone: company.phone, url: 'https://termitepestcontrol.co.in' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: detail.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Locations', '/locations'], [city.name, `/locations/${city.slug}`], [service.title, locationServiceUrl(city, serviceSlug)]].map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: `https://termitepestcontrol.co.in${path}` })) },
  ];
  return <>
    <AdminPreviewGuard textOverrides={localContent?.textOverrides} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <SiteHeader />
    <main id="main" className={`${styles.page} ${localStyles.page}`}>
      <ServiceBackground variant="service" />
      <ServiceHero service={service} detail={detail} city={city} />
      <div className={localStyles.cityContext}><div className={styles.shell}><a href={`/locations/${city.slug}`}><MapPin size={17} aria-hidden="true" />Termite treatment in {city.name}<ArrowRight size={16} aria-hidden="true" /></a><p>{city.areas.slice(0, 4).join(' · ')} &amp; nearby areas</p></div></div>

      <section className={`${styles.shell} ${styles.overview}`} id="local-overview" aria-labelledby="local-overview-title"><div className={styles.definition}><p className={styles.kicker}>PLANNED FOR YOUR CITY</p><h2 id="local-overview-title" data-edit-field="definitionTitle">{detail.definitionTitle}</h2><p data-edit-field="definition">{detail.definition}</p><a className={styles.textLink} href="#local-process">See how it works <ArrowRight size={17} aria-hidden="true" /></a></div><div className={styles.benefits}><h2 data-edit-field="benefitTitle">{detail.benefitTitle}</h2><ServiceBenefitGrid benefits={detail.benefits} /></div></section>

      <section className={styles.processSection} id="local-process" aria-labelledby="local-process-title"><div className={styles.shell}><header className={styles.sectionHeading}><p className={styles.kicker}>LOCAL SERVICE, STEP BY STEP</p><h2 id="local-process-title" data-edit-field="processTitle">{detail.processTitle}</h2><p data-edit-field="processIntro">{detail.processIntro}</p></header><div className={styles.processGrid}><figure className={styles.processVisual}><div className={styles.processImageWrap}><img src={construction ? '/images/services/foundation-cutaway-v4.webp' : visual.src} alt={construction ? `Illustration of pre-construction soil treatment zones for a new building in ${city.name}` : `Illustrative ${service.title.toLowerCase()} inspection for a ${city.name} property`} width={900} height={600} loading="lazy" /><span className={styles.imageLabel}><MapPin size={17} aria-hidden="true" />Care planned around your {city.name} property.</span></div><figcaption>Illustrative service image. Your treatment scope follows the local property assessment.</figcaption></figure><ol className={styles.processSteps}>{detail.steps.map(([heading, text], index) => <li key={heading}><span className={styles.stepNumber}>0{index + 1}</span><div><h3 data-edit-step-index={index} data-edit-step-part="title">{heading}</h3><p data-edit-step-index={index} data-edit-step-part="description">{text}</p></div></li>)}</ol></div></div></section>

      <section className={`${styles.shell} ${localStyles.otherServices}`} aria-labelledby="other-local-services-title">
        <header><p className={styles.kicker}>EXPLORE LOCAL SERVICES</p><h2 id="other-local-services-title">Other termite services in {city.name}</h2><p>Find the right care for your property, all from our {city.name} team.</p></header>
        <div className={localStyles.serviceCards}>{termiteServices.filter(item => item.slug !== serviceSlug).map(item => <a className={localStyles.serviceCard} href={locationServiceUrl(city, item.slug)} key={item.slug}>
          <img src={serviceVisuals[item.slug].src} alt={`${item.title} pest control in ${city.name}`} width={900} height={600} loading="lazy" />
          <div><h3>{item.title}</h3><p>{item.text}</p><span>Explore in {city.name}<ArrowUpRight size={17} aria-hidden="true" /></span></div>
        </a>)}</div>
      </section>

      <section className={`${styles.shell} ${styles.projectsSection}`} aria-labelledby="local-properties-title"><header className={styles.inlineHeading}><div><p className={styles.kicker}>FOR HOMES, BUSINESSES & NEW BUILDS</p><h2 id="local-properties-title">{detail.projectsTitle}</h2></div></header><div className={styles.projects}>{detail.projects.map(([heading, image], index) => <article className={styles.projectCard} key={heading}><div className={styles.projectPhoto} role="img" aria-label={`${heading}, illustrative architectural image`} style={{ backgroundPosition: `${(image % 3) * 50}% ${image < 3 ? 0 : 100}%` }} /><div className={styles.projectLabel}><span>0{index + 1}</span><h3>{heading}</h3></div></article>)}</div></section>

      <section className={styles.assuranceSection} id="local-service-faqs"><div className={`${styles.shell} ${styles.assuranceGrid}`}><div className={styles.whyCard}><p className={styles.kicker}>LOCAL CARE. CLEAR INFORMATION.</p><h2>{detail.whyTitle}</h2><p>{city.context}</p><ul>{detail.whyItems!.map(item => <li key={item}><span><Check size={15} aria-hidden="true" /></span>{item}</li>)}</ul><a href={company.telephone}><span className={styles.supportIcon}><Headphones size={22} aria-hidden="true" /></span><span><small>DISCUSS YOUR {city.name.toUpperCase()} PROPERTY</small><strong>{company.phone}</strong></span><ArrowUpRight size={20} aria-hidden="true" /></a></div><div className={styles.faqs}><p className={styles.kicker}>QUESTIONS FROM YOUR CITY</p><h2>{service.title} in {city.name}: FAQs</h2><div className={styles.faqList}>{detail.faqs.map(([question, answer], index) => <details name={`local-${city.slug}-${serviceSlug}`} key={question}><summary data-edit-faq-index={index} data-edit-faq-part="question">{question}<ChevronDown size={18} aria-hidden="true" /></summary><p data-edit-faq-index={index} data-edit-faq-part="answer">{answer}</p></details>)}</div></div></div></section>

      <section className={styles.enquirySection} id="local-service-enquiry" aria-labelledby="local-enquiry-title"><img className={styles.enquiryBackground} src={city.image} alt={city.imageAlt || `Termite control inspection and service in ${city.name}`} width={1536} height={1024} loading="lazy" /><div className={`${styles.shell} ${styles.enquiryGrid}`}><div className={styles.enquiryCopy}><p className={styles.heroEyebrow}><MapPin size={14} aria-hidden="true" />{city.name.toUpperCase()} SERVICE ENQUIRY</p><h2 id="local-enquiry-title">{detail.closingTitle}{' '}<span>{detail.closingAccent}</span></h2><p>{detail.closingText}</p><div className={styles.enquiryActions}><a className={styles.outlineButton} href={company.telephone}><Phone size={17} aria-hidden="true" />{company.phone}</a><a className={styles.whatsappButton} href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" />WhatsApp us <ArrowUpRight size={16} aria-hidden="true" /></a></div></div><ServiceEnquiryForm key={`${city.slug}-${serviceSlug}`} serviceTitle={service.title} city={city.name} /></div></section>

      <div className={styles.trustStrip}><div className={styles.shell}><span><MapPin size={22} aria-hidden="true" />Local {city.name} support</span><span><ShieldCheck size={22} aria-hidden="true" />Property-specific plans</span><span><ClipboardCheck size={22} aria-hidden="true" />Clear service information</span><span><Headphones size={22} aria-hidden="true" />{company.phone}</span></div></div>
    </main><SiteFooter locationName={`${city.name}, India`} servicesHref={`/locations/${city.slug}#local-services`} enquiryHref="#local-service-enquiry" />
  </>;
}

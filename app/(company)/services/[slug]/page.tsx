import AdminPreviewGuard from '../../../../components/AdminPreviewGuard';
import ServiceHero from '../../../../components/ServiceHero';
import ServiceBackground from '../../../../components/ServiceBackground';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, CalendarCheck2, Check, ChevronDown, ClipboardCheck, Headphones, MapPin, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../../../components/SiteHeader';
import SiteFooter from '../../../../components/SiteFooter';
import ServiceEnquiryForm from '../../../../components/ServiceEnquiryForm';
import ServiceBenefitGrid from '../../../../components/ServiceBenefitGrid';
import { company, termiteServices } from '../../../../lib/company';
import { serviceDetails } from '../../../../lib/service-details';
import { serviceVisuals } from '../../../../lib/service-presentation';
import { getPageContent } from '../../../../lib/content-service';
import styles from './service-detail.module.css';

export const dynamicParams = false;
export function generateStaticParams() {
  return termiteServices.map(item => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = termiteServices.find(item => item.slug === slug);
  const detail = serviceDetails[slug];
  if (!service || !detail) return { title: 'Service Not Found' };
  return {
    title: service.title,
    description: detail.intro,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title: service.title,
      description: detail.intro,
      url: `https://termitepestcontrol.co.in/services/${slug}`,
      siteName: 'TermiteTreatment',
      images: [{ url: detail.hero, width: 1536, height: 1024, alt: detail.heroAlt }],
    },
    twitter: { card: 'summary_large_image', title: service.title, description: detail.intro, images: [detail.hero] },
  };
}

const pointPositions = [
  { left: '23%', top: '58%' },
  { left: '39%', top: '49%' },
  { left: '55%', top: '42%' },
  { left: '82%', top: '53%' },
  { left: '94%', top: '36%' },
];

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = termiteServices.find(item => item.slug === slug);
  const baseDetail = serviceDetails[slug];
  if (!service || !baseDetail) notFound();

  const content = await getPageContent('service', slug);
  const normalizedFaqs: [string, string][] = content?.faqs
    ? (content.faqs as any[]).map((f: any): [string, string] =>
        Array.isArray(f) ? [String(f[0] || ''), String(f[1] || '')] : [String(f.question || ''), String(f.answer || '')]
      )
    : baseDetail.faqs;

  const detail = content
    ? {
        ...baseDetail,
        title: content.title ?? baseDetail.title,
        accent: content.accent ?? baseDetail.accent,
        intro: content.intro ?? baseDetail.intro,
        definitionTitle: content.definitionTitle ?? baseDetail.definitionTitle,
        definition: content.definition ?? baseDetail.definition,
        benefitTitle: content.benefitTitle ?? baseDetail.benefitTitle,
        benefits: (content.benefits as [string, string][]) || baseDetail.benefits,
        processTitle: content.processTitle ?? baseDetail.processTitle,
        processIntro: content.processIntro ?? baseDetail.processIntro,
        steps: (content.steps as [string, string][]) || baseDetail.steps,
        faqs: normalizedFaqs,
      }
    : baseDetail;

  const preconstruction = slug === 'pre-construction-termite-treatment';
  const visual = serviceVisuals[slug];
  const whatsappHref = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(`Hello, I would like to discuss ${service.title} for my property.`)}`;
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Service', name: service.title, description: detail.definition,
      serviceType: 'Termite inspection and treatment', areaServed: 'India',
      provider: { '@type': 'HomeAndConstructionBusiness', name: 'TermiteTreatment', telephone: company.phone, url: 'https://termitepestcontrol.co.in' },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: detail.faqs.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [['Home', '/'], ['Services', '/services'], [service.title, `/services/${slug}`]].map(([name, path], index) => ({ '@type': 'ListItem', position: index + 1, name, item: `https://termitepestcontrol.co.in${path}` })),
    },
  ];

  return <>
    <AdminPreviewGuard textOverrides={content?.textOverrides} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <SiteHeader />
    <main id="main" className={styles.page}>
      <ServiceBackground variant="service" />
      <ServiceHero service={service} detail={detail} />

      <div className={styles.sectionNav}><div className={styles.shell}><a href="#overview">Overview</a><a href="#treatment-process">Our process</a><a href="#property-types">Property types</a><a href="#service-faqs">FAQs</a><a href="#service-enquiry">Get in touch <ArrowUpRight size={14} aria-hidden="true" /></a></div></div>

      <section className={`${styles.shell} ${styles.overview}`} id="overview" aria-labelledby="overview-title">
        <div className={styles.definition}>{!preconstruction && <p className={styles.kicker}>UNDERSTAND THE TREATMENT</p>}<h2 id="overview-title" data-edit-field="definitionTitle">{detail.definitionTitle}</h2><p data-edit-field="definition">{detail.definition}</p><a className={styles.textLink} href="#treatment-process">See how it works <ArrowRight size={17} aria-hidden="true" /></a></div>
        <div className={styles.benefits}><h2 data-edit-field="benefitTitle">{detail.benefitTitle}</h2><ServiceBenefitGrid benefits={detail.benefits} numbered={preconstruction} /></div>
      </section>

      <section className={styles.processSection} id="treatment-process" aria-labelledby="process-title"><div className={styles.shell}>
        <header className={styles.sectionHeading}>{!preconstruction && <p className={styles.kicker}>A CLEAR PLAN, STEP BY STEP</p>}<h2 id="process-title" data-edit-field="processTitle">{detail.processTitle}</h2><p data-edit-field="processIntro">{detail.processIntro}</p></header>
        <div className={styles.processGrid}>
          <figure className={`${styles.processVisual} ${preconstruction ? styles.cutaway : ''}`}>
            <div className={styles.processImageWrap}><img src={preconstruction ? '/images/services/foundation-cutaway-v4.webp' : visual.src} alt={preconstruction ? 'Illustration of foundation footings, plinth soil, service entry and external soil around a new building' : visual.alt} width={900} height={600} loading="lazy" />
              {preconstruction && <div className={styles.diagramMarkers} aria-hidden="true">{pointPositions.map((position, index) => <span style={position} key={index}>{index + 1}</span>)}</div>}
              <span className={styles.imageLabel}><ShieldCheck size={17} aria-hidden="true" />{preconstruction ? 'Protection starts below the surface.' : 'The right care starts with a closer look.'}</span>
            </div>
            <figcaption>{preconstruction ? 'Illustrative treatment zones. The application plan is agreed after assessing your site.' : 'The treatment method and scope are based on your property assessment.'}</figcaption>
          </figure>
          <ol className={styles.processSteps}>{detail.steps.map(([title, text], index) => <li key={title}><span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span><div><h3 data-edit-step-index={index} data-edit-step-part="title">{title}</h3><p data-edit-step-index={index} data-edit-step-part="description">{text}</p></div></li>)}</ol>
        </div>
      </div></section>

      <section className={`${styles.shell} ${styles.projectsSection}`} id="property-types" aria-labelledby="projects-title">
        <header className={styles.inlineHeading}><div>{!preconstruction && <p className={styles.kicker}>PLANNED FOR YOUR PROPERTY</p>}<h2 id="projects-title">{detail.projectsTitle}</h2></div>{!preconstruction && <p>Different spaces. The same attention to detail.</p>}</header>
        <div className={styles.projects}>{detail.projects.map(([title, image], index) => <article className={styles.projectCard} key={title}><div className={styles.projectPhoto} role="img" aria-label={`${title} — architectural illustration`} style={{ backgroundPosition: `${(image % 3) * 50}% ${image < 3 ? 0 : 100}%` }} /><div className={styles.projectLabel}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3></div></article>)}</div>
      </section>

      <section className={styles.assuranceSection} id="service-faqs"><div className={`${styles.shell} ${styles.assuranceGrid}`}>
        <div className={styles.whyCard}>{!preconstruction && <p className={styles.kicker}>CARE WITH A CLEAR PURPOSE</p>}<h2>{detail.whyTitle || <>Why choose<br />TermiteTreatment?</>}</h2>{!preconstruction && <p>A considered approach to your property, from the first conversation to the next step.</p>}<ul>{(detail.whyItems || ['Assessment before recommendations', 'Treatment planned for your property', 'Clear scope, quotation and preparation', 'Service information and aftercare guidance']).map(item => <li key={item}><span><Check size={15} strokeWidth={2.7} aria-hidden="true" /></span>{item}</li>)}</ul><a href={company.telephone}><span className={styles.supportIcon}><Headphones size={22} aria-hidden="true" /></span><span><small>LET’S TALK ABOUT YOUR PROPERTY</small><strong>{company.phone}</strong></span><ArrowUpRight size={20} aria-hidden="true" /></a></div>
        <div className={styles.faqs}>{!preconstruction && <p className={styles.kicker}>GOOD QUESTIONS. CLEAR ANSWERS.</p>}<h2>{preconstruction ? 'Frequently Asked Questions' : 'Frequently asked questions'}</h2><div className={styles.faqList}>{detail.faqs.map(([question, answer], index) => <details key={question} name={`service-faq-${slug}`} open={!preconstruction && index === 0}><summary data-edit-faq-index={index} data-edit-faq-part="question">{question}<ChevronDown size={18} aria-hidden="true" /></summary><p data-edit-faq-index={index} data-edit-faq-part="answer">{answer}</p></details>)}</div>{preconstruction && <a className={styles.textLink} href="/contact-us#contact-faq">View all FAQs <ArrowRight size={16} aria-hidden="true" /></a>}</div>
      </div></section>

      <section className={styles.enquirySection} id="service-enquiry" aria-labelledby="enquiry-title">
        <img className={styles.enquiryBackground} src={detail.hero} alt="" width={1536} height={1024} loading="lazy" />
        <div className={`${styles.shell} ${styles.enquiryGrid}`}>
          <div className={styles.enquiryCopy}>{!preconstruction && <p className={styles.heroEyebrow}><span /> YOUR NEXT STEP STARTS HERE</p>}<h2 id="enquiry-title">{detail.closingTitle}{' '}<span>{detail.closingAccent}</span></h2><p>{detail.closingText}</p><div className={styles.enquiryActions}><a className={styles.outlineButton} href={company.telephone}><Phone size={17} aria-hidden="true" />{preconstruction ? 'Call Now' : company.phone}</a><a className={styles.whatsappButton} href={whatsappHref} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true" />WhatsApp us <ArrowUpRight size={16} aria-hidden="true" /></a></div>{!preconstruction && <div className={styles.enquiryNote}><CalendarCheck2 size={18} aria-hidden="true" /><span>A free inspection. A clear proposal.<br />A next step you understand.</span></div>}</div>
          <ServiceEnquiryForm key={slug} serviceTitle={service.title} />
        </div>
      </section>

      <aside className={`${styles.shell} ${styles.related}`} aria-label="Other termite services"><span>EXPLORE OTHER SERVICES</span><div>{termiteServices.filter(item => item.slug !== slug).map(item => <a key={item.slug} href={`/services/${item.slug}`}>{item.shortTitle}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div></aside>
      <div className={styles.trustStrip}><div className={styles.shell}><span><ShieldCheck size={22} aria-hidden="true" />{preconstruction ? 'Licensed & Insured' : 'Property-specific plans'}</span><span><ClipboardCheck size={22} aria-hidden="true" />{preconstruction ? 'Safe & Eco-Friendly Solutions' : 'Clear service information'}</span><span><Headphones size={22} aria-hidden="true" />{preconstruction ? 'Prompt Service' : 'A team you can talk to'}</span><span><MapPin size={22} aria-hidden="true" />{preconstruction ? 'Serving Bengaluru & Beyond' : 'Local teams. Wider coverage.'}</span></div></div>
    </main>
    <SiteFooter />
  </>;
}

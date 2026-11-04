import type { CSSProperties } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarCheck2, Check, ClipboardCheck, MapPin, Phone, ScanSearch, ShieldCheck } from 'lucide-react';
import { company, termiteServices } from '../lib/company';
import { serviceDetails, type ServiceDetail } from '../lib/service-details';
import { serviceHeroPositions } from '../lib/service-presentation';
import styles from './ServiceHero.module.css';

type ServiceHeroProps = {
  service: (typeof termiteServices)[number];
  detail: ServiceDetail;
  city?: { name: string; slug: string };
};

const journey = [
  { label: 'Look closer', text: 'A property assessment', icon: ScanSearch },
  { label: 'Plan the protection', text: 'Treatment suited to your space', icon: ShieldCheck },
  { label: 'Keep you informed', text: 'Clear preparation & aftercare', icon: ClipboardCheck },
];

export default function ServiceHero({ service, detail, city }: ServiceHeroProps) {
  const baseDetail = serviceDetails[service.slug];
  const title = detail?.title ?? baseDetail?.title ?? service.title;
  const accent = detail?.accent ?? baseDetail?.accent;
  const enquiryHref = city ? '#local-service-enquiry' : '#service-enquiry';
  const processHref = city ? '#local-process' : '#treatment-process';
  const imagePosition = serviceHeroPositions[service.slug];
  const placeLabel = city ? `${city.name} team` : 'Homes · Businesses · New builds';

  return <section className={styles.hero} aria-labelledby="service-hero-title" style={{ '--hero-image-position': imagePosition.desktop, '--hero-mobile-image-position': imagePosition.mobile } as CSSProperties}>
    <div className={styles.frame}>
      <img className={styles.heroImage} src={detail.hero} alt={detail.heroAlt} width={1536} height={1024} fetchPriority="high" />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.texture} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.topbar}>
          <p className={styles.eyebrow}><ShieldCheck size={14} strokeWidth={2.2} aria-hidden="true" />{city ? `Specialist care in ${city.name}` : 'Specialist care. Lasting confidence.'}</p>
          <span className={styles.place}><MapPin size={14} aria-hidden="true" />{placeLabel}</span>
        </div>

        <div className={styles.copy}>
          <h1 id="service-hero-title">
            <span data-edit-field="titleMain">{title}</span>
            {accent && <span data-edit-field="accent">{accent}</span>}
            {city && <small>for {city.name} properties</small>}
          </h1>
          <p className={styles.lead} data-edit-field="intro">{city ? (detail.intro ?? service.text) : detail.intro}</p>
          <ul className={styles.highlights}>{[...service.tags, 'Clear quotation'].map(text => <li key={text}><Check size={15} strokeWidth={2.6} aria-hidden="true" />{text}</li>)}</ul>
          <div className={styles.actions}>
            <a className={styles.primary} href={enquiryHref}><CalendarCheck2 size={19} aria-hidden="true" />Book a free inspection<ArrowUpRight size={18} aria-hidden="true" /></a>
            <a className={styles.call} href={company.telephone}><Phone size={18} aria-hidden="true" />Call now</a>
          </div>
          <a className={styles.processLink} href={processHref}>See how we protect your property<ArrowDownRight size={17} aria-hidden="true" /></a>
        </div>

        <div className={styles.journey} aria-label="Our approach to termite care">
          <div className={styles.journeyIntro}><span>The way we care</span><strong>A clear path<br />to protection.</strong></div>
          {journey.map(({ label, text, icon: Icon }, index) => <div className={styles.journeyStep} key={label}>
            <span className={styles.stepIcon}><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
            <div><span className={styles.stepNumber}>0{index + 1}</span><strong>{label}</strong><p>{text}</p></div>
            {index < journey.length - 1 && <ArrowRight className={styles.stepArrow} size={16} aria-hidden="true" />}
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}

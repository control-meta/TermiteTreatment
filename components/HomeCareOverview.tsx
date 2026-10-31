'use client';

import { ArrowRight, ArrowUpRight, Building2, CalendarCheck, HardHat, House, ShieldCheck } from 'lucide-react';
import { termiteServices } from '../lib/company';
import styles from './HomeCareOverview.module.css';

const descriptions = [
  'For apartments, villas and the home you love.',
  'Care planned around your premises and business.',
  'Build protection in, from the foundation upwards.',
  'Targeted treatment for the spaces already built.',
  'Regular checks and continued care, year after year.',
];
const serviceIcons = [House, Building2, HardHat, ShieldCheck, CalendarCheck];

export default function HomeCareOverview({ onInspect }: { onInspect: () => void }) {
  return <section className={`container ${styles.section}`} id="services" aria-labelledby="home-care-title">
    <div className={`${styles.heading} reveal`}>
      <div><p className="eyebrow"><span className="tiny-line" /> SPECIALIST TERMITE CARE</p><h2 id="home-care-title" className={styles.singleLine}>The right care. <span>At every stage.</span></h2></div>
    </div>

    <div className={`${styles.content} reveal`}>
      <div className={styles.photo}>
        <img className="motion-photo" src="/images/termite-services-closeup-v2.webp" alt="Pale termites moving across damaged bark" width={1122} height={1402} loading="lazy" />
        <span className={`${styles.photoBadge} motion-badge`}><ShieldCheck size={15} /> A thoughtful approach</span>
        <div className={styles.photoCaption}><span>CARE BEGINS WITH A CLOSER LOOK</span><h3>Your property.<br />Our full attention.</h3><p>Understand the signs. Find the right next step.</p></div>
      </div>
      <div className={styles.list}>
        {termiteServices.map((item, index) => { const ServiceIcon = serviceIcons[index]; return <a className={styles.row} href={`/services/${item.slug}`} key={item.slug} aria-label={`Explore ${item.title}`}><span className={styles.serviceIcon} aria-hidden="true"><ServiceIcon size={21} strokeWidth={1.6} /></span><span className={styles.rowCopy}><strong>{item.title}</strong><span>{descriptions[index]}</span></span><span className={styles.arrow}><ArrowUpRight size={19} /></span></a>; })}
      </div>
    </div>

    <div className={styles.footer}><div><span className={styles.noteIcon}><ShieldCheck size={20} /></span><p><strong>Not sure where to start?</strong><span>A closer look can make things clearer.</span></p></div><button className={styles.inspectionButton} type="button" onClick={onInspect}>Start with a free inspection <ArrowRight size={17} /></button></div>
  </section>;
}

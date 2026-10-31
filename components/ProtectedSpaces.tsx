import { ArrowRight, Building2, CalendarCheck, Check, House, Leaf, ShieldCheck } from 'lucide-react';
import styles from './ProtectedSpaces.module.css';

const spaces = [
  { type: 'home', label: 'HOMES & APARTMENTS', title: 'For the place you call home.', description: 'Care for your wooden fittings, everyday spaces and the people who make them yours.', image: 'home-inspection', alt: 'A termite specialist inspecting wooden fittings in a bright home', icon: House, features: ['Living areas & wooden fittings', 'Entry points & damp-prone corners', 'Preparation & aftercare guidance'], cta: 'Plan care for my home', service: 'Residential Termite Control', detail: 'Care around your household', detailIcon: ShieldCheck },
  { type: 'business', label: 'OFFICES & BUSINESSES', title: 'For the space you work hard for.', description: 'A practical termite-care plan that considers your premises, your people and your working day.', image: 'commercial-care', alt: 'A property care specialist visiting a contemporary office', icon: Building2, features: ['Offices, shops & managed properties', 'Visits around your operating hours', 'Property-specific prevention advice'], cta: 'Plan care for my business', service: 'Commercial Termite Control', detail: 'Planned around your business', detailIcon: CalendarCheck },
];

export default function ProtectedSpaces({ onInspect }: { onInspect: (service: string) => void }) {
  return <section className={styles.section} id="spaces" aria-labelledby="spaces-title">
    <div className="container">
      <div className={`${styles.heading} reveal`}><p className="eyebrow"><span className="tiny-line" /> SPACES WE PROTECT <span className="tiny-line" /></p><h2 id="spaces-title">Different spaces.<br /><span>The same thoughtful care.</span></h2><p>At home or at work, start with termite protection<br className={styles.desktopBreak} /> shaped around your property.</p></div>
      <div className={styles.grid}>
        {spaces.map(space => { const SpaceIcon = space.icon; const DetailIcon = space.detailIcon; return <article className={`${styles.card} reveal`} key={space.type}>
          <div className={styles.image}><img src={`/images/${space.image}.webp`} alt={space.alt} width={900} height={600} loading="lazy" /><span className={`${styles.imageLabel} motion-tag`}><SpaceIcon size={16} strokeWidth={1.7} />{space.label}</span></div>
          <div className={styles.content}><span className={styles.detail}><DetailIcon size={14} />{space.detail}</span><h3>{space.title}</h3><p>{space.description}</p><ul>{space.features.map(feature => <li key={feature}><Check size={14} strokeWidth={2} /><span>{feature}</span></li>)}</ul><button type="button" className={styles.cta} onClick={() => onInspect(space.service)}>{space.cta}<span><ArrowRight size={19} /></span></button></div>
        </article>; })}
      </div>
      <p className={`${styles.footnote} reveal`}><Leaf size={15} />Every property is different. A closer look helps us find the right care.</p>
    </div>
  </section>;
}

import { ArrowRight } from 'lucide-react';
import styles from './ProcessSteps.module.css';

const steps = [
  { title: 'Let’s connect', text: 'Tell us what you’ve noticed. We’ll help you arrange a convenient inspection.', photo: 'termiguard-family', alt: 'A friendly conversation with a family at home' },
  { title: 'We get to the root', text: 'An expert checks your space and walks you through a tailored treatment plan.', photo: 'home-inspection', alt: 'A specialist taking a closer look at wooden fittings' },
  { title: 'Care that goes further', text: 'Get targeted treatment, practical aftercare and guidance for ongoing prevention.', photo: 'commercial-care', alt: 'A specialist providing ongoing property care' },
];

export default function ProcessSteps({ onInspect }: { onInspect: () => void }) {
  return <section className={`container ${styles.section}`} id="about" aria-labelledby="process-title">
    <div className={`${styles.heading} reveal`}>
      <p className="eyebrow">SIMPLE STEPS. STRONGER PROTECTION.</p>
      <h2 id="process-title">From the first hello<br />to <span>a worry-free home.</span></h2>
      <p>We make caring for your property feel simple, at every step.</p>
    </div>
    <ol className={styles.steps}>
      {steps.map((step, index) => <li className={`${styles.step} reveal`} key={step.title}>
        <div className={styles.visual}>
          <span className={styles.photo}><img src={`/images/${step.photo}.webp`} alt={step.alt} width={180} height={180} loading="lazy" /><span className={`${styles.number} motion-step-badge`} aria-label={`Step ${index + 1}`}>0{index + 1}</span></span>
          {index < steps.length - 1 && <span className={`${styles.connector} motion-connector`} aria-hidden="true"><ArrowRight size={20} /></span>}
        </div>
        <h3>{step.title}</h3><p>{step.text}</p>
      </li>)}
    </ol>
    <div className={`${styles.action} reveal`}><button className="button button-primary" type="button" onClick={onInspect}>Let’s start with a free inspection <ArrowRight size={19} /></button><span>No pressure. Just a conversation.</span></div>
  </section>;
}

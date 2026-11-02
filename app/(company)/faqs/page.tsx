import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import { company } from '../../../lib/company';
import { faqs } from '../../../lib/faqs';
import FaqExplorer from './FaqExplorer';
import styles from './faqs.module.css';

const title = 'Termite Control FAQs | 30 Questions Answered';
const description = 'Find answers to 30 common termite-control questions about inspections, treatment, preparation, aftercare, pricing, warranties and booking a visit.';
export const metadata: Metadata = {
  title, description, alternates: { canonical: '/faqs' },
  openGraph: { title, description, type: 'website', locale: 'en_IN', url: '/faqs', images: [{ url: '/images/protected-home.webp', alt: 'A landscaped home representing thoughtful termite care' }] },
  twitter: { card: 'summary_large_image', title, description, images: [{ url: '/images/protected-home.webp', alt: 'A landscaped home representing thoughtful termite care' }] },
};

const schema = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'FAQPage', '@id': 'https://termitepestcontrol.co.in/faqs#faq', url: 'https://termitepestcontrol.co.in/faqs', name: title, description, mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://termitepestcontrol.co.in/' }, { '@type': 'ListItem', position: 2, name: 'FAQs', item: 'https://termitepestcontrol.co.in/faqs' }] },
] };

export default function FaqsPage() {
  const whatsapp = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hello, I have a question about termite treatment for my property.')}`;
  return <div className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <SiteHeader />
    <main id="main" className={styles.main}>
      <section className={`${styles.shell} ${styles.hero}`} aria-labelledby="faq-page-title">
        <div className={styles.heroCopy}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span aria-current="page">FAQs</span></nav>
          <p className={styles.eyebrow}><span /> FREQUENTLY ASKED QUESTIONS</p>
          <h1 id="faq-page-title">Good questions.<br /><em>Clear answers.</em></h1>
          <p className={styles.lead}>A little clarity makes caring for your property easier. Explore everything from your first inspection to lasting termite protection.</p>
          <div className={styles.heroActions}><a href="#answers">Find your answer <ArrowRight size={18} aria-hidden="true" /></a><a href={company.telephone}><Phone size={17} aria-hidden="true" />Talk to our team</a></div>
        </div>
        <div className={styles.heroVisual}>
          <img src="/images/protected-home.webp" width={640} height={640} alt="Sunlit modern home entrance surrounded by a green garden" fetchPriority="high" />
          <span className={styles.visualLabel}><ShieldCheck size={17} aria-hidden="true" />Termite care, explained.</span>
          <div className={styles.visualHelp}><div><span>A question about your own space?</span><strong>Let’s talk it through.</strong></div><a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Ask our team on WhatsApp"><MessageCircle size={22} aria-hidden="true" /><ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </div>
      </section>
      <div className={styles.shell}><FaqExplorer /></div>
      <section className={`${styles.shell} ${styles.bottomCta}`} aria-labelledby="faq-help-title"><div><p className={styles.eyebrow}>LET’S TALK ABOUT YOUR PROPERTY</p><h2 id="faq-help-title">Still have a question?</h2><p>Share your location and a few details. We’ll help you plan the next step.</p></div><a href="/contact-us#enquiry">Request an inspection <ArrowRight size={18} aria-hidden="true" /></a></section>
      <p className={`${styles.shell} ${styles.sourceNote}`}>For treatment preparation, cleaning and re-entry, follow the chosen product’s label and your applicator’s instructions. <a href="https://www.epa.gov/safepestcontrol/termites-how-identify-and-control-them" target="_blank" rel="noopener noreferrer">Read general termite-treatment safety guidance <ArrowUpRight size={12} aria-hidden="true" /></a></p>
    </main>
    <SiteFooter />
  </div>;
}

'use client';

import { ArrowRight, ArrowUpRight, Leaf, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import Brand from './Brand';
import { company } from '../lib/company';
import styles from './SiteFooter.module.css';

type FooterProps = {
  onInspect?: () => void;
  locationName?: string;
  servicesHref?: string;
  enquiryHref?: string;
};

export default function SiteFooter({ onInspect, locationName = 'Bengaluru, India', servicesHref = '/services', enquiryHref = '/contact-us#enquiry' }: FooterProps) {
  const isHome = Boolean(onInspect);
  const [heroInView, setHeroInView] = useState(isHome);

  useEffect(() => {
    if (!isHome) return;
    const hero = document.querySelector('.home-page .hero-layout');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroInView(entry.isIntersecting), { rootMargin: '-80px 0px 0px 0px' });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [isHome]);

  return <>
    <footer className={`footer container home-footer ${styles.footer}`}>
      <div className="footer-top">
        <div className="footer-brand"><Brand href={isHome ? '#home' : '/#home'} /><p>Thoughtful pest care.<br />For the spaces and people you love.</p></div>
        <div className="footer-links"><span>EXPLORE</span><a href={servicesHref}>Our services</a><a href={isHome ? '#why-us' : '/#why-us'}>Why TermiteTreatment</a><a href="/about-us">Our approach</a><a href="/faqs">FAQs</a></div>
        <div className="footer-links"><span>LET’S CONNECT</span><a href={company.telephone}>{company.phone}</a>{onInspect ? <button type="button" className="footer-inspection" onClick={onInspect}>Request an inspection <ArrowUpRight size={14} /></button> : <a className="footer-inspection" href={enquiryHref}>Request an inspection <ArrowUpRight size={14} /></a>}<span className="footer-location"><MapPin size={14} /> {locationName}</span></div>
        <div className="footer-note"><Leaf size={24} /><p>Small steps today.<br /><strong>Better spaces tomorrow.</strong></p><a href={isHome ? '#home' : '#main'} aria-label="Back to top"><ArrowRight size={20} /></a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} TermiteTreatment. All rights reserved.</span><span>Designed with care. <Leaf size={12} /></span></div>
      <p className="demo-note">Concept website based on the supplied design. Customer figures, testimonial, guarantee and contact details are reference content; confirm them before using this site for a live business. Enquiries are prepared in WhatsApp and are only sent when you choose to send them.</p>
    </footer>
    <div className={`mobile-bottom-bar${isHome && heroInView ? ' mobile-bar-after-hero' : ''}`}><a href={company.telephone}><Phone size={18} /> Call us</a>{onInspect ? <button type="button" className="mobile-inspection" onClick={onInspect}>Free inspection <ArrowRight size={18} /></button> : <a className="mobile-inspection" href={enquiryHref}>Free inspection <ArrowRight size={18} /></a>}</div>
  </>;
}

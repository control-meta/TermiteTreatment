'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Building2, CalendarCheck, ChevronDown, ChevronRight, Hammer, Home, Info, Layers3, Menu, MessageCircle, Phone, ShieldCheck, X } from 'lucide-react';
import Brand from './Brand';
import { company, termiteServices } from '../lib/company';
import styles from './SiteHeader.module.css';

const navigation = [['Home', 'home'], ['Services', 'services'], ['About', 'about'], ['Contact', 'contact']];
const pages: Record<string, string> = { services: '/services', about: '/about-us', contact: '/contact-us' };
const mobilePageIcons = { home: Home, about: Info, contact: MessageCircle };
const mobileServiceIcons = [Home, Building2, Layers3, Hammer, CalendarCheck];
const mobileServiceLabels = ['Residential care', 'Commercial care', 'Pre-construction', 'Post-construction', 'Annual maintenance'];
const mobileServiceDetails = ['Homes & apartments', 'Offices & businesses', 'Protection before you build', 'Care for existing properties', 'Ongoing termite protection'];

type HeaderProps = { menuOpen?: boolean; onMenuChange?: (open: boolean) => void };

/** The original homepage header, shared by every route. */
export default function SiteHeader({ menuOpen, onMenuChange }: HeaderProps) {
  const path = usePathname();
  const isHome = path === '/';
  const [localMenuOpen, setLocalMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesMenuRef, setServicesMenuRef] = useState<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const open = menuOpen ?? localMenuOpen;
  const setOpen = onMenuChange ?? setLocalMenuOpen;
  const active = isHome ? 'home' : path.startsWith('/services') ? 'services' : path === '/about-us' ? 'about' : path === '/contact-us' ? 'contact' : '';
  const destination = (id: string) => pages[id] || `${isHome ? '' : '/'}#${id}`;
  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        setServicesOpen(false);
        setMobileServicesOpen(false);
        if (open) menuButtonRef.current?.focus();
      }
      if (event.key === 'Tab' && open) {
        const controls = [...(headerRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]):not([tabindex="-1"])') ?? [])].filter(element => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open, setOpen]);
  useEffect(() => {
    if (!open) return;
    const mobile = window.matchMedia('(max-width: 1100px)');
    if (!mobile.matches) { setOpen(false); return; }
    const previousOverflow = document.body.style.overflow;
    const background = [...document.querySelectorAll<HTMLElement>('#main, .footer, .mobile-bottom-bar')].map(element => ({ element, inert: element.inert }));
    document.body.style.overflow = 'hidden';
    background.forEach(({ element }) => { element.inert = true; });
    const closeOnDesktop = () => { if (!mobile.matches) { setOpen(false); setMobileServicesOpen(false); } };
    mobile.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => { element.inert = inert; });
      mobile.removeEventListener('change', closeOnDesktop);
    };
  }, [open, setOpen]);
  useEffect(() => {
    setServicesOpen(false);
    setMobileServicesOpen(false);
    setOpen(false);
  }, [path, setOpen]);
  useEffect(() => {
    if (!servicesOpen) return;
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !servicesMenuRef?.contains(event.target)) setServicesOpen(false);
    }
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [servicesOpen, servicesMenuRef]);
  const closeMenus = () => { setServicesOpen(false); setMobileServicesOpen(false); setOpen(false); };
  const serviceLinks = (
    <div className="services-dropdown-inner">
      <p className="services-dropdown-label">Services</p>
      <ul className="services-dropdown-list">
        {termiteServices.map((service, index) => {
          const Icon = mobileServiceIcons[index];
          return (
            <li key={service.slug}>
              <a href={`/services/${service.slug}`} onClick={closeMenus} aria-current={path === `/services/${service.slug}` ? 'page' : undefined}>
                <span className="services-dropdown-icon"><Icon size={15} aria-hidden="true" /></span>
                <span>{service.title}</span><ChevronRight size={14} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
      <a href="/services" className="services-dropdown-all" onClick={closeMenus}>View all services <ArrowRight size={14} aria-hidden="true" /></a>
    </div>
  );
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" ref={headerRef}><div className={`header-inner ${styles.headerInner}`}>
      <Brand href={isHome ? '#home' : '/#home'} />
      <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, id]) => id === 'services' ? <div className="nav-service-group" key={id} ref={setServicesMenuRef} onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
        <button type="button" className={`nav-service-trigger ${active === id ? 'active' : ''}`} aria-expanded={servicesOpen} aria-haspopup="true" aria-controls="services-dropdown" aria-current={active === id ? 'location' : undefined} onClick={() => setServicesOpen(value => !value)} onFocus={() => setServicesOpen(true)}>{label}<ChevronDown size={14} /></button>
        {servicesOpen && <div className="services-dropdown" id="services-dropdown" role="menu" aria-label="Service pages">{serviceLinks}</div>}
      </div> : <a key={id} className={active === id ? 'active' : ''} href={destination(id)} aria-current={active === id ? 'location' : undefined}>{label}</a>)}</nav>
      <a className={`header-call ${styles.headerCall}`} href={company.telephone} aria-label={`Call TermiteTreatment on ${company.phone}`}><span className="header-phone-icon"><Phone size={17} /></span><span className="header-call-copy"><small>Talk to an expert</small><strong>{company.phone}</strong></span></a>
      <button type="button" ref={menuButtonRef} className={`menu-toggle ${styles.menuToggle}`} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div>
    {open && <>
      <button type="button" className={styles.backdrop} tabIndex={-1} aria-label="Close navigation" onClick={() => { closeMenus(); menuButtonRef.current?.focus(); }} />
      <nav className={styles.mobileNav} id="mobile-nav" aria-label="Mobile navigation">
        <div className={styles.menuScroll}>
          <div className={styles.menuHeading}><span>EXPLORE</span><span>Care for every space</span></div>
          <div className={styles.pageLinks}>{navigation.filter(([, id]) => id !== 'services').map(([label, id]) => {
            const Icon = mobilePageIcons[id as keyof typeof mobilePageIcons];
            return <a className={styles.pageLink} key={id} href={destination(id)} aria-current={active === id ? 'page' : undefined} onClick={closeMenus}><Icon size={20} /><span>{label}</span></a>;
          })}</div>
          <section className={styles.servicesSection} aria-label="Termite services">
            <button type="button" className={styles.servicesTrigger} aria-expanded={mobileServicesOpen} aria-controls="mobile-service-links" onClick={() => setMobileServicesOpen(value => !value)}>
              <span className={styles.servicesIcon}><ShieldCheck size={21} /></span><span><strong>Termite services</strong><small>Find the right protection</small></span><ChevronDown size={18} />
            </button>
            <div id="mobile-service-links" className={styles.serviceLinks} hidden={!mobileServicesOpen}>
              <a className={styles.overviewLink} href="/services" onClick={closeMenus}>Explore all services <ArrowRight size={15} /></a>
              {termiteServices.map((service, index) => {
                const Icon = mobileServiceIcons[index];
                return <a className={styles.serviceLink} key={service.slug} href={`/services/${service.slug}`} aria-label={service.title} aria-current={path === `/services/${service.slug}` ? 'page' : undefined} onClick={closeMenus}>
                  <span className={styles.serviceIcon}><Icon size={18} /></span><span className={styles.serviceCopy}><strong>{mobileServiceLabels[index]}</strong><small>{mobileServiceDetails[index]}</small></span><ChevronRight size={15} />
                </a>;
              })}
            </div>
          </section>
        </div>
        <div className={styles.menuContact}><a href={company.telephone}><span className={styles.contactIcon}><Phone size={19} /></span><span><small>Talk to our team</small><strong>{company.phone}</strong></span><ArrowRight size={19} /></a></div>
      </nav>
    </>}
    </header>
  </>;
}

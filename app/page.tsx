'use client';

import TermiteField from '../components/TermiteField';
import SiteHeader from '../components/SiteHeader';
import HomeCareOverview from '../components/HomeCareOverview';
import ReviewMarquee from '../components/ReviewMarquee';
import ProcessSteps from '../components/ProcessSteps';
import ProtectedSpaces from '../components/ProtectedSpaces';
import differenceStyles from '../components/TermiteDifference.module.css';
import SiteFooter from '../components/SiteFooter';
import ServicePicker from '../components/ServicePicker';
import HeroAmbientBackground from '../components/HeroAmbientBackground';
import PageAmbientBackground from '../components/PageAmbientBackground';
import { useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, BadgeCheck, CheckCheck, ChevronDown, Home, Leaf, LockKeyhole, MessageCircle, Phone, Search, ShieldCheck, UserRound, X } from 'lucide-react';

const faqs = [
  ['What are the first signs of a termite problem?', 'Look for narrow mud tubes along walls, discarded wings near windows, wood that sounds hollow, or blistered paint. These signs can have other causes too, so an inspection is the best next step before choosing treatment.'],
  ['Do I need to leave my home during treatment?', 'It depends on the treatment, the products used and the areas being treated. Your technician should explain preparation, ventilation and re-entry instructions before any work begins. Let us know about children, pets or sensitivities when requesting an inspection.'],
  ['How much does termite treatment cost?', 'The right plan and price depend on the size of your property, the construction and the extent of termite activity. Request an inspection so the proposed work, price and any warranty terms can be explained before you decide.'],
  ['Can I book an inspection for my business?', 'Yes. Select Commercial pest care in the enquiry form and share your location with the team. You can discuss access requirements and suitable service times with the team before confirming a visit.'],
  ['How can I help prevent termites from returning?', 'Fix persistent leaks, reduce damp areas, avoid storing wood against walls and keep soil or mulch away from timber where possible. Regular checks can help spot new activity early. Ask for guidance specific to your property.'],
];

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [service, setService] = useState('');
  const [serviceError, setServiceError] = useState(false);
  const serviceTrigger = useRef<HTMLButtonElement>(null);
  const [enquiry, setEnquiry] = useState<{ name: string; phone: string; service: string } | null>(null);
  const enquiryDialog = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  function inspect(chosen?: string) { if (chosen) { setService(({ 'Home pest protection': 'Residential Termite Control', 'Commercial pest care': 'Commercial Termite Control', 'Preventive inspection': 'Not sure — I need an inspection', 'Termite control': 'Post-Construction Termite Treatment' } as Record<string, string>)[chosen] || chosen); setServiceError(false); } setMenuOpen(false); const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; document.getElementById('contact')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' }); window.setTimeout(() => nameInput.current?.focus({ preventScroll: true }), reducedMotion ? 0 : 450); }
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (!service) { setServiceError(true); serviceTrigger.current?.focus(); return; } const data = new FormData(e.currentTarget); setEnquiry({ name: String(data.get('name')).trim(), phone: String(data.get('phone')).trim(), service }); enquiryDialog.current?.showModal(); }
  const message = enquiry ? `Hello TermiteTreatment! I would like to request a free inspection.\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nService: ${enquiry.service}\nPlease share available times and a quote.` : '';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return <>
    <link rel="preload" as="image" href="/images/mobile-hero-family.webp" media="(max-width: 760px)" />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <TermiteField />
    <PageAmbientBackground />
    <SiteHeader menuOpen={menuOpen} onMenuChange={setMenuOpen} />

    <main id="main" className="home-page">
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-background" role="img" aria-label="A family speaking with a friendly TermiteTreatment technician outside their home"><img className="hero-scene" src="/images/termiguard-family.webp" alt="Professional pest control technician consulting with a family outside their protected home" width={1672} height={941} /></div>
        <div className="hero-wash" />
        <HeroAmbientBackground />
        <div className="hero-foliage" aria-hidden="true"><img src="/images/hero-left-foliage.webp" alt="Decorative green foliage" width={320} height={480} /></div><div className="leaf-blur leaf-two" />
        <div className="hero-layout container">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">PROTECT WHAT MATTERS MOST <span /></p>
            <h1 id="hero-title">Reliable Termite<br />Control for<br /><span>Homes &amp; Businesses</span></h1>
            <p className="hero-description">Protect your property from termites with expert inspections, proven treatments and preventive care. A safer, healthier space for your family, your business and a stronger tomorrow.</p>
            <div className="hero-benefits">
              {[
                ['termiguard-family', 'A family at home', 'Safe for', 'Families'],
                ['home-inspection', 'A specialist inspecting a home', 'Expert', 'Inspection'],
                ['commercial-care', 'Professional property care', 'Preventive', 'Care'],
                ['termiguard-family', 'A protected family home', 'Guaranteed', 'Protection'],
              ].map(([photo, alt, one, two]) => <div className="benefit" key={one}><span className="benefit-icon"><img src={`/images/${photo}.webp`} alt={alt} width={60} height={60} /></span><span>{one}<br />{two}</span></div>)}
            </div>
            <div className="hero-actions"><button className="button button-primary" onClick={() => inspect()}>Get a Free Inspection <ArrowRight size={21} /></button><a href="/services" className="button button-outline">View Our Services</a></div>
            <div className="mobile-photo"><span><ShieldCheck size={15} /> Your home. In caring hands.</span></div>
          </div>

          <div className="quote-card" id="contact">
            <div className="quote-heading"><span className="quote-termite"><img src="/images/booking-termite.webp" alt="Termite inspection icon" width={48} height={48} /></span><div><h2>Quick Connect</h2><p>Get a Free Inspection &amp; Quote</p></div></div>
            <form onSubmit={submit}>
              <label className="input-wrap"><UserRound size={21} /><span className="sr-only">Your name</span><input ref={nameInput} name="name" placeholder="Your Name" autoComplete="name" required minLength={2} maxLength={80} pattern=".*\S.*" /></label>
              <label className="input-wrap"><Phone size={20} /><span className="sr-only">Phone number</span><input name="phone" type="tel" placeholder="Phone Number" autoComplete="tel" required pattern={String.raw`[+0-9 \(\)\-]{10,18}`} title="Enter a phone number with 10 to 18 characters, using digits, spaces, +, parentheses or hyphens." /></label>
              <ServicePicker value={service} onChange={value => { setService(value); setServiceError(false); }} invalid={serviceError} triggerRef={serviceTrigger} />
              <button type="submit" className="button button-primary quote-submit">Book NOW <ArrowRight size={21} /></button>
              <p className="privacy-note"><LockKeyhole size={14} /> No spam. Your information is safe with us.</p>
            </form>
          </div>
        </div>
        <div className="trust-strip container">
          <div className="hero-review">
            <div className="avatar-family"><img src="/images/customer-family.webp" alt="A family enjoying time together at home" width={112} height={112} /><span className="avatar-verified"><BadgeCheck size={14} /></span></div>
            <div className="hero-review-copy"><div className="review-meta"><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><span className="verified-pill"><BadgeCheck size={12} /> Verified customer</span></div><blockquote>“TermiteTreatment gave us complete peace of mind. Professional, reliable and truly care about our home.”</blockquote><cite>Priya S. — Homeowner, Bengaluru</cite></div>
          </div>
          <div className="trust-stat"><span className="stat-icon trust-symbol" aria-hidden="true"><svg viewBox="0 0 48 48" fill="currentColor"><circle cx="24" cy="12" r="6" /><circle cx="10" cy="17" r="4.5" /><circle cx="38" cy="17" r="4.5" /><path d="M14 40V30a10 10 0 0 1 20 0v10H14ZM3 36v-8a7 7 0 0 1 10-6 14 14 0 0 0-3 9v5H3ZM38 36v-5a14 14 0 0 0-3-9 7 7 0 0 1 10 6v8h-7Z" /></svg></span><div><strong>5000+</strong><span>Happy Customers</span></div></div>
          <div className="trust-stat"><span className="stat-icon trust-symbol" aria-hidden="true"><ShieldCheck strokeWidth={2.2} /></span><div><strong>10+</strong><span>Years of Experience</span></div></div>
          <div className="trust-stat"><span className="stat-icon trust-symbol" aria-hidden="true"><Home strokeWidth={2.2} /></span><div><strong>100%</strong><span>Satisfaction Guarantee</span></div></div>
          <a className="termite-note" href="#spaces"><span className="bug-circle"><img src="/images/termite-macro.webp" alt="A close-up of termites on wood" width={224} height={224} /><span className="bug-badge"><span className="bug-dot" /> Live infestation</span></span><span className="termite-copy"><strong>Stop termite damage before it starts.</strong><small>See what we inspect</small></span><span className="note-arrow"><ArrowRight size={14} /></span></a>
        </div>
        <div className="hero-bottom"><span /><a href="#services">A LITTLE CARE. A LOT OF PEACE OF MIND. <ChevronDown size={15} /></a><span /></div>
      </section>

      <HomeCareOverview onInspect={() => inspect()} />

      <section className={`why-section ${differenceStyles.section}`} id="why-us"><div className="container why-layout">
        <div className="why-visual reveal"><div className="why-photo" role="img" aria-label="A specialist inspecting a termite mud tube on a wooden door frame" /><div className="image-top-tag"><span className="status-dot" /> REAL CARE. RIGHT AT YOUR DOOR.</div><div className="image-bottom-card"><span className="stat-icon photo-stat"><img src="/images/termite-difference-identification-v2.webp" alt="Pest care technician inspecting timber fittings" width={60} height={60} /></span><div><strong>Peace of mind comes home.</strong><span>With a team that cares as much as you do.</span></div></div><div className="photo-accent"><Leaf size={29} /><span>A thoughtful<br />approach to care</span></div></div>
        <div className="why-copy reveal"><p className="eyebrow"><span className="tiny-line" /> THE TERMITETREATMENT DIFFERENCE</p><h2>Your home is personal.<br /><span>We treat it that way.</span></h2><p className="section-intro">It’s more than four walls. It’s where your life happens. Our approach brings expertise, attention and a little extra care to every visit.</p><div className="why-points">{[[Search, 'We look a little closer.', 'A thorough inspection helps us understand the cause, so we can recommend care that makes sense.'], [Leaf, 'Care with your family in mind.', 'Clear preparation and aftercare guidance, with your household’s needs considered at every step.'], [CheckCheck, 'Clarity, from start to finish.', 'Understand the plan, the price and the next steps before treatment begins. No guesswork.']].map(([Icon, title, text], i) => { const PointIcon = Icon as typeof Search; return <div className="why-point" key={i}><span className="point-photo"><img src={`/images/${["termite-difference-identification-v2", "termite-difference-treatment-v2", "termite-difference-plan-v2"][i]}.webp`} alt={["A close-up of a termite on a green leaf", "Targeted treatment at a termite mud tube", "A termite inspection plan beside damaged timber"][i]} width={72} height={72} loading="lazy" /></span><div><h3>{String(title)}</h3><p>{String(text)}</p></div></div>; })}</div><a href="/about-us" className="text-link">A little more about us <ArrowRight size={19} /></a></div>
      </div></section>

      <ProcessSteps onInspect={() => inspect()} />

      <ProtectedSpaces onInspect={inspect} />

      <section className="faq-section section container" id="faq"><div className="faq-intro reveal"><p className="eyebrow"><span className="tiny-line" /> A LITTLE CLARITY</p><h2>Good questions.<br /><span>Honest answers.</span></h2><p>Because feeling confident starts with<br className="desktop-break" /> knowing what to expect.</p><a className="faq-contact" href="tel:+919220312345"><span className="stat-icon"><Phone size={23} /></span><span>Still have a question?<strong>Let’s talk <ArrowUpRight size={16} /></strong></span></a></div><div className="faq-list reveal">{faqs.map(([question, answer], i) => <details key={question} name="faqs" open={i === 0 ? true : undefined}><summary>{question}<span><ChevronDown size={18} /></span></summary><p>{answer}</p></details>)}</div></section>

      <ReviewMarquee onInspect={() => inspect()} />

    </main>

    <SiteFooter onInspect={() => inspect()} />

    <dialog ref={enquiryDialog} aria-label="Review your enquiry" className="detail-dialog enquiry-dialog" onClick={e => { if (e.target === e.currentTarget) enquiryDialog.current?.close(); }}><button className="dialog-close" aria-label="Close enquiry" onClick={() => enquiryDialog.current?.close()}><X /></button><span className="dialog-icon"><CheckCheck size={33} /></span><p className="eyebrow">ONE MORE LITTLE STEP</p><h2>Your enquiry is ready.</h2><p>Thanks, {enquiry?.name}. Review your details below, then open WhatsApp to send your request to the team. Your booking is confirmed only after the team replies.</p><dl className="enquiry-summary"><div><dt>Service</dt><dd>{enquiry?.service}</dd></div><div><dt>Phone</dt><dd>{enquiry?.phone}</dd></div></dl><a className="button button-primary" href={`https://wa.me/919220312345?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={20} /> Continue in WhatsApp <ArrowUpRight size={18} /></a><button className="edit-enquiry" onClick={() => enquiryDialog.current?.close()}>Edit my details</button></dialog>
  </>;
}

'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, CheckCheck, Mail, MessageCircle, X } from 'lucide-react';
import { company, regions, termiteServices } from '../lib/company';

type Enquiry = { name: string; phone: string; city: string; service: string; property: string; message: string };

export default function ContactForm() {
  const [service, setService] = useState('');
  const [city, setCity] = useState('');
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const review = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requested = termiteServices.find(item => item.slug === query.get('service'));
    if (requested) setService(requested.title);
    const requestedCity = query.get('city');
    if (requestedCity && regions.includes(requestedCity)) setCity(requestedCity);
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setEnquiry(Object.fromEntries(['name', 'phone', 'city', 'service', 'property', 'message'].map(key => [key, String(data.get(key) || '').trim()])) as Enquiry);
    review.current?.showModal();
  }
  const message = enquiry ? `Hello TermiteTreatment, I would like to request a free inspection.\n\nName: ${enquiry.name}\nPhone: ${enquiry.phone}\nCity / area: ${enquiry.city}\nProperty: ${enquiry.property}\nService: ${enquiry.service}${enquiry.message ? `\nDetails: ${enquiry.message}` : ''}\n\nPlease confirm availability and the next steps.` : '';
  return <>
    <form className="contact-form" id="enquiry" onSubmit={submit}>
      <p className="eyebrow">LET’S TAKE THE FIRST STEP</p><h2>Tell us a little<br />about your space.</h2><p className="form-intro">Request a free inspection. We’ll help you understand what your property needs.</p>
      <div className="form-two"><label>Full name <span>*</span><input name="name" autoComplete="name" placeholder="Your full name" required minLength={2} maxLength={80} pattern=".*\S.*" /></label><label>Phone number <span>*</span><input name="phone" type="tel" autoComplete="tel" placeholder="Your mobile number" required pattern={String.raw`[+0-9 \(\)\-]{10,18}`} title="Enter a phone number with 10 to 18 characters." /></label></div>
      <div className="form-two"><label>City or area <span>*</span><input name="city" autoComplete="address-level2" placeholder="Where is your property?" list="service-cities" required maxLength={100} pattern=".*\S.*" value={city} onChange={event => setCity(event.target.value)} /><datalist id="service-cities">{regions.map(region => <option key={region} value={region} />)}</datalist></label><label>Property type <span>*</span><select name="property" required defaultValue=""><option value="" disabled>Select property type</option><option>Home / apartment</option><option>Office / commercial</option><option>New construction</option><option>Housing society / other</option></select></label></div>
      <label>How can we help? <span>*</span><select name="service" value={service} onChange={event => setService(event.target.value)} required><option value="" disabled>Select a service</option>{termiteServices.map(item => <option key={item.slug}>{item.title}</option>)}<option>Not sure — I need an inspection</option></select></label>
      <label>A little more detail <small>(optional)</small><textarea name="message" rows={3} maxLength={1200} placeholder="Tell us about any termite signs, your property or your construction stage." /></label>
      <button className="button button-primary" type="submit">Review my inspection request <ArrowRight size={19} /></button><p className="form-footnote">Review your details, then send your request on WhatsApp. Our team will confirm the visit with you.</p>
    </form>
    <dialog ref={review} className="detail-dialog enquiry-dialog" aria-label="Review your inspection request" onClick={event => { if (event.target === event.currentTarget) review.current?.close(); }}><button className="dialog-close" type="button" aria-label="Close enquiry" onClick={() => review.current?.close()}><X /></button><span className="dialog-icon"><CheckCheck size={32} /></span><p className="eyebrow">READY WHEN YOU ARE</p><h2>Your request,<br />ready to send.</h2><p>Thanks, {enquiry?.name}. Check your details and send them to our team. We’ll discuss availability before confirming your inspection.</p><dl className="enquiry-summary"><div><dt>Phone</dt><dd>{enquiry?.phone}</dd></div><div><dt>Location</dt><dd>{enquiry?.city}</dd></div><div><dt>Property</dt><dd>{enquiry?.property}</dd></div><div><dt>Service</dt><dd>{enquiry?.service}</dd></div>{enquiry?.message && <div><dt>Details</dt><dd>{enquiry.message}</dd></div>}</dl><a className="button button-primary" href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Send via WhatsApp <ArrowUpRight size={18} /></a><a className="enquiry-email" href={`mailto:${company.email}?subject=${encodeURIComponent('Termite inspection request')}&body=${encodeURIComponent(message)}`}><Mail size={16} /> Prefer email? Send your request</a><button className="edit-enquiry" type="button" onClick={() => review.current?.close()}>Edit my details</button></dialog>
  </>;
}

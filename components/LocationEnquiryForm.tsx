'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import PhoneInput from './PhoneInput';
import { company, termiteServices } from '../lib/company';
import { locations } from '../lib/locations';
import styles from './LocationEnquiryForm.module.css';

export default function LocationEnquiryForm({ citySlug, serviceSlug = '' }: { citySlug: string; serviceSlug?: string }) {
  const [city, setCity] = useState(citySlug);
  const [service, setService] = useState(serviceSlug);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const location = locations.find(item => item.slug === city);
    const selectedService = termiteServices.find(item => item.slug === service);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const area = String(data.get('area') || '').trim();
    const details = String(data.get('message') || '').trim();
    const message = `Hello TermiteTreatment, I would like to request an enquiry in ${location?.name}.\n\nName: ${name}\nMobile: ${phone}\nCity: ${location?.name}\nService: ${selectedService?.title}${area ? `\nArea / locality: ${area}` : ''}${details ? `\nMessage: ${details}` : ''}\n\nPlease confirm inspection availability and the next steps.`;
    window.location.assign(`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`);
  }
  return <form className={styles.form} onSubmit={submit}>
    <h2>Get a Free Enquiry</h2>
    <p>Fill in the form and our team will get back to you shortly.</p>
    <div className={styles.fields}>
      <label><span>Your Name <b>*</b></span><input name="name" autoComplete="name" placeholder="Your name" minLength={2} maxLength={80} pattern={String.raw`.*\S.*`} required /></label>
      <label><span>Mobile Number <b>*</b></span><PhoneInput name="phone" autoComplete="tel-national" placeholder="10-digit mobile number" required /></label>
      <label><span>Select Service <b>*</b></span><select name="service" value={service} onChange={event => setService(event.target.value)} required><option value="" disabled>Select service</option>{termiteServices.map(item => <option value={item.slug} key={item.slug}>{item.title}</option>)}</select></label>
      <label><span>Select City <b>*</b></span><select name="city" value={city} onChange={event => setCity(event.target.value)} required>{locations.map(item => <option value={item.slug} key={item.slug}>{item.name}</option>)}</select></label>
      <label className={styles.wide}><span>Area / locality <small>(optional)</small></span><input name="area" autoComplete="address-level3" placeholder="Your area, sector or neighbourhood" maxLength={100} /></label>
      <label className={styles.wide}><span>Your Message <small>(optional)</small></span><textarea name="message" rows={3} maxLength={1200} placeholder="Tell us about your property or termite concern" /></label>
    </div>
    <button type="submit"><Send size={17} aria-hidden="true" />Submit Enquiry</button>
    <small className={styles.note}>Opens WhatsApp with your details. Send the message to complete your enquiry.</small>
  </form>;
}

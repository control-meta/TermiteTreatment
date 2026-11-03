'use client';

import type { FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import PhoneInput from './PhoneInput';
import { company, offices, termiteServices } from '../lib/company';
import { locations } from '../lib/locations';
import styles from './ServiceEnquiryForm.module.css';

type ServiceEnquiryFormProps = {
  serviceTitle?: string;
  city?: string;
  id?: string;
  className?: string;
  suggestedLocations?: string[];
};

export default function ServiceEnquiryForm({ serviceTitle = '', city = '', id = 'service-quote-form', className = '', suggestedLocations = [] }: ServiceEnquiryFormProps) {
  const locationSuggestions = [...new Set(['Bangalore', ...suggestedLocations, ...locations.map(location => location.name), ...offices.map(office => office.city)])];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || '').trim();
    const message = `Hello Termite Pest Control, I would like to request a free enquiry.\n\nName: ${value('name')}\nMobile: ${value('phone')}\nService required: ${value('service')}\nCity / location: ${value('city')}\n\nPlease confirm inspection availability and the next steps.`;
    window.location.assign(`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`);
  }

  return <form id={id} className={`${styles.form} ${className}`} onSubmit={submit} aria-labelledby={`${id}-title`}>
    <h2 className={styles.title} id={`${id}-title`}>Request a Free Enquiry</h2>
    <div className={styles.fields}>
      <label>Your Name <span>*</span><input name="name" placeholder="Your name" autoComplete="name" required minLength={2} maxLength={80} pattern={String.raw`.*\S.*`} /></label>
      <label>Mobile Number <span>*</span><PhoneInput name="phone" placeholder="10-digit mobile number" autoComplete="tel" required /></label>
      <label>Service Required <span>*</span><select name="service" required defaultValue={serviceTitle}><option value="" disabled>Select a service</option>{termiteServices.map(service => <option value={service.title} key={service.slug}>{service.title}</option>)}<option>Not sure — please advise</option></select></label>
      <label>City / Location <span>*</span><input name="city" defaultValue={city} placeholder="City / area" autoComplete="address-level2" list={`${id}-areas`} required maxLength={100} pattern={String.raw`.*\S.*`} /><datalist id={`${id}-areas`}>{locationSuggestions.map(location => <option value={location} key={location} />)}</datalist></label>
    </div>
    <button className={styles.submit} type="submit">Submit Enquiry <ArrowRight size={17} aria-hidden="true" /></button>
    <p className={styles.footnote}>Opens your enquiry in WhatsApp. Send the message to complete your request.</p>
  </form>;
}

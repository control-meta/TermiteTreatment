'use client';

import type { FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import PhoneInput from './PhoneInput';
import { company } from '../lib/company';
import styles from './ServiceEnquiryForm.module.css';

type Enquiry = { name: string; phone: string; city: string; property: string; stage: string; details: string };

export default function ServiceEnquiryForm({ serviceTitle, construction = false, maintenance = false }: {
  serviceTitle: string;
  construction?: boolean;
  maintenance?: boolean;
}) {
  const title = construction ? 'Request a Pre-Construction Treatment Quote' : maintenance ? 'Discuss your maintenance plan' : 'Request a free inspection';

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const enquiry = Object.fromEntries(['name', 'phone', 'city', 'property', 'stage', 'details'].map(key => [key, String(form.get(key) || '').trim()])) as Enquiry;
    const message = `Hello TermiteTreatment, I would like to enquire about ${serviceTitle}.\n\nName: ${enquiry.name}\nMobile: ${enquiry.phone}\nLocation: ${enquiry.city}\nProperty: ${enquiry.property}${enquiry.stage ? `\nConstruction stage: ${enquiry.stage}` : ''}${enquiry.details ? `\nDetails: ${enquiry.details}` : ''}\n\nPlease confirm inspection availability and the next steps.`;
    window.location.assign(`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`);
  }

  return <form className={styles.form} id="service-quote-form" onSubmit={submit}>
      <div className={styles.heading}>{!construction && <span>LET’S PLAN YOUR NEXT STEP</span>}<h3>{title}</h3>{!construction && <p>Tell us a little about your property.</p>}</div>
      <div className={styles.fields}>
        <label>{construction ? 'Full Name' : 'Full name'} <span>*</span><input name="name" autoComplete="name" placeholder={construction ? 'Enter your name' : 'Your full name'} required minLength={2} maxLength={80} pattern={String.raw`.*\S.*`} /></label>
        <label>{construction ? 'Mobile Number' : 'Mobile number'} <span>*</span><PhoneInput name="phone" autoComplete="tel" placeholder={construction ? 'Enter mobile number' : 'Your mobile number'} required /></label>
        <label>{construction ? 'Project Location' : 'Project location'} <span>*</span><input name="city" autoComplete="address-level2" placeholder="City / area" required maxLength={100} pattern={String.raw`.*\S.*`} /></label>
        <label>{construction ? 'Type of Property' : 'Type of property'} <span>*</span><select name="property" required defaultValue=""><option value="" disabled>Select property type</option><option>Independent house / villa</option><option>Apartment / residential complex</option><option>Office / commercial building</option><option>Industrial building / warehouse</option><option>Hotel / hospital / institution</option><option>Other property</option></select></label>
        {construction && <label className={styles.full}>Construction Stage <small>(optional)</small><select name="stage" defaultValue=""><option value="">Select current stage</option><option>Planning / before excavation</option><option>Foundation work</option><option>Backfilling / plinth filling</option><option>Before flooring</option><option>External works</option><option>Not sure — please advise</option></select></label>}
        <label className={styles.full}>{construction ? 'Project Details' : 'Project details'} <small>{construction ? '(Optional)' : '(optional)'}</small><textarea name="details" rows={3} maxLength={1200} placeholder={construction ? 'Tell us about your project...' : 'Property size, termite signs or previous treatment'} /></label>
      </div>
      <button className={styles.submit} type="submit">Submit Enquiry <ArrowRight size={18} aria-hidden="true" /></button>
      <p className={styles.footnote}>Opens WhatsApp with your enquiry details. Send the message to complete your request.</p>
  </form>;
}

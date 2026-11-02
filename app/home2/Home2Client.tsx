'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import PhoneInput from '../../components/PhoneInput';
import { company, offices, termiteServices } from '../../lib/company';
import { home2Locations, home2Projects } from './content';
import SheetImage from './SheetImage';
import styles from './home2.module.css';

export function Home2Projects() {
  const [expanded, setExpanded] = useState(false);
  return <section className={styles.projectSection} id="projects" aria-labelledby="home2-projects-title">
    <div className={styles.projectHeading}><h2 id="home2-projects-title">Our Recent Projects</h2><button type="button" aria-expanded={expanded} aria-controls="home2-project-gallery" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show Fewer' : 'View All Projects'} <ArrowRight size={14} aria-hidden="true" /></button></div>
    <div className={styles.projectGrid} id="home2-project-gallery">{home2Projects.slice(0, expanded ? 6 : 4).map((project, index) => <figure key={`${project.title}-${index}`}><SheetImage src="/images/services/property-types-v4.webp" index={project.image} alt={`${project.title} — illustrative architectural image`} /><figcaption>{project.title}</figcaption></figure>)}</div>
    <p className={styles.projectNote}>Architectural images shown for illustration.</p>
  </section>;
}

export function Home2Enquiry() {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || '').trim();
    const message = `Hello Termite Pest Control, I would like to request a free enquiry.\n\nName: ${value('name')}\nMobile: ${value('phone')}\nService required: ${value('service')}\nCity / location: ${value('city')}\n\nPlease confirm inspection availability and the next steps.`;
    window.location.assign(`https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`);
  }

  return <form id="home2-enquiry" className={styles.enquiryForm} onSubmit={submit}>
    <h2>Request a Free Enquiry</h2>
    <div className={styles.enquiryFields}>
      <label>Your Name <span>*</span><input name="name" placeholder="Your name" autoComplete="name" required minLength={2} maxLength={80} pattern={String.raw`.*\S.*`} /></label>
      <label>Mobile Number <span>*</span><PhoneInput name="phone" placeholder="10-digit mobile number" autoComplete="tel" required /></label>
      <label>Service Required <span>*</span><select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{termiteServices.map(service => <option key={service.slug}>{service.title}</option>)}<option>Not sure — please advise</option></select></label>
      <label>City / Location <span>*</span><input name="city" placeholder="City / area" autoComplete="address-level2" list="home2-service-areas" required maxLength={100} pattern={String.raw`.*\S.*`} /><datalist id="home2-service-areas">{['Bangalore', ...home2Locations, ...offices.map(office => office.city)].map(city => <option value={city} key={city} />)}</datalist></label>
    </div>
    <button className={styles.enquirySubmit} type="submit">Submit Enquiry <ArrowRight size={17} aria-hidden="true" /></button>
    <p>Opens your enquiry in WhatsApp. Send the message to complete your request.</p>
  </form>;
}

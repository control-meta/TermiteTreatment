'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ServiceEnquiryForm from '../../components/ServiceEnquiryForm';
import { home2Locations, home2Projects } from './content';
import SheetImage from './SheetImage';
import styles from './home2.module.css';

export function Home2Projects() {
  const [expanded, setExpanded] = useState(false);
  const projects = home2Projects.slice(0, expanded ? 6 : 4);
  const cards = (duplicate = false) => projects.map((project, index) => <figure key={`${project.title}-${index}`}><SheetImage src="/images/services/property-types-v4.webp" index={project.image} alt={duplicate ? '' : `${project.title} — illustrative architectural image`} /><figcaption>{project.title}</figcaption></figure>);
  return <section className={styles.projectSection} id="projects" aria-labelledby="home2-projects-title">
    <div className={styles.projectHeading}><h2 id="home2-projects-title">Our Recent Projects</h2><button type="button" aria-expanded={expanded} aria-controls="home2-project-gallery" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show Fewer' : 'View All Projects'} <ArrowRight size={14} aria-hidden="true" /></button></div>
    <div className={expanded ? undefined : styles.projectMarquee} id="home2-project-gallery">
      {expanded ? <div className={styles.projectGrid}>{cards()}</div> : <div className={styles.projectTrack}>
        <div className={`${styles.projectGrid} ${styles.projectGroup}`}>{cards()}</div>
        <div className={`${styles.projectGrid} ${styles.projectGroup} ${styles.projectDuplicate}`} aria-hidden="true">{cards(true)}</div>
      </div>}
    </div>
  </section>;
}

export function Home2Enquiry() {
  return <ServiceEnquiryForm id="home2-enquiry" className={styles.enquiryForm} suggestedLocations={home2Locations} />;
}

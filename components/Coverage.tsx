import { ArrowUpRight, MapPin } from 'lucide-react';
import { regions } from '../lib/company';

export default function Coverage() {
  return <section className="coverage-section"><div className="page-container coverage-inner"><div><p className="eyebrow">LOCAL CARE. A WIDER REACH.</p><h2>Across cities.<br /><span>Close to your home.</span></h2><p>Termite care across India’s major cities and surrounding areas. Get in touch to check availability for your address.</p></div><div className="coverage-cities">{regions.map((city, index) => <a href={`/contact-us?city=${encodeURIComponent(city)}#enquiry`} key={city}><span className="city-number">0{index + 1}</span><MapPin size={16} /><span>{city}</span><ArrowUpRight size={15} /></a>)}</div></div></section>;
}

import { serviceDetails, type ServiceDetail } from './service-details';
import { termiteServices } from './company';
import { serviceTitle } from './service-title';
import type { Location } from './locations';

const serviceIntroductions: Record<string, (city: Location) => string> = {
  'residential-termite-control': city => `Protect your ${city.name} home from termites with an inspection-led plan for apartments, independent houses and villas. ${city.homes}`,
  'commercial-termite-control': city => `Commercial termite control in ${city.name}, planned around your premises and operating needs. ${city.businesses}`,
  'pre-construction-termite-treatment': city => `Protect your new building in ${city.name} from termite infestation with professional pre-construction anti-termite treatment. ${city.construction}`,
  'post-construction-termite-treatment': city => `Address termite activity in your completed ${city.name} property with targeted inspection and treatment. ${city.homes}`,
  'annual-maintenance-contract': city => `Keep termite care on the calendar with an annual maintenance plan in ${city.name}. ${city.maintenance}`,
};

export function getLocalizedService(city: Location, slug: string): ServiceDetail | undefined {
  const base = serviceDetails[slug];
  const service = termiteServices.find(item => item.slug === slug);
  if (!base || !service) return undefined;
  const context = slug === 'commercial-termite-control' ? city.businesses : slug === 'pre-construction-termite-treatment' ? city.construction : slug === 'annual-maintenance-contract' ? city.maintenance : city.homes;
  const localStepNotes = slug === 'pre-construction-termite-treatment' ? [
    `Coordinate access to the excavated foundation trenches with your ${city.name} builder before they are covered.`,
    `For your ${city.name} site, agree the backfilling sequence and treatment visit with the contractor.`,
    `Share the flooring schedule for your ${city.name} project so this visit takes place while the filling is accessible.`,
    `Identify pipe routes and service penetrations with the site contact for your ${city.name} building.`,
    `Discuss accessible outer edges and landscaping plans at your ${city.name} site before the perimeter work is agreed.`,
  ] : [
    `Share your locality in ${city.name}, the property type and any access arrangements.`,
    `For properties in ${city.areas[0]}, ${city.areas[1]} and nearby areas, explain which rooms or site zones need attention.`,
    `Your ${city.name} quotation confirms the agreed areas, preparation and appointment arrangements.`,
    `The visit is coordinated with the household, builder or facilities contact for your ${city.name} property.`,
    `Keep the service information and contact our team if you notice new signs at your ${city.name} property.`,
  ];
  return {
    ...base,
    title: serviceTitle(slug, undefined, city.name),
    accent: '',
    intro: serviceIntroductions[slug](city),
    heroAlt: `${base.heroAlt}. Illustration of ${service.title.toLowerCase()} for properties in ${city.name}.`,
    heroTrust: [`Local ${city.name} Support`, 'Property-Specific Care', 'Clear Service Plan'],
    definitionTitle: `${service.title} in ${city.name}`,
    definition: `${base.definition} ${context}`,
    benefitTitle: `6 reasons to choose ${service.title.toLowerCase()} in ${city.name}`,
    processTitle: `Our ${service.title.toLowerCase()} process in ${city.name}`,
    processIntro: `A clear plan for ${city.name} properties, from the first conversation to agreed aftercare.`,
    steps: base.steps.map(([title, text], index) => [title, `${text} ${localStepNotes[index]}`]),
    projectsTitle: `${service.title} for different properties in ${city.name}`,
    projects: base.projects.map(([title, image]) => [`${title} in ${city.name}`, image]),
    whyTitle: `Why choose our termite control team in ${city.name}?`,
    whyItems: [`Local inspection planning in ${city.name}`, 'Treatment based on the property assessment', `Clear scope and quotation for your ${city.name} property`, 'Preparation, service information and aftercare guidance'],
    faqs: [
      [`Which areas of ${city.name} can I enquire about?`, `We welcome enquiries from ${city.areas.filter(area => area !== 'and More...').join(', ')} and nearby areas. Share the exact address or locality so the team can confirm service availability and access.`],
      [`How is ${service.title.toLowerCase()} planned in ${city.name}?`, `${context} ${base.faqs[0][1]}`],
      [`What affects the cost of ${service.title.toLowerCase()} in ${city.name}?`, `The size, construction, termite activity, accessible treatment areas and visit requirements affect your ${city.name} quotation. Share your locality and property details; the team will explain the proposed scope and price after assessment.`],
      [`How do I arrange ${service.title.toLowerCase()} in ${city.name}?`, `Use the enquiry form on this page or call our official helpline. Your message includes ${city.name} and ${service.title.toLowerCase()} so the team can discuss the right visit. Inspection timing is confirmed with you.`],
    ],
    closingTitle: `Need ${service.title.toLowerCase()} in ${city.name}?`,
    closingAccent: `Let’s plan the right care for your ${city.name} property.`,
    closingText: `Tell us your ${city.name} locality, property type and what you have noticed. ${slug === 'pre-construction-termite-treatment' ? 'Include the current construction stage so we can coordinate with your builder.' : slug === 'annual-maintenance-contract' ? 'Share any previous treatment and the ongoing coverage you need.' : 'Our team will confirm inspection availability and discuss the next step.'}`,
  };
}

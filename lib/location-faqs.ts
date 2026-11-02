import type { Location } from './locations';

export function locationFaqs(city: Location): [string, string][] {
  return [
    ['Is termite treatment safe for my family?', `For your ${city.name} property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins. Tell us about children, pets or any sensitivities when you enquire.`],
    ['How long does the treatment last?', 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan. Ask the team to explain any follow-up, maintenance and written warranty terms for your property.'],
    ['Do you offer AMC for regular maintenance?', `Yes. An annual maintenance plan can be discussed for homes and businesses in ${city.name}. Inspection frequency, covered areas and treatment inclusions are agreed before the contract starts.`],
    ['Are your treatments odorless?', 'Odour and preparation requirements depend on the products and method selected. The team can explain available options and the instructions for your property after assessment.'],
  ];
}

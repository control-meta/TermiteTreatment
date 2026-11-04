import { serviceBenefits } from './service-benefits';

export type ServiceDetail = {
  title: string;
  accent: string;
  intro: string;
  hero: string;
  heroAlt: string;
  heroPosition?: string;
  heroTrust?: [string, string, string];
  whyTitle?: string;
  whyItems?: string[];
  definitionTitle: string;
  definition: string;
  benefitTitle: string;
  benefits: [string, string][];
  processTitle: string;
  processIntro: string;
  steps: [string, string][];
  projectsTitle: string;
  projects: [string, number][];
  faqs: [string, string][];
  closingTitle: string;
  closingAccent: string;
  closingText: string;
};

export const serviceDetails: Record<string, ServiceDetail> = {
  'pre-construction-termite-treatment': {
    title: 'Pre-Construction Termite Treatment',
    accent: '',
    intro: 'Protect your new building from termite infestation with professional pre-construction anti-termite treatment.',
    hero: '/images/services/preconstruction-hero-v4.webp',
    heroAlt: 'Site engineer reviewing plans beside a concrete building under construction',
    heroTrust: ['Long-Term Protection', 'Expert Team', 'ISO Standard Process'],
    definitionTitle: 'What Is Pre-Construction Anti-Termite Treatment?',
    definition: 'Pre-construction anti-termite treatment is a preventive process carried out during construction to help protect your building from subterranean termites. It involves applying a termiticide to the soil at the right stages of construction.',
    benefitTitle: '6 Reasons to Protect Your Building Before Construction Is Completed',
    benefits: serviceBenefits['pre-construction-termite-treatment'],
    processTitle: 'Our Pre-Construction Termite Treatment Process',
    processIntro: 'A systematic approach to create a strong termite protection barrier.',
    steps: [
      ['Foundation Trench Treatment', 'Treat the bottom and sides of foundation trenches.'],
      ['Backfill Soil Treatment', 'Treat soil around foundation structures.'],
      ['Plinth Filling Treatment', 'Treat soil before flooring.'],
      ['Service Entry & Junction Treatment', 'Cover pipe and other entry points.'],
      ['External Perimeter Treatment', 'Treat soil around the building.'],
    ],
    projectsTitle: 'Termite Protection for Different Construction Projects',
    projects: [['Independent Houses & Villas', 0], ['Apartments & Residential Complexes', 1], ['Commercial Buildings', 2], ['Industrial Buildings & Warehouses', 3], ['Hotels, Hospitals & Educational Institutions', 4], ['Real Estate & Builder Projects', 5]],
    whyTitle: 'Why Choose Termite Pest Control?',
    whyItems: ['Experienced and trained team', 'Treatment as per industry standards', 'Suitable solutions for all projects', 'Complete documentation & support'],
    faqs: [
      ['What is pre-construction termite treatment?', 'Pre-construction anti-termite treatment is a preventive process carried out during construction to help protect your building from subterranean termites. It involves applying a termiticide to the soil at the right stages of construction.'],
      ['When should treatment be done?', 'Treatment is planned at the right stages of construction, including foundation trenches, backfill soil, plinth filling, service entries and the external perimeter. Contact our team before these areas are covered.'],
      ['Is it necessary for new buildings?', 'New buildings can also be vulnerable to subterranean termites. Pre-construction treatment helps create a protective barrier beneath and around the building while the soil is accessible.'],
    ],
    closingTitle: 'Planning a New Building?',
    closingAccent: 'Protect It Against Termites from the Beginning.',
    closingText: 'Contact our team to discuss your project and get a free site inspection.',
  },
  'residential-termite-control': {
    title: 'Residential Termite Control',
    accent: '',
    intro: 'Make room for living. Keep termites out. Get an inspection-led treatment plan for your home, wooden furniture and the hidden places that need attention.',
    hero: '/images/services/residential-hero-v4.webp',
    heroAlt: 'Termite-care specialist inspecting a timber doorway at a garden villa',
    definitionTitle: 'What is residential termite control?',
    definition: 'Residential termite control starts with inspecting your home for termite activity, vulnerable timber and possible entry routes. The findings guide a treatment plan for affected and accessible areas, followed by practical advice on preparation, moisture management and ongoing checks.',
    benefitTitle: '6 reasons to give your home a closer look',
    benefits: serviceBenefits['residential-termite-control'],
    processTitle: 'Our residential termite care process',
    processIntro: 'From the first signs to a considered plan for your home.',
    steps: [
      ['Listen & inspect', 'Tell us what you have noticed. We check accessible timber, wall-floor junctions and moisture-prone areas.'],
      ['Identify activity & access', 'Review visible termite signs and the places that may need closer attention.'],
      ['Agree a treatment plan', 'Discuss the proposed method, access, preparation and quotation before work begins.'],
      ['Treat the agreed areas', 'Carry out the planned work with attention to your home’s finishes and occupied spaces.'],
      ['Explain care & follow-up', 'Share aftercare guidance and confirm any agreed monitoring or warranty terms.'],
    ],
    projectsTitle: 'Thoughtful care for the places you call home',
    projects: [['Independent houses & villas', 0], ['Apartments & flats', 1], ['Bungalows & family homes', 0], ['Residential complexes', 1], ['Rental homes', 0], ['Housing societies', 1]],
    faqs: [
      ['What signs should I look for at home?', 'Mud tubes, discarded wings, damaged timber or wood that sounds hollow can justify an inspection. These signs can have other causes, so an assessment helps establish what is happening.'],
      ['Will my furniture need treatment?', 'We inspect accessible furniture and fixed woodwork, then explain which items need attention. The recommendation depends on the material, activity and access.'],
      ['Do I need to leave home during treatment?', 'Preparation and re-entry requirements depend on the method and products selected. Our team will explain the instructions for your property before the visit.'],
      ['How do I arrange a home inspection?', 'Share your city, property type and any signs you have noticed using the form below. The team will confirm availability and discuss a suitable time.'],
    ],
    closingTitle: 'Noticed something in the woodwork?',
    closingAccent: 'Let’s take care of your home.',
    closingText: 'A small sign is a good reason to start a conversation. Tell us about your home and arrange a free termite inspection.',
  },
  'commercial-termite-control': {
    title: 'Commercial Termite Control',
    accent: '',
    intro: 'Protect your premises. Keep business moving. Plan termite inspections and treatment around your building, operating hours and access requirements.',
    hero: '/images/services/commercial-hero-v5.webp',
    heroAlt: 'Termite-care specialist inspecting a timber entrance frame outside a modern glass office building',
    heroPosition: '65% 30%',
    definitionTitle: 'What is commercial termite control?',
    definition: 'Commercial termite control brings property assessment, treatment planning and service reporting together for business premises. We review accessible timber, structural junctions and areas of concern, then propose work that considers the building’s use, access and operating schedule.',
    benefitTitle: '6 ways a planned approach supports your business',
    benefits: serviceBenefits['commercial-termite-control'],
    processTitle: 'Our commercial termite protection process',
    processIntro: 'An organised service plan for your people, premises and operations.',
    steps: [
      ['Understand the premises', 'Review property use, affected areas, access restrictions and operating hours with your site contact.'],
      ['Inspect priority areas', 'Check accessible timber, building junctions and visible signs of termite activity.'],
      ['Plan access & treatment', 'Agree the scope, method, preparation and timing for each area of the building.'],
      ['Carry out the work', 'Complete the agreed treatment in coordination with the responsible site team.'],
      ['Report & review', 'Provide service information and discuss follow-up or an ongoing maintenance plan.'],
    ],
    projectsTitle: 'A considered plan for different business spaces',
    projects: [['Offices & business parks', 2], ['Retail & commercial spaces', 2], ['Warehouses & industrial sites', 3], ['Hotels & hospitality', 4], ['Hospitals & healthcare', 4], ['Schools & institutions', 4]],
    faqs: [
      ['Can work be planned around business hours?', 'Share your operating schedule and access requirements. We will discuss available appointments and whether the proposed treatment can be staged around your operations.'],
      ['Do you inspect large or multi-area properties?', 'We can discuss the size and layout of your premises and plan an assessment. Larger or complex sites may need a coordinated inspection with a facilities representative.'],
      ['Will we receive service documentation?', 'The agreed service scope and records are discussed before work starts. Tell us about any reporting requirements so the team can confirm what can be provided.'],
      ['Can we arrange ongoing maintenance?', 'Yes. Ask about an annual maintenance plan. Visit frequency, included areas and treatment terms are agreed for the property.'],
    ],
    closingTitle: 'Your premises deserve a plan.',
    closingAccent: 'Let’s protect the place you do business.',
    closingText: 'Tell us about your building, its use and a suitable time to visit. We’ll help you plan the next step.',
  },
  'post-construction-termite-treatment': {
    title: 'Post-Construction Termite Treatment',
    accent: '',
    intro: 'An existing building. A fresh layer of protection. Address termite activity around floors, walls and vulnerable woodwork with a property-specific treatment plan.',
    hero: '/images/services/postconstruction-hero-v4.webp',
    heroAlt: 'Protected technician applying precision treatment at a finished home’s wall-floor junction',
    definitionTitle: 'What is post-construction anti-termite treatment?',
    definition: 'Post-construction treatment addresses termite activity in completed or occupied buildings. After an inspection, suitable treatment may include targeted drilling and injection at accessible junctions, attention to affected woodwork and measures to address likely entry routes.',
    benefitTitle: '6 reasons to act on signs in an existing building',
    benefits: serviceBenefits['post-construction-termite-treatment'],
    processTitle: 'Our post-construction treatment process',
    processIntro: 'Find the signs. Reach suitable treatment points. Plan the next step.',
    steps: [
      ['Inspect the building', 'Check accessible timber, mud tubes and the junctions where activity has been noticed.'],
      ['Identify suitable access points', 'Review entry routes, building finishes and the treatment access available.'],
      ['Agree preparation & method', 'Explain the proposed work, including drilling and injection where suitable, before treatment starts.'],
      ['Apply targeted treatment', 'Treat the agreed areas and address affected woodwork as set out in your service plan.'],
      ['Review aftercare', 'Explain preparation for re-use, monitoring and any agreed follow-up or warranty terms.'],
    ],
    projectsTitle: 'Protection for buildings already in use',
    projects: [['Occupied houses & villas', 0], ['Apartments & housing societies', 1], ['Offices & commercial buildings', 2], ['Warehouses & storage spaces', 3], ['Hotels & institutions', 4], ['Renovation projects', 0]],
    faqs: [
      ['Will treatment involve drilling?', 'Drilling and injection may be recommended where suitable access is needed. The team will explain the proposed locations, method and finishing arrangements after the inspection.'],
      ['Can an occupied property be treated?', 'The plan considers how the building is used and which areas are accessible. Preparation, access and re-entry instructions will be explained for the selected treatment.'],
      ['Is damaged wood restored by treatment?', 'Treatment addresses termite activity; it does not restore damaged timber. Any repair or replacement needs to be assessed separately.'],
      ['What if I have already had termite treatment?', 'Share the previous service details and any new signs you have noticed. We will assess the current situation before recommending further work.'],
    ],
    closingTitle: 'Seeing signs of termites?',
    closingAccent: 'Get to the source of the problem.',
    closingText: 'Share what you have noticed and where. Start with a free inspection and understand the options for your building.',
  },
  'annual-maintenance-contract': {
    title: 'Annual Termite Maintenance',
    accent: '',
    intro: 'Protection needs attention, not guesswork. Keep termite care on the calendar with scheduled inspections, service records and support under an agreed plan.',
    hero: '/images/services/maintenance-hero-v4.webp',
    heroAlt: 'Specialist recording a scheduled timber inspection on a tablet beside a garden veranda',
    definitionTitle: 'What is a termite maintenance contract?',
    definition: 'An annual maintenance contract, or AMC, is an agreed plan for regular termite inspections, monitoring and support. The inspection frequency, covered areas, included treatments and re-treatment terms are set out for your property before the contract starts.',
    benefitTitle: '6 reasons to keep termite care on your calendar',
    benefits: serviceBenefits['annual-maintenance-contract'],
    processTitle: 'How your annual maintenance plan works',
    processIntro: 'A clear agreement. Regular checks. Care that continues.',
    steps: [
      ['Assess your property', 'Inspect accessible areas and review any termite history or previous treatment.'],
      ['Agree your coverage', 'Confirm covered areas, visit frequency, treatment inclusions and the contract period.'],
      ['Schedule inspection visits', 'Arrange the agreed checks and coordinate access with your household or site team.'],
      ['Record & act on findings', 'Document observations and carry out any work included under your agreement.'],
      ['Review your next year', 'Discuss changes to the property, ongoing care needs and renewal options before the plan ends.'],
    ],
    projectsTitle: 'Ongoing care for homes and working spaces',
    projects: [['Independent homes & villas', 0], ['Apartments & housing societies', 1], ['Offices & business premises', 2], ['Warehouses & managed sites', 3], ['Hotels & institutions', 4], ['Previously treated properties', 0]],
    faqs: [
      ['How many inspections are included?', 'The visit frequency is agreed for your property and stated in the contract. Ask the team to confirm the schedule, covered areas and access requirements before signing.'],
      ['Does an AMC include every type of treatment?', 'Coverage depends on the agreement. Inspection, preventive work, re-treatment and exclusions should be reviewed with the team so you know exactly what is included.'],
      ['Can I take an AMC after an earlier treatment?', 'Share your previous treatment details and current concerns. An initial assessment helps us propose a suitable maintenance scope for your property.'],
      ['Is renewal automatic?', 'Renewal arrangements depend on the contract you agree to. The team can explain the duration, expiry and renewal process before your plan starts.'],
    ],
    closingTitle: 'Keep care on the calendar.',
    closingAccent: 'Plan for peace of mind throughout the year.',
    closingText: 'Tell us about your property and previous termite history. We’ll help you explore an annual maintenance plan.',
  },
};

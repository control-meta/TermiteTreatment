export const company = {
  phone: '+91 92203 12345',
  telephone: 'tel:+919220312345',
  whatsapp: '919220312345',
  email: 'support@termitepestcontrol.co.in',
};

export const regions = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Goa'];

export const offices = [
  { city: 'Mumbai', address: 'Building No. 1/B, Shop No. 9, MMRDA Complex, Vikhroli Jogeshwari Link Road, Karve Nagar, Near Mhada Colony, Kanjurmarg East, Mumbai – 400042.' },
  { city: 'Bengaluru', address: '4/36, Tavarekere Main Road, Opp. Forum Mall, Chikkaadugodi, Baswanagudi, Bengaluru – 560029, India.' },
  { city: 'Pune', address: 'A1, Graficon Arcade, 23 Sassoon Road, Opp. Jehangir Nursing Home, Pune – 411001, Maharashtra.' },
  { city: 'Delhi NCR', address: 'A-13 (Dot House), 2nd Portion Hanuman Mandir, Pandav Nagar Complex, Block A, Ganesh Nagar, Delhi – 110092, India.' },
  { city: 'Goa', address: 'Shop No. 2, near Communidade Building, Ambre Colony, Defence Colony, Alto, Porvorim, Aradi Socorro, Goa – 403521.' },
];

export const termiteServices = [
  {
    slug: 'residential-termite-control', title: 'Residential Termite Control', shortTitle: 'Residential care', label: 'FOR THE PLACE YOU CALL HOME', type: 'home',
    headline: 'Make room for living. Keep termites out.',
    text: 'Thoughtful termite protection for apartments, villas and family homes, from wooden furniture to the places you rarely see.',
    detail: 'We inspect timber, moisture-prone areas and possible entry points, then recommend treatment for your home’s construction and termite activity. Ask about preparation, aftercare and warranty terms before work begins.',
    tags: ['Home inspection', 'Targeted treatment'], image: 'service-residential-v1', alt: 'A termite-care specialist inspecting the wooden skirting and cabinet edge in a lived-in apartment',
    suited: 'Apartments, villas, bungalows and housing societies.',
    includes: ['Inspection of woodwork and vulnerable areas', 'A treatment plan for your property', 'Preparation and prevention guidance'],
    steps: [['Look closely', 'Inspect the home and identify activity and access points.'], ['Treat with care', 'Carry out the agreed treatment with clear preparation guidance.'], ['Keep watch', 'Discuss follow-up visits and the applicable warranty.']],
    source: 'https://termitepestcontrol.co.in/residential-termite-control/',
  },
  {
    slug: 'commercial-termite-control', title: 'Commercial Termite Control', shortTitle: 'Commercial care', label: 'PROTECTION THAT WORKS AROUND YOU', type: 'business',
    headline: 'Protect your premises. Keep business moving.',
    text: 'Termite care for offices, retail spaces, hotels and larger premises, planned around your building and operating needs.',
    detail: 'A site assessment helps us identify structural risks, affected timber and entry routes. We plan treatment around access and operations, with reporting and maintenance options for your premises.',
    tags: ['Property assessment', 'Flexible scheduling'], image: 'service-commercial-v1', alt: 'A building-care professional checking a wooden reception counter in a contemporary office lobby',
    suited: 'Offices, shops, hotels, hospitals, schools, warehouses and managed properties.',
    includes: ['Assessment of premises and termite risks', 'Treatment planned around business operations', 'Service reporting and maintenance options'],
    steps: [['Assess the site', 'Review structural areas, wooden fixtures and utility passages.'], ['Plan around you', 'Agree access, timing and a property-specific treatment plan.'], ['Monitor the premises', 'Discuss reporting, follow-up and commercial maintenance.']],
    source: 'https://termitepestcontrol.co.in/commercial-termite-control/',
  },
  {
    slug: 'pre-construction-termite-treatment', title: 'Pre-Construction Termite Treatment', shortTitle: 'Before you build', label: 'START WITH A STRONGER FOUNDATION', type: 'both',
    headline: 'Build protection in. From the ground up.',
    text: 'Preventive soil treatment for new builds, coordinated with your construction schedule before vulnerable areas are covered.',
    detail: 'Soil treatment creates a protective barrier beneath and around a new structure. We coordinate the relevant stages with your builder, including foundations, plinth filling, pipe entries and the external perimeter.',
    tags: ['Soil barrier', 'Builder coordination'], image: 'service-preconstruction-v1', alt: 'A trained technician applying soil treatment along a building foundation trench before concrete is poured',
    suited: 'New homes, commercial developments, housing projects and industrial sites.',
    includes: ['Foundation and plinth-stage soil treatment', 'Attention to pipe entries and wall junctions', 'Perimeter treatment and service documentation'],
    steps: [['Plan early', 'Review the site and agree treatment stages with the builder.'], ['Treat in stages', 'Coordinate foundation, plinth and other accessible soil areas.'], ['Complete the barrier', 'Address perimeter access and provide service records.']],
    source: 'https://termitepestcontrol.co.in/pre-construction-termite-treatment/',
  },
  {
    slug: 'post-construction-termite-treatment', title: 'Post-Construction Termite Treatment', shortTitle: 'For existing buildings', label: 'GET TO THE SOURCE OF THE PROBLEM', type: 'both',
    headline: 'An existing home. A fresh layer of protection.',
    text: 'Targeted termite treatment for completed buildings, addressing activity around floors, walls and vulnerable woodwork.',
    detail: 'We assess termite activity in occupied properties and recommend a suitable treatment. Where appropriate, drilling and injection help reach concealed areas and establish protection at likely entry points.',
    tags: ['Existing properties', 'Drilling & injection'], image: 'service-postconstruction-v1', alt: 'A gloved technician using a precision injection tool at the skirting of a finished home',
    suited: 'Occupied homes, offices, shops and other completed buildings.',
    includes: ['Inspection of active and vulnerable areas', 'Targeted drilling and injection where suitable', 'Aftercare and prevention recommendations'],
    steps: [['Find the signs', 'Check mud tubes, affected timber and likely entry routes.'], ['Reach hidden areas', 'Apply the agreed treatment to suitable access points.'], ['Plan follow-up', 'Explain aftercare, monitoring and applicable warranty terms.']],
    source: 'https://termitepestcontrol.co.in/post-construction-termite-treatment/',
  },
  {
    slug: 'annual-maintenance-contract', title: 'Annual Maintenance Contract', shortTitle: 'Year-round care', label: 'CARE THAT CONTINUES', type: 'both',
    headline: 'Lasting peace of mind takes ongoing care.',
    text: 'A termite maintenance plan with scheduled inspections, monitoring and support for your home or business.',
    detail: 'An AMC brings regular checks and preventive care into one agreed service plan. Inspection frequency, treatment coverage and re-treatment terms are set out for your property before the contract starts.',
    tags: ['Scheduled checks', 'Ongoing support'], image: 'service-maintenance-v1', alt: 'A pest-care specialist using a tablet checklist during a scheduled inspection of an apartment door frame',
    suited: 'Homes, businesses, housing societies and properties with a history of termites.',
    includes: ['Initial property assessment', 'Scheduled follow-up inspections', 'Service records and support under your agreement'],
    steps: [['Assess your needs', 'Review the property and any previous termite activity.'], ['Agree your plan', 'Confirm coverage, visit frequency and contract terms.'], ['Stay in touch', 'Monitor the property and arrange care under the agreed plan.']],
    source: 'https://termitepestcontrol.co.in/termite-amc-plans/',
  },
];

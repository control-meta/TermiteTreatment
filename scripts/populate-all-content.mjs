import { MongoClient } from 'mongodb';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Helper to load .env
function loadEnv() {
  for (const fileName of ['.env', '.env.local']) {
    const envPath = resolve(process.cwd(), fileName);
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const key = trimmed.slice(0, idx).trim();
          const value = trimmed.slice(idx + 1).trim();
          if (!process.env[key] && value) {
            process.env[key] = value.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;

// 1. Locations
const locations = [
  {
    slug: 'mumbai',
    name: 'Mumbai',
    officialName: 'Mumbai',
    state: 'Maharashtra',
    landmark: 'Gateway of India',
    image: '/images/locations/mumbai-hero.webp',
    imageAlt: 'Illustration of the Gateway of India and landscaped waterfront in Mumbai',
    heroTitle: 'Termite Treatment in Mumbai',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Mumbai’s coastal climate makes homes and offices susceptible to termite infestations. Our professional termite pest control services in Mumbai offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property from destructive termites with a treatment plan tailored to your building.',
    context: 'Mumbai properties range from compact apartments and older timber interiors to housing societies and busy commercial premises. We plan inspections around building access, occupied rooms and the areas where you have noticed activity.',
    homes: 'For Mumbai flats, independent homes and housing societies, the assessment considers fixed cupboards, door frames, skirting and shared building access. Tell us about damp areas and any earlier treatment.',
    businesses: 'For Mumbai offices, retail units and managed premises, we discuss access with your facilities contact and plan the agreed work around the areas in use and your operating hours.',
    construction: 'For a new Mumbai home or commercial project, share the foundation plans, site access and the builder’s schedule so soil treatment can be coordinated before the relevant areas are covered.',
    maintenance: 'For Mumbai homes and managed buildings, an annual plan can bring inspections and service records together, with access coordinated through your household or society representative.',
    areas: ['Andheri', 'Powai', 'Borivali', 'Kanjurmarg', 'Vikhroli', 'Bandra', 'Goregaon', 'Mulund', 'Chembur', 'and More...'],
    faqs: [
      ['Is termite treatment safe for my family?', 'For your Mumbai property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins. Tell us about children, pets or any sensitivities when you enquire.'],
      ['How long does the treatment last?', 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan. Ask the team to explain any follow-up, maintenance and written warranty terms for your property.'],
      ['Do you offer AMC for regular maintenance?', 'Yes. An annual maintenance plan can be discussed for homes and businesses in Mumbai. Inspection frequency, covered areas and treatment inclusions are agreed before the contract starts.'],
      ['Are your treatments odorless?', 'Odour and preparation requirements depend on the products and method selected. The team can explain available options and the instructions for your property after assessment.']
    ]
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    officialName: 'Bengaluru',
    state: 'Karnataka',
    landmark: 'Vidhana Soudha',
    image: '/images/locations/bangalore-hero.webp',
    imageAlt: 'Illustration inspired by Vidhana Soudha with gardens and blue skies in Bangalore',
    heroTitle: 'Termite Treatment in Bangalore',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Bangalore’s humid climate makes homes and offices susceptible to termite infestations. Our professional termite pest control services in Bangalore offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property from destructive termites with guaranteed results.',
    context: 'Bangalore, also known as Bengaluru, has apartments, villas, rental homes and office campuses with different access and maintenance needs. We assess the accessible woodwork and areas of concern before proposing a service plan.',
    homes: 'For Bangalore apartments, villas and rental properties, inspections focus on accessible furniture, built-in cabinets, door frames and the areas where activity has been noticed. We discuss access with occupants or the property manager.',
    businesses: 'For Bangalore offices, IT parks, shops and managed workplaces, we consider your site rules and operating schedule before agreeing inspection access and treatment timing.',
    construction: 'For Bangalore residential developments and commercial builds, share your current construction stage and builder’s contact. Foundation, backfill, plinth and service-entry visits are planned around site progress.',
    maintenance: 'For Bangalore homes, housing societies and workplaces, a maintenance agreement sets out the inspection schedule, included areas and support available between agreed visits.',
    areas: ['Koramangala', 'Indiranagar', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'Rajajinagar', 'and More...'],
    faqs: [
      ['Is termite treatment safe for my family?', 'For your Bangalore property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins. Tell us about children, pets or any sensitivities when you enquire.'],
      ['How long does the treatment last?', 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan. Ask the team to explain any follow-up, maintenance and written warranty terms for your property.'],
      ['Do you offer AMC for regular maintenance?', 'Yes. An annual maintenance plan can be discussed for homes and businesses in Bangalore. Inspection frequency, covered areas and treatment inclusions are agreed before the contract starts.'],
      ['Are your treatments odorless?', 'Odour and preparation requirements depend on the products and method selected. The team can explain available options and the instructions for your property after assessment.']
    ]
  },
  {
    slug: 'pune',
    name: 'Pune',
    officialName: 'Pune',
    state: 'Maharashtra',
    landmark: 'Shaniwar Wada',
    image: '/images/locations/pune-hero.webp',
    imageAlt: 'Illustration of the historic Shaniwar Wada gateway and gardens in Pune',
    heroTitle: 'Termite Treatment in Pune',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Pune’s homes, apartments and workplaces need a considered approach to termite protection. Our professional termite pest control services in Pune offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property with a treatment plan based on an inspection.',
    context: 'Pune properties include independent houses, apartment communities, offices and buildings at different stages of construction. The plan takes account of the property layout, accessible timber and the work you are preparing for.',
    homes: 'For Pune houses, apartments and housing societies, we review visible signs, fixed woodwork and accessible junctions. Share any renovation plans so the inspection can include the areas that will become accessible.',
    businesses: 'For Pune offices, commercial units and industrial premises, we agree priority areas and site access with your representative before proposing work and reporting arrangements.',
    construction: 'For a new Pune house, commercial unit or building project, share the site timeline and builder’s contact so foundation and backfill applications can be coordinated before the areas are closed off.',
    maintenance: 'For Pune residential societies and commercial properties, an annual agreement sets out the inspection schedule, included areas and reporting arrangements for ongoing termite care.',
    areas: ['Kothrud', 'Viman Nagar', 'Baner', 'Wakad', 'Hinjewadi', 'Hadapsar', 'Aundh', 'Kalyani Nagar', 'and More...'],
    faqs: [
      ['Is termite treatment safe for my family?', 'For your Pune property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins. Tell us about children, pets or any sensitivities when you enquire.'],
      ['How long does the treatment last?', 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan. Ask the team to explain any follow-up, maintenance and written warranty terms for your property.'],
      ['Do you offer AMC for regular maintenance?', 'Yes. An annual maintenance plan can be discussed for homes and businesses in Pune. Inspection frequency, covered areas and treatment inclusions are agreed before the contract starts.'],
      ['Are your treatments odorless?', 'Odour and preparation requirements depend on the products and method selected. The team can explain available options and the instructions for your property after assessment.']
    ]
  },
  {
    slug: 'delhi-ncr',
    name: 'Delhi NCR',
    officialName: 'National Capital Region',
    state: 'Delhi NCR',
    landmark: 'India Gate',
    image: '/images/locations/delhi-ncr-hero.webp',
    imageAlt: 'Illustration of India Gate with ceremonial avenues and open skies in New Delhi',
    heroTitle: 'Termite Treatment in Delhi NCR',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Delhi NCR’s temperature extremes and changing moisture conditions can encourage termite activity across properties. Our professional termite pest control services in Delhi NCR provide reliable inspection and treatment for homes, housing complexes and offices.',
    context: 'Delhi NCR properties include standalone houses, builder floors, high-rise apartments and large corporate complexes. We coordinate inspection access around building gates, internal woodwork and your schedule.',
    homes: 'For Delhi NCR houses, apartments and residential societies, inspections focus on fixed wardrobes, door surrounds, wooden flooring and accessible junctions. Share any earlier treatments or signs you have noticed.',
    businesses: 'For Delhi NCR corporate offices, showrooms and commercial premises, we review access arrangements with your facility team and plan work to avoid disruption during business hours.',
    construction: 'For new construction across Delhi NCR, share your project schedule so pre-construction soil treatment visits can be aligned with foundation excavation, backfilling and floor preparation.',
    maintenance: 'For Delhi NCR homes and commercial sites, an annual plan provides scheduled checkups and a clear record of termite care suited to the local climate.',
    areas: ['South Delhi', 'Dwarka', 'Gurugram', 'Noida', 'Greater Noida', 'Rohini', 'Connaught Place', 'Vasant Kunj', 'and More...'],
    faqs: [
      ['Is termite treatment safe for my family?', 'For your Delhi NCR property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins.'],
      ['How long does the treatment last?', 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan.'],
      ['Do you offer AMC for regular maintenance?', 'Yes. An annual maintenance plan can be discussed for homes and businesses in Delhi NCR.'],
      ['Are your treatments odorless?', 'Odour and preparation requirements depend on the products and method selected.']
    ]
  },
  {
    slug: 'goa',
    name: 'Goa',
    officialName: 'Goa',
    state: 'Goa',
    landmark: 'Basilica of Bom Jesus',
    image: '/images/locations/goa-hero.webp',
    imageAlt: 'Illustration of historic church architecture and tropical palms in Goa',
    heroTitle: 'Termite Treatment in Goa',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Goa’s tropical climate and timber-rich architectural features require watchful termite protection. Our professional termite pest control services in Goa support holiday homes, heritage properties, resorts and local businesses.',
    context: 'Goa properties include traditional roof timbers, wooden door surrounds, holiday villas and coastal hospitality buildings. We plan inspections around seasonal access, property caretakers and visible signs.',
    homes: 'For Goa villas, apartments and ancestral homes, inspections pay close attention to exposed rafters, vintage furniture, window frames and damp corners. We coordinate with caretakers where properties are unoccupied.',
    businesses: 'For Goa hotels, homestays, restaurants and retail locations, we work with the management team to agree convenient inspection windows and discreet treatment scheduling.',
    construction: 'For new villas or hospitality builds in Goa, share the architect’s foundation drawings and pouring dates so soil applications can be completed before slabs are laid.',
    maintenance: 'For Goa properties with seasonal occupancy, an AMC provides regular audits to identify termite activity early and keep timber protected throughout the monsoon.',
    areas: ['Panaji', 'Margao', 'Mapusa', 'Calangute', 'Candolim', 'Vasco da Gama', 'Porvorim', 'Ponda', 'and More...'],
    faqs: [
      ['Is termite treatment safe for my family?', 'For your Goa property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins.'],
      ['How long does the treatment last?', 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan.'],
      ['Do you offer AMC for regular maintenance?', 'Yes. An annual maintenance plan can be discussed for homes and businesses in Goa.'],
      ['Are your treatments odorless?', 'Odour and preparation requirements depend on the products and method selected.']
    ]
  },
  {
    slug: 'noida',
    name: 'Noida',
    officialName: 'Noida',
    state: 'Uttar Pradesh',
    landmark: 'Worlds of Wonder',
    image: '/images/locations/noida-hero.webp',
    imageAlt: 'Illustration of modern Noida city towers and landscaped green sectors',
    heroTitle: 'Termite Treatment in Noida',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Noida’s fast-growing sectors, residential towers and commercial hubs need planned termite protection. Our professional termite pest control services in Noida offer long-lasting protection using advanced, safe and eco-friendly methods.',
    context: 'Noida properties include gated society apartments, independent villas, commercial IT offices and buildings under construction. We schedule visits around society management access and work timings.',
    homes: 'For Noida apartments and houses, we assess fitted kitchen units, false ceilings, door frames and skirting boards for signs of infestation before proposing a treatment scope.',
    businesses: 'For Noida tech parks, institutional premises and commercial centers, inspections are coordinated through your administrative lead with full documentation provided.',
    construction: 'For Noida residential complexes and commercial projects, pre-construction soil treatment is coordinated with the site team at foundation and plinth stages.',
    maintenance: 'For Noida residences and offices, regular AMC visits provide documented checkups and prompt assistance whenever you have questions.',
    areas: ['Sector 18', 'Sector 62', 'Sector 137', 'Sector 50', 'Sector 76', 'Sector 128', 'Greater Noida West', 'and More...'],
    faqs: [
      ['Is termite treatment safe for my family?', 'For your Noida property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins.'],
      ['How long does the treatment last?', 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan.'],
      ['Do you offer AMC for regular maintenance?', 'Yes. An annual maintenance plan can be discussed for homes and businesses in Noida.'],
      ['Are your treatments odorless?', 'Odour and preparation requirements depend on the products and method selected.']
    ]
  }
];

// 2. Services
const services = [
  {
    slug: 'residential-termite-control',
    title: 'Residential Termite Control',
    accent: 'Specialist Home Protection',
    intro: 'Protect your home, wooden furniture, wardrobes and woodwork from destructive termites with safe, odorless and targeted residential termite treatments.',
    hero: '/images/services/residential-v3.webp',
    heroAlt: 'Inspector checking residential wooden window frame for termite signs',
    heroTrust: ['Safe for Family & Pets', 'Odorless Solutions', 'Long-Term Warranty'],
    definitionTitle: 'What Is Residential Termite Control?',
    definition: 'Residential termite control protects flats, villas, apartments and houses from subterranean and drywood termites using specialized drilling, injecting and barrier treatments.',
    benefitTitle: 'Why Choose Professional Home Termite Treatment?',
    benefits: [
      ['Safe for Family & Pets', 'Odorless, government-approved solutions safe for all household members.'],
      ['Deep Timber Penetration', 'Treatment reaches inside door frames, wardrobes, skirting and fixed wooden structures.'],
      ['Long-Term Warranty', 'Enjoy guaranteed protection with free reinspections if signs recur.']
    ],
    processTitle: 'Our Residential Termite Treatment Process',
    processIntro: 'A systematic 4-step treatment designed for minimum disruption to your home routine.',
    steps: [
      ['Thorough Inspection', 'Detailed check of all wooden structures, walls, skirting and moist areas.'],
      ['Precision Drilling', 'Small 12mm holes drilled along walls and wood fixtures.'],
      ['Chemical Injection', 'Eco-friendly termiticide injected under pressure to form an active barrier.'],
      ['Color-Matched Sealing', 'Holes sealed seamlessly with matching chalk and white cement.']
    ],
    faqs: [
      ['How long does a residential inspection take?', 'A standard home assessment usually takes 30 to 45 minutes.'],
      ['Do I need to vacate the house during treatment?', 'No, with modern odorless water-based emulsions, vacating is generally not required except for sensitive occupants.']
    ]
  },
  {
    slug: 'commercial-termite-control',
    title: 'Commercial Termite Control',
    accent: 'Workplace & Facility Protection',
    intro: 'Safeguard your offices, commercial buildings, retail stores, warehouses and commercial properties with customized pest management and scheduled termite care.',
    hero: '/images/services/commercial-v3.webp',
    heroAlt: 'Technician inspecting modern commercial office wall paneling',
    heroTrust: ['Zero Business Interruption', 'Compliance Documentation', 'Multi-Site Coverage'],
    definitionTitle: 'Tailored Commercial Pest Management',
    definition: 'Commercial termite management is engineered to minimize business interruption while delivering comprehensive protection for documents, IT server room flooring, fixtures and structural woodwork.',
    benefitTitle: 'Protecting Your Business Assets & Reputation',
    benefits: [
      ['Zero Business Interruption', 'Flexible scheduling including evenings, weekends and after-hours treatment.'],
      ['Compliance & Documentation', 'Full service reports, chemical details and compliance documentation for audits.'],
      ['Multi-Site Management', 'Coordinated service for single offices or multi-branch facilities across Indian cities.']
    ],
    processTitle: 'Commercial Treatment Strategy',
    processIntro: 'Engineered around your facility layout and business operational hours.',
    steps: [
      ['Site Risk Assessment', 'Identification of vulnerable junctions, documentation rooms, and cabling ducts.'],
      ['Access Coordination', 'Scheduling treatment during non-working hours or facility maintenance slots.'],
      ['Targeted Protection', 'Application of non-repellent chemical barriers without disrupting electronic infrastructure.'],
      ['Detailed Service Dossier', 'Issuance of compliance certificates, warranty cards, and inspection logs.']
    ],
    faqs: [
      ['Can work be conducted during weekends?', 'Yes, we regularly service offices and commercial spaces on weekends and evenings.'],
      ['Is certification provided for facility records?', 'Yes, written service certificates and treatment warranties are provided.']
    ]
  },
  {
    slug: 'pre-construction-termite-treatment',
    title: 'Pre-Construction Termite Treatment',
    accent: 'Anti-Termite Treatment Before You Build',
    intro: 'Protect your new building from subterranean termites by creating an unbroken chemical barrier in the soil before construction finishes.',
    hero: '/images/services/preconstruction-hero-v4.webp',
    heroAlt: 'Site engineer reviewing plans beside a concrete building under construction',
    heroTrust: ['Foundation Chemical Barrier', '10-Year Service Warranty', 'IS 6313 Standard Compliant'],
    definitionTitle: 'What Is Pre-Construction Soil Treatment?',
    definition: 'Pre-construction anti-termite treatment is applied in stages according to Indian Standards (IS 6313) to soil trenches, foundation footings, plinth backfill and perimeter walls before flooring is laid.',
    benefitTitle: '6 Reasons to Protect Before Construction',
    benefits: [
      ['Barrier at Foundation Stage', 'Blocks subterranean termites from ever entering through foundation slabs.'],
      ['10-Year Service Warranty', 'Compliant with Indian Standard specifications for construction projects.'],
      ['Cost-Effective Prevention', 'Treating soil during construction is up to 5x more economical than post-construction drilling.']
    ],
    processTitle: 'The Pre-Construction Stage-by-Stage Process',
    processIntro: 'Timed perfectly with your structural pouring and backfill timeline.',
    steps: [
      ['Foundation Trench Treatment', 'Treating the bottom and sides of trenches before footing concrete is poured.'],
      ['Plinth Backfill Saturation', 'Treating the backfilled soil before the stone soling or PCC sub-base is laid.'],
      ['Service Entry Conduits', 'Treating soil around plumbing conduits and electrical entries.'],
      ['External Perimeter Barrier', 'Treating soil along the outside foundation wall to prevent lateral migration.']
    ],
    faqs: [
      ['What stages of construction require treatment?', 'Bottom and sides of foundation trenches, plinth backfill soil, and perimeter soil.'],
      ['Do you coordinate with the site engineer / builder?', 'Yes, our team coordinates directly with your site supervisor to match the pouring schedule.']
    ]
  },
  {
    slug: 'post-construction-termite-treatment',
    title: 'Post-Construction Termite Treatment',
    accent: 'Drill-Fill-Seal Termite Protection',
    intro: 'Comprehensive drill-inject-seal termite treatment for existing houses and buildings suffering from active termite damage or seeking preventive shielding.',
    hero: '/images/services/postconstruction-v3.webp',
    heroAlt: 'Technician applying drill fill and seal termite treatment along skirting',
    heroTrust: ['Targeted Woodwork Care', 'Precision Drilling', 'Guaranteed Colony Kill'],
    definitionTitle: 'How Post-Construction Treatment Works',
    definition: 'Trained technicians drill small holes along perimeter walls, skirting boards and wooden fixtures, inject high-grade termiticide into the masonry, and neatly seal the holes to match your decor.',
    benefitTitle: 'Targeted Protection for Existing Properties',
    benefits: [
      ['Drill-Fill-Seal Technology', 'Precision 12mm holes sealed with color-matched cement, leaving surfaces spotless.'],
      ['Immediate Colony Elimination', 'Fast-acting active ingredients eradicate existing colonies inside timber.'],
      ['Protection for Fixed Furniture', 'Wardrobes, kitchen cabinets, paneling and wooden door frames shielded from the inside.']
    ],
    processTitle: 'Step-by-Step Post-Construction Treatment',
    processIntro: 'Careful execution without causing structural damage or aesthetic flaws.',
    steps: [
      ['Acoustic & Visual Check', 'Locating hidden termite channels and hollow woodwork.'],
      ['Perimeter Skirting Injection', 'Creating an unbroken continuous chemical perimeter around all internal walls.'],
      ['Woodwork Penetration', 'Direct treatment of fixed wooden frames, wardrobes, and cabinets.'],
      ['Invisible Patching', 'Sealing every drill point with color-matched fillers for clean aesthetics.']
    ],
    faqs: [
      ['Will the drilling damage my tiles or flooring?', 'Drilling is done with precision tools along skirting or mortar joints and filled neatly with matching material.'],
      ['How soon can we use the rooms?', 'Rooms can be used immediately after treatment finishes and air circulates.']
    ]
  },
  {
    slug: 'termite-amc',
    title: 'Annual Maintenance Contract (AMC)',
    accent: 'Continuous Protection & Peace of Mind',
    intro: 'Year-round proactive termite monitoring and warranty checkups for homes, societies and commercial properties with priority emergency call-outs.',
    hero: '/images/services/amc-v3.webp',
    heroAlt: 'Expert technician writing inspection warranty report for homeowners',
    heroTrust: ['Scheduled Audits', 'Free Re-Treatments', 'Priority Emergency Support'],
    definitionTitle: 'Why Choose an Annual Maintenance Plan?',
    definition: 'Termites can re-infest properties through undetected soil channels. An AMC ensures scheduled quarterly audits, preventive spray touches, and free prompt treatments whenever needed.',
    benefitTitle: 'Continuous Defense Year After Year',
    benefits: [
      ['Scheduled Proactive Audits', 'Regular expert inspections identify risks before damage occurs.'],
      ['Zero Extra Charges', 'Any required treatment during the contract term is fully covered.'],
      ['Dedicated Relationship Support', 'Priority booking and personal relationship manager for your property.']
    ],
    processTitle: 'The AMC Service Cycle',
    processIntro: 'Continuous property health monitoring across the entire year.',
    steps: [
      ['Quarterly Thorough Inspection', 'Proactive scheduled audit every 3 to 4 months.'],
      ['Preventive Refresh', 'Touching up high-risk moisture zones and external door frames.'],
      ['Detailed Service Documentation', 'Written condition reports provided after every visit.'],
      ['Unlimited Emergency Calls', 'Free call-outs within 24 hours if any new activity is detected.']
    ],
    faqs: [
      ['How many visits are included in AMC?', 'Standard AMC plans include 3 to 4 scheduled checkups plus unlimited emergency visits.'],
      ['Can AMC be renewed annually?', 'Yes, AMC plans can be renewed seamlessly with loyalty discounts.']
    ]
  }
];

// 3. Localized Services (City + Service combinations)
const localizedServices = [];
const serviceSlugs = [
  'residential-termite-control',
  'commercial-termite-control',
  'pre-construction-termite-treatment',
  'post-construction-termite-treatment',
  'termite-amc'
];

for (const loc of locations) {
  for (const srv of services) {
    const key = `${loc.slug}-${srv.slug}`;
    const context = srv.slug === 'commercial-termite-control' ? loc.businesses : srv.slug === 'pre-construction-termite-treatment' ? loc.construction : srv.slug === 'termite-amc' ? loc.maintenance : loc.homes;
    
    localizedServices.push({
      key,
      citySlug: loc.slug,
      cityName: loc.name,
      serviceSlug: srv.slug,
      serviceTitle: srv.title,
      title: `${srv.title} in ${loc.name}`,
      accent: `${srv.accent} in ${loc.name}`,
      intro: `Protect your ${loc.name} property with expert ${srv.title.toLowerCase()}. ${context}`,
      heroAlt: `${srv.heroAlt}. Illustration of ${srv.title.toLowerCase()} for properties in ${loc.name}.`,
      definitionTitle: `${srv.title} in ${loc.name}`,
      definition: `${srv.definition} Planned specifically for properties across ${loc.name}.`,
      benefitTitle: `Why Choose Our ${srv.title} in ${loc.name}?`,
      benefits: srv.benefits,
      processTitle: `Our ${srv.title} Process in ${loc.name}`,
      processIntro: `Local, professional service for ${loc.name} homes and businesses.`,
      steps: srv.steps,
      faqs: [
        [`Which areas of ${loc.name} are covered?`, `We cover ${loc.areas.filter(a => a !== 'and More...').join(', ')} and surrounding localities in ${loc.name}.`],
        [`How can I book an inspection in ${loc.name}?`, `Call our local line or submit an enquiry to schedule a free property assessment.`]
      ]
    });
  }
}

// 4. Home Data
const homeData = {
  hero: {
    title: 'Complete Termite Control Solutions for Your Property',
    tagline: 'Prevent. Protect. Peace of Mind.',
    benefits: ['Expert Team', 'Safe & Eco-Friendly', 'Long-Lasting Protection']
  },
  about: {
    title: 'About Our Company',
    text: 'Termite Pest Control is a trusted provider of professional termite treatment services in Bangalore and across major Indian cities. We use advanced, odorless and safe methods to eliminate termites and protect your home and business for the long term.'
  },
  reasons: [
    'Experienced & Trained Technicians',
    'Safe & Eco-Friendly Treatment',
    'Long-Lasting Protection',
    'Affordable Pricing',
    'Timely Service & Support'
  ],
  faqs: [
    { question: 'How do I know if I have termites?', answer: 'Signs include mud tubes on walls, hollow-sounding wood, discarded wings near windows, and bubbling paint.' },
    { question: 'Is the treatment safe for my family and pets?', answer: 'Yes, we use government-approved, odorless, eco-friendly formulations that are safe once settled.' },
    { question: 'How long does termite treatment last?', answer: 'Our treatments provide multi-year protection, backed by written warranties and optional AMC checkups.' }
  ]
};

async function run() {
  console.log('\n📁 Creating LOCALServicePageData folder...');
  const outputDir = resolve(process.cwd(), 'LOCALServicePageData');
  mkdirSync(outputDir, { recursive: true });

  console.log('📝 Writing LOCALServicePageData/locations.json...');
  writeFileSync(resolve(outputDir, 'locations.json'), JSON.stringify(locations, null, 2));

  console.log('📝 Writing LOCALServicePageData/services.json...');
  writeFileSync(resolve(outputDir, 'services.json'), JSON.stringify(services, null, 2));

  console.log('📝 Writing LOCALServicePageData/location-services.json...');
  writeFileSync(resolve(outputDir, 'location-services.json'), JSON.stringify(localizedServices, null, 2));

  console.log('📝 Writing LOCALServicePageData/home.json...');
  writeFileSync(resolve(outputDir, 'home.json'), JSON.stringify(homeData, null, 2));

  console.log('✅ Successfully created LOCALServicePageData with all content files!');

  if (!uri) {
    console.error('\n⚠️ MONGODB_URI not set. Skipping DB upload.');
    return;
  }

  console.log('\n🌿 Connecting to MongoDB...');
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');

    const db = client.db('termite_pest_control');

    // 1. Locations
    console.log('\n📍 Pushing Locations to MongoDB (collection: locations)...');
    const locColl = db.collection('locations');
    for (const loc of locations) {
      await locColl.updateOne(
        { slug: loc.slug },
        { $set: { ...loc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      console.log(`  ✓ ${loc.name}`);
    }

    // 2. Services
    console.log('\n🛡️ Pushing Services to MongoDB (collection: services)...');
    const srvColl = db.collection('services');
    for (const srv of services) {
      await srvColl.updateOne(
        { slug: srv.slug },
        { $set: { ...srv, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      console.log(`  ✓ ${srv.title}`);
    }

    // 3. Location Services
    console.log('\n🏢 Pushing 30 Localized City Services to MongoDB (collection: location_services)...');
    const locSrvColl = db.collection('location_services');
    for (const item of localizedServices) {
      await locSrvColl.updateOne(
        { key: item.key },
        { $set: { ...item, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
    }
    console.log(`  ✓ 30 City + Service localized pages pushed to MongoDB.`);

    // 4. Home Page
    console.log('\n🏠 Pushing Home Page content to MongoDB (collection: settings)...');
    const settingsColl = db.collection('settings');
    await settingsColl.updateOne(
      { key: 'homepage' },
      { $set: { key: 'homepage', ...homeData, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(`  ✓ Homepage content pushed to MongoDB.`);

    console.log('\n🎉 ALL PAGE CONTENT PUSHED TO MONGODB SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ MongoDB Upload Error:', err);
  } finally {
    await client.close();
  }
}

run();


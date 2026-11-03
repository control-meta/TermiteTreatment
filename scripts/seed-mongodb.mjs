import { MongoClient } from 'mongodb';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Helper to read .env if present
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

if (!uri) {
  console.error('\n❌ ERROR: MONGODB_URI is not set in .env or environment.');
  console.error('Please add your MongoDB connection string in .env first:\n');
  console.error('MONGODB_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/termite_db?retryWrites=true&w=majority"\n');
  process.exit(1);
}

// Initial data extracted from the application files
const initialLocations = [
  {
    slug: 'mumbai',
    name: 'Mumbai',
    officialName: 'Mumbai',
    state: 'Maharashtra',
    heroTitle: 'Termite Treatment in Mumbai',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Mumbai’s coastal climate makes homes and offices susceptible to termite infestations. Our professional termite pest control services in Mumbai offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property from destructive termites with a treatment plan tailored to your building.',
    context: 'Mumbai properties range from compact apartments and older timber interiors to housing societies and busy commercial premises. We plan inspections around building access, occupied rooms and the areas where you have noticed activity.',
    areas: ['Andheri', 'Powai', 'Borivali', 'Kanjurmarg', 'Vikhroli', 'Bandra', 'Goregaon', 'Mulund', 'Chembur', 'and More...'],
    faqs: [
      { question: 'Is termite treatment safe for my family?', answer: 'For your Mumbai property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins. Tell us about children, pets or any sensitivities when you enquire.' },
      { question: 'How long does the treatment last?', answer: 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan. Ask the team to explain any follow-up, maintenance and written warranty terms for your property.' },
      { question: 'Do you offer AMC for regular maintenance?', answer: 'Yes. An annual maintenance plan can be discussed for homes and businesses in Mumbai. Inspection frequency, covered areas and treatment inclusions are agreed before the contract starts.' },
      { question: 'Are your treatments odorless?', answer: 'Odour and preparation requirements depend on the products and method selected. The team can explain available options and the instructions for your property after assessment.' }
    ]
  },
  {
    slug: 'bangalore',
    name: 'Bangalore',
    officialName: 'Bengaluru',
    state: 'Karnataka',
    heroTitle: 'Termite Treatment in Bangalore',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Bangalore’s humid climate makes homes and offices susceptible to termite infestations. Our professional termite pest control services in Bangalore offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property from destructive termites with guaranteed results.',
    context: 'Bangalore, also known as Bengaluru, has apartments, villas, rental homes and office campuses with different access and maintenance needs. We assess the accessible woodwork and areas of concern before proposing a service plan.',
    areas: ['Koramangala', 'Indiranagar', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'Rajajinagar', 'and More...'],
    faqs: [
      { question: 'Is termite treatment safe for my family?', answer: 'For your Bangalore property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins. Tell us about children, pets or any sensitivities when you enquire.' },
      { question: 'How long does the treatment last?', answer: 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan. Ask the team to explain any follow-up, maintenance and written warranty terms for your property.' },
      { question: 'Do you offer AMC for regular maintenance?', answer: 'Yes. An annual maintenance plan can be discussed for homes and businesses in Bangalore. Inspection frequency, covered areas and treatment inclusions are agreed before the contract starts.' },
      { question: 'Are your treatments odorless?', answer: 'Odour and preparation requirements depend on the products and method selected. The team can explain available options and the instructions for your property after assessment.' }
    ]
  },
  {
    slug: 'pune',
    name: 'Pune',
    officialName: 'Pune',
    state: 'Maharashtra',
    heroTitle: 'Termite Treatment in Pune',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Pune’s homes, apartments and workplaces need a considered approach to termite protection. Our professional termite pest control services in Pune offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property with a treatment plan based on an inspection.',
    context: 'Pune properties include independent houses, apartment communities, offices and buildings at different stages of construction. The plan takes account of the property layout, accessible timber and the work you are preparing for.',
    areas: ['Kothrud', 'Viman Nagar', 'Baner', 'Wakad', 'Hinjewadi', 'Hadapsar', 'Aundh', 'Kalyani Nagar', 'and More...'],
    faqs: [
      { question: 'Is termite treatment safe for my family?', answer: 'For your Pune property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins. Tell us about children, pets or any sensitivities when you enquire.' },
      { question: 'How long does the treatment last?', answer: 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan. Ask the team to explain any follow-up, maintenance and written warranty terms for your property.' },
      { question: 'Do you offer AMC for regular maintenance?', answer: 'Yes. An annual maintenance plan can be discussed for homes and businesses in Pune. Inspection frequency, covered areas and treatment inclusions are agreed before the contract starts.' },
      { question: 'Are your treatments odorless?', answer: 'Odour and preparation requirements depend on the products and method selected. The team can explain available options and the instructions for your property after assessment.' }
    ]
  },
  {
    slug: 'delhi-ncr',
    name: 'Delhi NCR',
    officialName: 'National Capital Region',
    state: 'Delhi NCR',
    heroTitle: 'Termite Treatment in Delhi NCR',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Delhi NCR’s temperature extremes and changing moisture conditions can encourage termite activity across properties. Our professional termite pest control services in Delhi NCR provide reliable inspection and treatment for homes, housing complexes and offices.',
    context: 'Delhi NCR properties include standalone houses, builder floors, high-rise apartments and large corporate complexes. We coordinate inspection access around building gates, internal woodwork and your schedule.',
    areas: ['South Delhi', 'Dwarka', 'Gurugram', 'Noida', 'Greater Noida', 'Rohini', 'Connaught Place', 'Vasant Kunj', 'and More...'],
    faqs: [
      { question: 'Is termite treatment safe for my family?', answer: 'For your Delhi NCR property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins.' },
      { question: 'How long does the treatment last?', answer: 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan.' },
      { question: 'Do you offer AMC for regular maintenance?', answer: 'Yes. An annual maintenance plan can be discussed for homes and businesses in Delhi NCR.' },
      { question: 'Are your treatments odorless?', answer: 'Odour and preparation requirements depend on the products and method selected.' }
    ]
  },
  {
    slug: 'goa',
    name: 'Goa',
    officialName: 'Goa',
    state: 'Goa',
    heroTitle: 'Termite Treatment in Goa',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Goa’s tropical climate and timber-rich architectural features require watchful termite protection. Our professional termite pest control services in Goa support holiday homes, heritage properties, resorts and local businesses.',
    context: 'Goa properties include traditional roof timbers, wooden door surrounds, holiday villas and coastal hospitality buildings. We plan inspections around seasonal access, property caretakers and visible signs.',
    areas: ['Panaji', 'Margao', 'Mapusa', 'Calangute', 'Candolim', 'Vasco da Gama', 'Porvorim', 'Ponda', 'and More...'],
    faqs: [
      { question: 'Is termite treatment safe for my family?', answer: 'For your Goa property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins.' },
      { question: 'How long does the treatment last?', answer: 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan.' },
      { question: 'Do you offer AMC for regular maintenance?', answer: 'Yes. An annual maintenance plan can be discussed for homes and businesses in Goa.' },
      { question: 'Are your treatments odorless?', answer: 'Odour and preparation requirements depend on the products and method selected.' }
    ]
  },
  {
    slug: 'noida',
    name: 'Noida',
    officialName: 'Noida',
    state: 'Uttar Pradesh',
    heroTitle: 'Termite Treatment in Noida',
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: 'Noida’s fast-growing sectors, residential towers and commercial hubs need planned termite protection. Our professional termite pest control services in Noida offer long-lasting protection using advanced, safe and eco-friendly methods.',
    context: 'Noida properties include gated society apartments, independent villas, commercial IT offices and buildings under construction. We schedule visits around society management access and work timings.',
    areas: ['Sector 18', 'Sector 62', 'Sector 137', 'Sector 50', 'Sector 76', 'Sector 128', 'Greater Noida West', 'and More...'],
    faqs: [
      { question: 'Is termite treatment safe for my family?', answer: 'For your Noida property, the team will explain the selected treatment, preparation, ventilation and re-entry instructions before work begins.' },
      { question: 'How long does the treatment last?', answer: 'Treatment coverage and duration depend on the method, property conditions and the agreed service plan.' },
      { question: 'Do you offer AMC for regular maintenance?', answer: 'Yes. An annual maintenance plan can be discussed for homes and businesses in Noida.' },
      { question: 'Are your treatments odorless?', answer: 'Odour and preparation requirements depend on the products and method selected.' }
    ]
  }
];

const initialServices = [
  {
    slug: 'residential-termite-control',
    title: 'Residential Termite Control',
    accent: 'Specialist Home Protection',
    intro: 'Protect your home, wooden furniture, wardrobes and woodwork from destructive termites with safe, odorless and targeted residential termite treatments.',
    definitionTitle: 'What Is Residential Termite Control?',
    definition: 'Residential termite control protects flats, villas, apartments and houses from subterranean and drywood termites using specialized drilling, injecting and barrier treatments.',
    benefitTitle: 'Why Choose Professional Home Termite Treatment?',
    benefits: [
      ['Safe for Family & Pets', 'Odorless, government-approved solutions safe for all household members.'],
      ['Deep Timber Penetration', 'Treatment reaches inside door frames, wardrobes, skirting and fixed wooden structures.'],
      ['Long-Term Warranty', 'Enjoy guaranteed protection with free reinspections if signs recur.']
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
    definitionTitle: 'Tailored Commercial Pest Management',
    definition: 'Commercial termite management is engineered to minimize business interruption while delivering comprehensive protection for documents, IT server room flooring, fixtures and structural woodwork.',
    benefitTitle: 'Protecting Your Business Assets & Reputation',
    benefits: [
      ['Zero Business Interruption', 'Flexible scheduling including evenings, weekends and after-hours treatment.'],
      ['Compliance & Documentation', 'Full service reports, chemical details and compliance documentation for audits.'],
      ['Multi-Site Management', 'Coordinated service for single offices or multi-branch facilities across Indian cities.']
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
    definitionTitle: 'What Is Pre-Construction Soil Treatment?',
    definition: 'Pre-construction anti-termite treatment is applied in stages according to Indian Standards (IS 6313) to soil trenches, foundation footings, plinth backfill and perimeter walls before flooring is laid.',
    benefitTitle: '6 Reasons to Protect Before Construction',
    benefits: [
      ['Barrier at Foundation Stage', 'Blocks subterranean termites from ever entering through foundation slabs.'],
      ['10-Year Service Warranty', 'Compliant with Indian Standard specifications for construction projects.'],
      ['Cost-Effective Prevention', 'Treating soil during construction is up to 5x more economical than post-construction drilling.']
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
    definitionTitle: 'How Post-Construction Treatment Works',
    definition: 'Trained technicians drill small holes along perimeter walls, skirting boards and wooden fixtures, inject high-grade termiticide into the masonry, and neatly seal the holes to match your decor.',
    benefitTitle: 'Targeted Protection for Existing Properties',
    benefits: [
      ['Drill-Fill-Seal Technology', 'Precision 12mm holes sealed with color-matched cement, leaving surfaces spotless.'],
      ['Immediate Colony Elimination', 'Fast-acting active ingredients eradicate existing colonies inside timber.'],
      ['Protection for Fixed Furniture', 'Wardrobes, kitchen cabinets, paneling and wooden door frames shielded from the inside.']
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
    definitionTitle: 'Why Choose an Annual Maintenance Plan?',
    definition: 'Termites can re-infest properties through undetected soil channels. An AMC ensures scheduled quarterly audits, preventive spray touches, and free prompt treatments whenever needed.',
    benefitTitle: 'Continuous Defense Year After Year',
    benefits: [
      ['Scheduled Proactive Audits', 'Regular expert inspections identify risks before damage occurs.'],
      ['Zero Extra Charges', 'Any required treatment during the contract term is fully covered.'],
      ['Dedicated Relationship Support', 'Priority booking and personal relationship manager for your property.']
    ],
    faqs: [
      ['How many visits are included in AMC?', 'Standard AMC plans include 3 to 4 scheduled checkups plus unlimited emergency visits.'],
      ['Can AMC be renewed annually?', 'Yes, AMC plans can be renewed seamlessly with loyalty discounts.']
    ]
  }
];

async function seed() {
  console.log('\n🌿 Connecting to MongoDB...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected successfully to MongoDB!');

    const db = client.db('termite_pest_control');

    // 1. Seed Locations
    console.log('\n📍 Seeding Locations collection...');
    const locationsColl = db.collection('locations');
    for (const loc of initialLocations) {
      await locationsColl.updateOne(
        { slug: loc.slug },
        { $set: { ...loc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      console.log(`  ✓ Location: ${loc.name} (${loc.slug}) upserted`);
    }

    // 2. Seed Services
    console.log('\n🛡️ Seeding Services collection...');
    const servicesColl = db.collection('services');
    for (const srv of initialServices) {
      await servicesColl.updateOne(
        { slug: srv.slug },
        { $set: { ...srv, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true }
      );
      console.log(`  ✓ Service: ${srv.title} (${srv.slug}) upserted`);
    }

    console.log('\n🎉 SUCCESS! MongoDB database "termite_pest_control" has been populated with all initial content.');
    console.log('You can now edit any page live from the Admin Panel!\n');
  } catch (err) {
    console.error('\n❌ MongoDB Seeding Error:', err.message);
  } finally {
    await client.close();
  }
}

seed();


import { MongoClient } from 'mongodb';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

import { locations, type Location } from '../lib/locations';
import { termiteServices } from '../lib/company';
import { serviceDetails } from '../lib/service-details';
import { getLocalizedService } from '../lib/location-services';
import { locationFaqs } from '../lib/location-faqs';
import { home2Faqs } from '../app/home2/content';

// Load .env
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key] && val) {
        process.env[key] = val;
      }
    }
  }
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI missing in .env');
  process.exit(1);
}

// 1. Prepare Locations Data (6)
const locationDocs = locations.map(loc => {
  const faqs = locationFaqs(loc);
  return {
    slug: loc.slug,
    name: loc.name,
    officialName: loc.officialName,
    state: loc.state,
    landmark: loc.landmark,
    image: loc.image,
    imageAlt: loc.imageAlt,
    heroTitle: `Termite Treatment in ${loc.name}`,
    heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
    about: loc.about,
    context: loc.context,
    homes: loc.homes,
    businesses: loc.businesses,
    construction: loc.construction,
    maintenance: loc.maintenance,
    areas: loc.areas,
    faqs: faqs.map(([question, answer]) => ({ question, answer })),
    url: `/locations/${loc.slug}`,
  };
});

// 2. Prepare Services Data (5)
const serviceDocs = termiteServices.map(srv => {
  const detail = serviceDetails[srv.slug];
  return {
    slug: srv.slug,
    title: srv.title,
    shortTitle: srv.shortTitle,
    accent: detail?.accent || '',
    intro: detail?.intro || srv.text,
    hero: detail?.hero || '',
    heroAlt: detail?.heroAlt || '',
    tags: srv.tags,
    definitionTitle: detail?.definitionTitle || '',
    definition: detail?.definition || srv.detail,
    benefitTitle: detail?.benefitTitle || '',
    benefits: detail?.benefits || [],
    processTitle: detail?.processTitle || '',
    processIntro: detail?.processIntro || '',
    steps: detail?.steps || srv.steps,
    faqs: detail?.faqs?.map(([question, answer]) => ({ question, answer })) || [],
    url: `/services/${srv.slug}`,
  };
});

// 3. Prepare All 30 Location-Specific Service Pages
const locationServiceDocs: any[] = [];
for (const city of locations) {
  for (const srv of termiteServices) {
    const key = `${city.slug}-${srv.slug}`;
    const detail = getLocalizedService(city, srv.slug);
    if (detail) {
      locationServiceDocs.push({
        key,
        citySlug: city.slug,
        cityName: city.name,
        serviceSlug: srv.slug,
        serviceTitle: srv.title,
        title: `${srv.title} in ${city.name}`,
        accent: detail.accent,
        intro: detail.intro,
        hero: detail.hero,
        heroAlt: detail.heroAlt,
        heroTrust: detail.heroTrust || [],
        definitionTitle: detail.definitionTitle,
        definition: detail.definition,
        benefitTitle: detail.benefitTitle,
        benefits: detail.benefits,
        processTitle: detail.processTitle,
        processIntro: detail.processIntro,
        steps: detail.steps,
        projectsTitle: detail.projectsTitle,
        projects: detail.projects,
        whyTitle: detail.whyTitle || '',
        whyItems: detail.whyItems || [],
        faqs: detail.faqs.map(([question, answer]) => ({ question, answer })),
        closingTitle: detail.closingTitle,
        closingAccent: detail.closingAccent,
        closingText: detail.closingText,
        url: `/locations/${city.slug}/${srv.slug}`,
      });
    }
  }
}

// 4. Prepare Home Page Data
const homeDoc = {
  key: 'homepage',
  title: 'Complete Termite Control Solutions for Your Property',
  tagline: 'Prevent. Protect. Peace of Mind.',
  about: 'Termite Pest Control is a trusted provider of professional termite treatment services in Bangalore. We use advanced, odorless and safe methods to eliminate termites and protect your home and business for the long term.',
  reasons: [
    'Experienced & Trained Technicians',
    'Safe & Eco-Friendly Treatment',
    'Long-Lasting Protection',
    'Affordable Pricing',
    'Timely Service & Support',
  ],
  faqs: home2Faqs,
};

async function main() {
  console.log('📦 Generating LOCALServicePageData files...');
  const baseDir = resolve(process.cwd(), 'LOCALServicePageData');
  const locSrvDir = resolve(baseDir, 'location-services');
  mkdirSync(baseDir, { recursive: true });
  mkdirSync(locSrvDir, { recursive: true });

  writeFileSync(resolve(baseDir, 'locations.json'), JSON.stringify(locationDocs, null, 2));
  writeFileSync(resolve(baseDir, 'services.json'), JSON.stringify(serviceDocs, null, 2));
  writeFileSync(resolve(baseDir, 'location-services.json'), JSON.stringify(locationServiceDocs, null, 2));
  writeFileSync(resolve(baseDir, 'home.json'), JSON.stringify(homeDoc, null, 2));

  // Write individual files for each of the 30 localized services
  for (const item of locationServiceDocs) {
    writeFileSync(resolve(locSrvDir, `${item.key}.json`), JSON.stringify(item, null, 2));
  }
  console.log(`✅ Saved all JSON files to LOCALServicePageData/ (including 30 individual location-service files)!`);

  console.log('\n🌿 Connecting to MongoDB cluster...');
  const client = new MongoClient(uri!);
  await client.connect();
  console.log('✅ Connected to MongoDB!');

  const db = client.db('termite_pest_control');

  // Push Locations (6)
  console.log('\n📍 Upserting 6 Location pages into "locations" collection...');
  for (const doc of locationDocs) {
    await db.collection('locations').updateOne(
      { slug: doc.slug },
      { $set: { ...doc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(`   ✓ ${doc.name} (/locations/${doc.slug})`);
  }

  // Push Services (5)
  console.log('\n🛡️ Upserting 5 Service pages into "services" collection...');
  for (const doc of serviceDocs) {
    await db.collection('services').updateOne(
      { slug: doc.slug },
      { $set: { ...doc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(`   ✓ ${doc.title} (/services/${doc.slug})`);
  }

  // Push Location-Specific Services (30)
  console.log('\n🏢 Upserting 30 Location-Specific Service pages into "location_services" collection...');
  for (const doc of locationServiceDocs) {
    await db.collection('location_services').updateOne(
      { key: doc.key },
      { $set: { ...doc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    console.log(`   ✓ ${doc.title} (${doc.url})`);
  }

  // Push Homepage
  console.log('\n🏠 Upserting Homepage settings into "settings" collection...');
  await db.collection('settings').updateOne(
    { key: 'homepage' },
    { $set: { ...homeDoc, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
  console.log(`   ✓ Homepage document`);

  // Verification Counts
  const countLocations = await db.collection('locations').countDocuments();
  const countServices = await db.collection('services').countDocuments();
  const countLocServices = await db.collection('location_services').countDocuments();
  const countSettings = await db.collection('settings').countDocuments();

  console.log('\n======================================================');
  console.log('🎉 MONGODB FULL SYNC REPORT');
  console.log('======================================================');
  console.log(`📍 Locations collection:        ${countLocations} documents (Target: 6)`);
  console.log(`🛡️ Services collection:         ${countServices} documents (Target: 5)`);
  console.log(`🏢 Location Services collection: ${countLocServices} documents (Target: 30)`);
  console.log(`🏠 Settings collection:         ${countSettings} document  (Target: 1)`);
  console.log(`Total live managed pages:       ${countLocations + countServices + countLocServices + 1}`);
  console.log('======================================================\n');

  await client.close();
}

main().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});


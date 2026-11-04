import { getDb, isMongoConfigured } from './mongodb';
import { locations as staticLocations, type Location } from './locations';
import { locationFaqs as staticLocationFaqs } from './location-faqs';
import { serviceDetails as staticServiceDetails } from './service-details';
import { termiteServices as staticTermiteServices } from './company';
import { getLocalizedService as staticGetLocalizedService } from './location-services';
import { revalidatePath } from 'next/cache';
import { validateTextOverrides } from './page-text';

export type EditablePage = {
  type: 'location' | 'service' | 'local_service';
  slug: string;
  name: string;
  title: string;
  url: string;
  updatedAt?: string;
  source: 'mongodb' | 'fallback';
};

export async function getAllLocations(): Promise<Location[]> {
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('locations').find({}).toArray();
        if (docs && docs.length > 0) {
          return docs.map(d => ({
            slug: d.slug,
            name: d.name,
            officialName: d.officialName || d.name,
            state: d.state || '',
            landmark: d.landmark || '',
            image: d.image || `/images/locations/${d.slug}-hero.webp`,
            imageAlt: d.imageAlt || `Termite treatment in ${d.name}`,
            about: d.about || '',
            context: d.context || '',
            homes: d.homes || '',
            businesses: d.businesses || '',
            construction: d.construction || '',
            maintenance: d.maintenance || '',
            areas: Array.isArray(d.areas) ? d.areas : [],
          }));
        }
      }
    } catch (err) {
      console.warn('[ContentService] Failed to load locations from MongoDB, using fallback.', err);
    }
  }
  return staticLocations;
}

export async function getAllPages(): Promise<EditablePage[]> {
  const pages: EditablePage[] = [];

  // Locations
  for (const loc of staticLocations) {
    pages.push({
      type: 'location',
      slug: loc.slug,
      name: loc.name,
      title: `Termite Treatment in ${loc.name}`,
      url: `/locations/${loc.slug}`,
      source: isMongoConfigured() ? 'mongodb' : 'fallback',
    });
  }

  // Services
  for (const srv of staticTermiteServices) {
    pages.push({
      type: 'service',
      slug: srv.slug,
      name: srv.title,
      title: srv.title,
      url: `/services/${srv.slug}`,
      source: isMongoConfigured() ? 'mongodb' : 'fallback',
    });
  }

  return pages;
}

export async function getAllLocationServices() {
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      if (db) {
        const docs = await db.collection('location_services').find({}).toArray();
        if (docs && docs.length > 0) {
          return docs.map(d => ({
            ...d,
            _id: d._id.toString(),
            _source: 'mongodb' as const,
          }));
        }
      }
    } catch (err) {
      console.warn('[ContentService] Failed to load location_services from MongoDB:', err);
    }
  }

  // Fallback
  const list: any[] = [];
  for (const city of staticLocations) {
    for (const srv of staticTermiteServices) {
      const detail = staticGetLocalizedService(city, srv.slug);
      if (detail) {
        list.push({
          key: `${city.slug}-${srv.slug}`,
          citySlug: city.slug,
          cityName: city.name,
          serviceSlug: srv.slug,
          serviceTitle: srv.title,
          title: `${srv.title} in ${city.name}`,
          accent: detail.accent,
          intro: detail.intro,
          hero: detail.hero,
          url: `/locations/${city.slug}/${srv.slug}`,
          _source: 'fallback' as const,
        });
      }
    }
  }
  return list;
}

export async function getPageContent(type: 'location' | 'service' | 'local_service', slug: string) {
  const fallback = getStaticPageContent(type, slug);
  if (!fallback) return null;
  // Always query MongoDB first when configured
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      if (db) {
        if (type === 'local_service') {
          const doc = await db.collection('location_services').findOne({ key: slug });
          if (doc) {
            return {
              ...fallback,
              ...doc,
              textOverrides: validateTextOverrides(doc.textOverrides),
              _id: doc._id.toString(),
              _source: 'mongodb' as const,
            };
          }
        } else {
          const collection = db.collection(type === 'location' ? 'locations' : 'services');
          const doc = await collection.findOne({ slug });
          if (doc) {
            return {
              ...fallback,
              ...doc,
              textOverrides: validateTextOverrides(doc.textOverrides),
              _id: doc._id.toString(),
              _source: 'mongodb' as const,
            };
          }
        }
      }
    } catch (err) {
      console.warn(`[ContentService] Failed to load ${type}/${slug} from MongoDB:`, err);
    }
  }

  return fallback;
}

function getStaticPageContent(type: 'location' | 'service' | 'local_service', slug: string) {
  // Static content also fills fields missing from older MongoDB documents.
  if (type === 'local_service') {
    // slug is city-service e.g. bangalore-residential-termite-control
    // find matching city
    const city = staticLocations.find(l => slug.startsWith(l.slug));
    const serviceSlug = city ? slug.slice(city.slug.length + 1) : '';
    if (!city || !serviceSlug) return null;
    const detail = staticGetLocalizedService(city, serviceSlug);
    if (!detail) return null;
    return {
      key: slug,
      citySlug: city.slug,
      cityName: city.name,
      serviceSlug,
      serviceTitle: detail.title,
      title: `${detail.title} in ${city.name}`,
      accent: detail.accent,
      intro: detail.intro,
      hero: detail.hero,
      heroAlt: detail.heroAlt,
      definitionTitle: detail.definitionTitle,
      definition: detail.definition,
      benefitTitle: detail.benefitTitle,
      benefits: detail.benefits,
      processTitle: detail.processTitle,
      processIntro: detail.processIntro,
      steps: detail.steps,
      faqs: detail.faqs.map(([q, a]) => ({ question: q, answer: a })),
      url: `/locations/${city.slug}/${serviceSlug}`,
      textOverrides: {},
      _source: 'fallback' as const,
    };
  } else if (type === 'location') {
    const loc = staticLocations.find(l => l.slug === slug);
    if (!loc) return null;
    const faqs = staticLocationFaqs(loc);
    return {
      slug: loc.slug,
      name: loc.name,
      officialName: loc.officialName,
      state: loc.state,
      heroTitle: `Termite Treatment in ${loc.name}`,
      heroLead: 'Protect Your Home & Business with Expert Termite Control Services',
      about: loc.about,
      context: loc.context,
      areas: loc.areas,
      faqs: faqs.map(([q, a]) => ({ question: q, answer: a })),
      textOverrides: {},
      _source: 'fallback' as const,
    };
  } else {
    const srv = staticTermiteServices.find(s => s.slug === slug);
    const detail = staticServiceDetails[slug];
    if (!srv || !detail) return null;
    return {
      slug: srv.slug,
      title: srv.title,
      accent: detail.accent,
      intro: detail.intro,
      definitionTitle: detail.definitionTitle,
      definition: detail.definition,
      benefitTitle: detail.benefitTitle,
      benefits: detail.benefits,
      processTitle: detail.processTitle,
      processIntro: detail.processIntro,
      steps: detail.steps,
      faqs: detail.faqs.map(([q, a]) => ({ question: q, answer: a })),
      textOverrides: {},
      _source: 'fallback' as const,
    };
  }
}

export async function getLocalizedServiceContent(citySlug: string, serviceSlug: string) {
  const key = `${citySlug}-${serviceSlug}`;
  if (isMongoConfigured()) {
    try {
      const db = await getDb();
      if (db) {
        const doc = await db.collection('location_services').findOne({ key });
        if (doc) {
          return {
            ...doc,
            textOverrides: validateTextOverrides(doc.textOverrides),
            _id: doc._id.toString(),
            _source: 'mongodb' as const,
          };
        }
      }
    } catch (err) {
      console.warn(`[ContentService] Failed to load location_service ${key} from MongoDB:`, err);
    }
  }

  // Fallback
  const city = staticLocations.find(l => l.slug === citySlug);
  if (!city) return null;
  return staticGetLocalizedService(city, serviceSlug);
}

export async function savePageContent(type: 'location' | 'service' | 'local_service', slug: string, data: any) {
  const db = await getDb();
  if (!db) {
    throw new Error('MongoDB is not configured. Please set MONGODB_URI in .env first.');
  }

  const collectionName =
    type === 'location' ? 'locations' : type === 'service' ? 'services' : 'location_services';
  const collection = db.collection(collectionName);

  // Timestamps belong to the server. A loaded createdAt must never also enter
  // $set, because MongoDB rejects paths shared with $setOnInsert.
  const { _id, _source, createdAt, updatedAt, ...cleanData } = data;
  const now = new Date().toISOString();

  const filter = type === 'local_service' ? { key: slug } : { slug };

  await collection.updateOne(
    filter,
    {
      $set: {
        ...cleanData,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  // Trigger on-demand cache revalidation
  try {
    if (type === 'location') {
      revalidatePath(`/locations/${slug}`);
      revalidatePath('/locations');
    } else if (type === 'service') {
      revalidatePath(`/services/${slug}`);
      revalidatePath('/services');
    } else if (type === 'local_service') {
      const city = staticLocations.find(location => slug.startsWith(`${location.slug}-`));
      if (city) revalidatePath(`/locations/${city.slug}/${slug.slice(city.slug.length + 1)}`);
    }
    revalidatePath('/');
  } catch (err) {
    console.warn('[ContentService] Revalidation notice:', err);
  }

  return { success: true, slug, type };
}

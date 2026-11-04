const http = require('http');
const { JSDOM } = require('jsdom');
const fs = require('fs');

const routes = [
  '/',
  '/services',
  '/services/residential-termite-control',
  '/services/commercial-termite-control',
  '/services/pre-construction-termite-treatment',
  '/services/post-construction-termite-treatment',
  '/services/annual-maintenance-contract',
  '/locations',
  '/locations/mumbai',
  '/locations/bangalore',
  '/locations/pune',
  '/locations/delhi-ncr',
  '/locations/goa',
  '/locations/noida',
  '/about-us',
  '/faqs',
  '/contact-us',
  '/home2',
];

const cities = ['mumbai', 'bangalore', 'pune', 'delhi-ncr', 'goa', 'noida'];
const services = [
  'residential-termite-control',
  'commercial-termite-control',
  'pre-construction-termite-treatment',
  'post-construction-termite-treatment',
  'annual-maintenance-contract',
];

for (const city of cities) {
  for (const s of services) {
    routes.push(`/locations/${city}/${s}`);
  }
}

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, html: data });
      });
    }).on('error', reject);
  });
}

async function audit() {
  console.log(`Starting SEO audit for ${routes.length} pages...`);
  const results = [];

  for (const r of routes) {
    try {
      const res = await fetchPage(r);
      if (res.statusCode !== 200) {
        results.push({ route: r, error: `HTTP ${res.statusCode}` });
        continue;
      }

      const dom = new JSDOM(res.html);
      const doc = dom.window.document;

      const title = doc.querySelector('title')?.textContent?.trim() || '';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
      const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() || '';
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim() || '';
      const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim() || '';
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')?.trim() || '';

      const h1Els = [...doc.querySelectorAll('h1')];
      const h2Els = [...doc.querySelectorAll('h2')];
      const h3Els = [...doc.querySelectorAll('h3')];

      const h1Texts = h1Els.map(el => el.textContent.replace(/\s+/g, ' ').trim());
      const h2Texts = h2Els.map(el => el.textContent.replace(/\s+/g, ' ').trim());
      const h3Texts = h3Els.map(el => el.textContent.replace(/\s+/g, ' ').trim());

      const jsonLdScripts = [...doc.querySelectorAll('script[type="application/ld+json"]')];
      const jsonLdData = [];
      for (const s of jsonLdScripts) {
        try {
          const parsed = JSON.parse(s.textContent);
          jsonLdData.push(parsed['@type'] || 'JSON-LD');
        } catch {
          jsonLdData.push('INVALID_JSON');
        }
      }

      const images = [...doc.querySelectorAll('img')].map(img => ({
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') !== null ? img.getAttribute('alt') : null,
      }));

      const missingAltImages = images.filter(img => img.alt === null || img.alt.trim() === '');

      // Check heading hierarchy: check all h1, h2, h3 in DOM order
      const allHeadings = [...doc.querySelectorAll('h1, h2, h3, h4, h5, h6')].map(el => ({
        tag: el.tagName.toLowerCase(),
        text: el.textContent.replace(/\s+/g, ' ').trim()
      }));

      results.push({
        route: r,
        status: res.statusCode,
        title,
        titleLength: title.length,
        description,
        descLength: description.length,
        canonical,
        ogTitle,
        ogDesc,
        ogImage,
        h1Count: h1Els.length,
        h1Texts,
        h2Count: h2Els.length,
        h3Count: h3Els.length,
        jsonLdTypes: jsonLdData,
        imageCount: images.length,
        missingAltCount: missingAltImages.length,
        missingAltImages,
        allHeadings,
      });
    } catch (err) {
      results.push({ route: r, error: err.message });
    }
  }

  fs.writeFileSync('scripts/audit-results.json', JSON.stringify(results, null, 2));
  console.log(`Audit finished. Analyzed ${results.length} pages.`);

  // Summary analysis
  let pagesWithoutH1 = 0;
  let pagesWithMultipleH1 = 0;
  let pagesWithoutDesc = 0;
  let pagesWithoutTitle = 0;
  let pagesWithMissingAlts = 0;
  let pagesWithoutJsonLd = 0;

  for (const item of results) {
    if (item.error) {
      console.log(`ERROR on ${item.route}: ${item.error}`);
      continue;
    }
    if (item.h1Count === 0) {
      console.log(`[H1 MISSING] ${item.route}`);
      pagesWithoutH1++;
    } else if (item.h1Count > 1) {
      console.log(`[MULTIPLE H1 (${item.h1Count})] ${item.route}: ${item.h1Texts.join(' | ')}`);
      pagesWithMultipleH1++;
    }
    if (!item.title) {
      console.log(`[TITLE MISSING] ${item.route}`);
      pagesWithoutTitle++;
    }
    if (!item.description) {
      console.log(`[DESC MISSING] ${item.route}`);
      pagesWithoutDesc++;
    }
    if (item.missingAltCount > 0) {
      console.log(`[MISSING ALT (${item.missingAltCount})] ${item.route}`);
      pagesWithMissingAlts++;
    }
    if (item.jsonLdTypes.length === 0) {
      pagesWithoutJsonLd++;
    }
  }

  console.log('\n--- SUMMARY ---');
  console.log(`Total Pages: ${results.length}`);
  console.log(`Pages missing H1: ${pagesWithoutH1}`);
  console.log(`Pages with multiple H1s: ${pagesWithMultipleH1}`);
  console.log(`Pages missing Meta Title: ${pagesWithoutTitle}`);
  console.log(`Pages missing Meta Description: ${pagesWithoutDesc}`);
  console.log(`Pages with missing Alt attributes: ${pagesWithMissingAlts}`);
  console.log(`Pages without Schema JSON-LD: ${pagesWithoutJsonLd}`);
}

audit();

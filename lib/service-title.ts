const titles: Record<string, string> = {
  'residential-termite-control': 'Residential Termite Control',
  'commercial-termite-control': 'Commercial Termite Control',
  'pre-construction-termite-treatment': 'Pre-Construction Termite Treatment',
  'post-construction-termite-treatment': 'Post-Construction Termite Treatment',
  'annual-maintenance-contract': 'Annual Termite Maintenance',
};

const legacy: Record<string, [string, string]> = {
  'residential-termite-control': ['Residential', 'Termite Control'],
  'commercial-termite-control': ['Commercial', 'Termite Protection'],
  'pre-construction-termite-treatment': ['Pre-Construction', 'Anti-Termite Treatment Services'],
  'post-construction-termite-treatment': ['Post-Construction', 'Anti-Termite Treatment'],
  'annual-maintenance-contract': ['Annual Termite', 'Maintenance Plans'],
};

/** Upgrade the old split headings while keeping deliberately edited titles. */
export function serviceTitle(slug: string, savedTitle?: unknown, city?: string): string {
  const base = titles[slug] || slug;
  const suffix = city ? ` in ${city}` : '';
  const canonical = `${base}${suffix}`;
  if (typeof savedTitle !== 'string') return canonical;
  const value = savedTitle.replace(/\s+/g, ' ').trim();
  const [main, accent] = legacy[slug] || [base, ''];
  const oldTitles = new Set([main, `${main}${suffix}`, base]);
  if (slug === 'annual-maintenance-contract') oldTitles.add(`Annual Maintenance Contract${suffix}`);
  for (const start of [main, base, canonical]) {
    for (const end of [accent, `${accent}${suffix}`]) {
      oldTitles.add(`${start}${end}`);
      oldTitles.add(`${start} ${end}`);
    }
  }
  return oldTitles.has(value) ? canonical : value;
}

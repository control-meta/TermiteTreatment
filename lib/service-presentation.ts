export const serviceHeroPositions: Record<string, { desktop: string; mobile: string }> = {
  'residential-termite-control': { desktop: '68% 45%', mobile: '68% 48%' },
  'commercial-termite-control': { desktop: '66% 48%', mobile: '66% 50%' },
  'pre-construction-termite-treatment': { desktop: '78% 50%', mobile: '78% 52%' },
  'post-construction-termite-treatment': { desktop: '72% 55%', mobile: '72% 55%' },
  'annual-maintenance-contract': { desktop: '68% 45%', mobile: '68% 48%' },
};

export const serviceVisuals: Record<string, { src: string; alt: string; position: string }> = {
  'residential-termite-control': {
    src: '/images/services/residential-v3.webp',
    alt: 'A termite specialist inspecting a wooden window frame in a bright home',
    position: '50% 50%',
  },
  'commercial-termite-control': {
    src: '/images/services/commercial-v3.webp',
    alt: 'A termite professional inspecting timber fittings in a modern office',
    position: '50% 50%',
  },
  'pre-construction-termite-treatment': {
    src: '/images/services/preconstruction-v3.webp',
    alt: 'A trained specialist applying preventive soil treatment at a building foundation',
    position: '50% 50%',
  },
  'post-construction-termite-treatment': {
    src: '/images/services/postconstruction-v3.webp',
    alt: 'A gloved termite professional using a precision treatment tool at wooden skirting',
    position: '50% 50%',
  },
  'annual-maintenance-contract': {
    src: '/images/services/maintenance-v3.webp',
    alt: 'A termite specialist recording a scheduled timber inspection on a tablet',
    position: '50% 50%',
  },
};

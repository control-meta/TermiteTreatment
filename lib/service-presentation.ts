export const serviceHeroPositions: Record<string, { desktop: string; mobile: string }> = {
  'residential-termite-control': { desktop: '74% 14%', mobile: '74% 15%' },
  'commercial-termite-control': { desktop: '68% 22%', mobile: '68% 24%' },
  'pre-construction-termite-treatment': { desktop: '78% 22%', mobile: '78% 25%' },
  'post-construction-termite-treatment': { desktop: '74% 16%', mobile: '74% 18%' },
  'annual-maintenance-contract': { desktop: '74% 12%', mobile: '74% 14%' },
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

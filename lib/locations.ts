export type Location = {
  slug: string;
  name: string;
  officialName: string;
  state: string;
  landmark: string;
  image: string;
  imageAlt: string;
  about: string;
  context: string;
  homes: string;
  businesses: string;
  construction: string;
  maintenance: string;
  areas: string[];
};

export const locations: Location[] = [
  {
    slug: 'mumbai', name: 'Mumbai', officialName: 'Mumbai', state: 'Maharashtra',
    landmark: 'Gateway of India', image: '/images/locations/mumbai-hero.webp',
    imageAlt: 'Illustration of the Gateway of India and landscaped waterfront in Mumbai',
    about: 'Mumbai’s coastal climate makes homes and offices susceptible to termite infestations. Our professional termite pest control services in Mumbai offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property from destructive termites with a treatment plan tailored to your building.',
    context: 'Mumbai properties range from compact apartments and older timber interiors to housing societies and busy commercial premises. We plan inspections around building access, occupied rooms and the areas where you have noticed activity.',
    homes: 'For Mumbai flats, independent homes and housing societies, the assessment considers fixed cupboards, door frames, skirting and shared building access. Tell us about damp areas and any earlier treatment.',
    businesses: 'For Mumbai offices, retail units and managed premises, we discuss access with your facilities contact and plan the agreed work around the areas in use and your operating hours.',
    construction: 'For a new Mumbai home or commercial project, share the foundation plans, site access and the builder’s schedule so soil treatment can be coordinated before the relevant areas are covered.',
    maintenance: 'For Mumbai homes and managed buildings, an annual plan can bring inspections and service records together, with access coordinated through your household or society representative.',
    areas: ['Andheri', 'Powai', 'Borivali', 'Kanjurmarg', 'Vikhroli', 'Bandra', 'Goregaon', 'Mulund', 'Chembur', 'and More...'],
  },
  {
    slug: 'bangalore', name: 'Bangalore', officialName: 'Bengaluru', state: 'Karnataka',
    landmark: 'Vidhana Soudha', image: '/images/locations/bangalore-hero.webp',
    imageAlt: 'Illustration inspired by Vidhana Soudha with gardens and blue skies in Bangalore',
    about: 'Bangalore’s humid climate makes homes and offices susceptible to termite infestations. Our professional termite pest control services in Bangalore offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property from destructive termites with guaranteed results.',
    context: 'Bangalore, also known as Bengaluru, has apartments, villas, rental homes and office campuses with different access and maintenance needs. We assess the accessible woodwork and areas of concern before proposing a service plan.',
    homes: 'For Bangalore apartments, villas and rental properties, inspections focus on accessible furniture, built-in cabinets, door frames and the areas where activity has been noticed. We discuss access with occupants or the property manager.',
    businesses: 'For Bangalore offices, IT parks, shops and managed workplaces, we consider your site rules and operating schedule before agreeing inspection access and treatment timing.',
    construction: 'For Bangalore residential developments and commercial builds, share your current construction stage and builder’s contact. Foundation, backfill, plinth and service-entry visits are planned around site progress.',
    maintenance: 'For Bangalore homes, housing societies and workplaces, a maintenance agreement sets out the inspection schedule, included areas and support available between agreed visits.',
    areas: ['Koramangala', 'Indiranagar', 'HSR Layout', 'BTM Layout', 'Jayanagar', 'Whitefield', 'Electronic City', 'Marathahalli', 'Rajajinagar', 'and More...'],
  },
  {
    slug: 'pune', name: 'Pune', officialName: 'Pune', state: 'Maharashtra',
    landmark: 'Shaniwar Wada', image: '/images/locations/pune-hero.webp',
    imageAlt: 'Illustration of the historic Shaniwar Wada gateway and gardens in Pune',
    about: 'Pune’s homes, apartments and workplaces need a considered approach to termite protection. Our professional termite pest control services in Pune offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property with a treatment plan based on an inspection.',
    context: 'Pune properties include independent houses, apartment communities, offices and buildings at different stages of construction. The plan takes account of the property layout, accessible timber and the work you are preparing for.',
    homes: 'For Pune houses, apartments and housing societies, we review visible signs, fixed woodwork and accessible junctions. Share any renovation plans so the inspection can include the areas that will become accessible.',
    businesses: 'For Pune offices, commercial units and industrial premises, we agree priority areas and site access with your representative before proposing work and reporting arrangements.',
    construction: 'For new Pune homes and development projects, preventive soil treatment is planned around foundation work, filling, flooring and accessible external areas in coordination with the builder.',
    maintenance: 'For Pune homes and business properties, regular inspections can be organised under a written plan that explains visit frequency, covered areas and the process for reporting new concerns.',
    areas: ['Baner', 'Wakad', 'Hinjewadi', 'Kothrud', 'Viman Nagar', 'Kharadi', 'Hadapsar', 'Aundh', 'Shivajinagar', 'and More...'],
  },
  {
    slug: 'delhi-ncr', name: 'Delhi NCR', officialName: 'Delhi NCR', state: 'Delhi & NCR',
    landmark: 'India Gate', image: '/images/locations/delhi-ncr-hero.webp',
    imageAlt: 'Illustration of India Gate with landscaped lawns in New Delhi',
    about: 'Homes and businesses across Delhi NCR can be vulnerable to termites in concealed woodwork and building junctions. Our professional termite pest control services in Delhi NCR offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property with inspection-led treatment.',
    context: 'Delhi NCR covers a broad mix of houses, apartments, offices and larger developments. Tell us your exact locality and property type so the team can confirm access, service availability and a suitable inspection visit.',
    homes: 'For Delhi NCR homes and apartments, we assess accessible woodwork, fitted storage and visible signs at wall-floor junctions. Mention earlier infestations or treatment when arranging your inspection.',
    businesses: 'For Delhi NCR offices, retail premises and institutions, the plan considers your site contact, operating hours and access restrictions, with the scope agreed after assessment.',
    construction: 'For a new Delhi NCR building, early planning helps coordinate soil treatment with your contractor while foundation trenches, filling and service penetrations remain accessible.',
    maintenance: 'For Delhi NCR homes and managed premises, an AMC sets out the agreed local service schedule, coverage and reporting process. Exact locality and travel access are confirmed before appointments.',
    areas: ['Dwarka', 'Rohini', 'Saket', 'Janakpuri', 'Laxmi Nagar', 'Mayur Vihar', 'Greater Kailash', 'Ghaziabad', 'Gurugram', 'and More...'],
  },
  {
    slug: 'goa', name: 'Goa', officialName: 'Goa', state: 'Goa',
    landmark: 'Basilica of Bom Jesus', image: '/images/locations/goa-hero.webp',
    imageAlt: 'Illustration inspired by the Basilica of Bom Jesus with tropical greenery in Old Goa',
    about: 'Goa’s coastal climate makes homes and businesses susceptible to termite infestations. Our professional termite pest control services in Goa offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property with a plan for its construction, woodwork and use.',
    context: 'Goa properties include villas, family homes, apartments, hospitality spaces and buildings with substantial timber features. We discuss occupancy, access and the areas that need attention before recommending treatment.',
    homes: 'For Goa villas, apartments and family homes, we check accessible doors, frames, cabinetry and the areas where you have noticed signs. Tell us if the home is occupied, rented or visited periodically.',
    businesses: 'For Goa hotels, hospitality properties, offices and shops, we plan inspection access with the property team and discuss how agreed work can fit around guests, staff and daily operations.',
    construction: 'For a new Goa villa, apartment building or hospitality project, soil treatment visits are coordinated with the foundation and flooring schedule while the relevant zones remain accessible.',
    maintenance: 'For Goa homes and hospitality premises, a maintenance plan can coordinate checks around occupancy and access. Visit frequency, covered buildings and included work are stated in the agreement.',
    areas: ['Panaji', 'Porvorim', 'Mapusa', 'Margao', 'Vasco da Gama', 'Ponda', 'Calangute', 'Candolim', 'Dona Paula', 'and More...'],
  },
  {
    slug: 'noida', name: 'Noida', officialName: 'Noida', state: 'Uttar Pradesh',
    landmark: 'Noida business district', image: '/images/locations/noida-hero.webp',
    imageAlt: 'Illustration of modern glass office towers, a metro viaduct and landscaped streets in Noida',
    about: 'Noida’s apartments, independent homes and commercial properties need reliable termite protection. Our professional termite pest control services in Noida offer long-lasting protection using advanced, safe and eco-friendly methods. We help you safeguard your property with treatment planned around its needs.',
    context: 'Noida includes apartment towers, independent sector homes, office developments and buildings under construction. Share your sector, society name and access arrangements so the local service visit can be planned.',
    homes: 'For Noida apartments and sector homes, the assessment considers fixed woodwork, cabinets and accessible junctions. Tell us about society access rules and any previous treatment in your flat or building.',
    businesses: 'For Noida offices, IT premises and commercial buildings, inspections are coordinated with facilities contacts and security access, with treatment areas and timings agreed before work.',
    construction: 'For new Noida homes and developments, share the sector, site plans and stage of work. Preventive treatment is aligned with foundation, filling, flooring and external-access milestones.',
    maintenance: 'For Noida apartments, housing societies and offices, a maintenance plan records scheduled inspections and coverage, with building access and the contact for new concerns agreed in advance.',
    areas: ['Sector 18', 'Sector 50', 'Sector 62', 'Sector 75', 'Sector 76', 'Sector 78', 'Sector 93', 'Sector 137', 'Greater Noida', 'and More...'],
  },
];

export function getLocation(slug: string) {
  return locations.find(location => location.slug === slug);
}

export function locationServiceUrl(location: Location, serviceSlug: string) {
  return `/locations/${location.slug}/${serviceSlug}`;
}

export const locationServiceLabels: Record<string, [string, string]> = {
  'residential-termite-control': ['Residential Termite Treatment', 'Protect Your Home'],
  'commercial-termite-control': ['Commercial Termite Control', 'Secure Your Business'],
  'pre-construction-termite-treatment': ['Pre-Construction Termite Control', 'Build with Confidence'],
  'post-construction-termite-treatment': ['Post-Construction Termite Control', 'Protect Existing Buildings'],
  'annual-maintenance-contract': ['Annual Maintenance Plan (AMC)', 'Long-Term Protection'],
};

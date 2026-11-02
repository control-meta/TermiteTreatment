# Location pages

Implemented on 2 November 2026 from the supplied Bangalore location-page reference.

## Routes

The index is `/locations`. City landing pages use `/locations/{city}`. Each city has five separate service URLs at `/locations/{city}/{service}`.

City slugs: `mumbai`, `bangalore`, `pune`, `delhi-ncr`, `goa`, `noida`.

Service slugs:

- `residential-termite-control`
- `commercial-termite-control`
- `pre-construction-termite-treatment`
- `post-construction-termite-treatment`
- `annual-maintenance-contract`

This creates six city pages, 30 local service pages and one location index. Bangalore is the public URL/display name; Bengaluru is retained as its official name in structured data.

## Content and navigation

City pages follow the reference layout: landmark hero, introduction, service cards, reasons to choose the team, coverage, property gallery, reference testimonial, FAQs and enquiry form. The Bangalore wording is retained where supplied. The fifth post-construction card completes the requested five-service set.

Local service pages adapt introductions, property guidance, treatment-stage notes, benefits, FAQs and enquiry copy using city-specific content in `lib/locations.ts` and `lib/location-services.ts`. Service links in the shared desktop/mobile header retain the current city. Related-service links and footer inspection links retain that context too.

Enquiry forms preselect the city and service where applicable. They prepare a WhatsApp message for the shared official number, +91 99452 42545, without a confirmation modal. Visitors send the prepared message in WhatsApp. The shared phone input allows exactly ten digits.

## Images and SEO

Six original city illustrations were generated with ImageGen and optimized as 1536 × 1024 WebP files in `public/images/locations`. They are architectural illustrations inspired by the Gateway of India, Vidhana Soudha, Shaniwar Wada, India Gate, Basilica of Bom Jesus and a modern Noida skyline. Existing service and property illustrations are reused. All meaningful image elements have descriptive alt text or an accessible image label; decorative backgrounds have empty alt text.

The gallery is marked illustrative. The supplied Radhika Sharma testimonial remains identified as reference content; no Review or AggregateRating schema is added.

Every city/service route has its own title, description, canonical URL, Open Graph/Twitter metadata and applicable Service, FAQ and breadcrumb JSON-LD. All 37 new URLs are included once in the sitemap. Unknown city and service paths are excluded from static generation.

## Validation

- Final production build passed in an isolated checkout: 51 pages generated including the existing routes, six new cities and 30 new service pages.
- Workspace TypeScript check and `git diff --check` passed.
- Generated-HTML audit passed for all 37 new routes: H1, unique localized metadata, canonical, OG image alt, valid JSON-LD, image files/alt, local links, selected form values, ten-digit phone constraints, city footer text and sitemap entries.
- All 30 enquiry handlers were exercised with mocked navigation; destination, city, service and submitted fields were correct. No messages were sent.
- Browser inspection covered the Bangalore city page at 1440px desktop and 390px mobile, the six-city mobile menu, and the Goa pre-construction page at 390px with city/service selections verified. No horizontal overflow was observed in those mobile checks.
- Recovery check: all 37 generated routes pass metadata (including Twitter image alt), canonical, local-link, anchor and image-file checks. The saved implementation was reused. Mumbai city also passes 320px and 768px clipping/overflow checks. Mobile location tapping was verified by navigating to Mumbai with the city preselected and menu closed. Noida city and commercial-service selections and city-aware service links were verified in the browser; the commercial service has no clipped headings or horizontal overflow at 320, 768 and 1440 pixels. Desktop Locations now opens on mouse hover, with tap navigation retained for mobile. The earlier browser limit no longer blocks these checks.

The main development build and unrelated Home2 work were left intact. No publishing or deployment was performed.

The original closed side-chat window was not recovered. This verification continued from the saved checkout and implementation notes.

All city landing pages now share the Home page’s SiteFooter component, matching the existing local service pages. City-specific inspection and service destinations are retained within that shared design.

## Location support layout and review carousel

All six city landing pages now stack a compact review card above the FAQ card in one column, beside the enquiry form. The stack and form align at both the top and bottom; the message field expands to use available desktop space. Phones show reviews, FAQs and the form in order. FAQ expansion keeps the adjacent layout aligned.

`LocationReviewsCarousel` slides one short review at a time within an overflow-contained viewport. It has vertically centred arrows, keyboard navigation, native touch swiping, a five-review counter and automatic advancement every five seconds. Motion pauses during hover, focus and touch, while offscreen or in a hidden tab, and for reduced-motion preferences. Duplicate loop slides are hidden from assistive technology.

The project has no five verified customer reviews. Five brief **preview** reviews are explicitly labelled as awaiting approved feedback; they are not presented as genuine endorsements or added to review structured data. A Google Business review link or approved review text has been requested from the user. Replace `lib/location-reviews.ts` when supplied.

# Service detail page redesign — 2 November 2026

The five service detail routes share a responsive, server-rendered layout in `app/(company)/services/[slug]/`. Service-specific copy lives in `lib/service-details.ts`. The supplied construction-service page is the layout and content reference. Its pre-construction section wording is retained, including the original headline, treatment explanation, six benefits, five treatment stages, project categories, trust labels, FAQ questions and quotation copy. The official site logo and updated contact number are retained; the testimonial/reviews section and historical trust badge are omitted. FAQ answers and the other four service pages have service-specific supporting copy.

## Design

- Forest-green image-backed hero with lime accents, readable gradients, and direct call and inspection actions.
- Treatment explanation, six benefits, five process stages, six property cards, practical reasons to choose the team, the reference’s three pre-construction FAQs (four for the other services), and an inline enquiry form.
- No testimonial or reviews section.
- Mobile: separate hero photo above copy, two-column benefit/property cards, stacked process and FAQ sections, and single-column form fields. Existing shared header, footer and floating contact controls are retained.
- The pre-construction process uses a schematic cutaway with HTML number markers linked visually to the ordered treatment stages.
- All contact actions use the shared company data, currently +91 99452 42545.
- Service enquiries validate locally and go directly to WhatsApp with the completed service-specific message, without a review modal. The visitor sends the message in WhatsApp; there is no backend submission or automatic booking. The extra project quotation button beside the pre-construction form is omitted at the user’s request.

## Generated assets

Generated with the built-in ImageGen tool. Five photorealistic service hero scenes use subject matter from the supplied reference and existing service descriptions. No text, branding or contact details are baked into the images. The foundation illustration is educational, not a construction specification. The property asset contains six architectural scenes in an exact 3-by-2 grid, displayed individually with CSS background positioning. Original PNGs are preserved; project assets are WebP conversions at quality 84.

| Asset | Original generated PNG |
| --- | --- |
| `public/images/services/preconstruction-hero-v4.webp` | `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-29027e10-bbf9-4e05-8fa0-95c378533c94.png` |
| `public/images/services/residential-hero-v4.webp` | `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-b497f2ec-d711-4b34-ac2a-1df20e560297.png` |
| `public/images/services/commercial-hero-v4.webp` | `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-9434c7ba-50ab-41f0-9d4b-9fb8f12f606e.png` |
| `public/images/services/postconstruction-hero-v4.webp` | `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-aa249cf8-a871-4a6a-abb7-b2a351286e09.png` |
| `public/images/services/maintenance-hero-v4.webp` | `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-55174c0e-29ad-47e1-8793-ddba32b4d2c6.png` |
| `public/images/services/foundation-cutaway-v4.webp` | `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-6e951708-efb1-4fec-aea6-0ab2fa54c0ab.png` |
| `public/images/services/property-types-v4.webp` | `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-7c26e6fe-29b0-47e4-a3d8-516ae3c42615.png` |

The existing service-v3 treatment photographs remain as supporting process images for residential, commercial, post-construction and annual maintenance care. The new heroes and architectural property images are used across the redesigned detail pages.


## Verification

- Production build and TypeScript checks pass.
- All five pages checked at 320px, 768px and 1440px: no horizontal overflow or clipped headings/paragraphs; additional 390px phone checks confirm 16px form inputs and single-column fields.
- Generated page images, local anchors and official call/WhatsApp recipients verified.
- Reference wording checked against 23 source passages, with the full pre-construction headline wrapping on mobile.
- Required-field validation and FAQ expansion checked in the browser.
- Direct form submission checked with mocked navigation for pre-construction, residential and maintenance variants: correct official WhatsApp recipient, encoded service/name/phone/location/property/details, and optional construction stage. No test message was sent.
- The project quotation button and service form review modal are absent from the final page.

## Follow-up adjustments

All website phone inputs now share `components/PhoneInput.tsx`: numeric keyboard, digits only while typing, formatted paste sanitization, a 10-digit maximum, and exactly 10 digits required. Service, contact, homepage and quick-booking fields were checked in the browser; incomplete values are invalid. Paste and selection-editing behavior was also verified without submitting an enquiry.

The commercial hero is replaced with a new exterior inspection scene, `public/images/services/commercial-hero-v5.webp`, showing a specialist at a timber entrance of a glass office building. The service data sets a crop position for this image; the commercial quotation background and social preview use the same updated asset.

Original commercial-v5 PNG: `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-2e2b7c96-d58e-4167-989a-9f71209b2780.png`. Generated with the built-in ImageGen tool and converted to WebP at quality 84; original retained.

## Consistent benefit copy

All five services now have six descriptions of exactly 12 words each (80–93 characters). City service pages inherit those descriptions without uneven appended sentences. This covers 210 benefit descriptions across 35 service pages, verified in generated HTML. Benefit headings reserve a consistent text row and the grid uses equal-height points. Mumbai residential benefits were checked at 1440, 768, 390 and 320 pixels with matching point heights and no clipping or horizontal overflow.

### Equal visible lines and responsive alignment

`ServiceBenefitGrid` now balances complete words into the same number of visible lines for all six descriptions. It measures the loaded font and available width, using all service descriptions as a common reference so every service uses the same line count at the same width. All copy stays visible; there is no line clamp or truncation. Main and city service routes share this component.

Below 1100px the overview stacks to give the benefit card room. Below 600px each point places its icon beside the text in a single-column list. All five services were verified at 320px and 390px: four and three lines respectively, equal paragraph positions, no clipping or page overflow. The Mumbai commercial route was also verified at 768px, 1024px and 1440px; desktop descriptions use three lines. TypeScript, production build and word-preservation/width checks pass.

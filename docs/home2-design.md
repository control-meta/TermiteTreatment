# Home2 — alternate homepage

Created 2 November 2026 at `/home2` from the supplied homepage design reference. The existing homepage remains at `/`.

## Content and behavior

The reference’s headline, company introduction, service labels, four process steps, residential/commercial lists, reasons to choose the team, three supplied testimonials, FAQ questions, and enquiry call to action are retained. The official phone and WhatsApp destination is the shared company number, +91 99452 42545. Testimonial names and wording come from the supplied reference; initials are used rather than fabricated customer portraits. Architectural project imagery is labelled as illustrative.

The page uses the website’s forest-green, sage and pale-lime palette, scoped through `home2.module.css`. Home2 uses the same shared website header as the other pages, without a top announcement strip. The navigation places Home2 immediately after Home on desktop and mobile. Header navigation, services dropdown, mobile navigation, expandable project gallery, native FAQ accordions and direct WhatsApp enquiry are functional. The form reuses the shared digits-only, exactly-10-digit phone field. Location links prefill both area and city in the contact form.

Page metadata includes an absolute descriptive title, description, `/home2` canonical URL, Open Graph and Twitter images with alt text, WebPage/FAQ JSON-LD, and a sitemap entry. Every informative image has alt text; the decorative termite badge has one accessible wrapper label.

## New generated images

Generated with the built-in ImageGen tool. Originals are retained. Project assets are WebP conversions at quality 84; the image sheets are cropped in CSS without stretching.

### hero

- Project asset: `public/images/home2/hero-v1.webp`
- Original: `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-697109e9-eabb-490b-af45-e7c4c32b95a1.png`
- Prompt: Use case: photorealistic-natural. Asset type: website hero background, landscape 3:2. Create polished realistic architectural advertising photography of a beautiful completed two-storey contemporary Indian villa with warm cream stone, broad glass doors, black window frames, glass balcony and immaculate green lawn, clear bright blue sky, garden trees and subtle leafy branches near upper corners. Main villa on RIGHT two thirds. LEFT third is quieter softly lit pale sky and lawn, usable for a white gradient and dark navy HTML headline. Eye-level wide architectural view, enough headroom, house visible from roof to lawn, excellent natural daylight and crisp true-to-life materials. Similar composition to premium termite-control homepage advertising: reassuring protected home, elegant rather than overly luxurious. No people, no insects, no logos, no text, no badges, no borders, no watermark, no UI.

### termites

- Project asset: `public/images/home2/termites-v1.webp`
- Original: `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-9171f63b-6364-44a2-9c53-d98263c55644.png`
- Prompt: Use case: photorealistic-natural. Asset type: macro photography contact-sheet asset for four pest-control service cards. Landscape 3:2 canvas with an EXACT TWO BY TWO grid of FOUR equal-size photographs, no gutters, borders or text. Top left: close-up of two cream worker termites on textured light brown timber. Top right: a reddish-brown soldier termite with clear head and mandibles on wood. Bottom left: several pale subterranean termites walking inside a damaged timber groove. Bottom right: amber and pale worker termites beside small damaged wood fibres. True termites with realistic pale segmented bodies and six legs, not ants, no giant stylised insects. Different compositions but consistent warm macro photography, sharp subject details and shallow depth of field. Keep each subject near the centre of its own equal-sized tile. No text, no logos, no graphic overlay, no red prohibition symbol, no watermark.

### technician

- Project asset: `public/images/home2/technician-v1.webp`
- Original: `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-d4cf8524-819f-4250-a5a3-8359de0c0505.png`
- Prompt: Use case: photorealistic-natural. Asset type: landscape service photograph for a termite-control homepage. A professional Indian pest-control technician in clean navy blue uniform, dark blue cap, safety glasses, fitted protective mask and protective gloves carefully treating the base of a timber door frame inside a bright completed home. Neat compact professional treatment equipment, no excessive spray cloud or spills, natural daylight, warm white plaster and realistic wood. Technician kneeling on RIGHT two thirds and looking at work, full head and hands visible with generous headroom; LEFT third clean light wall space. Premium realistic advertising photography, accurate anatomy, no other people, no text, no branding, no logo, no watermark.

### bangalore

- Project asset: `public/images/home2/bangalore-v1.webp`
- Original: `/home/raagneet/.codex/generated_images/01a19ac0-79b7-7920-8c18-3217b3a3d0c4/exec-06eeff0b-7099-451b-9bcc-fbe8fb237645.png`
- Prompt: Use case: photorealistic-natural. Asset type: landscape background photograph for a Bangalore service-locations card. Beautiful clear daylight architectural photograph of Vidhana Soudha in Bengaluru, its distinctive cream Neo-Dravidian facade and central dome, seen from a landscaped foreground. Building concentrated in LEFT half and lower part, pale blue sky and subtle soft clouds on RIGHT half for navy HTML location labels. Crisp accurate architecture and natural green lawn, tasteful and calm, no people in foreground, no vehicles, no writing or graphic overlays, no logos, no watermark.

## Existing images reused

`public/images/services/property-types-v4.webp` supplies the residential/commercial panels and architectural gallery. Its provenance is recorded in `docs/service-detail-redesign-v4.md`.


## Verification

- Production build and TypeScript pass, including `/home2` in the generated routes.
- Layout checked at 320, 390, 768, 1024, 1280 and 1440 pixels: no clipped text or horizontal overflow.
- Mobile navigation opens, closes, and follows section anchors; the project gallery expands from four to six items and collapses again.
- FAQ accordions and the five-point blog expansion work.
- Form required fields, digits-only 10-digit phone constraints and direct WhatsApp URL construction pass. Submission was tested with mocked navigation; no enquiry was sent.
- Location links prefill the contact form with both neighbourhood and city.
- Title, description, canonical, Open Graph/Twitter metadata and alt text, JSON-LD, sitemap, image files, internal anchors and the official contact links verified.
- Browser error log was empty for the checked page.
- Local development URL verified with HTTP 200: `http://localhost:3000/home2`.

## Content updates

The Our Prime Locations and Latest Blogs sections were removed at the user’s request. The remaining FAQ panel is centered with a readable maximum width.

## Reviews carousel

Home2 now shows six review cards in a continuous horizontal marquee: the three supplied testimonials and three visibly labelled sample reviews using generic customer roles. The samples are preview copy, not additional customer endorsements. The carousel has vertically centered previous/next arrows, keyboard arrows and native horizontal touch scrolling. It pauses on hover, focus and touch, respects reduced-motion preferences, skips hidden tabs and offscreen animation, and hides duplicate loop content from assistive technology.

## Shared footer and locations navigation

Home2 and all six city landing pages now use the same SiteFooter component as the Home page and existing service/company pages. The separate footer markup, branding helper and styles were removed. Local inspection and service links retain the relevant page or city context. A new Our Locations section links to all six city pages immediately above the reviews, using the existing landmark assets and descriptive alt text. It uses six columns on desktop, three on tablet and two on phones.

## Whole-page background motion

Home2 reuses the shared PageAmbientBackground: moving sage/gold light washes, botanical layers and drifting motes behind the page content and shared footer. Card surfaces stay opaque. The hero image has a slow, scoped zoom animation. Reduced-motion styles stop the hero and ambient effects, including the sunlight layer. Desktop animation transforms were verified; mobile overflow and text visibility were checked.

## Promoted to the main homepage

The Home2 design now renders at `/` as Home. The former homepage implementation was replaced; the separate Home2 item was removed from desktop and mobile navigation. `/home2` permanently redirects to `/` for existing links. The main page canonical URL, Open Graph URL and WebPage schema now identify the root route, and the sitemap lists only the canonical homepage. The obsolete global preload of the former homepage image was removed. The shared footer's Why TermiteTreatment link targets the new homepage's `why-us` section. Existing Home2 asset and helper filenames remain internal implementation details.

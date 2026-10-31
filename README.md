# TermiGuard

A complete React / Next.js App Router website, recreated from the supplied TermiGuard design. Uses TypeScript, Lucide icons and custom responsive CSS.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Next.js. Build with `npm run build`; check types with `npm run typecheck`. The production website exports to `out/` and can be served by any static host. `npm start` is intended for a server build, so for this static export use `npx serve out` instead.

## Features

- Reference-inspired desktop hero with an optimized custom background photograph, live HTML typography, shield/leaf branding, enquiry form and social proof.
- Responsive layouts from small phones through large desktop screens; compact mobile navigation and fixed mobile contact actions.
- Entry, scroll and hover animations, with reduced-motion support.
- Home/business service filters, accessible native service dialogs, FAQs, a home/business property selector, inspection process and contact calls to action.
- Labelled and validated form fields. Submitting opens a review dialog and prepares a WhatsApp message. Nothing is sent automatically; the visitor must open WhatsApp and send it. No backend, inbox, booking service or lead storage is configured.
- Semantic sections, keyboard focus styles, skip link and native modal focus management.

## Before using for a real business

Replace the reference phone number (`+91 98765 43210`) and WhatsApp destination (`919876543210`) in `app/page.tsx`. Confirm the supplied statistics, testimonial, guarantee and service descriptions. Update location and business information. Those items are demonstration content retained from the reference, as disclosed in the footer.

Main files: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`.

## Image asset

The family/technician photo was created using the built-in Imagegen tool with the supplied image as an edit reference. Original output: `public/images/termiguard-family.png`. Optimized website asset: `public/images/termiguard-family.webp` (about 210 KB). The original generated PNG is retained. See `ASSET-PROMPT.md` for the generation prompt.

## Responsive layout and 3D animation

`app/responsive.css` lets content reflow with browser zoom instead of clipping it inside a fixed hero height. The hero remains compact when space permits and grows naturally on smaller viewports. Navigation, grids, headings, dialogs and image cards adapt to available space. Browser zoom is not disabled or counteracted.

`components/TermiteField.tsx` loads `lib/termiteScene.ts` only when the animation is enabled. Three.js renders exactly two small articulated termite models on every screen. They wander in smoothly changing random directions and steer around the hero text, enquiry form and long reading blocks. The models have segmented abdomens, six jointed legs, beaded antennae, mandibles, surface detail, physical materials and transparent soft shadows. The transparent canvas ignores pointer events. A pause/play control, reduced-motion defaults, hidden-tab suspension, a 30 FPS ceiling and capped pixel density limit unnecessary motion and rendering cost. Browsers without WebGL retain all website content without the decorative animation.

The dedicated customer review section reuses the Priya testimonial supplied in the original reference. No additional customer reviews were invented. The old final green call-to-action banner was removed. Generated photography replaces the large decorative icons; normal navigation and form symbols remain for usability. All new asset prompts are in `ASSET-PROMPT.md`.

The warning-signs section was replaced with the interactive “Spaces we protect” section. Its home/business buttons update the photo, care guidance and enquiry service selection. The slimmer trust strip uses a distinct family portrait, inspection photo, commercial-care photo, house exterior and termite macro instead of repeating the hero image.

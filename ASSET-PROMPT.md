# Hero asset provenance

Cleanup note, 31 October 2026: original PNG files are no longer stored in this project. The website retains the optimized WebP versions it currently uses. Original-output paths below document generation history; the complete removal list is in `docs/project-cleanup-report.md`.

## Mobile reference redesign — 31 October 2026

Built-in `image_gen.imagegen`, opaque generation. Optimized project asset: `public/images/mobile-hero-family.webp` (1000 × 1250, approximately 107 KiB). Desktop keeps its existing photograph. References: the supplied `Modern Green Termite Control Hero.png` for composition and the existing `termiguard-family.webp` for photographic style. The generated asset is illustrative, not a photograph of an actual service visit.

Prompt: Use case: photorealistic-natural. Asset type: mobile website hero background photo, portrait 4:5 composition. Input image 1 is a layout/composition reference ONLY; do not reproduce any typography, logo, form, icons, buttons, border or UI. Input image 2 is a photographic style reference for the people, warm house and garden. Create ONLY a clean premium photographic background. Bright welcoming Indian family (father, mother, young daughter) speaking with a professional termite-control technician in a dark forest-green polo and cap holding a tablet, outside a contemporary warm cream stone house with lush sunlit plants. COMPOSITION CRITICAL: the group is small and positioned in the LOWER RIGHT quadrant, occupying the rightmost 42% of the frame and bottom 52%; all faces stay below the vertical midpoint. Technician at far right, parents and child beside him. Keep the entire upper 40% and left 58% very quiet, pale warm ivory and soft-focus sage garden, suitable for dark headline and paragraph overlay. House doorway visible on the right edge; people recognizable, natural and realistically proportioned. Soft golden morning lighting, light green botanical palette, elegant editorial photograph, gentle natural ivory haze fading along left and bottom. No text, no logos, no watermarks, no UI. Deliver one background image only.

Tool: built-in `image_gen.imagegen`, edit mode with the supplied reference image; transparent background disabled.

Input: `ChatGPT Image Oct 27, 2026, 12_49_46 PM.png`.

Outputs: `public/images/termiguard-family.png` and the lossily compressed WebP `public/images/termiguard-family.webp` used by the site.

Prompt:

Use case: precise-object-edit. Asset type: full-bleed website background photograph, wide landscape 16:9. Edit target: attached TermiGuard website reference. Extract/recreate ONLY the beautiful photographic background, removing ALL typography, logo, navigation, white quote form, buttons, icons, testimonial bar and white overlays. Keep the exact same family (father white shirt, mother beige shirt, young daughter light green dress) and friendly pest-control technician in dark forest green uniform and baseball cap holding a tablet, standing together outside the same beautiful modern cream stone house in warm sunlight with garden greenery. Match their natural appearance and original positions: family and technician grouped in center-right of composition, clean bright softly blurred white/green garden negative space filling left 42% for future website headline; house and foliage on right. Show their heads and bodies fully to just below the knees. Natural editorial architectural lifestyle photography, soft sun flare, shallow depth of field, lush green leaves at edges. No text, no lettering, no graphics, no UI, no watermarks. Preserve photographic scene and warm inviting mood.

## Service photography update

Mode: built-in Imagegen, new generation, opaque backgrounds. Images are editorial concept assets, not records of actual customers or completed jobs. The WebP assets were resized to 1200 pixels wide and compressed for the website; no scene editing was applied afterward.

### `public/images/termite-macro.webp`

Photorealistic editorial macro photograph of real subterranean worker termites on richly textured damaged wood, ivory translucent segmented bodies, amber heads and fine six jointed legs, one prominent termite sharply in focus, others softly behind, warm natural light, subtle forest green out-of-focus background, premium pest control website service photography, sophisticated natural earthy palette, horizontal 3:2 composition, no text, no logos, no graphics, no border, not an icon, not a cartoon.

### `public/images/home-inspection.webp`

Photorealistic premium editorial photograph of a professional Indian pest control inspector in a neat dark forest green polo shirt and green cap, inspecting a wooden window frame inside a beautiful sunlit contemporary home, holding a small inspection flashlight and checking wood carefully, pale warm interiors with lush green garden visible beyond window, clean home with natural materials, realistic human proportions and detailed hands, inviting trustworthy natural light, high quality commercial lifestyle photography, horizontal 3:2 composition, no text, no logos, no UI, no graphics.

### `public/images/commercial-care.webp`

Photorealistic premium editorial architectural photograph of a professional pest control technician wearing a dark forest green polo shirt and dark trousers, holding a tablet while walking through a beautiful contemporary boutique office reception with stone floors, natural timber paneling, large windows and green plants, bright warm natural morning light, refined clean business space, sophisticated commercial photography, focus on professional care in a real working environment, horizontal 3:2 composition, no text, no logos, no UI, no graphics, no illustration.

## Compact trust-strip images

Built-in Imagegen, opaque square generations, optimized as 640-pixel WebP images. These are illustrative lifestyle/architecture assets, not photographs of a named reviewer or an actual serviced property.

### `public/images/customer-family.webp`

Photorealistic editorial portrait of a happy Indian family of three, mother father and their young daughter, sitting closely together on a warm beige sofa in a bright contemporary living room with soft green plants and natural sunlight. Different people and a different interior from a pest control technician scene. Candid relaxed smiles, natural believable facial expressions, elegant premium lifestyle photography, medium close-up faces clearly recognizable as a tiny round website thumbnail, square composition. No text, no logos, no graphics, no technician.

### `public/images/protected-home.webp`

Photorealistic editorial architectural photograph of a beautiful modest contemporary Indian family house with white plaster and warm timber entrance details, a small beautifully tended lush green garden and sunlit porch, peaceful welcoming atmosphere, no people, no technician, distinctly different from a stone-clad luxury house. Framed exterior facade and front door clearly recognizable when cropped into a small circle, warm natural morning light, premium real estate photography, square composition, no text, no logos, no graphics.

# Services image generation — version 3

Generated 2026-11-01 with the built-in `image_gen.imagegen` tool, one independent call per requested asset. No input/reference images were supplied. All five calls used `transparent_background: false`. These are AI-generated editorial service illustrations, not photographs of the business's staff or completed projects.

The original PNG outputs remain at the default generated-image location; the final project assets are copied and optimized into this repository. Each output was inspected for scene, equipment, composition, natural proportions, palette and absence of unwanted text. All five outputs were accepted without regeneration.

## Production assets

All files are 900 × 600 pixels, landscape 3:2, encoded as WebP with Sharp (`quality: 82`, `effort: 6`, center crop). The full image is suitable for a compact landscape panel; thumbnails should retain the action near the center.

| Asset | Saved path | Bytes | Suggested alt text |
| --- | --- | ---: | --- |
| residential | `public/images/services/residential-v3.webp` | 46924 | Termite specialist inspecting a wooden window frame in a sunlit home. |
| commercial | `public/images/services/commercial-v3.webp` | 45666 | Termite specialist checking the timber base of an office reception desk. |
| preconstruction | `public/images/services/preconstruction-v3.webp` | 109010 | Technician in protective equipment treating soil beside new foundation footings. |
| postconstruction | `public/images/services/postconstruction-v3.webp` | 43374 | Technician applying targeted treatment beside finished wooden skirting. |
| maintenance | `public/images/services/maintenance-v3.webp` | 47616 | Termite specialist checking a wooden door frame during a routine follow-up visit. |

## Exact prompts and tool provenance

### residential

Tool: built-in `image_gen.imagegen` (not CLI/API fallback).

Original output: `/home/raagneet/.codex/generated_images/01a1976b-8a96-77c2-9bad-654d8e195526/exec-9d00ae15-73cc-4fb5-b32d-a5b80a1b596f.png`

```text
Use case: photorealistic-natural
Asset type: compact landscape service photograph for a minimal premium termite-care website
Style/medium: authentic editorial photograph, natural human proportions and equipment, refined understated documentary realism
Composition/framing: 3:2 landscape, close-medium framing with the key action in the central 65 percent so it remains legible in a small rounded thumbnail, concise scene without excessive empty space
Lighting/mood: soft Indian morning daylight, calm capable professional care
Color palette: warm cream interiors, natural honey oak, deep forest-green workwear, muted plants
Constraints: no text, no lettering, no logos, no watermark, no collage, no graphic overlays, no dramatic infestation, no visible brand labels
Primary request: An Indian termite specialist wearing a clean forest-green polo and blue nitrile gloves carefully inspecting the lower wooden frame of a large residential window with a small black inspection flashlight. A calm contemporary Bengaluru home with cream walls and softly blurred green garden beyond glass. Photograph close enough to clearly show the technician's focused face in three-quarter view and gloved hand at the wood frame. Natural believable pose, only one technician.
```

### commercial

Tool: built-in `image_gen.imagegen` (not CLI/API fallback).

Original output: `/home/raagneet/.codex/generated_images/01a1976b-8a96-77c2-9bad-654d8e195526/exec-663c5955-3880-4cb2-ab38-f9c5b52bc104.png`

```text
Use case: photorealistic-natural
Asset type: compact landscape service photograph for a minimal premium termite-care website
Style/medium: authentic editorial photograph, natural human proportions and equipment, refined understated documentary realism
Composition/framing: 3:2 landscape, close-medium framing with the key action in the central 65 percent so it remains legible in a small rounded thumbnail, concise scene without excessive empty space
Lighting/mood: soft Indian morning daylight, calm capable professional care
Color palette: warm cream interiors, natural honey oak, deep forest-green workwear, muted plants
Constraints: no text, no lettering, no logos, no watermark, no collage, no graphic overlays, no dramatic infestation, no visible brand labels
Primary request: An Indian termite specialist in a clean forest-green polo and dark trousers crouches beside the honey-oak base of a modern office reception desk, inspecting the timber join with a compact black flashlight. Elegant small contemporary Bengaluru office with warm cream walls, a plant and softly blurred seating. Keep face, hand, flashlight and oak join grouped near center. Only one technician, credible quiet professional inspection.
```

### preconstruction

Tool: built-in `image_gen.imagegen` (not CLI/API fallback).

Original output: `/home/raagneet/.codex/generated_images/01a1976b-8a96-77c2-9bad-654d8e195526/exec-91d4958a-d667-450f-8d3d-b95e00595713.png`

```text
Use case: photorealistic-natural
Asset type: compact landscape service photograph for a minimal premium termite-care website
Style/medium: authentic editorial photograph, natural human proportions and equipment, refined understated documentary realism
Composition/framing: 3:2 landscape, close-medium framing with the key action in the central 65 percent so it remains legible in a small rounded thumbnail, concise scene without excessive empty space
Lighting/mood: soft Indian morning daylight, calm capable professional care
Color palette: warm cream interiors, natural honey oak, deep forest-green workwear, muted plants
Constraints: no text, no lettering, no logos, no watermark, no collage, no graphic overlays, no dramatic infestation, no visible brand labels
Primary request: An Indian termite prevention technician treating the exposed soil at the bottom of a shallow foundation trench at a clean residential construction site. The technician wears forest-green coveralls, rubber work boots, nitrile gloves, clear protective eyewear and a fitted half-face respirator, using a slim low-pressure spray lance attached to a hose; no aerosol cloud. Visible light brown soil trench and low masonry footings show preconstruction prevention clearly. Crouched practical working posture, framed at close-medium distance, with worker and trench treatment centered. Soft natural daylight, minimal uncluttered site.
```

### postconstruction

Tool: built-in `image_gen.imagegen` (not CLI/API fallback).

Original output: `/home/raagneet/.codex/generated_images/01a1976b-8a96-77c2-9bad-654d8e195526/exec-4e13b36f-7d55-4596-a8b9-c78495bfcf74.png`

```text
Use case: photorealistic-natural
Asset type: compact landscape service photograph for a minimal premium termite-care website
Style/medium: authentic editorial photograph, natural human proportions and equipment, refined understated documentary realism
Composition/framing: 3:2 landscape, close-medium framing with the key action in the central 65 percent so it remains legible in a small rounded thumbnail, concise scene without excessive empty space
Lighting/mood: soft Indian morning daylight, calm capable professional care
Color palette: warm cream interiors, natural honey oak, deep forest-green workwear, muted plants
Constraints: no text, no lettering, no logos, no watermark, no collage, no graphic overlays, no dramatic infestation, no visible brand labels
Primary request: Close-medium editorial photograph of an Indian termite specialist in forest-green workwear kneeling beside a finished honey-oak floor skirting in a contemporary cream interior, applying precise treatment through a small discreet drilled port near the skirting using a slim professional injection wand connected to a hose. Blue nitrile gloves and protective eyewear; realistic hands and tool contact. Show focused three-quarter face, gloved hands, small wand and lower wall, centered together. Clean precision treatment, no spraying cloud, no disassembled room.
```

### maintenance

Tool: built-in `image_gen.imagegen` (not CLI/API fallback).

Original output: `/home/raagneet/.codex/generated_images/01a1976b-8a96-77c2-9bad-654d8e195526/exec-7614f722-6199-4422-a54e-8c5814f0056a.png`

```text
Use case: photorealistic-natural
Asset type: compact landscape service photograph for a minimal premium termite-care website
Style/medium: authentic editorial photograph, natural human proportions and equipment, refined understated documentary realism
Composition/framing: 3:2 landscape, close-medium framing with the key action in the central 65 percent so it remains legible in a small rounded thumbnail, concise scene without excessive empty space
Lighting/mood: soft Indian morning daylight, calm capable professional care
Color palette: warm cream interiors, natural honey oak, deep forest-green workwear, muted plants
Constraints: no text, no lettering, no logos, no watermark, no collage, no graphic overlays, no dramatic infestation, no visible brand labels
Primary request: An Indian termite maintenance technician wearing a clean forest-green polo and blue nitrile gloves checks a honey-oak door frame during a routine follow-up visit in a calm bright cream home. One hand holds a slim dark tablet against the body while the other gloved hand examines a small timber join. Focused friendly three-quarter face and real wood detail centered. Softly blurred cream interior and houseplant, concise composition, only one technician. No readable screen content.
```

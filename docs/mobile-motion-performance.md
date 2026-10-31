# Mobile motion and performance checks

Implemented October 30, 2026.

## Motion

- Mobile sections enter once with a 14px lift and a 520ms opacity/transform transition.
- First-screen content stays visible immediately; the hero is excluded from reveal hiding.
- One visibility observer handles reveal targets and disconnects each target after revealing it. It cleans up on route changes.
- Vertical scrolling stays browser-native. No wheel/touch scrolling interception or continuous page-scroll handler was added.
- Review cards follow horizontal pointer movement and settle with a distance-based 240–520ms easing. Short, quick flicks can advance a card.
- The review marquee pauses while outside the viewport or while the document is hidden.
- Mobile cursor-parallax processing is skipped. Botanical artwork remains visible.
- Mobile background-position and shadow-pulse accents are static to avoid continuous repaint work during scrolling.
- Reduced-motion preferences show content directly and use native horizontal review scrolling.

## Asset comparison

Compared JavaScript and CSS referenced by the exported homepage HTML, compressed with Python gzip. This is an asset-size check, not a lab performance score; actual transfer sizes depend on hosting compression and caching.

| Assets | Before, gzip bytes | After, gzip bytes | Change |
| --- | ---: | ---: | ---: |
| JavaScript | 195,310 | 195,943 | +633 |
| CSS | 23,067 | 23,225 | +158 |
| Total | 218,377 | 219,168 | +791 |

No dependency, image, font, or animation-library download was added. The number of homepage JS/CSS files stayed at 8 and 2 respectively.

## Validation

- Production build passed, including TypeScript and all 11 static pages.
- Mobile first-screen content stayed visible and the header cleared the title.
- Reveal targets transitioned to visible on vertical scrolling with opacity/transform only.
- Left and right review drag gestures and autoplay resuming were checked in the browser.
- The marquee was paused before entering the viewport, and mobile cursor-parallax classes were absent on a fresh mobile load.
- No browser console errors were observed in these checks.

A live PageSpeed Insights / Lighthouse score was not measured. Score, LCP, INP and CLS must be checked against the deployed version under controlled conditions; they cannot be guaranteed by source changes or bundle size alone.

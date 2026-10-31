# Existing website review and implementation

Reviewed 30 October 2026. Source: https://termitepestcontrol.co.in/

## Pages reviewed

- [Homepage](https://termitepestcontrol.co.in/)
- [About Us](https://termitepestcontrol.co.in/about-us/)
- [Contact Us](https://termitepestcontrol.co.in/contact-us/) — office details checked directly in the browser.
- [Residential termite control](https://termitepestcontrol.co.in/residential-termite-control/)
- [Commercial termite control](https://termitepestcontrol.co.in/commercial-termite-control/)
- [Pre-construction treatment](https://termitepestcontrol.co.in/pre-construction-termite-treatment/)
- [Post-construction treatment](https://termitepestcontrol.co.in/post-construction-termite-treatment/) — reviewed in the browser because the text-fetch service returned 403.
- [Termite AMC plans](https://termitepestcontrol.co.in/termite-amc-plans/)

## Service catalogue

The old site presents five termite services. Residential treatment addresses existing homes and woodwork; commercial care considers larger premises and operating needs. Pre-construction treatment coordinates soil barriers with building stages. Post-construction treatment addresses completed properties, including drilling and injection where appropriate. AMC plans provide agreed monitoring, visits and ongoing care.

The redesign gives each service an individual page with suitable property types, inclusions, a three-step process, related services and an enquiry link. The Services overview contains all five, with home/business filters. Treatment details and contract terms are described without inventing prices or a universal warranty duration.

## Company and contact facts

- Central phone and WhatsApp: +91 92203 12345.
- Email: support@termitepestcontrol.co.in.
- Listed offices: Mumbai, Bengaluru, Pune, Delhi NCR and Goa. Full addresses are transcribed into `lib/company.ts`, with punctuation normalised. Map buttons search the actual address; they do not claim a separately verified business listing.
- Nine main coverage regions: Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad and Goa. Coverage is distinguished from physical offices.
- No opening hours or guaranteed response time were found, so none were invented.

The new About Us page explains the termite specialism, inspection-led approach, prevention and maintenance, and geographic coverage. The Contact Us page brings phone, email, WhatsApp, office locations and an inspection enquiry into one place. Service and city links prefill the relevant form field.

The form first opens a review dialog. The visitor then chooses WhatsApp or email to send the request. It does not send automatically, store a lead or confirm a booking without a team reply.

## Content inconsistencies found

The homepage/About Us page claims 32+ years of experience; the post-construction page claims more than 35. The homepage also combines large customer claims with counters rendered as zero and contains repeated testimonials. These claims are not repeated on the new company/service pages. The homepage references A to Z Pest Solutions while other pages use Termite Pest Control; the current TermiteTreatment branding is retained without inferring a legal company name.

## Homepage preservation

The user's latest instruction is to preserve the homepage UI and visuals. Its existing header/footer structure, three service cards, content sections, photos, typography, statistics, testimonials, animations and layout are retained. Existing links now reach the separate Services, About Us and Contact Us pages. The contact number and enquiry service choices are updated as business data, without restyling the homepage.

New pages are under `app/(company)/`. Their stylesheet is imported by that route group's layout and every selector is prefixed with `.company-pages`. The homepage has no such wrapper. `app/layout.tsx`, all existing stylesheets, animation code, logo and image assets are unchanged.

Source verification confirms that the homepage's main markup is identical apart from link destinations, and all 18 protected design/image files have their original hashes. Production export and TypeScript validation pass. An export audit verifies all 264 local links, anchors and images across 11 HTML files.

Browser comparisons at 1280px desktop and 390px mobile show no changes in the measured homepage element positions, dimensions, fonts, colours, padding or spacing after the existing entry animations settle. All new page stylesheet selectors are confined to `.company-pages`. Browser checks also pass for the shared navigation, five-service overview, filters, mobile navigation, service preselection, enquiry review, correct WhatsApp destination, five office cards and the original homepage enquiry selector. No test request was sent.

Publication is pending explicit approval under the automatic approval review restriction recorded earlier in this chat. This implementation is local.

## Header consistency correction

Every route now renders the same `SiteHeader` component using the original homepage header styles. All pages use the same four labels (Home, Services, About, Contact), brand, phone action and mobile menu. Company-page navigation overrides and the alternate Services dropdown have been removed. The current page receives the original active pill treatment.

## Subsequent homepage changes requested by the owner

The header now contains Home, Services, About and Contact only. Active navigation is determined by the page URL; scrolling anywhere on the homepage keeps Home selected. The previous section observer and its stale navigation state have been removed.

The owner subsequently authorised a redesign of the homepage service section. `HomeCareOverview` replaces the old filter controls and three-card catalogue with an inspection photograph, five compact service links and a free-inspection action. Its CSS module is restricted to this section. All five links resolve to their individual service pages. The inspection action stays on the homepage and focuses the name field.

The owner also requested new termite-related photography for the company-difference section. Four images were created with the built-in image tool: a large termite/timber macro, inspection close-up, targeted treatment close-up and timber-gallery close-up. The three point images are circular. Image originals, optimised WebP files and full generation prompts are listed in `docs/termite-difference-image-prompts.md`.

The final production build passes. Browser checks at desktop and mobile widths confirm the Home/Services route selection, no horizontal overflow, five service links, working inspection focus and all new circular image assets loading. The export audit resolves all 266 local links/images.

# Helio Interface — main7

The sixth design is a standalone futuristic website with its own React composition and stylesheet. It uses Sora, IBM Plex Mono, graphite, mint, lilac and warm event accents. Photographs are absent.

## Experience

- Three main pages: Home, System and Contact; a separate legal page.
- A native SVG isometric solar field with animated signal paths.
- Monitor, Analyze and Notify controls change the illustrative chart, field event and explanatory copy. Sample values are explicitly labelled illustrative, not live.
- A scroll-driven intelligence sequence with a sticky processor schematic and accessible stage jump controls.
- A seven-product workbench that supports native keyboard activation and links to the selected product's specifications.
- Full original company, team, awards, news, articles, product specifications and contact information remain available in consolidated disclosures.
- Locally hosted fonts and license files; no added dependencies.
- Native scrolling, reduced-motion support, focus indicators, mobile navigation and Escape-to-close behavior.
- Existing enquiry validation and reviewable email preparation. No emails sent.

## Verification

- Production TypeScript/Vite build and local prerender: passed for all four routes.
- Six existing browser checks: passed (1.0 minute).
- New futuristic interaction check: passed (8.8 seconds), covering preview modes, keyboard selection, correct product deep links and stage jump behavior.
- Responsive checks: all four routes at 320, 390, 768, 1440 and 1920px without horizontal page overflow.
- Original substantive paragraphs preserved; internal anchors and 25 legacy redirects verified.
- Browser runtime and console error checks passed.
- Desktop composition reviewed in the in-app browser; interactive Analyze and Notify modes verified directly.

## Repository state

Created on main7 from main2. Main and main2 through main6 remain at their previously verified commits. The redesign is maintained on main7. No deployment has been performed.
## Phone signal stage fix

On screens up to 620px wide, Monitor, Analyze and Notify now update one description in place. Stage selection no longer scrolls the page, and scroll observation does not override the selected phone stage. The processor graphic adapts to viewport height.

Verification: production build and all four prerendered routes passed. Three relevant browser checks passed (24.9 seconds), including all three stage selections on 320x568 and 390x844 screens with reduced motion enabled and disabled. Each selection keeps the whole graphic and controls in the viewport and changes scroll position by no more than one pixel. Existing desktop interactions and responsive navigation also passed. Direct phone-size taps in the in-app browser kept scrollY at 1205 while switching Notify and Analyze. Preview: docs/qa/helio-main7-phone-stages.png.

## Continuous signal flow and corrected data path

The signal animation plays continuously on desktop and phone, including when the browser reports reduced motion. There are no play or pause controls. Other page motion follows the existing reduced-motion preference.

The path is Field → ETi-LOG logger → ETi-SOL cloud and ETi-EDGE local monitoring dashboards. Both the processor schematic and opening field illustration follow this path. The processor has three animated routes, with terminal positions matched to SVG coordinates at every width. Desktop stage selection follows the narrative nearest the viewport centre. Phone stage selection stays in place without automatic scrolling.

The product catalog retains its previous category-column layout and complete product details. The compact catalog experiment has been reverted.

Verification: the final production build and all four prerendered routes passed. Focused browser checks passed for animated dash progression, route direction, node alignment at 1280px and 1920px, stage selection in both scroll directions, and phone selections at 320x568 and 390x844. The restored product layout was verified directly in the local preview: original category columns, full specifications, and no compact feature cards. Main remains unchanged; no deployment has been performed. Preview: docs/qa/helio-main7-desktop-signal-flow.png.

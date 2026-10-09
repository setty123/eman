# EnerMAN verification — 8 October 2026

The final production build completed successfully. TypeScript compiled, Vite bundled the application, and Chromium generated HTML for all 27 audited routes. Deployment files are in `dist`.

## Browser acceptance

`npx playwright test` against `http://127.0.0.1:4173`: **12 passed**.

- All 27 source routes, titles, images and internal destinations.
- Original press publishers and dates remain paired with their headlines.
- Homepage and representative internal layouts at 360, 390, 768, 1024, 1440 and 1920 pixels, without horizontal overflow.
- Product and dashboard controls using clicks and keyboard navigation.
- Mobile navigation, Escape, browser back and forward.
- Anchors, FAQ, article and product filters, and reduced motion.
- Required-field validation, native phone validation and the email enquiry flow.
- Normal Lenis scrolling, navigation to the top of a new page, and saved scroll restoration.
- No browser console errors or uncaught runtime errors in any test.

The source comparison checks the exact text of 391 original paragraphs longer than 65 characters, including linked prose. No checked paragraph is missing across the rebuilt site. Six homepage product summaries are also available on their corresponding detail pages. See `qa/content-comparison.json`. The original raw HTML and section inventory remain in `source` and `content-inventory.json` for review of shorter copy, lists, specifications and media.

## Visual and performance checks

Screenshots of all six homepage widths and full desktop homepage, product, company, team, news and article pages are in `qa`. Original photography, product screenshots, certificates, customer logos and leadership portraits were retained.

The 59 audited media assets total 4,294,106 bytes before optimization and 3,417,060 bytes using the optimized versions: a 20.4% reduction. This describes the audited media set, not the initial page transfer. Below-the-fold media is lazy-loaded, page data is split by route, and the three requested font families are self-hosted. The two main variable fonts are preloaded. Generated preload links use portable paths.

`qa/mobile-performance.json` records the final local synthetic run: Chromium at 390 × 844, 4× CPU slowdown, 150 ms latency and 200 KB/s download. It includes paint timings, layout shift, long tasks, resource transfers, overflow and a native touch-scroll check. Results vary with host load and are not field Core Web Vitals or a frame-rate certification.

The latest recorded run measured a 4,940 ms largest contentful paint, zero cumulative layout shift, six startup long tasks and no horizontal overflow. A native touch gesture advanced the page by 425 pixels. An earlier run measured 3,288 ms LCP; the variation illustrates the effect of host load on this synthetic environment. Startup loading under the constrained mobile profile remains a performance improvement opportunity.

## Handoff and configuration

- Run and deployment instructions, architecture, animation behavior and provenance: `../README.md`.
- Direct web form delivery requires a real `VITE_CONTACT_ENDPOINT`; the default validated email flow already works and does not claim to submit an enquiry.
- Public datasheets were not exposed by the source site. The three original gated datasheet requests remain working request forms.
- The supplied design reference required OpenAI sign-in and remains visually unverified. The Sand & Olive brief, original EnerMAN site and accessible Lenis references informed the implementation.
- No deployment or enquiry transmission was performed.

There are no outstanding build or browser-test failures.

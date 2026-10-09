# EnerMAN — Sand & Olive

Complete React / Vite / TypeScript rebuild of the publicly accessible EnerMAN corporate site, audited on 8 October 2026. All 27 audited routes are preserved. Uses Tailwind CSS, React Router, Sora, Manrope, IBM Plex Mono, Lenis, GSAP / ScrollTrigger, Motion and Lucide. The homepage headline uses Manrope with a self-hosted Cormorant Garamond italic accent.

## Run

```sh
npm ci
npx playwright install chromium
npm run dev
```

Vite reports the available local port. The development session uses port 5174; production browser verification uses port 4173; the Playwright base URL can be changed with `TEST_BASE_URL`.

Build and start the production preview before running browser verification:

```sh
npm run build
npm run preview -- --port 4173
```

In a second terminal, run `npm test`. To test a development server, set `TEST_BASE_URL` to its reported URL.

Generated audit, build and browser-report files are excluded from development watching. Tailwind scans `src` so generated test traces cannot cause reload loops or add unused styles.

The build compiles TypeScript, bundles the app, then uses headless Chromium to generate real HTML for every audited route, along with route-specific titles, descriptions, canonical URLs and Open Graph metadata. It also writes a sitemap and an Organization schema. Chromium must be installed in the build environment. The `dist` folder is the deployment artifact.

## Deployment

Use a Node 22.19+ compatible build environment. Serve `dist` with gzip or Brotli compression. Serve real files and existing route directories first, then fall back to `index.html` for client navigation. A Netlify `_redirects` file and Apache `.htaccess` are included. Configure equivalent fallback rules on other hosts. Do not deploy the `docs/source` audit archive or `node_modules`.

Keep `https://enerman.in` as the canonical origin only when deploying to that domain. Change the canonical origin, sitemap origin and structured data together when using a different production domain. Retain the existing `/wp-content/uploads` files on the production host because external sites may still link directly to those original URLs. The redesign ships optimized local copies under `/assets/`.

## Enquiries and datasheets

The source site uses WordPress / WPForms and transient tokens. Those forms cannot be moved into a standalone static build by copying their old tokens. The app preserves all required fields and validates them. Without an API configured, it prepares a real email request to `sales@enerman.in`, clearly asks the visitor to review and send it, and never reports a successful submission.

For direct web submission, configure `VITE_CONTACT_ENDPOINT` at build time. It receives a JSON POST with the displayed fields, `requestType` (`contact`, `demo`, or `datasheet`) and optional `product`. Return `{ "success": true }` only after the backend has accepted the enquiry; return an appropriate non-2xx status and `{ "success": false, "message": "..." }` on failure. Configure validation, spam prevention, email delivery and CORS on the real backend. Credentials belong on the server. Rebuild after setting this variable. No enquiry has been sent during verification.

Source “Download the datasheet” actions were gated request forms, not public PDF links. Equivalent request forms are included for ETi-SOL, ETi-EDGE and ETi-LOG. Both the original `#datasheet` anchor and the descriptive product datasheet anchor work.

## Content provenance

The application is organized as follows:

| Files                                                           | Purpose                                                                                  |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/main.tsx`, `src/App.tsx`                                   | Initial route loading, React Router and page metadata                                    |
| `src/pages/Home.tsx`, `src/components/HomeSections.tsx`         | Complete editorial homepage                                                              |
| `src/pages/ContentPage.tsx`, `src/components/SourceContent.tsx` | Product details, catalog, articles, company, team, awards, news, contact and legal pages |
| `src/components/ProductShowcase.tsx`, `src/components/ui.tsx`   | Product controls, metric counters, FAQ and shared interface elements                     |
| `src/components/Layout.tsx`, `src/styles/main.css`              | Navigation, footer, responsive layouts and the Sand & Olive design system                |
| `src/hooks/useMotion.ts`                                        | Lenis, GSAP, ScrollTrigger and route scroll restoration                                  |
| `src/components/ContactForm.tsx`                                | Validated enquiry, demo and datasheet requests                                           |
| `scripts/`, `tests/site.spec.ts`                                | Source audit, data preparation, HTML generation, profiling and browser checks            |

- `docs/CONTENT-AUDIT.md`: route inventory and reference limitations.
- `docs/content-inventory.json`: original headings, text, section mapping, source links, forms and asset provenance.
- `docs/source/`: original HTML, captured before UI implementation.
- `src/data/pages/`: original content split into independently loaded page data.
- `src/data/content.ts`: verified product summaries, benefits, deployment figures and business contacts.
- `src/data/assets.json`: original assets, retained status, optimized paths and file sizes.

All seven current products, nine library articles, leadership biographies, vision, mission, technical descriptions, press archive, awards, customer logos, original logo and contact details are retained. Historical ETi-SLDC information remains in the original ETi product-family article; it is not presented as an additional current product. Historic deployment figures in dated articles remain historical and are not substituted for current numbers.

The supplied `enerman-sand-olive.wavy-moon-1503.chatgpt.site` reference redirects to OpenAI sign-in in this environment and could not be visually inspected. The Lenis corporate showcase and Maritime Fusion reference were inspected in the browser. No inaccessible reference behavior was assumed.

## Motion and accessibility

One Lenis instance is driven by the GSAP ticker, with `autoRaf: false`, matching ScrollTrigger updates, complete cleanup and Strict Mode support. Native touch scrolling is preserved. Live reduced-motion changes disable smoothing and nonessential reveals. Route navigation restores scroll positions on back/forward, handles anchors, and refreshes after fonts and images load.

Motion includes masked hero lines, limited section reveals, selected-image parallax, a desktop sticky product index, scroll-linked category selection, direct product controls, brief Motion transitions, short metric count-ups and restrained magnetic buttons on fine pointers. Once a visitor selects a product, their choice takes precedence over automatic scroll selection for that page visit. All product destinations remain available through the catalog and footer. Mobile uses normal document scrolling and direct product selection.

The site includes semantic landmarks, a skip link, keyboard tabs, visible focus states, accessible FAQ expansion, mobile menu Escape handling, readable technical content and native form validation. Product/application screenshots are labelled as previews.

## Verification

The final production acceptance run passed all 12 tests. See `docs/VERIFICATION.md` for coverage, source comparison, performance methodology and remaining environment configuration.

`tests/site.spec.ts` covers all original routes, page titles, assets, internal destinations, the six requested viewport widths, representative internal-page layouts, tabs, filters, FAQ, mobile navigation, anchors, back/forward restoration, Lenis initialization and the email request flow. Browser screenshots and content comparison are written to `docs/qa`. `scripts/profile.mjs` records a synthetic mobile run with a 4× CPU slowdown and constrained network against a production preview. This is not a field performance or frame-rate certification.

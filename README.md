# EnerMAN — Helio Interface

This branch is **main7**: the Helio Interface redesign. The original main branch is unchanged.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the URL Vite prints. To preview a production build:

```bash
npm run build
npm run preview
```

## This design

- Typography: Sora + IBM Plex Mono; locally hosted fonts with licenses.
- 3 main pages: /, /system/, /contact/ plus a legal page.
- No photographic images. Native SVG/CSS geometry and scroll effects.
- Product specifications stay together on /system/.
- Company, leadership, team, awards, news and full articles are consolidated within Home.
- Legacy URLs redirect to the corresponding page and section.
- Scroll effects respect reduced motion. Mobile navigation supports Escape.
- The enquiry form prepares an email for review. Set VITE_CONTACT_ENDPOINT only when a real endpoint is ready.

## Design branches

| Branch | Design | Typography |
| --- | --- | --- |
| main7 | Helio Interface | Sora + IBM Plex Mono |
| main2 | Signal Grid | Space Grotesk + DM Sans |
| main3 | Nocturne | Syne + Plus Jakarta Sans |
| main4 | Kiln Editorial | DM Serif Display + Outfit |
| main5 | Cobalt Index | Bricolage Grotesque + Inter |
| main6 | Quiet Current | Fraunces + DM Sans |

`npm test` checks navigation, responsive layouts, retained content, legacy redirects, product interactions, motion and enquiries. Run a local preview server first. No deployment is configured or performed by these scripts.

## Helio interactions

Use Monitor, Analyze and Notify in the homepage preview, scroll through the intelligence sequence, and select any ETi product in the workbench. Values in the preview are illustrative, not live. The original designs remain on main2 through main6. This new direction is on main7 and is saved locally without deployment.

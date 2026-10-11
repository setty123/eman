# Solar Ignition — main8

A new EnerMAN design created from main7 on a separate main8 branch. The original branches are preserved. Local development only; no deployment.

## Visual direction

Syne headings, DM Sans reading text, IBM Plex Mono instrument labels. Fonts are hosted locally with their existing licenses. Warm ivory (#F5F1E8) transitions into midnight navy (#08101F); sunlight is amber (#FFB44A) and data is cyan (#58E2F3). All visuals are native SVG/CSS; no photographic assets are used.

## Scroll story

The opening holds within the viewport while the visitor scrolls through a solar day. The sun rises from the left horizon, follows an arc over the panels, and sets below the right horizon. The theme, light cone, panel illumination, time, generation readout and chart are driven by the same scroll position. Scrolling back reverses the sequence. Stopping scrolling holds the scene. Generation peaks near midday and returns to zero at sunset, while the day's chart remains visible. Data is explicitly illustrative, not live.

Reduced motion keeps the core scroll-controlled sun journey and telemetry direction visible, while removing decorative object rotations, bobbing and panel pulses. The data trails always run. No play/pause control is introduced.

## Connected system

Field equipment → ETi-LOG logger → ETi-SOL cloud / ETi-EDGE local dashboards. These connections represent plant data. The dashboards let operators monitor and see results. Monitor, Analyze and Notify use an accessible keyboard tab interface; product selection uses native buttons with a pressed state and links to complete specifications.

## Site structure

Home, System, Contact and Legal. Existing product descriptions, specifications, company records, team, awards, news and articles are retained. Legacy URLs lead to the appropriate section. The original enquiry form continues to prepare reviewable email requests when no submission endpoint is configured.

## Local preview

Run npm install if dependencies are missing, then npm run dev. For the production preview use npm run build and npm run preview -- --port 4173. No publishing or deployment command is required.

## Validation

Production TypeScript/Vite build and prerendering for all four routes. Browser checks cover content preservation, legacy redirects, route links, responsive overflow, mobile menu, specifications, article search, form validation, scroll reversal, sunrise/sunset direction, the generation curve, keyboard tabs, and full scene visibility on phones. All eight applicable browser checks pass across the full run and focused verification after fixes; the three tests specific to the previous Helio design are inactive on this branch. Responsive layouts cover 320, 390, 768, 1440 and 1920 px widths. The complete solar scene and all three dashboard views were verified at 320 × 568 and 390 × 844 with both motion preferences. Production build and prerendering pass for all four routes.

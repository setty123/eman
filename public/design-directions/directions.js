const directions = [
  {
    id: "signal",
    name: "Signal Grid",
    recommended: true,
    heading: "Space Grotesk",
    body: "DM Sans",
    palette: ["#F4F6F0", "#143F35", "#D2F56A", "#E5EADF"],
    philosophy:
      "Clear, confident, and built around the product. A connected system diagram replaces the hero photograph.",
    layout: "Asymmetric hero → dark product bands → sticky process story.",
    routes: "Home · Solutions · Company · Contact",
    routeCount: 4,
    motion:
      "A drawing connection path, a scroll progress line, and staggered section reveals.",
  },
  {
    id: "nocturne",
    name: "Nocturne",
    heading: "Syne",
    body: "Plus Jakarta Sans",
    palette: ["#0D1524", "#EEF3F3", "#7AE0E8", "#162438"],
    philosophy:
      "A technical, immersive identity for a connected energy platform. Dark surfaces, luminous accents, and controlled geometric motion.",
    layout:
      "Wide type + orbital diagram → overlapping product chapters → quiet company story.",
    routes: "Home · Platform · Company · Contact",
    routeCount: 4,
    motion:
      "Scroll-driven orbital rotation and three product panels that stack as you scroll.",
  },
  {
    id: "kiln",
    name: "Kiln Editorial",
    heading: "DM Serif Display",
    body: "Outfit",
    palette: ["#F7F0E4", "#342437", "#B44E35", "#FFD3A8"],
    philosophy:
      "Warm and human, with the feeling of a considered editorial publication. Large serif statements replace decorative images.",
    layout:
      "Uneven editorial columns → numbered product index → a vertical narrative.",
    routes: "Home · Solutions · Contact",
    routeCount: 3,
    motion:
      "A geometric sunrise, shifting chapter numerals, and gentle text reveals.",
  },
  {
    id: "cobalt",
    name: "Cobalt Index",
    heading: "Bricolage Grotesque",
    body: "Inter",
    palette: ["#F7F8FB", "#1C2333", "#315DFF", "#FFC852"],
    philosophy:
      "Precise, functional, and easy to scan. An index, sharp grids, and expandable product groups keep the information compact.",
    layout:
      "Editorial index → modular system map → product accordions → company panel.",
    routes: "Home · Solutions · Company · Contact",
    routeCount: 4,
    motion:
      "A scroll-responsive connection strip, modular reveals, and expanding product rows.",
  },
  {
    id: "current",
    name: "Quiet Current",
    heading: "Fraunces",
    body: "DM Sans",
    palette: ["#F9F8F2", "#075E57", "#DDD9F7", "#E9EEE5"],
    philosophy:
      "Calm, minimal, and refined. Expressive serif typography and a single flowing line give the brand character with very little visual clutter.",
    layout:
      "Open, airy hero → unboxed solution rows → company story → rounded contact panel.",
    routes: "Home · Solutions · Contact",
    routeCount: 3,
    motion:
      "A continuous line draws with the scroll, followed by soft section transitions.",
  },
];

const groups = [
  {
    name: "Monitor",
    note: "Know your assets. From every inverter to your whole portfolio.",
    products: [
      ["ETi-SOL", "Cloud IoT SCADA"],
      ["ETi-EDGE", "Local SCADA"],
      ["ETi-LOG", "IoT datalogger"],
    ],
  },
  {
    name: "Control",
    note: "Coordinate plant output, zero export, and changing site loads.",
    products: [
      ["ETi-PPC", "Power plant controller"],
      ["ETi-ZES", "Zero export system"],
      ["ETi-LMS", "Load management and DG sync"],
    ],
  },
  {
    name: "Forecast",
    note: "Turn weather data into generation forecasts for better planning.",
    products: [["ETi-CAST", "Solar generation forecasting"]],
  },
];
const tabs = document.getElementById("direction-tabs");
const brief = document.getElementById("direction-brief");
const preview = document.getElementById("concept-preview");
const motionButton = document.getElementById("motion-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let active =
  directions.find(
    (direction) =>
      direction.id === new URLSearchParams(location.search).get("direction"),
  ) || directions[0];
let motionEnabled = !reducedMotion.matches;
let revealObserver;
let pendingFrame = false;

const paletteMarkup = (palette) =>
  palette.map((color) => `<i style="--swatch:${color}"></i>`).join("");
tabs.innerHTML = directions
  .map(
    (direction, index) =>
      `<button class="direction-tab" id="tab-${direction.id}" data-direction="${direction.id}" type="button" role="tab" aria-controls="concept-preview" aria-selected="false" tabindex="-1"><span class="tab-top"><span>0${index + 1}</span>${direction.recommended ? '<span class="tab-recommendation">RECOMMENDED</span>' : ""}</span><strong>${direction.name}</strong><span class="tab-palette" aria-hidden="true">${paletteMarkup(direction.palette)}</span></button>`,
  )
  .join("");

const eyeline = (text) => `<p class="eyeline">${text}</p>`;
const description = `<p class="site-description">Connected solar intelligence for PV plants and rooftops. Monitor your assets, understand performance, and act on the right alerts.</p>`;
const actions = `<div class="hero-actions"><a class="site-button" href="#contact">Request a demo <span aria-hidden="true">↗</span></a><a class="text-link" href="#solutions">Explore solutions <span aria-hidden="true">↘</span></a></div>`;
const stats = () =>
  `<div class="hero-stat-row reveal"><div><strong>3+ GW</strong><span>Solar portfolio</span></div><div><strong>700+</strong><span>Solar plants</span></div><div><strong>10+</strong><span>Countries</span></div></div>`;
const productList = (group) =>
  `<div class="product-group"><ul>${group.products.map(([name, label]) => `<li><strong>${name}</strong><span>${label}</span></li>`).join("")}</ul></div>`;
const productGroups = () =>
  `<div class="product-groups">${groups.map((group, index) => `<div class="product-group reveal"><div class="product-group-head"><h3>${group.name}</h3><span>0${index + 1}</span></div><ul>${group.products.map(([name, label]) => `<li><strong>${name}</strong><span>${label}</span></li>`).join("")}</ul></div>`).join("")}</div>`;
const sectionHeading = () =>
  `<div class="section-top reveal"><div>${eyeline("SEVEN CONNECTED PRODUCTS")}<h2>One portfolio.<br>Every part connected.</h2></div><p>Cloud or local monitoring, plant controls, and generation forecasting. Built to work together.</p></div>`;

function header(direction) {
  return `<header class="site-header site-wrap" id="site-top"><a class="wordmark" href="#site-top" aria-label="EnerMAN preview home">Ener<span>MAN</span></a><nav class="site-nav" aria-label="Preview navigation"><a href="#solutions">${direction.id === "nocturne" ? "Platform" : "Solutions"}</a><a href="#company">Company</a><a class="site-button" href="#contact">Let’s talk <span aria-hidden="true">↗</span></a></nav></header>`;
}

const signalDiagram = `<div class="signal-map" data-scene><svg viewBox="0 0 500 400" role="img" aria-label="A conceptual system diagram connecting plant equipment, EnerMAN intelligence, and alerts. This is a capability diagram, not live operational data."><path class="network-line" d="M80 100H180Q215 100 215 135V170M80 200H205M80 300H180Q215 300 215 265V235M295 200H390Q420 200 420 165V120M295 200H420V280" fill="none" stroke="currentColor" stroke-width="1.5"/><g fill="var(--surface)" stroke="var(--line)"><rect x="15" y="70" width="135" height="60" rx="12"/><rect x="15" y="170" width="135" height="60" rx="12"/><rect x="15" y="270" width="135" height="60" rx="12"/><rect x="355" y="90" width="130" height="60" rx="12"/><rect x="355" y="255" width="130" height="60" rx="12"/></g><g class="map-core"><rect x="200" y="150" width="100" height="100" rx="23" fill="var(--ink)"/><circle cx="250" cy="200" r="28" fill="none" stroke="var(--accent)" stroke-width="1.5"/><path d="M242 180L256 193L246 205L258 218" fill="none" stroke="var(--accent)" stroke-width="2"/></g><g class="map-label" text-anchor="middle" font-size="13"><text x="82" y="105">Inverters</text><text x="82" y="205">Meters</text><text x="82" y="305">Sensors</text><text x="420" y="125">Analytics</text><text x="420" y="290">Notifications</text></g><text x="250" y="280" class="map-label" text-anchor="middle" font-size="10" letter-spacing="2">ENERMAN</text></svg><div class="map-note"><span>FIELD → INTELLIGENCE → ACTION</span><span>SYSTEM DIAGRAM</span></div></div>`;
const nocturneDiagram = `<div class="nocturne-orbit" data-scene><svg viewBox="0 0 400 400" role="img" aria-label="A conceptual orbit representing monitoring, control, and forecasting around the EnerMAN platform"><circle cx="200" cy="200" r="154" fill="none" stroke="var(--line)"/><circle cx="200" cy="200" r="116" fill="none" stroke="var(--line)"/><circle class="orbit-progress" cx="200" cy="200" r="154" fill="none" stroke="var(--accent)" stroke-width="1.5" transform="rotate(-90 200 200)"/><g class="orbit-track"><circle cx="200" cy="46" r="8" fill="var(--accent)"/><circle cx="354" cy="200" r="5" fill="var(--accent)"/><circle cx="200" cy="354" r="6" fill="var(--accent)"/><circle cx="84" cy="200" r="5" fill="var(--accent)"/></g><rect x="153" y="153" width="94" height="94" rx="26" fill="var(--panel)" stroke="var(--accent)" stroke-width=".8"/><text x="200" y="211" text-anchor="middle" font-family="Syne,sans-serif" font-size="31" fill="var(--accent)">ETi</text></svg><p>MONITOR / CONTROL / FORECAST</p></div>`;
const currentDiagram = `<div class="current-curve" data-scene><svg viewBox="0 0 240 380" role="img" aria-label="A flowing connection between plant data, understanding, and action"><path d="M160 25C15 15 0 150 122 177C260 208 216 351 80 350" fill="none" stroke="var(--ink)" stroke-width="2"/><circle cx="160" cy="25" r="13" fill="var(--accent)" stroke="var(--ink)" stroke-width="1"/><circle cx="122" cy="177" r="20" fill="var(--surface)" stroke="var(--ink)" stroke-width="1"/><circle cx="80" cy="350" r="10" fill="var(--ink)"/><text x="122" y="182" text-anchor="middle" font-size="12" fill="var(--ink)" font-family="DM Sans,sans-serif">ETi</text></svg><p>CONNECTED, SIMPLY.</p></div>`;

function hero(direction) {
  if (direction.id === "signal")
    return `<section class="signal-hero site-wrap"><div>${eyeline("INTELLIGENCE FOR A CLEANER TOMORROW")}<h1>Monitor,<br>Analyze and<br><em>Notify.</em></h1>${description}${actions}</div>${signalDiagram}</section><div class="site-wrap">${stats()}</div>`;
  if (direction.id === "nocturne")
    return `<section class="nocturne-hero site-wrap"><div>${eyeline("YOUR SOLAR PORTFOLIO, CONNECTED")}<h1>Monitor,<br>Analyze and<br><span>Notify.</span></h1>${description}${actions.replace('class="site-button"', 'class="site-button accent"')}</div>${nocturneDiagram}</section><div class="site-wrap">${stats()}</div>`;
  if (direction.id === "kiln")
    return `<section class="kiln-hero site-wrap"><div>${eyeline("SOLAR INTELLIGENCE, BUILT IN INDIA")}<h1>Monitor,<br>Analyze and<br><span>Notify.</span></h1></div><div class="kiln-side"><div class="kiln-sun" data-scene aria-hidden="true"></div>${description}${actions}</div></section><div class="site-wrap">${stats()}</div>`;
  if (direction.id === "cobalt")
    return `<section class="cobalt-hero site-wrap"><aside class="cobalt-index" aria-label="Preview section index"><a href="#site-top"><span>01</span>Overview</a><a href="#solutions"><span>02</span>Solutions</a><a href="#company"><span>03</span>Company</a><a href="#contact"><span>04</span>Contact</a></aside><div><h1>Monitor,<br><span>Analyze</span><br>and Notify.</h1><p class="hero-title-note">Solar PV plants and rooftops.<br>One connected operating picture.</p>${actions}</div><div class="cobalt-side"><div class="index-module" data-scene aria-label="Conceptual process: acquire plant data, analyze it, then notify"><div><span>01</span>Acquire</div><div><span>02</span>Analyze</div><div><span>03</span>Notify</div></div>${description}</div></section><div class="site-wrap">${stats()}</div>`;
  return `<section class="current-hero site-wrap"><div>${eyeline("LESS NOISE. MORE UNDERSTANDING.")}<h1>Monitor,<br><span>Analyze</span><br>and Notify.</h1>${description}${actions}</div>${currentDiagram}</section><div class="site-wrap">${stats()}</div>`;
}

function solutions(direction) {
  if (direction.id === "nocturne")
    return `<section class="site-section site-wrap" id="solutions">${sectionHeading()}<div class="stack-panels">${groups.map((group, index) => `<article class="stack-panel" style="--stack-index:${index}"><div><span class="stack-number">0${index + 1} / THE CONNECTED PLATFORM</span><h3>${group.name}.</h3><p>${group.note}</p></div>${productList(group)}</article>`).join("")}</div><div class="motion-caption"><span>Keep scrolling: product chapters build on each other.</span><span>SCROLL / STACK</span></div></section>`;
  if (direction.id === "cobalt")
    return `<section class="site-section site-wrap" id="solutions">${sectionHeading()}<div class="solution-accordion">${groups.map((group, index) => `<details ${index === 0 ? "open" : ""}><summary><span>0${index + 1}</span><h3>${group.name}</h3><span aria-hidden="true">+</span></summary>${productList(group)}</details>`).join("")}</div></section>`;
  return `<section class="site-section solutions-section" id="solutions"><div class="site-wrap">${sectionHeading()}${productGroups()}</div></section>`;
}

const processSteps = [
  [
    "Acquire",
    "Connect plant equipment through ETi-LOG. Keep critical data available through network interruptions.",
  ],
  [
    "Understand",
    "Bring your assets into cloud or local SCADA. Use analytics and reports to understand performance.",
  ],
  [
    "Act",
    "Use alerts, plant controls, and generation forecasts to make better operational decisions.",
  ],
];

function story(direction) {
  if (direction.id === "signal")
    return `<section class="flow-story site-wrap" data-scene><div class="flow-sticky">${eyeline("FROM SIGNAL TO ACTION")}<h2>Not just data.<br>A clear next step.</h2><p>A complete path from field equipment to decisions, with every layer built in-house.</p><div class="flow-meter" aria-hidden="true"><span></span></div></div><div>${processSteps.map(([title, copy], index) => `<article class="flow-step reveal"><span>0${index + 1} /</span><h3>${title}.</h3><p>${copy}</p></article>`).join("")}</div></section>`;
  if (direction.id === "kiln")
    return `<section class="site-section site-wrap kiln-story"><div class="story-aside">${eyeline("A MORE CONSIDERED WAY TO OPERATE")}<h2>From a single<br>signal to a<br>smarter plant.</h2></div><div>${processSteps.map(([title, copy], index) => `<article class="editorial-step reveal" data-scene><span>0${index + 1}</span><div><h3>${title}.</h3><p>${copy}</p></div></article>`).join("")}</div></section>`;
  return "";
}

function company(direction) {
  return `<section class="site-section site-wrap" id="company"><div class="company-copy reveal"><div>${eyeline("BUILT HERE. CONNECTED EVERYWHERE.")}<h2>From concept<br>to commissioning.</h2></div><div><p>EnerMAN’s team builds hardware, firmware, cloud platforms, and mobile apps in-house in Bengaluru. The same engineering knowledge connects the field unit, the platform, and the people operating your plant.</p><div class="hero-actions"><a class="text-link" href="#contact">Meet the team <span aria-hidden="true">↗</span></a><a class="text-link" href="#contact">Talk about your plant <span aria-hidden="true">↗</span></a></div></div></div></section>`;
}

function contact(direction) {
  const wrap = direction.id === "signal" ? "" : "site-wrap";
  return `<section class="site-contact ${wrap}" id="contact"><div class="reveal">${eyeline("LET’S CONNECT")}<h2>Bring your plants<br>to one clear view.</h2></div><a class="site-button ${direction.id === "nocturne" ? "accent" : ""}" href="mailto:sales@enerman.in">sales@enerman.in <span aria-hidden="true">↗</span></a></section><footer class="site-footer site-wrap"><span>EnerMAN Technologies · Bengaluru, India</span><span>Hardware / Firmware / Cloud / Mobile</span><span>Design concept · 2026</span></footer>`;
}

function updateScenes() {
  pendingFrame = false;
  if (!motionEnabled) return;
  preview.querySelectorAll("[data-scene]").forEach((scene) => {
    const rect = scene.getBoundingClientRect();
    const progress = Math.max(
      0,
      Math.min(
        1,
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
      ),
    );
    scene.style.setProperty("--phase", progress.toFixed(4));
  });
}
function scheduleScenes() {
  if (!pendingFrame) {
    pendingFrame = true;
    requestAnimationFrame(updateScenes);
  }
}

function setMotion() {
  document.body.classList.toggle("motion-off", !motionEnabled);
  document.body.classList.toggle("motion-preview-on", motionEnabled);
  motionButton.setAttribute("aria-pressed", String(motionEnabled));
  motionButton.innerHTML = `${motionEnabled ? "Motion on" : "Motion off"} <span aria-hidden="true">${motionEnabled ? "◉" : "○"}</span>`;
  scheduleScenes();
}

function render(direction, updateURL = false) {
  active = direction;
  revealObserver?.disconnect();
  tabs.querySelectorAll("button").forEach((button) => {
    const selected = button.dataset.direction === direction.id;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  preview.setAttribute("aria-labelledby", `tab-${direction.id}`);
  brief.innerHTML = `<div><span class="brief-label">THE DESIGN IDEA</span><p>${direction.philosophy}</p><div class="brief-palette">${direction.palette.map((color) => `<span><i style="--swatch:${color}"></i>${color}</span>`).join("")}</div></div><div><span class="brief-label">TYPOGRAPHY & STRUCTURE</span><p>${direction.heading} + ${direction.body}</p><span class="brief-secondary">${direction.routeCount} main pages: ${direction.routes}.<br>${direction.layout}</span></div><div><span class="brief-label">SCROLL SIGNATURE</span><p>${direction.motion}</p><span class="brief-secondary">Reduced motion is supported. Product details stay together on the Solutions page.</span></div>`;
  preview.innerHTML = `<div class="site ${direction.id}">${header(direction)}${hero(direction)}${solutions(direction)}${story(direction)}${company(direction)}${contact(direction)}</div>`;
  revealObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  preview
    .querySelectorAll(".reveal")
    .forEach((element) => revealObserver.observe(element));
  scheduleScenes();
  document.fonts.ready.then(scheduleScenes);
  if (updateURL) {
    const url = new URL(location.href);
    url.searchParams.set("direction", direction.id);
    url.hash = "";
    history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-direction]");
  if (button)
    render(
      directions.find((direction) => direction.id === button.dataset.direction),
      true,
    );
});
tabs.addEventListener("keydown", (event) => {
  const index = directions.indexOf(active);
  let next;
  if (event.key === "ArrowRight") next = (index + 1) % directions.length;
  if (event.key === "ArrowLeft")
    next = (index - 1 + directions.length) % directions.length;
  if (event.key === "Home") next = 0;
  if (event.key === "End") next = directions.length - 1;
  if (next !== undefined) {
    event.preventDefault();
    render(directions[next], true);
    document.getElementById(`tab-${directions[next].id}`).focus();
  }
});
motionButton.addEventListener("click", () => {
  motionEnabled = !motionEnabled;
  setMotion();
});
reducedMotion.addEventListener("change", () => {
  motionEnabled = !reducedMotion.matches;
  setMotion();
});
window.addEventListener("scroll", scheduleScenes, { passive: true });
window.addEventListener("resize", scheduleScenes);
setMotion();
render(active);

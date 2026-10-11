import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowDown,
  ArrowUpRight,
  Bell,
  Cloud,
  Cpu,
  Gauge,
  Menu,
  Monitor,
  Radio,
  Sun,
  X,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import ContactForm from "../components/ContactForm";
import {
  appLinks,
  benefits,
  industries,
  mapUrl,
  metrics,
  phoneNumbers,
  products,
  social,
} from "../data/content";
import {
  destination,
  Insights,
  Metadata,
  SiteLink,
  SourceDisclosure,
  TextBlocks,
  useScrollDesign,
} from "../redesign/Site";
import archive from "../redesign/content.json";
import type { SourcePage } from "../data/types";

gsap.registerPlugin(ScrollTrigger);
const pages = archive as unknown as Record<string, SourcePage>;
const slug = (route: string) => route.replace(/^\/+|\/+$/g, "");
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
};
const mix = (a: number[], b: number[], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(", ");
const chapters = [
  [
    "01",
    "First light",
    "Every day begins with possibility.",
    "Scroll to bring a solar day to life.",
  ],
  [
    "02",
    "Solar ignition",
    "Light becomes energy.",
    "Sunlight reaches the panels. The field wakes up.",
  ],
  [
    "03",
    "Generation",
    "Energy becomes intelligence.",
    "Watch generation rise, then follow the data.",
  ],
  [
    "04",
    "Last light",
    "The sun sets. The insight stays.",
    "The day's results remain in your dashboards.",
  ],
];

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="s-label">
      <span className="s-dot" />
      {children}
    </p>
  );
}
function Action({
  href,
  children,
  subtle = false,
}: {
  href: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  return (
    <SiteLink href={href} className={subtle ? "s-link" : "s-button"}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </SiteLink>
  );
}
function Brand() {
  return (
    <Link className="s-brand" to="/" aria-label="EnerMAN home">
      <svg width="24" height="30" viewBox="0 0 24 30" aria-hidden="true">
        <path d="M10 0h14L13 11h9L4 30l5-15H0Z" fill="currentColor" />
      </svg>
      <span>
        Ener<strong>MAN</strong>
        <small>TECHNOLOGIES</small>
      </span>
    </Link>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [location.key]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  const links = [
    ["/system/", "System"],
    ["/#company", "Engineering"],
    ["/#insights", "Insights"],
  ];
  return (
    <header className="s-header">
      <div className="s-wrap s-header-inner">
        <Brand />
        <nav className="s-desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link
              to={href}
              key={href}
              aria-current={location.pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link to="/contact/" className="s-header-contact">
          Let's connect
          <ArrowUpRight size={15} />
        </Link>
        <button
          className="s-menu-toggle"
          ref={toggle}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="s-mobile-nav"
          aria-label="Mobile navigation"
        >
          {[["/", "Home"], ...links, ["/contact/", "Contact"]].map(
            ([href, label], i) => (
              <Link to={href} key={href}>
                <span>0{i + 1}</span>
                {label}
                <ArrowUpRight />
              </Link>
            ),
          )}
        </nav>
      )}
    </header>
  );
}

function SolarDay() {
  const root = useRef<HTMLElement>(null);
  const [chapter, setChapter] = useState(0);
  useLayoutEffect(() => {
    const section = root.current!;
    const site = section.closest<HTMLElement>(".solar")!;
    const sun = section.querySelector<SVGGElement>(".solar-sun")!;
    const rays = section.querySelector<SVGPathElement>(".solar-rays")!;
    const reflection =
      section.querySelector<SVGEllipseElement>(".solar-reflection")!;
    const readout = section.querySelector<HTMLElement>("[data-power]")!;
    const clock = section.querySelector<HTMLElement>("[data-clock]")!;
    const trace = section.querySelector<SVGPathElement>(".solar-trace")!;
    let currentChapter = -1;
    const update = (p: number) => {
      const x = 80 + 960 * p;
      const y = 363 - 302 * Math.sin(Math.PI * p);
      const daylight = clamp((325 - y) / 264);
      const dark = smooth((p - 0.14) / 0.2);
      const generation = Math.round(840 * daylight * smooth((p - 0.18) / 0.15));
      const stage = p < 0.18 ? 0 : p < 0.36 ? 1 : p < 0.81 ? 2 : 3;
      site.style.setProperty(
        "--bg",
        `rgb(${mix([245, 241, 232], [8, 16, 31], dark)})`,
      );
      site.style.setProperty(
        "--ink",
        `rgb(${mix([30, 39, 49], [237, 243, 252], dark)})`,
      );
      site.style.setProperty(
        "--muted",
        `rgb(${mix([97, 104, 111], [158, 179, 198], dark)})`,
      );
      site.style.setProperty(
        "--line",
        `rgba(${mix([30, 39, 49], [164, 192, 219], dark)}, .19)`,
      );
      site.style.setProperty(
        "--nav-bg",
        `rgba(${mix([245, 241, 232], [8, 16, 31], dark)}, .86)`,
      );
      site.style.setProperty(
        "--accent",
        `rgb(${mix([155, 83, 22], [88, 226, 243], dark)})`,
      );
      section.style.setProperty("--night", String(dark));
      section.style.setProperty("--light", String(daylight));
      section.style.setProperty("--day", String(p));
      section.style.setProperty("--sun-x", `${x / 11.2}%`);
      section.style.setProperty("--sun-y", `${y / 6}%`);
      section.dataset.sunProgress = p.toFixed(3);
      section.dataset.generation = String(generation);
      sun.setAttribute(
        "transform",
        `translate(${x.toFixed(2)} ${y.toFixed(2)})`,
      );
      rays.setAttribute(
        "d",
        `M${x - 15},${y + 23} L310,357 L825,460 L${x + 15},${y + 23}Z`,
      );
      reflection.setAttribute("cx", String(370 + 360 * p));
      reflection.style.opacity = String(daylight * 0.5);
      readout.textContent = generation.toLocaleString("en-IN");
      const hour = 6 + p * 12;
      clock.textContent = `${Math.floor(hour).toString().padStart(2, "0")}:${Math.floor(
        (hour % 1) * 60,
      )
        .toString()
        .padStart(2, "0")}`;
      trace.style.strokeDashoffset = String(1 - smooth((p - 0.22) / 0.65));
      if (stage !== currentChapter) {
        currentChapter = stage;
        setChapter(stage);
      }
    };
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => update(self.progress),
    });
    update(trigger.progress);
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) {
        ScrollTrigger.refresh();
        update(trigger.progress);
      }
    });
    return () => {
      cancelled = true;
      trigger.kill();
    };
  }, []);
  const cells = Array.from({ length: 30 }, (_, i) => {
    const row = Math.floor(i / 6),
      col = i % 6;
    const x = 310 + col * 62 + row * 38,
      y = 354 - col * 11 + row * 34;
    return (
      <g
        key={i}
        className="solar-panel"
        style={{ "--cell-delay": `${i * 0.07}s` } as React.CSSProperties}
      >
        <path
          d={`M${x},${y + 7} l59,-10 34,29 -59,11Z`}
          fill="#10212E"
          stroke="#2E4858"
        />
        <path className="solar-cell" d={`M${x},${y} l59,-10 34,29 -59,11Z`} />
        <path
          d={`M${x + 15},${y - 2.5} l34,29 M${x + 30},${y - 5} l34,29 M${x + 45},${y - 7.5} l34,29 M${x + 11},${y + 10} l59,-10 M${x + 23},${y + 20} l59,-10`}
          fill="none"
          stroke="#74BACA"
          strokeOpacity=".2"
          strokeWidth=".6"
        />
      </g>
    );
  });
  return (
    <section
      className="solar-day"
      ref={root}
      data-scene
      data-sun-progress="0"
      data-generation="0"
      aria-label="A solar day controlled by scrolling"
    >
      <div className="solar-sticky">
        <div className="s-wrap solar-heading">
          <div>
            <Label>ENGINEERED FOR THE ENERGY AHEAD</Label>
            <h1>
              Monitor. Analyze.
              <br />
              <span>Notify.</span>
            </h1>
          </div>
          <div className="solar-introduction">
            <p>
              From the first ray
              <br />
              to the last reading.
            </p>
            <span>
              Solar monitoring, controls and forecasting.
              <br />
              Connected by EnerMAN.
            </span>
            <Action href="/system/" subtle>
              Explore the system
            </Action>
          </div>
        </div>
        <div className="solar-scene">
          <div className="solar-grain" />
          <div className="solar-stars" />
          <div className="solar-coordinate solar-coordinate-left">
            SOLAR FIELD / 01
            <br />
            <span>FROM LIGHT TO INSIGHT</span>
          </div>
          <div className="solar-coordinate solar-coordinate-right">
            <Sun size={13} />
            <span data-clock>06:00</span> / SOLAR DAY
          </div>
          <svg
            className="solar-world"
            viewBox="0 0 1120 600"
            role="img"
            aria-label="Sun rises from the left, lights solar panels, and sets on the right as you scroll"
          >
            <defs>
              <radialGradient id="sun-glow">
                <stop stopColor="#FFCC7D" stopOpacity=".48" />
                <stop offset="1" stopColor="#FFB44A" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="sun-disc">
                <stop stopColor="#FFF4C9" />
                <stop offset=".7" stopColor="#FFC56B" />
                <stop offset="1" stopColor="#FF9E3A" />
              </radialGradient>
              <linearGradient id="light-beam" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFC679" stopOpacity=".16" />
                <stop offset="1" stopColor="#FFD694" stopOpacity=".025" />
              </linearGradient>
              <radialGradient id="ground-glow">
                <stop stopColor="#58E2F3" stopOpacity=".25" />
                <stop offset="1" stopColor="#58E2F3" stopOpacity="0" />
              </radialGradient>
              <clipPath id="solar-sky">
                <rect x="-200" y="-200" width="1520" height="525" />
              </clipPath>
              <clipPath id="solar-ground">
                <rect y="325" width="1120" height="275" />
              </clipPath>
            </defs>
            <g
              className="solar-grid"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
            >
              <path d="M0 325H1120 M0 370H1120 M0 433H1120 M0 525H1120" />
              {[0, 160, 320, 480, 640, 800, 960, 1120].map((x, i) => (
                <path key={i} d={`M560 325 L${x} 600`} />
              ))}
            </g>
            <path
              className="solar-orbit"
              d="M80 363 Q560 -240 1040 363"
              fill="none"
              stroke="currentColor"
              strokeDasharray="2 8"
            />
            <g clipPath="url(#solar-sky)">
              <g className="solar-sun" transform="translate(80 363)">
                <circle r="116" fill="url(#sun-glow)" />
                <circle r="39" fill="url(#sun-disc)" />
                <circle
                  r="46"
                  fill="none"
                  stroke="#FFCF8E"
                  strokeOpacity=".25"
                />
                <circle
                  r="53"
                  fill="none"
                  stroke="#FFCF8E"
                  strokeOpacity=".12"
                />
              </g>
            </g>
            <path
              className="solar-horizon"
              d="M0 325H1120"
              fill="none"
              stroke="currentColor"
            />
            <path
              className="solar-rays"
              d="M65 386L310 357L825 460L95 386Z"
              fill="url(#light-beam)"
            />
            <g clipPath="url(#solar-ground)">
              <ellipse
                className="solar-reflection"
                cx="370"
                cy="436"
                rx="290"
                ry="95"
                fill="url(#ground-glow)"
              />
            </g>
            <g className="solar-array">{cells}</g>
            <g className="solar-field-label" fill="currentColor">
              <path
                d="M812 385H920V420"
                fill="none"
                stroke="currentColor"
                strokeWidth=".6"
              />
              <circle cx="812" cy="385" r="3" />
              <text x="930" y="423">
                PHOTOVOLTAIC ARRAY
              </text>
              <text x="930" y="441" opacity=".5">
                LIGHT → GENERATION
              </text>
            </g>
            <g className="solar-direction" fill="currentColor">
              <text x="45" y="355">
                RISE / EAST
              </text>
              <text x="979" y="355">
                SET / WEST
              </text>
            </g>
          </svg>
          <div className="solar-chapter" key={chapter}>
            <span className="s-mono">
              {chapters[chapter][0]} / {chapters[chapter][1]}
            </span>
            <h2>{chapters[chapter][2]}</h2>
            <p>{chapters[chapter][3]}</p>
          </div>
        </div>
        <div className="s-wrap solar-instruments">
          <div className="solar-output">
            <span className="s-mono">
              <Zap size={12} /> GENERATION
            </span>
            <p>
              <strong data-power>0</strong>
              <span>kW</span>
            </p>
          </div>
          <div className="solar-chart">
            <div className="solar-chart-label s-mono">
              <span>THE DAY, CAPTURED</span>
              <span>ILLUSTRATIVE · NOT LIVE</span>
            </div>
            <svg
              viewBox="0 0 380 65"
              aria-label="Illustrative generation rises at midday and returns to zero at sunset"
            >
              <path
                d="M0 58H380 M95 4V58 M190 4V58 M285 4V58"
                className="chart-grid"
              />
              <path
                d="M0 58C40 58 56 47 78 33S143 2 190 3S285 34 309 47S351 58 380 58"
                className="chart-ghost"
              />
              <path
                d="M0 58C40 58 56 47 78 33S143 2 190 3S285 34 309 47S351 58 380 58"
                className="solar-trace"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
              <text x="0" y="65">
                06:00
              </text>
              <text x="178" y="65">
                12:00
              </text>
              <text x="354" y="65">
                18:00
              </text>
            </svg>
          </div>
          <div className="solar-scroll">
            <span className="s-mono">SCROLL TO FOLLOW THE SUN</span>
            <ArrowDown size={19} />
            <div className="solar-progress">
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const modes = ["Monitor", "Analyze", "Notify"] as const;
function Intelligence() {
  const [mode, setMode] = useState<(typeof modes)[number]>("Monitor");
  const active = modes.indexOf(mode);
  const copy = [
    [
      "The whole field. In your view.",
      "See connected equipment and plant generation together. ETi-SOL and ETi-EDGE are your cloud and local dashboards for monitoring and results.",
    ],
    [
      "Find the story in the signal.",
      "Compare inverter performance, explore generation reports and understand downtime losses. Move from plant data to informed decisions.",
    ],
    [
      "Attention, where it matters.",
      "Track plant alerts, review events and bring issues to your team's attention. Give operators a clear place to start.",
    ],
  ];
  return (
    <section className="s-intelligence s-wrap s-section" id="intelligence">
      <div className="s-section-top reveal">
        <Label>01 / THE INTELLIGENCE LAYER</Label>
        <h2>
          After the sunlight.
          <br />
          <span>Clarity.</span>
        </h2>
        <p>
          Every signal has a destination.
          <br />
          Every reading has a reason.
        </p>
      </div>
      <div className="s-intelligence-body">
        <div className="s-dashboard" data-mode={mode}>
          <div className="s-dashboard-top">
            <span className="s-mono">
              <span className="s-dot" /> SOLAR OPERATIONS
            </span>
            <span className="s-mono">ILLUSTRATIVE VIEW</span>
          </div>
          <div className="s-flow">
            <div>
              <Radio size={18} />
              <strong>FIELD</strong>
              <span>Plant equipment</span>
            </div>
            <span className="s-flow-line" />
            <div>
              <Cpu size={18} />
              <strong>ETi-LOG</strong>
              <span>Collects plant data</span>
            </div>
            <span className="s-flow-line" />
            <div className="s-flow-dashboards">
              <span>
                <Cloud size={15} /> ETi-SOL
              </span>
              <span>
                <Monitor size={15} /> ETi-EDGE
              </span>
              <small>Monitor & see results</small>
            </div>
          </div>
          <div className="s-dashboard-screen">
            <div className="s-screen-heading">
              <span>
                {mode === "Monitor"
                  ? "Generation overview"
                  : mode === "Analyze"
                    ? "Performance intelligence"
                    : "Plant events"}
              </span>
              <span className="s-screen-tag">
                {mode === "Notify" ? "EVENT LOG" : "DAY'S RESULTS"}
              </span>
            </div>
            {mode === "Notify" ? (
              <div className="s-events">
                {[
                  ["08:42", "Inverter communication", "Review connection"],
                  ["12:18", "Generation deviation", "Review performance"],
                  ["17:54", "Daily generation report", "Ready to review"],
                ].map(([time, title, status], i) => (
                  <div key={title}>
                    <Bell size={14} />
                    <time>{time}</time>
                    <strong>{title}</strong>
                    <span className={i === 2 ? "complete" : ""}>{status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="s-screen-values">
                  <div>
                    <span>
                      {mode === "Analyze"
                        ? "Performance ratio"
                        : "Day's generation"}
                    </span>
                    <strong>
                      {mode === "Analyze" ? "82.4" : "4.28"}
                      <small>{mode === "Analyze" ? "%" : "MWh"}</small>
                    </strong>
                  </div>
                  <div>
                    <span>
                      {mode === "Analyze"
                        ? "Inverter comparison"
                        : "Midday peak"}
                    </span>
                    <strong>
                      {mode === "Analyze" ? "12" : "840"}
                      <small>{mode === "Analyze" ? "units" : "kW"}</small>
                    </strong>
                  </div>
                </div>
                <svg
                  className="s-screen-chart"
                  viewBox="0 0 500 140"
                  aria-label="Illustrative daily solar generation chart"
                >
                  <defs>
                    <linearGradient
                      id="dashboard-area"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop stopColor="#58E2F3" stopOpacity=".2" />
                      <stop offset="1" stopColor="#58E2F3" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    className="chart-grid"
                    d="M0 25H500M0 60H500M0 95H500M0 130H500M125 0V130M250 0V130M375 0V130"
                  />
                  <path
                    d="M0 130C60 130 85 75 125 50S200 8 250 10S325 45 375 75S445 130 500 130V140H0Z"
                    fill="url(#dashboard-area)"
                  />
                  <path
                    className="s-drawing-line"
                    d="M0 130C60 130 85 75 125 50S200 8 250 10S325 45 375 75S445 130 500 130"
                    pathLength="1"
                  />
                  {mode === "Analyze" && (
                    <path
                      d="M0 130C60 130 85 90 125 75S200 32 250 38S325 57 375 94S445 130 500 130"
                      className="s-comparison-line"
                    />
                  )}
                </svg>
                <div className="s-chart-times s-mono">
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                </div>
              </>
            )}
          </div>
          <div className="s-dashboard-bottom s-mono">
            <span>
              <span className="s-dot" /> FIELD → LOGGER → DASHBOARDS
            </span>
            <span>DATA CONNECTION</span>
          </div>
        </div>
        <div className="s-intelligence-copy">
          <div className="s-tabs" role="tablist" aria-label="Intelligence view">
            {modes.map((item, i) => (
              <button
                key={item}
                id={`view-${item.toLowerCase()}`}
                role="tab"
                aria-selected={mode === item}
                aria-controls="intelligence-panel"
                tabIndex={mode === item ? 0 : -1}
                onClick={() => setMode(item)}
                onKeyDown={(e) => {
                  if (
                    ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                  ) {
                    e.preventDefault();
                    const next =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 2
                          : (active + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                    setMode(modes[next]);
                    document
                      .getElementById(`view-${modes[next].toLowerCase()}`)
                      ?.focus();
                  }
                }}
              >
                <span>0{i + 1}</span>
                {item}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id="intelligence-panel"
            aria-labelledby={`view-${mode.toLowerCase()}`}
            className="s-tab-copy"
          >
            <span className="s-mono">CONNECTED SOLAR INTELLIGENCE</span>
            <h3>{copy[active][0]}</h3>
            <p>{copy[active][1]}</p>
            <Action
              href={mode === "Notify" ? "/system/#eti-sol" : "/system/"}
              subtle
            >
              Discover the technology
            </Action>
          </div>
          <div className="s-intelligence-note">
            <span>01 → 02 → 03</span>
            <p>
              From field data to results.
              <br />
              Cloud or local. Your choice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
function Ecosystem() {
  const [selected, setSelected] = useState(0);
  const product = products[selected];
  return (
    <section className="s-ecosystem s-section" id="ecosystem">
      <div className="s-wrap">
        <div className="s-section-top reveal">
          <Label>02 / ONE CONNECTED ECOSYSTEM</Label>
          <h2>
            Built to connect.
            <br />
            <span>Made to work together.</span>
          </h2>
          <Action href="/system/" subtle>
            Explore all products
          </Action>
        </div>
        <div className="s-product-explorer">
          <div className="s-product-index" aria-label="Choose a product">
            {products.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setSelected(i)}
                aria-pressed={i === selected}
              >
                <span className="s-mono">0{i + 1}</span>
                <strong>{p.name}</strong>
                <small>{p.category}</small>
                <ArrowUpRight size={17} />
              </button>
            ))}
          </div>
          <article className="s-product-focus" key={product.name}>
            <div className="s-product-object" aria-hidden="true">
              <div className="s-object-orbit" />
              <div className="s-object-orbit s-object-orbit-two" />
              <div className="s-device">
                <div className="s-device-top">
                  <span>EnerMAN</span>
                  <span className="s-dot" />
                </div>
                {product.category === "Monitor" ? (
                  <Monitor size={48} strokeWidth={0.8} />
                ) : product.category === "Control" ? (
                  <Gauge size={48} strokeWidth={0.8} />
                ) : (
                  <Sun size={48} strokeWidth={0.8} />
                )}
                <strong>{product.name}</strong>
                <span className="s-mono">CONNECTED SOLAR INTELLIGENCE</span>
                <div className="s-device-ports">
                  {Array.from({ length: 8 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
              </div>
              <span className="s-object-label s-mono">
                {product.category.toUpperCase()} / 0{selected + 1}
              </span>
            </div>
            <div className="s-product-description">
              <span className="s-mono">{product.label}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <Action href={product.route} subtle>
                Explore {product.name}
              </Action>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
function Engineering() {
  return (
    <section className="s-engineering s-wrap s-section" id="company">
      <div className="s-section-top reveal">
        <Label>03 / ENGINEERED IN BENGALURU</Label>
        <h2>
          One team.
          <br />
          <span>Every layer.</span>
        </h2>
        <p>
          Hardware, firmware, cloud platforms and mobile apps. Developed
          in-house, from concept to commissioning.
        </p>
      </div>
      <div className="s-metrics">
        {metrics.map((m) => (
          <div key={m.label} className="reveal">
            <strong>
              {m.value}
              <span>{m.suffix}</span>
            </strong>
            <p>{m.label}</p>
          </div>
        ))}
      </div>
      <div className="s-engineering-grid">
        {[
          [
            Cpu,
            "Embedded system development",
            "PCB design, firmware programming and real-time hardware testing.",
          ],
          [
            Monitor,
            "SCADA and HMI design labs",
            "Real-time monitoring interfaces, simulation setups and redundancy testing.",
          ],
          [
            Cloud,
            "Cloud and mobile apps",
            "API development, cloud dashboards and mobile app integration.",
          ],
        ].map(([Icon, title, copy], i) => {
          const I = Icon as typeof Cpu;
          return (
            <article className="reveal" key={String(title)}>
              <span className="s-mono">
                0{i + 1} / <I size={18} />
              </span>
              <h3>{String(title)}</h3>
              <p>{String(copy)}</p>
            </article>
          );
        })}
      </div>
      <div className="s-company-records">
        <SourceDisclosure
          route="/about-us/"
          id="leadership"
          label="Our story, vision & leadership"
        />
        <SourceDisclosure route="/team/" id="team" label="Meet the team" />
        <SourceDisclosure
          route="/awards/"
          id="awards"
          label="Awards & recognition"
        />
        <SourceDisclosure
          route="/news-updates/"
          id="news"
          label="News & updates"
        />
      </div>
    </section>
  );
}
function Connect() {
  return (
    <section className="s-connect s-wrap">
      <div className="s-connect-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
        <Zap size={42} strokeWidth={1} />
      </div>
      <div>
        <Label>YOUR NEXT CHAPTER</Label>
        <h2>
          Let's bring your
          <br />
          <span>solar data to life.</span>
        </h2>
      </div>
      <Action href="/contact/">Start a conversation</Action>
    </section>
  );
}
function Home() {
  return (
    <>
      <SolarDay />
      <Intelligence />
      <Ecosystem />
      <Engineering />
      <div className="s-insights-shell">
        <Insights />
      </div>
      <section className="s-industries s-wrap s-section">
        <div className="s-section-top reveal">
          <Label>05 / BUILT FOR YOUR OPERATION</Label>
          <h2>
            A clearer view.
            <br />
            <span>At every scale.</span>
          </h2>
        </div>
        <div className="s-industries-grid">
          {industries.map(([title, copy, href], i) => (
            <SiteLink key={title} href={href} className="s-industry">
              <span className="s-mono">
                0{i + 1}
                <ArrowUpRight size={19} />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </SiteLink>
          ))}
        </div>
      </section>
      <Connect />
    </>
  );
}
function PageIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="s-page-intro s-wrap">
      <Label>{label}</Label>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );
}
function System() {
  const [filter, setFilter] = useState("All");
  const location = useLocation();
  useEffect(() => {
    if (location.hash) setFilter("All");
  }, [location.hash]);
  return (
    <>
      <PageIntro
        label="THE ETi ECOSYSTEM"
        title={
          <>
            The technology
            <br />
            <span>behind the signal.</span>
          </>
        }
      >
        Seven connected products. Monitor your assets, control your plant and
        forecast generation, with hardware and software engineered together.
      </PageIntro>
      <section className="s-catalog s-wrap">
        <div className="s-filters" aria-label="Filter solutions">
          {["All", "Monitor", "Control", "Forecast"].map((name) => (
            <button
              key={name}
              onClick={() => setFilter(name)}
              aria-pressed={filter === name}
            >
              {name}
              <span>
                {name === "All"
                  ? 7
                  : products.filter((p) => p.category === name).length}
              </span>
            </button>
          ))}
        </div>
        {["Monitor", "Control", "Forecast"]
          .filter((c) => filter === "All" || filter === c)
          .map((name, i) => (
            <div className="s-catalog-group" key={name}>
              <div className="s-catalog-category">
                <span className="s-mono">0{i + 1} /</span>
                <h2>{name}</h2>
                <p>
                  {name === "Monitor"
                    ? "Understand every signal."
                    : name === "Control"
                      ? "Respond with precision."
                      : "Plan the energy ahead."}
                </p>
              </div>
              <div>
                {products
                  .filter((p) => p.category === name)
                  .map((p) => (
                    <details
                      className="product-detail"
                      key={p.name}
                      id={slug(p.route)}
                    >
                      <summary>
                        <span className="s-mono">{p.label}</span>
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                        <span className="disclosure-plus" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <div className="s-specifications">
                        <TextBlocks blocks={pages[p.route].blocks} />
                        <Action
                          href={`/contact/?product=${encodeURIComponent(p.name)}#enquiry`}
                        >
                          Request the {p.name} datasheet
                        </Action>
                      </div>
                    </details>
                  ))}
              </div>
            </div>
          ))}
      </section>
      <section className="s-wrap s-section">
        <div className="s-section-top">
          <Label>MORE FROM YOUR DATA</Label>
          <h2>
            Made for
            <br />
            <span>better decisions.</span>
          </h2>
        </div>
        <div className="s-benefits">
          {benefits.map(([title, copy], i) => (
            <article key={title}>
              <span className="s-mono">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <SourceDisclosure
          route="/"
          id="platform-capabilities"
          label="Platform capabilities & common questions"
        />
        <SourceDisclosure
          route="/products/"
          id="product-family"
          label="How the ETi family works together"
        />
      </section>
      <Connect />
    </>
  );
}
function Contact() {
  const location = useLocation();
  const requested = new URLSearchParams(location.search).get("product");
  const product = products.find((p) => p.name === requested)?.name;
  return (
    <>
      <PageIntro
        label="LET'S CONNECT"
        title={
          <>
            Good energy.
            <br />
            <span>Great conversations.</span>
          </>
        }
      >
        Tell us about your plant, portfolio or project. Let's find the right
        combination of monitoring, controls and forecasting.
      </PageIntro>
      <section className="s-contact-layout s-wrap">
        <div className="s-contact-info">
          <span className="s-mono">DIRECT CONNECTION</span>
          <a className="s-contact-email" href="mailto:sales@enerman.in">
            sales@enerman.in
            <ArrowUpRight size={22} />
          </a>
          <div>
            <h2>Visit Bengaluru</h2>
            <p>
              EnerMAN Technologies Pvt Ltd
              <br />
              No. 12 & 13, Daystar Center, 10th Cross,
              <br />
              Pampa Extension, Kempapura, Hebbal,
              <br />
              Bengaluru, Karnataka – 560024, India.
            </p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
              className="s-link"
            >
              Open in Google Maps
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div>
            <h2>Call our team</h2>
            {phoneNumbers.map((phone) => (
              <a key={phone} href={"tel:" + phone.replace(/\s/g, "")}>
                {phone}
              </a>
            ))}
          </div>
          <div>
            <h2>Support & enquiries</h2>
            <a href="mailto:support@enerman.in">support@enerman.in</a>
            <a href="mailto:info@enerman.in">info@enerman.in</a>
          </div>
        </div>
        <div id="enquiry" className="s-enquiry">
          <ContactForm
            key={product || "demo"}
            demo={!product}
            product={product}
          />
        </div>
      </section>
      <section className="s-wrap s-contact-records">
        <SourceDisclosure
          route="/contact/"
          id="contact-details"
          label="All contact details"
        />
        <SourceDisclosure
          route="/inquiry-form/"
          id="demo-details"
          label="Demo & technical proposal enquiries"
        />
      </section>
    </>
  );
}
function Legal() {
  return (
    <>
      <PageIntro
        label="TERMS & CONDITIONS"
        title={
          <>
            Clear terms.
            <br />
            <span>Open connection.</span>
          </>
        }
      >
        The terms and conditions for using EnerMAN's website and services.
      </PageIntro>
      <section className="s-wrap s-legal">
        <TextBlocks blocks={pages["/terms-and-conditions/"].blocks} />
      </section>
    </>
  );
}
function Legacy() {
  const l = useLocation();
  const target = destination(l.pathname + l.hash);
  if (target !== l.pathname + l.hash) return <Navigate to={target} replace />;
  return (
    <>
      <PageIntro label="404 / SIGNAL NOT FOUND" title="Let’s reconnect.">
        This page is unavailable. Explore the system or connect with our team.
      </PageIntro>
      <div className="s-wrap s-not-found">
        <Action href="/">Back to home</Action>
      </div>
    </>
  );
}
function Footer() {
  return (
    <footer className="s-footer s-wrap">
      <div className="s-footer-top">
        <Brand />
        <p>
          From field.
          <br />
          To future.
        </p>
        <div>
          <Link to="/system/">System</Link>
          <Link to="/#company">Engineering</Link>
          <Link to="/#insights">Insights</Link>
          <Link to="/contact/">Contact</Link>
        </div>
        <div>
          <a
            href="https://www.eaglesunscada.com/#/login"
            target="_blank"
            rel="noreferrer"
          >
            Customer login
            <ArrowUpRight size={13} />
          </a>
          {appLinks.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {label}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      </div>
      <div className="s-footer-social">
        {social
          .filter(([name]) => name !== "WhatsApp")
          .map(([name, href]) => (
            <a key={name} href={href} target="_blank" rel="noreferrer">
              {name}
              <ArrowUpRight size={12} />
            </a>
          ))}
      </div>
      <div className="s-footer-bottom s-mono">
        <span>© {new Date().getFullYear()} EnerMAN Technologies Pvt Ltd</span>
        <span>
          <span className="s-dot" /> ENERGY. UNDERSTOOD.
        </span>
        <Link to="/legal/">Terms & conditions</Link>
      </div>
    </footer>
  );
}

export default function Solar() {
  useScrollDesign();
  const location = useLocation();
  const site = useRef<HTMLDivElement>(null);
  const home = location.pathname === "/";
  useLayoutEffect(() => {
    if (!home) {
      ["--bg", "--ink", "--muted", "--line", "--nav-bg", "--accent"].forEach(
        (p) => site.current?.style.removeProperty(p),
      );
    }
  }, [home]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const tick = (time: number) => lenis?.raf(time * 1000);
    const setup = () => {
      if (query.matches) {
        gsap.ticker.remove(tick);
        lenis?.destroy();
        lenis = undefined;
      } else if (!lenis) {
        lenis = new Lenis({
          duration: 0.85,
          smoothWheel: true,
          anchors: false,
        });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
      }
    };
    setup();
    query.addEventListener("change", setup);
    return () => {
      query.removeEventListener("change", setup);
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, [location.pathname]);
  return (
    <div
      ref={site}
      className={`site solar ${home ? "solar-home" : ""}`}
      data-design="Solar Ignition"
    >
      <Metadata />
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/system/" element={<System />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/legal/" element={<Legal />} />
          <Route path="*" element={<Legacy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

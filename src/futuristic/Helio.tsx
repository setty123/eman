import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Bell,
  Cloud,
  Cpu,
  Gauge,
  Menu,
  Radio,
  ShieldCheck,
  Waves,
  X,
} from "lucide-react";
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

const pages = archive as unknown as Record<string, SourcePage>;
const slug = (route: string) => route.replace(/^\/+|\/+$/g, "");
type View = "Monitor" | "Analyze" | "Notify";
const views: View[] = ["Monitor", "Analyze", "Notify"];
const viewCopy = {
  Monitor: [
    "A complete field of view.",
    "See connected equipment and plant generation in one place.",
  ],
  Analyze: [
    "Turn signals into understanding.",
    "Compare generation, spot deviations and understand performance.",
  ],
  Notify: [
    "Know when attention is needed.",
    "Bring relevant plant events into view so your team can respond.",
  ],
};

function Tag({ children }: { children: ReactNode }) {
  return (
    <p className="h-tag">
      <span />
      {children}
    </p>
  );
}
function Action({
  children,
  href,
  secondary = false,
}: {
  children: ReactNode;
  href: string;
  secondary?: boolean;
}) {
  return (
    <SiteLink
      href={href}
      className={secondary ? "h-action secondary" : "h-action"}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </SiteLink>
  );
}
function Mark() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <path
        d="M7 4h19l-4 6H11l-3 4h12l-4 6H5l-4 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path d="M7 26h15" stroke="currentColor" strokeWidth="3.2" />
    </svg>
  );
}
function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [location.key]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const links = [
    ["System", "/system/"],
    ["Engineering", "/#company"],
    ["Insights", "/#insights"],
  ];
  return (
    <header className="h-header">
      <div className="h-nav-shell">
        <Link className="h-logo" to="/" aria-label="EnerMAN home">
          <Mark />
          <span>
            Ener<span>MAN</span>
          </span>
        </Link>
        <nav className="h-desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link
              key={label}
              to={href}
              aria-current={location.pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link to="/contact/" className="h-nav-contact">
          Let's connect <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <button
          ref={toggle}
          className="h-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="h-mobile-nav"
          aria-label="Mobile navigation"
        >
          {[...links, ["Contact", "/contact/"]].map(([label, href], i) => (
            <Link key={label} to={href}>
              <span>0{i + 1}</span>
              {label}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function Field({ view }: { view: View }) {
  const id = useId().replace(/:/g, "");
  const plots = Array.from({ length: 36 }, (_, i) => ({
    x: 405 + ((i % 6) - Math.floor(i / 6)) * 48,
    y: 138 + ((i % 6) + Math.floor(i / 6)) * 24,
    i,
  }));
  return (
    <svg
      className={"h-field view-" + view.toLowerCase()}
      viewBox="0 0 800 520"
      role="img"
      aria-label="Illustrative isometric solar field connected to an edge gateway and cloud platform"
    >
      <defs>
        <linearGradient id={id + "panel"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#2c5548" />
          <stop offset="1" stopColor="#102b26" />
        </linearGradient>
        <radialGradient id={id + "glow"}>
          <stop stopColor="#62eeb9" stopOpacity=".17" />
          <stop offset="1" stopColor="#62eeb9" stopOpacity="0" />
        </radialGradient>
        <pattern
          id={id + "grid"}
          width="48"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 12 24 0 48 12 24 24Z"
            fill="none"
            stroke="#b5ded4"
            strokeOpacity=".09"
            strokeWidth=".7"
          />
        </pattern>
      </defs>
      <ellipse
        cx="405"
        cy="300"
        rx="325"
        ry="205"
        fill={"url(#" + id + "glow)"}
      />
      <path
        d="M30 280 410 90 780 280 410 480Z"
        fill={"url(#" + id + "grid)"}
        stroke="#a4d7c4"
        strokeOpacity=".12"
      />
      <g className="h-panel-field">
        {plots.map(({ x, y, i }) => (
          <g
            key={i}
            className={
              "h-solar-tile " + (i === 14 && view === "Notify" ? "fault" : "")
            }
            style={{ "--tile": i } as CSSProperties}
          >
            <path
              d={"M" + x + " " + (y + 8) + "l42 21 -42 21 -42 -21Z"}
              fill="#050b0b"
              opacity=".7"
            />
            <path
              d={"M" + x + " " + y + "l42 21v7l-42 21 -42 -21v-7Z"}
              fill="#122a23"
              stroke="#64cfa2"
              strokeOpacity=".25"
            />
            <path
              d={"M" + x + " " + y + "l42 21 -42 21 -42 -21Z"}
              fill={"url(#" + id + "panel)"}
              stroke="#76eabc"
              strokeOpacity=".55"
              strokeWidth=".8"
            />
            <path
              d={
                "M" +
                (x - 28) +
                " " +
                (y + 7) +
                "l42 21m-56 -14 42 21m-14 -28 -42 21m56 -14 -42 21"
              }
              stroke="#87dfc0"
              strokeOpacity=".23"
              strokeWidth=".6"
            />
            <path
              className="tile-edge"
              d={"M" + (x - 42) + " " + (y + 21) + "l42 21 42 -21"}
              fill="none"
              stroke="#9affd0"
              strokeWidth="1.5"
            />
          </g>
        ))}
      </g>
      <g
        className="h-field-route"
        fill="none"
        stroke="#95f6c8"
        strokeWidth="1.2"
      >
        <path d="M405 415v40L213 358h-80M650 295l88 44v-96M134 357V222l-50-26" />
        <path className="flow-line" d="M405 415v40L213 358h-80" />
      </g>
      <g className="h-gateway">
        <path
          d="m97 327 38-19 38 19v35l-38 19-38-19Z"
          fill="#172725"
          stroke="#6fb29e"
        />
        <path d="m97 327 38 20 38-20M135 347v34" fill="none" stroke="#6fb29e" />
        <rect x="126" y="318" width="18" height="4" rx="2" fill="#a8ffce" />
        <circle cx="110" cy="350" r="2.5" fill="#a8ffce" />
      </g>
      <g className="h-cloud-node">
        <path d="m701 202 37-19 37 19-37 19Z" fill="#172725" stroke="#9ba9f6" />
        <path
          d="m701 202v28l37 19 37-19v-28M738 221v28"
          fill="none"
          stroke="#9ba9f6"
        />
        <path d="M722 206h31m-25 6h20" stroke="#c1c6ff" />
      </g>
      <g
        fill="#a0b6ae"
        fontSize="10"
        fontFamily="IBM Plex Mono, monospace"
        letterSpacing="1"
      >
        <text x="80" y="410">
          EDGE GATEWAY
        </text>
        <text x="673" y="173">
          CLOUD SCADA
        </text>
        <text x="326" y="500">
          CONNECTED SOLAR ARRAY
        </text>
      </g>
      <g className="h-field-label">
        <path
          d="M405 105V64h95"
          fill="none"
          stroke="#8dc3ab"
          strokeWidth=".8"
        />
        <circle cx="405" cy="105" r="3" fill="#a9ffcf" />
        <text
          x="420"
          y="51"
          fill="#b1ffd4"
          fontSize="10"
          fontFamily="IBM Plex Mono, monospace"
        >
          FIELD / DATA / INTELLIGENCE
        </text>
      </g>
      {view === "Notify" && (
        <g>
          <circle
            cx="453"
            cy="258"
            r="28"
            fill="#ffba7820"
            stroke="#ffba78"
            strokeDasharray="3 4"
          />
          <text x="449" y="264" fill="#ffcc91" fontSize="20">
            !
          </text>
        </g>
      )}
    </svg>
  );
}
function MiniChart({ analyze = false }: { analyze?: boolean }) {
  return (
    <svg
      className="h-mini-chart"
      viewBox="0 0 210 68"
      role="img"
      aria-label={
        analyze
          ? "Illustrative actual and expected solar generation curves"
          : "Illustrative solar generation curve"
      }
    >
      {[20, 40, 60].map((y) => (
        <path
          key={y}
          d={"M0 " + y + "h210"}
          stroke="#c2dacc"
          strokeOpacity=".1"
        />
      ))}
      <path
        d="M0 63 14 59 28 53 42 44 56 32 70 25 84 16 98 20 112 12 126 9 140 17 154 22 168 32 182 40 196 51 210 56"
        fill="none"
        stroke="#9cf8c9"
        strokeWidth="1.8"
      />
      {analyze && (
        <path
          d="M0 60Q105 -38 210 60"
          fill="none"
          stroke="#b2aafa"
          strokeDasharray="4 4"
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}
function InterfacePreview() {
  const [view, setView] = useState<View>("Monitor");
  const copy = viewCopy[view];
  return (
    <div className="h-console" data-view={view}>
      <div className="h-console-top">
        <span>
          <span className="status-dot" />
          INTERACTIVE SYSTEM PREVIEW
        </span>
        <span>ETi / 01</span>
      </div>
      <div className="h-console-visual">
        <Field view={view} />
        <div className="h-readout">
          <span className="h-mono">
            {view === "Notify"
              ? "EXAMPLE EVENT"
              : view === "Analyze"
                ? "GENERATION PROFILE"
                : "PLANT OUTPUT"}
          </span>
          {view === "Notify" ? (
            <>
              <strong className="h-alert-value">
                Attention needed <Bell size={16} />
              </strong>
              <p>Inverter 03 · output deviation</p>
              <div className="h-event-note">
                <span />
                Review event details
              </div>
            </>
          ) : (
            <>
              <strong>
                2.48 <span>MW</span>
                <Activity size={16} />
              </strong>
              <MiniChart analyze={view === "Analyze"} />
              <div className="h-chart-legend">
                <span>
                  <i />
                  Actual
                </span>
                {view === "Analyze" && (
                  <span>
                    <i />
                    Expected
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        <span className="h-coordinate">12° N / 77° E · SCHEMATIC</span>
        <div className="h-system-note">
          <ShieldCheck size={15} />
          <span>Field → Edge → Cloud</span>
        </div>
      </div>
      <div className="h-preview-toolbar">
        <div
          className="h-view-controls"
          role="group"
          aria-label="Explore the interface"
        >
          {views.map((name, i) => (
            <button
              key={name}
              aria-pressed={view === name}
              onClick={() => setView(name)}
            >
              {i === 0 ? (
                <Radio size={14} />
              ) : i === 1 ? (
                <Activity size={14} />
              ) : (
                <Bell size={14} />
              )}
              {name}
            </button>
          ))}
        </div>
        <span className="h-mono">ILLUSTRATIVE DATA · NOT LIVE</span>
      </div>
      <div className="h-preview-copy" aria-live="polite">
        <span>{copy[0]}</span>
        <p>{copy[1]}</p>
      </div>
    </div>
  );
}
function Hero() {
  return (
    <section className="h-hero h-wrap" id="overview" data-scene>
      <div className="h-hero-copy">
        <Tag>Solar intelligence, evolved</Tag>
        <h1>
          Monitor.
          <br />
          <span>Analyze.</span>
          <br />
          <em>Notify.</em>
        </h1>
        <p>
          Your plant has a story.
          <br />
          See every signal. Understand every change. Know what needs your
          attention.
        </p>
        <div className="h-hero-actions">
          <Action href="/system/">Explore the system</Action>
          <Link className="h-watch-link" to="/#intelligence">
            <span>
              <ArrowDown size={15} />
            </span>
            Follow the signal
          </Link>
        </div>
        <div className="h-hero-note">
          <span />
          Hardware. Software. Intelligence.
          <br />
          <span className="h-note-indent">Engineered to connect.</span>
        </div>
      </div>
      <InterfacePreview />
      <div className="h-hero-bottom">
        <span>DESIGNED IN BENGALURU / CONNECTED WORLDWIDE</span>
        <Link to="/#intelligence">
          SCROLL TO EXPLORE <ArrowDown size={13} />
        </Link>
      </div>
    </section>
  );
}
function Footprint() {
  return (
    <section className="h-footprint h-wrap" aria-label="EnerMAN footprint">
      {metrics.map((m, i) => (
        <div key={m.label}>
          <span className="h-mono">
            0{i + 1} / {m.label}
          </span>
          <strong>
            {m.value}
            <span>{m.suffix}</span>
          </strong>
        </div>
      ))}
    </section>
  );
}
const stages = [
  {
    name: "Monitor",
    title: "The whole plant.\nOne clear signal.",
    copy: "Connect equipment through ETi-LOG. Bring plant data into cloud or local SCADA and see your solar assets together.",
    label: "FIELD CONNECTIVITY",
    Icon: Radio,
    product: "ETi-LOG / ETi-SOL / ETi-EDGE",
  },
  {
    name: "Analyze",
    title: "Find the meaning\nbetween the numbers.",
    copy: "Explore generation reports, compare inverter performance and understand downtime losses. Move from raw data to informed decisions.",
    label: "PERFORMANCE INTELLIGENCE",
    Icon: Activity,
    product: "REPORTS / RANKING / LOSS ANALYSIS",
  },
  {
    name: "Notify",
    title: "The right signal.\nAt the right moment.",
    copy: "Track plant alerts, review events and bring issues to your team's attention. Give your operators a clear place to start.",
    label: "OPERATIONAL AWARENESS",
    Icon: Bell,
    product: "ALERTS / EVENT TRACKING / RESPONSE",
  },
];
function SignalJourney() {
  const [active, setActive] = useState(0);
  const [compact, setCompact] = useState(
    () => window.matchMedia("(max-width: 620px)").matches,
  );
  const sections = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 620px)");
    const update = () => setCompact(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (compact) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length)
          setActive(Number((visible[0].target as HTMLElement).dataset.stage));
      },
      { rootMargin: "-15% 0px -35% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [compact]);
  const stage = stages[active];
  return (
    <section className="h-intelligence h-wrap" id="intelligence">
      <div className="h-section-label">
        <span>01 / INTELLIGENCE IN MOTION</span>
        <span>FROM SIGNAL TO ACTION</span>
      </div>
      <div className="h-journey-layout">
        <div className="h-journey-sticky">
          <div
            className="h-stage-switch"
            role="group"
            aria-label={
              compact ? "Select a signal stage" : "Jump to a signal stage"
            }
          >
            {stages.map((s, i) => (
              <button
                key={s.name}
                aria-pressed={active === i}
                aria-controls={`signal-stage-${i}`}
                onClick={() => {
                  setActive(i);
                  if (compact) return;
                  sections.current[i]?.scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                    block: "center",
                  });
                }}
              >
                <span>0{i + 1}</span>
                {s.name}
              </button>
            ))}
          </div>
          <div className={"h-processor stage-" + active} aria-hidden="true">
            <div className="h-processor-grid" />
            <div className="h-chip">
              <stage.Icon size={39} strokeWidth={1} />
              <span>{stage.name.toUpperCase()}</span>
              <small>ETi INTELLIGENCE</small>
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={"h-terminal terminal-" + i}>
                <span />
                <small>{["FIELD", "EDGE", "CLOUD", "OPERATOR"][i]}</small>
              </div>
            ))}
            <svg viewBox="0 0 420 350">
              <path d="M76 80H170V136M345 80H250V136M76 275H170V215M345 275H250V215" />
              <path
                className="h-travel"
                d="M76 80H170V136M345 80H250V136M76 275H170V215M345 275H250V215"
              />
            </svg>
            <div className="h-processor-status">
              <span className="status-dot" />
              {stage.label}
            </div>
          </div>
          <p className="h-mono h-stage-meta">{stage.product}</p>
        </div>
        <div
          className="h-journey-steps"
          aria-live={compact ? "polite" : undefined}
        >
          {stages.map((s, i) => (
            <article
              key={s.name}
              id={`signal-stage-${i}`}
              hidden={compact && active !== i}
              ref={(el) => {
                sections.current[i] = el;
              }}
              data-stage={i}
              data-scene
              className="h-signal-step reveal"
            >
              <span className="h-step-number">
                0{i + 1} / {s.label}
              </span>
              <h2>
                {s.title.split("\n").map((line, j) => (
                  <span key={line}>
                    {j > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h2>
              <p>{s.copy}</p>
              <Link to="/system/" className="h-text-link">
                Discover the technology <ArrowUpRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Ecosystem() {
  const [selected, setSelected] = useState(0);
  const product = products[selected];
  const icons = [Cloud, Cpu, Radio, Gauge, ShieldCheck, Waves, Activity];
  const Icon = icons[selected];
  return (
    <section className="h-ecosystem h-wrap" id="ecosystem">
      <div className="h-section-label">
        <span>02 / THE CONNECTED ECOSYSTEM</span>
        <span>7 PRODUCTS. ONE PURPOSE.</span>
      </div>
      <div className="h-section-heading reveal">
        <h2>
          Different layers.
          <br />
          <span>One intelligence.</span>
        </h2>
        <p>
          From the field unit to the final forecast, every part is built to work
          together.
        </p>
      </div>
      <div className="h-product-workbench">
        <div
          className="h-product-picker"
          role="group"
          aria-label="Explore EnerMAN products"
        >
          {products.map((p, i) => (
            <button
              key={p.name}
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              <span>0{i + 1}</span>
              <strong>{p.name}</strong>
              <small>{p.category}</small>
              <ArrowUpRight size={15} />
            </button>
          ))}
        </div>
        <div className="h-product-display" aria-live="polite">
          <div className="h-product-symbol" aria-hidden="true">
            <div />
            <Icon size={66} strokeWidth={0.8} />
          </div>
          <div className="h-product-caption">
            <span className="h-mono">
              {product.category.toUpperCase()} / {product.label.toUpperCase()}
            </span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <Action href={"/system/#" + slug(product.route)}>
              Explore {product.name}
            </Action>
          </div>
          <span className="h-product-count">
            {String(selected + 1).padStart(2, "0")} / 07
          </span>
        </div>
      </div>
    </section>
  );
}
function Engineering() {
  return (
    <section className="h-engineering h-wrap" id="company">
      <div className="h-section-label">
        <span>03 / ENGINEERED FROM THE INSIDE</span>
        <span>BENGALURU, INDIA</span>
      </div>
      <div className="h-origin-layout">
        <div className="reveal">
          <Tag>Every layer. In-house.</Tag>
          <h2>
            The people behind
            <br />
            <span>the intelligence.</span>
          </h2>
          <p>
            Hardware, firmware, cloud platforms and mobile apps. Designed and
            developed by one team that understands your plant from the ground
            up.
          </p>
          <Link className="h-text-link" to="/#leadership">
            Meet Team EnerMAN <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="h-engineering-stack">
          {[
            [
              Cpu,
              "01",
              "Embedded systems",
              "PCB design, firmware programming and real-time hardware testing.",
            ],
            [
              Gauge,
              "02",
              "SCADA & HMI",
              "Monitoring interfaces, simulation setups and redundancy testing.",
            ],
            [
              Cloud,
              "03",
              "Cloud & mobile",
              "API development, cloud dashboards and mobile app integration.",
            ],
          ].map(([Symbol, num, title, copy]) => {
            const Icon = Symbol as typeof Cpu;
            return (
              <article key={String(num)} className="reveal">
                <span className="h-mono">{String(num)}</span>
                <Icon size={21} strokeWidth={1.2} />
                <div>
                  <h3>{String(title)}</h3>
                  <p>{String(copy)}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <div className="h-company-records">
        <SourceDisclosure
          route="/about-us/"
          id="leadership"
          label="Our story, vision & leadership"
        />
        <SourceDisclosure route="/team/" id="team" label="Meet Team EnerMAN" />
        <SourceDisclosure
          route="/awards/"
          id="awards"
          label="Awards & recognition"
        />
        <SourceDisclosure
          route="/news-updates/"
          id="news"
          label="News & milestones"
        />
      </div>
    </section>
  );
}
function Operations() {
  return (
    <section className="h-operations h-wrap">
      <div className="h-section-heading">
        <h2>
          Built for your
          <br />
          <span>kind of solar.</span>
        </h2>
        <p>
          One connected system. The flexibility to meet the way you operate.
        </p>
      </div>
      <div className="h-industries">
        {industries.map(([title, copy, route], i) => (
          <SiteLink className="reveal" href={route} key={title}>
            <span className="h-mono">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
            <ArrowUpRight size={19} />
          </SiteLink>
        ))}
      </div>
    </section>
  );
}
function Connect() {
  return (
    <section className="h-connect h-wrap" data-scene>
      <div className="h-connect-lines" aria-hidden="true" />
      <Tag>The next connection is yours</Tag>
      <h2>
        Your plants.
        <br />
        <span>A new perspective.</span>
      </h2>
      <p>Let's build a clearer view of your solar operations.</p>
      <Action href="/contact/">Start a conversation</Action>
      <span className="h-connect-coordinate">ENERMAN / FIELD TO FUTURE</span>
    </section>
  );
}
function Home() {
  return (
    <>
      <Hero />
      <Footprint />
      <SignalJourney />
      <Ecosystem />
      <Engineering />
      <div className="h-knowledge">
        <Insights />
      </div>
      <Operations />
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
    <section className="h-page-intro h-wrap">
      <Tag>{label}</Tag>
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
            Your plant.
            <br />
            <span>Your system.</span>
          </>
        }
      >
        Seven products. Field connectivity, cloud and local monitoring, plant
        controls and forecasting. Explore every layer in one place.
      </PageIntro>
      <section className="h-catalog h-wrap">
        <div className="h-catalog-toolbar">
          <span className="h-mono">SELECT A LAYER</span>
          <div className="filter-row" aria-label="Filter solutions">
            {["All", "Monitor", "Control", "Forecast"].map((name) => (
              <button
                key={name}
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
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
        </div>
        {["Monitor", "Control", "Forecast"]
          .filter((name) => filter === "All" || filter === name)
          .map((name, i) => (
            <div className="h-catalog-group" id={name.toLowerCase()} key={name}>
              <div className="h-catalog-category">
                <span className="h-mono">0{i + 1}</span>
                <h2>{name}</h2>
                <p>
                  {name === "Monitor"
                    ? "Understand every signal."
                    : name === "Control"
                      ? "Coordinate plant output."
                      : "Plan the generation ahead."}
                </p>
              </div>
              <div className="h-catalog-products">
                {products
                  .filter((p) => p.category === name)
                  .map((p) => (
                    <details
                      className="product-detail"
                      key={p.name}
                      id={slug(p.route)}
                    >
                      <summary>
                        <span className="h-mono">{p.label}</span>
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                        <span className="disclosure-plus" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <div className="h-specifications">
                        <TextBlocks blocks={pages[p.route].blocks} />
                        <Action
                          href={
                            "/contact/?product=" +
                            encodeURIComponent(p.name) +
                            "#enquiry"
                          }
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
      <section className="h-capabilities h-wrap">
        <div className="h-section-heading">
          <h2>
            Data that works
            <br />
            <span>for your decisions.</span>
          </h2>
        </div>
        <div className="h-benefits">
          {benefits.map(([title, copy], i) => (
            <article key={title}>
              <span className="h-mono">0{i + 1}</span>
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
            The next signal
            <br />
            <span>starts with you.</span>
          </>
        }
      >
        Tell us about your plant, portfolio or project. Let's find the right
        combination of monitoring, controls and forecasting.
      </PageIntro>
      <section className="h-contact-layout h-wrap">
        <div className="h-contact-info">
          <span className="h-mono">DIRECT CONNECTION</span>
          <a className="h-contact-email" href="mailto:sales@enerman.in">
            sales@enerman.in <ArrowUpRight size={23} />
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
              className="h-text-link"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps <ArrowUpRight size={15} />
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
          <div className="h-contact-orbit" aria-hidden="true">
            <Radio size={27} />
            <span />
            <span />
          </div>
        </div>
        <div className="h-enquiry" id="enquiry">
          <ContactForm
            key={product || "demo"}
            demo={!product}
            product={product}
          />
        </div>
      </section>
      <section className="h-wrap h-contact-records">
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
      <section className="h-wrap h-legal">
        <TextBlocks blocks={pages["/terms-and-conditions/"].blocks} />
      </section>
    </>
  );
}
function Legacy() {
  const location = useLocation();
  const target = destination(location.pathname + location.hash);
  if (target !== location.pathname + location.hash)
    return <Navigate to={target} replace />;
  return (
    <>
      <PageIntro label="404 / SIGNAL NOT FOUND" title="Let’s reconnect.">
        This page is unavailable. Explore the system or connect with our team.
      </PageIntro>
      <div className="h-wrap h-not-found">
        <Action href="/">Back to home</Action>
      </div>
    </>
  );
}
function Footer() {
  return (
    <footer className="h-footer h-wrap">
      <div className="h-footer-upper">
        <Link className="h-logo" to="/">
          <Mark />
          <span>
            Ener<span>MAN</span>
          </span>
        </Link>
        <p>
          Intelligence for a<br />
          cleaner tomorrow.
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
            Customer login <ArrowUpRight size={13} />
          </a>
          {appLinks.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {label}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      </div>
      <div className="h-footer-social">
        {social
          .filter(([name]) => name !== "WhatsApp")
          .map(([name, href]) => (
            <a key={name} href={href} target="_blank" rel="noreferrer">
              {name}
              <ArrowUpRight size={12} />
            </a>
          ))}
      </div>
      <div className="h-footer-bottom">
        <span>© {new Date().getFullYear()} EnerMAN Technologies Pvt Ltd</span>
        <span>
          <span className="status-dot" />
          FIELD TO FUTURE.
        </span>
        <Link to="/legal/">Terms & conditions</Link>
      </div>
    </footer>
  );
}
export default function Helio() {
  useScrollDesign();
  return (
    <div className="site helio" data-design="Helio Interface">
      <Metadata />
      <a className="skip-link" href="#content">
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

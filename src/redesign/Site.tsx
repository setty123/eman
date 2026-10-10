import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Cloud,
  Cpu,
  Menu,
  Monitor,
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
import type { Block, SourcePage } from "../data/types";
import archive from "./content.json";
import design from "./design.json";
import { currentDiagram, nocturneDiagram, signalDiagram } from "./diagrams";

const pages = archive as unknown as Record<string, SourcePage>;
const slug = (route: string) => route.replace(/^\/+|\/+$/g, "");
const companyHref = design.companyPage ? "/company/" : "/#company";
const categories = ["Monitor", "Control", "Forecast"];
const excluded = new Set([
  "/",
  "/about-us/",
  "/team/",
  "/awards/",
  "/news-updates/",
  "/resource/",
  "/products/",
  "/contact/",
  "/inquiry-form/",
  "/terms-and-conditions/",
  ...products.map((p) => p.route),
]);
const readingPages = Object.values(pages).filter((p) => !excluded.has(p.route));

export function destination(href: string) {
  if (href.startsWith("https://enerman.in/"))
    href = href.slice("https://enerman.in".length);
  if (
    !href.startsWith("/") ||
    href.startsWith("/assets/") ||
    href.startsWith("/wp-content/")
  )
    return href;
  const [path, hash = ""] = href.split("#");
  const route = path === "/" ? "/" : path.replace(/\/$/, "") + "/";
  if (route === "/" && hash === "datasheet") return "/contact/#enquiry";
  if (route.startsWith("/category/"))
    return `${design.companyPage ? "/company/" : "/"}#insights`;
  if (design.routes.includes(route)) return route + (hash ? `#${hash}` : "");
  if (route === "/products/")
    return design.solutionsPath + (hash ? `#${hash}` : "");
  const product = products.find((p) => p.route === route);
  if (product) return `${design.solutionsPath}#${slug(product.route)}`;
  if (route === "/about-us/") return companyHref;
  if (["/team/", "/awards/", "/news-updates/", "/resource/"].includes(route)) {
    const section = {
      "/team/": "team",
      "/awards/": "awards",
      "/news-updates/": "news",
      "/resource/": "insights",
    }[route];
    return `${design.companyPage ? "/company/" : "/"}#${section}`;
  }
  if (route === "/inquiry-form/") return "/contact/#enquiry";
  if (route === "/terms-and-conditions/") return "/legal/";
  if (pages[route])
    return `${design.companyPage ? "/company/" : "/"}#article-${slug(route)}`;
  return href;
}

export function SiteLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const target = destination(href);
  return target.startsWith("/") &&
    !target.startsWith("/wp-content/") &&
    !target.startsWith("/assets/") ? (
    <Link className={className} to={target}>
      {children}
    </Link>
  ) : (
    <a
      className={className}
      href={target}
      target={target.startsWith("https:") ? "_blank" : undefined}
      rel={target.startsWith("https:") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function Eyeline({ children }: { children: ReactNode }) {
  return <p className="eyeline">{children}</p>;
}
function Button({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <SiteLink
      href={href}
      className={`site-button ${light ? "light" : design.id === "nocturne" ? "accent" : ""}`}
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </SiteLink>
  );
}
export function TextBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="reading-copy">
      {blocks.map((block, i) => {
        if (block.type === "image" || block.type === "h1") return null;
        const links =
          block.links?.filter(
            (l) => l.label && !/Skip to content/i.test(l.label),
          ) || [];
        if (block.type === "list")
          return (
            <ul key={i}>
              {block.items?.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        if (/^h[2-6]$/.test(block.type))
          return (
            <h4 key={i}>
              {links.length === 1 && links[0].label === block.text ? (
                <SiteLink href={links[0].href}>
                  {block.text}
                  <ArrowUpRight size={14} />
                </SiteLink>
              ) : (
                block.text
              )}
            </h4>
          );
        if (!block.text) return null;
        const linkedText = links.length === 1 && links[0].label === block.text;
        return (
          <div key={i}>
            {!linkedText && <p>{block.text}</p>}
            {links.length > 0 && (
              <div className="reading-links">
                {links.map((link, j) => (
                  <SiteLink href={link.href} key={j}>
                    {link.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </SiteLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
export function SourceDisclosure({
  route,
  id,
  label,
}: {
  route: string;
  id: string;
  label: string;
}) {
  const page = pages[route];
  if (!page) return null;
  return (
    <details className="content-disclosure" id={id}>
      <summary>
        <span>{label}</span>
        <span className="disclosure-plus" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="disclosure-body">
        <TextBlocks blocks={page.blocks} />
      </div>
    </details>
  );
}

export function useScrollDesign() {
  const location = useLocation();
  const navigation = useNavigationType();
  const positions = useRef(new Map<string, number>());
  useLayoutEffect(() => {
    let cancelled = false;
    const move = () => {
      if (cancelled) return;
      const target =
        location.hash &&
        document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        let parent: HTMLElement | null = target;
        while (parent) {
          if (parent instanceof HTMLDetailsElement) parent.open = true;
          parent = parent.parentElement;
        }
        target.scrollIntoView({ behavior: "instant", block: "start" });
      } else
        window.scrollTo({
          top:
            navigation === "POP" ? positions.current.get(location.key) || 0 : 0,
          behavior: "instant",
        });
    };
    const frame = requestAnimationFrame(move);
    document.fonts.ready.then(move);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      positions.current.set(location.key, window.scrollY);
    };
  }, [location.key, location.pathname, location.hash, navigation]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scene]"),
    );
    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal"),
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.06 },
    );
    reveals.forEach((element) => observer.observe(element));
    const update = () => {
      frame = 0;
      document.documentElement.classList.toggle("motion-off", query.matches);
      if (query.matches) return;
      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        scene.style.setProperty(
          "--phase",
          Math.max(
            0,
            Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
          ).toFixed(4),
        );
      });
      document.documentElement.style.setProperty(
        "--page-progress",
        String(
          window.scrollY /
            Math.max(1, document.documentElement.scrollHeight - innerHeight),
        ),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    query.addEventListener("change", schedule);
    document.fonts.ready.then(schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", schedule);
    };
  }, [location.pathname]);
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => setOpen(false), [location.key]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  const items = [
    ["/", "Home"],
    [design.solutionsPath, design.solutionsLabel],
    [companyHref, "Company"],
    ["/contact/", "Contact"],
  ];
  return (
    <header className="header-shell">
      <div className="site-header site-wrap">
        <Link className="wordmark" to="/" aria-label="EnerMAN home">
          Ener<span>MAN</span>
        </Link>
        <nav className="site-nav desktop-nav" aria-label="Main navigation">
          {items.slice(1, design.companyPage ? 3 : 2).map(([href, label]) => (
            <Link
              aria-current={location.pathname === href ? "page" : undefined}
              key={href}
              to={href}
            >
              {label}
            </Link>
          ))}
          <Button href="/contact/">Let’s talk</Button>
        </nav>
        <button
          className="menu-toggle"
          ref={toggle}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          className="mobile-navigation site-wrap"
          id="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {items.map(([href, label], i) => (
            <Link key={href} to={href}>
              <span>0{i + 1}</span>
              {label}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
      )}
      <div className="page-progress" aria-hidden="true" />
    </header>
  );
}

function Stats() {
  return (
    <div className="hero-stat-row">
      {metrics.map((m) => (
        <div key={m.label}>
          <strong>
            {m.value}
            {m.suffix}
          </strong>
          <span>{m.label}</span>
        </div>
      ))}
    </div>
  );
}
function HeroActions() {
  return (
    <div className="hero-actions">
      <Button href="/contact/#enquiry">Request a demo</Button>
      <SiteLink href={design.solutionsPath} className="text-link">
        Explore {design.solutionsLabel.toLowerCase()}
        <ArrowRight size={16} aria-hidden="true" />
      </SiteLink>
    </div>
  );
}
function Diagram({ html }: { html: string }) {
  return (
    <div
      className="diagram-container"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
const description = (
  <p className="site-description">
    Connected solar intelligence for PV plants and rooftops. Monitor your
    assets, understand performance, and act on the right alerts.
  </p>
);
function Hero() {
  if (design.id === "cobalt")
    return (
      <>
        <section className="cobalt-hero site-wrap">
          <aside className="cobalt-index" aria-label="Section index">
            {[
              ["#content", "Overview"],
              ["#solutions", "Solutions"],
              ["#company", "Company"],
              ["#connect", "Contact"],
            ].map(([href, label], i) => (
              <a key={href} href={href}>
                <span>0{i + 1}</span>
                {label}
              </a>
            ))}
          </aside>
          <div>
            <h1>
              Monitor,
              <br />
              <span>Analyze</span>
              <br />
              and Notify.
            </h1>
            <p className="hero-title-note">
              Solar PV plants and rooftops.
              <br />
              One connected operating picture.
            </p>
            <HeroActions />
          </div>
          <div className="cobalt-side">
            <div className="index-module" data-scene>
              <div>
                <span>01</span>Acquire
              </div>
              <div>
                <span>02</span>Analyze
              </div>
              <div>
                <span>03</span>Notify
              </div>
            </div>
            {description}
          </div>
        </section>
        <div className="site-wrap">
          <Stats />
        </div>
      </>
    );
  if (design.id === "kiln")
    return (
      <>
        <section className="kiln-hero site-wrap">
          <div>
            <Eyeline>Solar intelligence, built in India</Eyeline>
            <h1>
              Monitor,
              <br />
              Analyze and
              <br />
              <span>Notify.</span>
            </h1>
          </div>
          <div className="kiln-side">
            <div className="kiln-sun" data-scene aria-hidden="true" />
            {description}
            <HeroActions />
          </div>
        </section>
        <div className="site-wrap">
          <Stats />
        </div>
      </>
    );
  const nocturne = design.id === "nocturne";
  const current = design.id === "current";
  return (
    <>
      <section className={`${design.id}-hero site-wrap`}>
        <div>
          <Eyeline>
            {nocturne
              ? "Your solar portfolio, connected"
              : current
                ? "Less noise. More understanding."
                : "Intelligence for a cleaner tomorrow"}
          </Eyeline>
          <h1>
            {current ? (
              <>
                Monitor,
                <br />
                <span>Analyze</span>
                <br />
                and Notify.
              </>
            ) : (
              <>
                Monitor,
                <br />
                Analyze and
                <br />
                {nocturne ? <span>Notify.</span> : <em>Notify.</em>}
              </>
            )}
          </h1>
          {description}
          <HeroActions />
        </div>
        <Diagram
          html={
            nocturne
              ? nocturneDiagram
              : current
                ? currentDiagram
                : signalDiagram
          }
        />
      </section>
      <div className="site-wrap">
        <Stats />
      </div>
    </>
  );
}

function ProductLinks({ category }: { category: string }) {
  return (
    <div className="product-group product-link-list">
      <ul>
        {products
          .filter((p) => p.category === category)
          .map((p) => (
            <li key={p.name}>
              <SiteLink href={p.route}>
                <strong>
                  {p.name}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </strong>
                <span>{p.label}</span>
              </SiteLink>
            </li>
          ))}
      </ul>
    </div>
  );
}
function SolutionsOverview() {
  const heading = (
    <div className="section-top">
      <div>
        <Eyeline>Seven connected products</Eyeline>
        <h2>
          One portfolio.
          <br />
          Every part connected.
        </h2>
      </div>
      <p>
        Cloud or local monitoring, plant controls, and generation forecasting.
        Built to work together.
      </p>
    </div>
  );
  return (
    <section
      className={`site-section ${design.id === "signal" ? "solutions-section" : "site-wrap"}`}
      id="solutions"
    >
      <div className={design.id === "signal" ? "site-wrap" : ""}>
        {heading}
        {design.id === "nocturne" ? (
          <div className="stack-panels">
            {categories.map((name, i) => (
              <article
                className="stack-panel"
                style={{ "--stack-index": i } as React.CSSProperties}
                key={name}
              >
                <div>
                  <span className="stack-number">
                    0{i + 1} / THE CONNECTED PLATFORM
                  </span>
                  <h3>{name}.</h3>
                  <p>
                    {i === 0
                      ? "Know your assets. From every inverter to your whole portfolio."
                      : i === 1
                        ? "Coordinate plant output, zero export, and changing site loads."
                        : "Turn weather data into generation forecasts for better planning."}
                  </p>
                </div>
                <ProductLinks category={name} />
              </article>
            ))}
          </div>
        ) : design.id === "cobalt" ? (
          <div className="solution-accordion">
            {categories.map((name, i) => (
              <details key={name} open={i === 0}>
                <summary>
                  <span>0{i + 1}</span>
                  <h3>{name}</h3>
                  <span aria-hidden="true">+</span>
                </summary>
                <ProductLinks category={name} />
              </details>
            ))}
          </div>
        ) : (
          <div className="product-groups">
            {categories.map((name, i) => (
              <div className="product-group" key={name}>
                <div className="product-group-head">
                  <h3>{name}</h3>
                  <span>0{i + 1}</span>
                </div>
                <ProductLinks category={name} />
              </div>
            ))}
          </div>
        )}
        <div className="overview-action">
          <Button href={design.solutionsPath} light={design.id === "signal"}>
            Explore the full {design.solutionsLabel.toLowerCase()}
          </Button>
        </div>
      </div>
    </section>
  );
}
const steps = [
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
function Process() {
  if (design.id !== "signal" && design.id !== "kiln")
    return (
      <section className="site-section site-wrap">
        <div className="section-top">
          <div>
            <Eyeline>From signal to action</Eyeline>
            <h2>A clearer way to operate.</h2>
          </div>
        </div>
        <div className="process-strip">
          {steps.map(([title, copy], i) => (
            <article className="reveal" key={title}>
              <span>0{i + 1} /</span>
              <h3>{title}.</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    );
  return (
    <section
      className={`${design.id === "signal" ? "flow-story" : "kiln-story site-section"} site-wrap`}
      data-scene
    >
      <div className={design.id === "signal" ? "flow-sticky" : "story-aside"}>
        <Eyeline>From signal to action</Eyeline>
        <h2>
          {design.id === "signal" ? (
            <>
              Not just data.
              <br />A clear next step.
            </>
          ) : (
            <>
              From a single
              <br />
              signal to a<br />
              smarter plant.
            </>
          )}
        </h2>
        <p>
          A complete path from field equipment to decisions, with every layer
          built in-house.
        </p>
        <div className="flow-meter" aria-hidden="true">
          <span />
        </div>
      </div>
      <div>
        {steps.map(([title, copy], i) => (
          <article
            className={
              design.id === "signal"
                ? "flow-step reveal"
                : "editorial-step reveal"
            }
            key={title}
            data-scene
          >
            <span>0{i + 1}</span>
            <div>
              <h3>{title}.</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function CompanyIntro({ extended = false }: { extended?: boolean }) {
  return (
    <section className="site-section site-wrap" id="company">
      <div className="company-copy reveal">
        <div>
          <Eyeline>Built here. Connected everywhere.</Eyeline>
          <h2>
            From concept
            <br />
            to commissioning.
          </h2>
        </div>
        <div>
          <p>
            EnerMAN’s team builds hardware, firmware, cloud platforms, and
            mobile apps in-house in Bengaluru. The same engineering knowledge
            connects the field unit, the platform, and the people operating your
            plant.
          </p>
          <div className="hero-actions">
            <SiteLink
              href={extended ? `${companyHref}#leadership` : companyHref}
              className="text-link"
            >
              Meet the people
              <ArrowUpRight size={16} />
            </SiteLink>
            <SiteLink href="/contact/" className="text-link">
              Talk about your plant
              <ArrowUpRight size={16} />
            </SiteLink>
          </div>
        </div>
      </div>
    </section>
  );
}
function CompanyContent() {
  return (
    <>
      <section className="site-section site-wrap" id="engineering">
        <div className="section-top">
          <div>
            <Eyeline>Engineering under one roof</Eyeline>
            <h2>Every layer. In-house.</h2>
          </div>
          <p>
            30+ professionals bring decades of combined experience in solar
            power automation, industrial systems, embedded technology and cloud
            platforms.
          </p>
        </div>
        <div className="capability-grid">
          {[
            [
              Cpu,
              "Embedded systems",
              "PCB design, firmware programming and real-time hardware testing.",
            ],
            [
              Monitor,
              "SCADA & HMI",
              "Real-time monitoring interfaces, simulation setups and redundancy testing.",
            ],
            [
              Cloud,
              "Cloud & mobile",
              "API development, cloud dashboards and mobile app integration.",
            ],
          ].map(([Icon, title, text], i) => {
            const Symbol = Icon as typeof Cpu;
            return (
              <article className="reveal" key={String(title)}>
                <div>
                  <Symbol size={26} strokeWidth={1.4} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </article>
            );
          })}
        </div>
        <div className="company-disclosures">
          <SourceDisclosure
            route="/about-us/"
            id="leadership"
            label="Our story, vision & leadership"
          />
          <SourceDisclosure
            route="/team/"
            id="team"
            label="Meet Team EnerMAN"
          />
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
      <Insights />
    </>
  );
}
export function Insights() {
  const [query, setQuery] = useState("");
  const location = useLocation();
  useEffect(() => setQuery(""), [location.hash]);
  const shown = readingPages.filter((p) =>
    `${p.heading} ${p.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="site-section site-wrap" id="insights">
      <div className="section-top">
        <div>
          <Eyeline>Field notes & perspectives</Eyeline>
          <h2>Knowledge, connected.</h2>
        </div>
        <label className="search-label">
          Search insights
          <input
            type="search"
            placeholder="SCADA, forecasting, plant control…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="insight-list">
        {shown.map((p, i) => (
          <details
            className="insight-item"
            id={`article-${slug(p.route)}`}
            key={p.route}
          >
            <summary>
              <span className="insight-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{p.heading}</h3>
                <p>{p.description}</p>
              </div>
              <ArrowDown aria-hidden="true" size={20} />
            </summary>
            <div className="disclosure-body">
              <TextBlocks blocks={p.blocks} />
            </div>
          </details>
        ))}
      </div>
      {shown.length === 0 && (
        <p role="status">No articles match “{query}”. Try another keyword.</p>
      )}
      <SourceDisclosure
        route="/resource/"
        id="library"
        label="Explore the complete resource library"
      />
    </section>
  );
}
function ContactBanner() {
  return (
    <section
      className={`site-contact ${design.id === "signal" ? "" : "site-wrap"}`}
      id="connect"
    >
      <div className="reveal">
        <Eyeline>Let’s connect</Eyeline>
        <h2>
          Bring your plants
          <br />
          to one clear view.
        </h2>
      </div>
      <Button href="/contact/">Start a conversation</Button>
    </section>
  );
}
function Home() {
  return (
    <>
      <Hero />
      <SolutionsOverview />
      <Process />
      <CompanyIntro extended={!design.companyPage} />
      {!design.companyPage && <CompanyContent />}
      <section className="site-section site-wrap">
        <div className="section-top">
          <div>
            <Eyeline>Built for your operations</Eyeline>
            <h2>
              One system.
              <br />
              Many kinds of plant.
            </h2>
          </div>
        </div>
        <div className="industry-list">
          {industries.map(([title, copy, route]) => (
            <SiteLink href={route} key={title} className="industry-item reveal">
              <h3>{title}</h3>
              <p>{copy}</p>
              <ArrowUpRight size={23} aria-hidden="true" />
            </SiteLink>
          ))}
        </div>
      </section>
      <ContactBanner />
    </>
  );
}
function PageIntro({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: ReactNode;
  copy: string;
}) {
  return (
    <section className="page-intro site-wrap">
      <Eyeline>{kicker}</Eyeline>
      <h1>{title}</h1>
      <p>{copy}</p>
    </section>
  );
}

function Solutions() {
  const [filter, setFilter] = useState("All");
  const location = useLocation();
  useEffect(() => {
    if (location.hash) setFilter("All");
  }, [location.hash]);
  return (
    <>
      <PageIntro
        kicker="The EnerMAN ecosystem"
        title={
          <>
            Every signal.
            <br />
            <em>One connected system.</em>
          </>
        }
        copy="Seven products for monitoring, plant control and forecasting. Explore what your plant needs, together in one place."
      />
      <section className="site-section site-wrap catalog-section">
        <div className="filter-row" aria-label="Filter solutions">
          {["All", ...categories].map((name) => (
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
        {categories
          .filter((name) => filter === "All" || name === filter)
          .map((name, i) => (
            <div className="catalog-group" id={name.toLowerCase()} key={name}>
              <div className="catalog-heading">
                <span>0{i + 1} /</span>
                <h2>{name}.</h2>
                <p>
                  {name === "Monitor"
                    ? "See every plant. Understand every signal."
                    : name === "Control"
                      ? "Coordinate power, export and changing loads."
                      : "Plan generation with confidence."}
                </p>
              </div>
              <div>
                {products
                  .filter((p) => p.category === name)
                  .map((p) => (
                    <details
                      className="product-detail"
                      id={slug(p.route)}
                      key={p.name}
                    >
                      <summary>
                        <div>
                          <span className="product-label">{p.label}</span>
                          <h3>{p.name}</h3>
                        </div>
                        <p>{p.description}</p>
                        <span className="disclosure-plus" aria-hidden="true">
                          +
                        </span>
                      </summary>
                      <div className="product-detail-body">
                        <TextBlocks blocks={pages[p.route].blocks} />
                        <div className="product-next">
                          <Button
                            href={`/contact/?product=${encodeURIComponent(p.name)}#enquiry`}
                          >
                            Request the {p.name} datasheet
                          </Button>
                        </div>
                      </div>
                    </details>
                  ))}
              </div>
            </div>
          ))}
      </section>
      <section className="site-section site-wrap" id="capabilities">
        <div className="section-top">
          <div>
            <Eyeline>From data to understanding</Eyeline>
            <h2>Built for daily decisions.</h2>
          </div>
        </div>
        <div className="benefit-list">
          {benefits.map(([title, copy], i) => (
            <article className="reveal" key={title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
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
      <ContactBanner />
    </>
  );
}
function CompanyPage() {
  return (
    <>
      <PageIntro
        kicker="About EnerMAN"
        title={
          <>
            Made in Bengaluru.
            <br />
            <em>Connected everywhere.</em>
          </>
        }
        copy="Solar SCADA, RMS and IoT hardware, designed and developed in-house. A team that understands the plant, the platform and the people using it."
      />
      <div className="site-wrap">
        <Stats />
      </div>
      <CompanyContent />
      <ContactBanner />
    </>
  );
}
function Contact() {
  const location = useLocation();
  const selected =
    new URLSearchParams(location.search).get("product") || undefined;
  const product = products.some((p) => p.name === selected)
    ? selected
    : undefined;
  return (
    <>
      <PageIntro
        kicker="Let’s talk solar"
        title={
          <>
            A clearer view
            <br />
            <em>starts here.</em>
          </>
        }
        copy="Tell us about your solar plant, portfolio or project. Our team can help with monitoring, controls, generation forecasting and technical proposals."
      />
      <section className="contact-layout site-wrap">
        <div className="contact-information">
          <Eyeline>Connect with our team</Eyeline>
          <a className="contact-email" href="mailto:sales@enerman.in">
            sales@enerman.in
            <ArrowUpRight size={20} />
          </a>
          <div className="contact-group">
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
              className="text-link"
              href={mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="contact-group">
            <h2>Call us</h2>
            {phoneNumbers.map((phone) => (
              <a href={`tel:${phone.replace(/\s/g, "")}`} key={phone}>
                {phone}
              </a>
            ))}
          </div>
          <div className="contact-group">
            <h2>Support & enquiries</h2>
            <a href="mailto:support@enerman.in">support@enerman.in</a>
            <a href="mailto:info@enerman.in">info@enerman.in</a>
          </div>
        </div>
        <div className="enquiry-panel" id="enquiry">
          <ContactForm
            key={product || "demo"}
            demo={!product}
            product={product}
          />
        </div>
      </section>
      <section className="site-section site-wrap">
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
        kicker="Terms & conditions"
        title="Clear terms."
        copy="The terms and conditions for using EnerMAN’s website and services."
      />
      <section className="site-wrap legal-copy">
        <TextBlocks blocks={pages["/terms-and-conditions/"].blocks} />
      </section>
    </>
  );
}
function Legacy() {
  const location = useLocation();
  const target = destination(location.pathname + location.hash);
  if (target !== location.pathname + location.hash)
    return <Navigate replace to={target} />;
  return (
    <>
      <PageIntro
        kicker="404 / Page not found"
        title="Let’s reconnect."
        copy="This page is unavailable. Explore the EnerMAN platform or contact our team."
      />
      <div className="site-wrap not-found-actions">
        <Button href="/">Back to home</Button>
        <Button href={design.solutionsPath}>Explore solutions</Button>
      </div>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer-shell site-wrap">
      <div className="footer-top">
        <Link className="wordmark" to="/">
          Ener<span>MAN</span>
        </Link>
        <p>
          Intelligence for a<br />
          cleaner tomorrow.
        </p>
        <div>
          <SiteLink href={design.solutionsPath}>
            {design.solutionsLabel}
          </SiteLink>
          <SiteLink href={companyHref}>Company</SiteLink>
          <SiteLink href={`${design.companyPage ? "/company/" : "/"}#insights`}>
            Insights
          </SiteLink>
          <Link to="/contact/">Contact</Link>
        </div>
        <div>
          <a
            href="https://www.eaglesunscada.com/#/login"
            target="_blank"
            rel="noreferrer"
          >
            Customer login
            <ArrowUpRight size={14} />
          </a>
          {appLinks.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {label}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
      </div>
      <div className="footer-social">
        {social
          .filter(([name]) => name !== "WhatsApp")
          .map(([name, href]) => (
            <a key={name} href={href} target="_blank" rel="noreferrer">
              {name}
              <ArrowUpRight size={12} />
            </a>
          ))}
      </div>
      <div className="site-footer">
        <span>© {new Date().getFullYear()} EnerMAN Technologies Pvt Ltd</span>
        <span>Bengaluru, India · Hardware / Firmware / Cloud / Mobile</span>
        <Link to="/legal/">Terms & conditions</Link>
      </div>
    </footer>
  );
}
export function Metadata() {
  const location = useLocation();
  useEffect(() => {
    const label =
      location.pathname === design.solutionsPath
        ? design.solutionsLabel
        : location.pathname === "/company/"
          ? "Company"
          : location.pathname === "/contact/"
            ? "Contact"
            : location.pathname === "/legal/"
              ? "Terms & conditions"
              : "Monitor, Analyze and Notify";
    const title = `${label} | EnerMAN Technologies`;
    document.title = title;
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", title);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", design.themeColor);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `https://enerman.in${location.pathname}`);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", `https://enerman.in${location.pathname}`);
  }, [location.pathname]);
  return null;
}
export default function Site() {
  useScrollDesign();
  return (
    <div className={`site ${design.id}`} data-design={design.name}>
      <Metadata />
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <Header />
      <main id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path={design.solutionsPath} element={<Solutions />} />
          {design.companyPage && (
            <Route path="/company/" element={<CompanyPage />} />
          )}
          <Route path="/contact/" element={<Contact />} />
          <Route path="/legal/" element={<Legal />} />
          <Route path="*" element={<Legacy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Layers3,
  Bell,
  FileChartColumn,
  Activity,
  ChartNoAxesCombined,
  MapPin,
  Network,
  RefreshCw,
  ArrowRight,
  Globe2,
  Sun,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { asset, benefits, industries } from "../data/content";
import assets from "../data/assets.json";
import articles from "../data/articles.json";
import awards from "../data/awards.json";
import { SectionHeading, Eyebrow, Button } from "./ui";

export function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-topline">
          <Eyebrow>INTELLIGENCE FOR A CLEANER TOMORROW</Eyebrow>
          <span className="mono hero-coordinate">
            HARDWARE · FIRMWARE · CLOUD · MOBILE
          </span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1>
              <span className="line-mask">
                <span data-hero-line>Monitor, </span>
              </span>
              <span className="line-mask">
                <span data-hero-line>Analyze and </span>
              </span>
              <span className="line-mask">
                <span data-hero-line className="olive hero-notify">
                  Notify{" "}
                </span>
              </span>
              <span className="hero-title-end" data-hero-line>
                solar PV plants and rooftops.
              </span>
            </h1>
            <p data-reveal>
              Monitor all inverters’ status across all plants in seconds,
              without a single click.
            </p>
            <div className="hero-buttons" data-reveal>
              <Button to="/inquiry-form/">Request a demo</Button>
              <Button to="/eti-sol/" secondary>
                Discover ETi-SOL
              </Button>
            </div>
            <div className="hero-footnote">
              <span className="small-sun">
                <Sun size={21} />
              </span>
              <span>
                IoT SCADA for solar PV plants. <br />
                <strong>Built in India for the global market.</strong>
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="solar-orbit" aria-hidden="true">
              <div />
              <div />
              <div />
            </div>
            <div className="sun-stamp" aria-hidden="true">
              <Sun strokeWidth={0.9} size={54} />
            </div>
            <figure className="hero-photo">
              <img
                src={asset("Aerial panoramic")}
                alt="Aerial view of a ground-mounted solar PV plant, from EnerMAN’s SCADA article"
                width="799"
                height="580"
                fetchPriority="high"
                data-parallax
              />
              <figcaption>
                <span className="status-dot" />
                RENEWABLE ENERGY. REAL INTELLIGENCE.
                <ArrowUpRight size={18} />
              </figcaption>
            </figure>
            <div className="hero-dashboard">
              <div className="browser-top">
                <div>
                  <i />
                  <i />
                  <i />
                </div>
                <span className="mono">ETi-SOL / INVERTER DASHBOARD</span>
                <ArrowUpRight size={12} />
              </div>
              <img
                src={asset("Inverter dashboard")}
                alt="Authentic ETi-SOL inverter dashboard showing hourly energy and irradiance"
                width="700"
                height="323"
                fetchPriority="high"
              />
              <div className="dashboard-caption">
                <span className="status-dot" />
                Your entire portfolio. One clear view.
                <span className="mono">PRODUCT PREVIEW</span>
              </div>
            </div>
            <span className="art-caption mono">
              <span>01 / CONNECTED SOLAR INTELLIGENCE</span>
              <Globe2 size={15} />
            </span>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#impact">
            <span className="scroll-pill">
              <ArrowRight size={14} />
            </span>
            Scroll to explore
          </a>
          <span className="mono">
            MONITOR <i /> CONTROL <i /> FORECAST
          </span>
        </div>
      </div>
    </section>
  );
}

export function Credibility() {
  const logos = assets.filter((a) => a.original.includes("eman-logo-"));
  return (
    <div className="credibility container">
      <span className="mono">
        DEPLOYED AT
        <br />
        <span>LEADING ORGANISATIONS</span>
      </span>
      <div className="customer-logos">
        {logos.map((a) => (
          <img
            key={a.local}
            src={a.local}
            alt={a.alt}
            width="110"
            height="54"
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
const icons = [
  Layers3,
  Bell,
  FileChartColumn,
  Activity,
  ChartNoAxesCombined,
  MapPin,
  Network,
  RefreshCw,
];
export function Benefits() {
  return (
    <section className="section benefits-section">
      <div className="container">
        <SectionHeading
          number="03"
          label="WHY ENERMAN"
          title={
            <>
              More visibility.
              <br />
              Better decisions.
            </>
          }
          action={
            <Button to="/eti-sol/" secondary>
              See ETi-SOL
            </Button>
          }
        >
          Easy to use dashboards through web apps and mobile apps (Android and
          iOS), from anywhere.
        </SectionHeading>
        <div className="bento-grid">
          <div className="bento-feature" data-reveal>
            <div>
              <span className="icon-tile">
                <Layers3 size={24} />
              </span>
              <h3>{benefits[0][0]}</h3>
              <p>{benefits[0][1]}</p>
            </div>
            <img
              src={asset("Control room wall")}
              alt="Control room with original ETi-SOL dashboards"
              loading="lazy"
              width="600"
              height="400"
            />
            <Link
              to="/eti-sol/"
              aria-label="Explore multi-plant monitoring"
              className="round-link"
            >
              <ArrowUpRight size={21} />
            </Link>
          </div>
          {benefits.slice(1).map(([title, description], i) => {
            const Icon = icons[i + 1];
            return (
              <div className={`bento-card bento-${i}`} key={title} data-reveal>
                <span className="icon-tile">
                  <Icon size={23} strokeWidth={1.5} />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="mono card-number">0{i + 2}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const dashboards = [
  {
    title: "Portfolio overview",
    query: "console-home",
    caption:
      "One dashboard across all plants, with the live status of all the equipment of plants in different geographies.",
  },
  {
    title: "Plant performance",
    query: "console-plant-overview",
    caption:
      "Performance ratio, CUF, yield, insolation and irradiance, with expected generation compared against the PVsyst model.",
  },
  {
    title: "Inverter analytics",
    query: "Inverter dashboard",
    caption: "Insight into the best and worst performing inverter.",
  },
  {
    title: "Forecast reports",
    query: "console-ecast",
    caption:
      "Forecasts solar plant generation from weather data: day-ahead, week-ahead and intra-day reports.",
  },
];
export function DashboardShowcase() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section className="section dashboard-section">
      <div className="container">
        <div className="dashboard-heading">
          <Eyebrow number="04">A CLEARER PICTURE</Eyebrow>
          <h2>
            Your plant.
            <br />
            In <span className="olive">perspective.</span>
          </h2>
          <p>
            More than monitoring: intelligent analytics that detect, report and
            help you close performance gaps and energy losses.
          </p>
        </div>
        <div
          className="dashboard-tabs"
          role="tablist"
          aria-label="Dashboard views"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const n = (active + (e.key === "ArrowRight" ? 1 : 3)) % 4;
              setActive(n);
              document.getElementById("dashboard-tab-" + n)?.focus();
            }
          }}
        >
          {dashboards.map((d, i) => (
            <button
              key={d.title}
              id={"dashboard-tab-" + i}
              aria-controls="dashboard-view"
              role="tab"
              tabIndex={active === i ? 0 : -1}
              aria-selected={active === i}
              onClick={() => setActive(i)}
            >
              {d.title}
            </button>
          ))}
        </div>
        <div
          className="dashboard-frame"
          id="dashboard-view"
          role="tabpanel"
          aria-labelledby={"dashboard-tab-" + active}
        >
          <div className="browser-top">
            <div>
              <i />
              <i />
              <i />
            </div>
            <span className="mono">
              ETi-SOL / {dashboards[active].title.toUpperCase()}
            </span>
            <span className="mono">APPLICATION PREVIEW</span>
          </div>
          <motion.img
            key={active}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            src={asset(dashboards[active].query)}
            alt={`Original EnerMAN screenshot: ${dashboards[active].title}`}
            loading="lazy"
            width="1400"
            height="670"
          />
        </div>
        <div className="dashboard-footer">
          <p>{dashboards[active].caption}</p>
          <Link to="/eti-sol/" className="text-button">
            Explore the platform
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section className="section industries-section">
      <div className="container">
        <SectionHeading
          number="05"
          label="DESIGNED FOR YOUR WORLD"
          title={
            <>
              Different plants.
              <br />
              Shared possibilities.
            </>
          }
        >
          IPPs, EPCs, utility and C&I rooftop owners, PM-KUSUM projects and O&M
          providers.
        </SectionHeading>
        <div className="industry-grid">
          {industries.map(([title, description, route], i) => (
            <Link to={route} className="industry" key={title} data-reveal>
              <span className="mono">0{i + 1}</span>
              <ArrowUpRight className="industry-arrow" size={25} />
              <h3>{title}</h3>
              <p>{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AwardsPreview() {
  return (
    <section className="section awards-preview">
      <div className="container">
        <SectionHeading
          number="06"
          label="RECOGNISED BY THE INDUSTRY"
          title={<>Progress, recognised.</>}
          action={
            <Button to="/awards/" secondary>
              All awards & recognition
            </Button>
          }
        />
        <div className="award-preview-grid">
          {awards.slice(0, 3).map((a, i) => (
            <Link to="/awards/" className="award-preview" key={i} data-reveal>
              <div className="award-image">
                <img
                  src={a.image.src}
                  alt={a.image.alt}
                  loading="lazy"
                  width="210"
                  height="290"
                />
                <span className="round-link">
                  <ArrowUpRight size={19} />
                </span>
              </div>
              <span className="mono">{a.year} / RECOGNITION</span>
              <h3>{a.title}</h3>
              <p>{a.organization}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ArticleCard({
  article,
  featured = false,
}: {
  article: (typeof articles)[number];
  featured?: boolean;
}) {
  return (
    <Link
      to={article.route}
      className={`article-card ${featured ? "featured" : ""}`}
      data-reveal
    >
      <div className="article-image">
        {article.image?.src ? (
          <img
            src={article.image.src}
            alt={article.image.alt || article.title}
            loading="lazy"
            width="600"
            height="400"
          />
        ) : (
          <div className="article-placeholder">
            <Sun size={50} strokeWidth={1} />
          </div>
        )}
        <span className="round-link">
          <ArrowUpRight size={21} />
        </span>
      </div>
      <div className="article-meta mono">
        <span>{article.category}</span>
        <span>{article.date}</span>
      </div>
      <h3>{article.title}</h3>
      <p>{article.description}</p>
    </Link>
  );
}
export function Insights() {
  const selected = [
    articles.find((a) => a.category === "Case Study"),
    articles.find((a) => a.route === "/why-plant-owners-replace-their-scada/"),
    articles.find((a) => a.route === "/eti-sol-dashboard-reports-alerts-kpis/"),
  ].filter(Boolean) as typeof articles;
  return (
    <section className="section insights-section">
      <div className="container">
        <SectionHeading
          number="07"
          label="FROM THE LIBRARY"
          title={
            <>
              Knowledge that
              <br />
              powers progress.
            </>
          }
          action={
            <Button to="/resource/" secondary>
              Explore the library
            </Button>
          }
        />
        <div className="article-grid">
          {selected.map((a) => (
            <ArticleCard key={a.route} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import type { SourcePage } from "../data/types";
import { usePageMotion } from "../hooks/useMotion";
import { products, asset, phoneNumbers, mapUrl, social } from "../data/content";
import articles from "../data/articles.json";
import awards from "../data/awards.json";
import { ArticleCard } from "../components/HomeSections";
import { Button, Eyebrow, Metrics, SectionHeading } from "../components/ui";
import { FinalCTA } from "../components/Layout";
import {
  SourceBlock,
  SourceSection,
  sectionId,
} from "../components/SourceContent";
import ContactForm from "../components/ContactForm";
const modules = import.meta.glob<{ default: SourcePage }>(
  "../data/pages/*.json",
);
const initialPage = () => {
  try {
    return JSON.parse(
      document.getElementById("page-data")?.textContent || "null",
    ) as SourcePage | null;
  } catch {
    return null;
  }
};
function Contact({ demo }: { demo: boolean }) {
  return (
    <section className="section">
      <div className="container contact-grid">
        <div className="contact-info">
          <Eyebrow>CONTACT ENERMAN</Eyebrow>
          <h1>
            Let’s connect
            <br />
            for <span className="olive">smarter energy.</span>
          </h1>
          <p>
            Whether you’re looking for customized SCADA systems, hybrid power
            monitoring, or want to collaborate on a renewable energy project,
            we’re here to help.
          </p>
          <div className="contact-detail">
            <MapPin size={22} />
            <div>
              <h3>Head office</h3>
              <p>
                EnerMAN Technologies Pvt Ltd
                <br />
                No. 12 & 13, Daystar Center, 10th Cross,
                <br />
                Pampa Extension, Kempapura, Hebbal,
                <br />
                Bengaluru 560024, Karnataka, India
              </p>
              <a
                href={mapUrl}
                className="text-button"
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="contact-detail">
            <Mail size={22} />
            <div>
              <h3>Email us</h3>
              {[
                ["Product sales", "sales@enerman.in"],
                ["Customer support", "support@enerman.in"],
                ["Enquiries", "info@enerman.in"],
              ].map(([label, email]) => (
                <p key={email}>
                  <span>{label}</span>
                  <a href={"mailto:" + email}>{email}</a>
                </p>
              ))}
            </div>
          </div>
          <div className="contact-detail">
            <Phone size={22} />
            <div>
              <h3>Call us</h3>
              {phoneNumbers.map((n) => (
                <a href={"tel:" + n.replaceAll(" ", "")} key={n}>
                  {n}
                </a>
              ))}
            </div>
          </div>
          <div className="contact-social">
            {social.map(([n, u]) => (
              <a key={n} href={u} target="_blank" rel="noreferrer">
                {n}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
        <ContactForm demo={demo} />
      </div>
    </section>
  );
}
function Library() {
  const [category, setCategory] = useState("All");
  const categories = ["All", "IoT", "Analytics", "Case Study", "Products"];
  return (
    <section className="section">
      <div className="container">
        <div className="page-title">
          <Eyebrow>WHITE PAPERS & CASE STUDIES</Eyebrow>
          <h1>
            The <span className="olive">library.</span>
          </h1>
          <p>
            From plant-level data to meaningful insights. Explore EnerMAN’s
            articles and case studies.
          </p>
        </div>
        <div className="filter-bar" role="group" aria-label="Filter articles">
          {categories.map((c) => (
            <button
              aria-pressed={category === c}
              className={category === c ? "active" : ""}
              key={c}
              onClick={() => setCategory(c)}
            >
              {c}
              <span>
                {c === "All"
                  ? articles.length
                  : articles.filter((a) => a.category === c).length}
              </span>
            </button>
          ))}
        </div>
        <div className="article-grid library-grid">
          {articles
            .filter((a) => category === "All" || a.category === category)
            .map((a) => (
              <ArticleCard key={a.route} article={a} />
            ))}
        </div>
        <section className="datasheets">
          <SectionHeading
            label="TECHNICAL RESOURCES"
            title="Product datasheets"
          />
          <p>
            What it monitors, what it needs on site, what it reports. Full
            manual on request.
          </p>
          <div className="datasheet-grid">
            {products.map((p, i) => (
              <Link
                key={p.name}
                to={
                  p.route +
                  (i < 3 ? "#" + p.name.toLowerCase() + "-datasheet" : "")
                }
              >
                <span className="mono">{p.category}</span>
                <h3>{p.name}</h3>
                <p>{p.label}</p>
                <span className="text-button">
                  {i < 3 ? "Request datasheet" : "Explore product"}
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
function Awards({ page }: { page: SourcePage }) {
  return (
    <section className="section">
      <div className="container">
        <div className="page-title">
          <Eyebrow>AWARDS & RECOGNITION</Eyebrow>
          <h1>
            Progress,
            <br />
            <span className="olive">recognised.</span>
          </h1>
          <p>
            {
              page.blocks.find(
                (b, i) =>
                  b.type === "p" &&
                  i > page.blocks.findIndex((x) => x.type === "h1"),
              )?.text
            }
          </p>
        </div>
        <div className="award-gallery">
          {awards.map((a, i) => (
            <article key={i} data-reveal>
              <a
                className="award-certificate"
                href={a.image.src}
                target="_blank"
                rel="noreferrer"
                aria-label={`View certificate: ${a.title}`}
              >
                <img
                  src={a.image.src}
                  alt={a.image.alt}
                  loading="lazy"
                  width="724"
                  height="1024"
                />
                <span className="round-link">
                  <ArrowUpRight size={20} />
                </span>
              </a>
              <span className="mono">{a.year} / RECOGNITION</span>
              <h2>{a.title}</h2>
              <p>{a.organization}</p>
            </article>
          ))}
        </div>
        {page.sections
          .filter((s) => s.heading.includes("SuryaCon"))
          .map((s, i) => (
            <SourceSection section={s} index={i + 1} key={s.heading} />
          ))}
      </div>
    </section>
  );
}
function Team({ page }: { page: SourcePage }) {
  const images = page.blocks
    .filter(
      (b) => b.type === "image" && !b.original?.toLowerCase().includes("logo"),
    )
    .map((b) => {
      const dimensions = b.src?.match(/-(\d+)x(\d+)\./);
      return {
        ...b,
        width: b.width || Number(dimensions?.[1]) || 900,
        height: b.height || Number(dimensions?.[2]) || 500,
      };
    });
  const hero = images.find((b) => b.alt?.includes("company polo")) || images[0];
  const headings = page.blocks.filter((b) => b.type === "h2");
  return (
    <section className="section">
      <div className="container">
        <div className="page-title">
          <Eyebrow>LIFE AT ENERMAN</Eyebrow>
          <h1>{page.heading}</h1>
          <p>{headings[0]?.text}</p>
        </div>
        {hero && (
          <figure className="team-hero-photo">
            <img
              src={hero.src}
              alt={hero.alt || "The EnerMAN team"}
              width={hero.width || 1024}
              height={hero.height || 574}
              fetchPriority="high"
            />
          </figure>
        )}
        <div className="team-gallery">
          {images
            .filter((b) => b !== hero)
            .map((b, i) => (
              <figure key={b.src} data-reveal>
                <a href={b.src} target="_blank" rel="noreferrer">
                  <img
                    src={b.src}
                    alt={
                      b.alt?.includes("Ayudha")
                        ? "Ayudha Puja celebration at EnerMAN"
                        : `EnerMAN company gallery photograph ${i + 1}`
                    }
                    loading="lazy"
                    width={b.width || 900}
                    height={b.height || 500}
                  />
                </a>
              </figure>
            ))}
        </div>
        <div className="team-join">
          <h2>{headings[headings.length - 1]?.text}</h2>
          <a
            href="mailto:sales@enerman.in?subject=Careers%20at%20EnerMAN"
            className="text-button"
          >
            Contact EnerMAN
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
function Catalog({ page }: { page: SourcePage }) {
  const [category, setCategory] = useState("All");
  return (
    <section className="section">
      <div className="container">
        <div className="page-title">
          <Eyebrow>THE ENERMAN ECOSYSTEM</Eyebrow>
          <h1>
            IoT SCADA and RMS products
            <br />
            <span className="olive">for solar plants.</span>
          </h1>
          <p>
            {
              page.blocks.find(
                (b, i) =>
                  b.type === "p" &&
                  i > page.blocks.findIndex((x) => x.type === "h1"),
              )?.text
            }
          </p>
          <p>
            {
              page.sections
                .find((s) => s.heading === "Seven products")
                ?.blocks.find((b) => b.type === "p")?.text
            }
          </p>
        </div>
        <div className="filter-bar" role="group" aria-label="Filter products">
          {["All", "Monitor", "Control", "Forecast"].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              className={category === c ? "active" : ""}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="catalog-grid">
          {products
            .filter((p) => category === "All" || p.category === category)
            .map((p) => (
              <Link
                key={p.name}
                to={p.route}
                id={
                  p.name === "ETi-SOL"
                    ? "monitor"
                    : p.name === "ETi-PPC"
                      ? "control"
                      : p.name === "ETi-CAST"
                        ? "forecast"
                        : undefined
                }
                className="catalog-card"
              >
                <div className="catalog-image">
                  <img
                    src={asset(p.imageQuery) || asset("Inverter dashboard")}
                    alt={p.label + " — original EnerMAN product visual"}
                    loading="lazy"
                    width="600"
                    height="350"
                  />
                  <span className="round-link">
                    <ArrowUpRight size={22} />
                  </span>
                </div>
                <span className="mono">
                  {p.category} / {p.label}
                </span>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
              </Link>
            ))}
        </div>
        {page.sections
          .filter((s) =>
            [
              "From the panel in the field to one screen",
              "In the cloud or on your own server",
            ].includes(s.heading),
          )
          .map((s, i) => (
            <SourceSection key={s.heading} section={s} index={i + 1} />
          ))}
      </div>
    </section>
  );
}
function Editorial({ page }: { page: SourcePage }) {
  const product = products.find((p) => p.route === page.route);
  const article = articles.find(
    (a) => a.route === page.route || a.title === page.heading,
  );
  const titleIndex = page.blocks.findIndex((b) => b.type === "h1");
  const intro = page.sections[0];
  const companyLabel = (text = "") =>
    (page.route === "/about-us/" &&
      [
        "What we do",
        "Vision",
        "Mission",
        "Team EnerMAN",
        "How we build",
      ].includes(text)) ||
    (page.route === "/news-updates/" &&
      ["Latest", "Press archive"].includes(text));
  const imageCaption =
    page.route === "/about-us/"
      ? intro.blocks.find(
          (b) => b.text === "An EnerMAN panel cabinet, built in-house.",
        )
      : undefined;
  const introductoryCopy = intro.blocks.filter(
    (b, i) =>
      i > titleIndex &&
      b.type === "p" &&
      b.text &&
      b !== imageCaption &&
      !companyLabel(b.text) &&
      !/^(?:Book|Download)\b/.test(b.text) &&
      !/^\d{1,2} [A-Z][a-z]+ \d{4}$/.test(b.text) &&
      !/^(?:[\d+.,]+|GW Portfolio|Solar Plants|Customers|Countries|What it does)$/.test(
        b.text,
      ),
  );
  const description = introductoryCopy[0];
  const image = intro.blocks.find((b) => b.type === "image");
  const sections = page.sections
    .slice(1)
    .filter((s) => s.heading !== "Bring your solar plants to one screen.")
    .map((s) => ({
      ...s,
      blocks: s.blocks.filter((b) => !companyLabel(b.text)),
    }));
  const isArticle = !!article || page.route === "/terms-and-conditions/";
  return (
    <>
      <section
        className={`editorial-hero section ${product ? "product-detail-hero" : ""}`}
      >
        <div className="container">
          <Link
            className="breadcrumb"
            to={product ? "/products/" : article ? "/resource/" : "/"}
          >
            <ArrowLeft size={14} />
            {product
              ? "All solutions"
              : article
                ? "Back to the library"
                : "Home"}
          </Link>
          <div className={`editorial-title ${image ? "with-image" : ""}`}>
            <div>
              <Eyebrow>
                {product
                  ? product.category + " / " + product.label
                  : article
                    ? article.category
                    : page.route === "/about-us/"
                      ? "ABOUT ENERMAN"
                      : page.route === "/news-updates/"
                        ? "NEWS & UPDATES"
                        : "INFORMATION"}
              </Eyebrow>
              <h1>{product ? product.name : page.heading}</h1>
              {product && (
                <h2>{page.heading.replace(product.name + ":", "").trim()}</h2>
              )}
              {article && (
                <span className="mono article-date">{article.date}</span>
              )}
              {description && <SourceBlock block={description} />}
              {product && (
                <div className="hero-buttons">
                  <Button to="/inquiry-form/">
                    Book a 20-minute walkthrough
                  </Button>
                  {sections.some((s) => s.heading.includes("datasheet")) && (
                    <a
                      href={"#" + product.name.toLowerCase() + "-datasheet"}
                      className="text-button"
                    >
                      Request datasheet
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
            {image && (
              <figure>
                <img
                  src={image.src}
                  alt={image.alt || ""}
                  width={image.width || 900}
                  height={image.height || 500}
                  fetchPriority="high"
                />
                <figcaption>{imageCaption?.text || image.alt}</figcaption>
              </figure>
            )}
          </div>
          {product && <Metrics />}
        </div>
      </section>
      <div
        className={`container editorial-content ${isArticle ? "is-article" : ""}`}
      >
        <aside className="contents-nav" aria-label="On this page">
          <span className="mono">ON THIS PAGE</span>
          {sections.map((s, i) => (
            <a href={"#" + sectionId(s.heading)} key={i}>
              {s.heading}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </aside>
        <div className="editorial-sections">
          {introductoryCopy
            .filter((b) => b !== description)
            .map((b, i) => (
              <SourceBlock key={i} block={b} />
            ))}
          {sections.map((s, i) =>
            s.heading.toLowerCase().includes("datasheet") ? (
              <section
                id={sectionId(s.heading)}
                className="source-section"
                key={s.heading}
              >
                <div id="datasheet">
                  <ContactForm product={product?.name} />
                </div>
              </section>
            ) : (
              <SourceSection
                key={i}
                section={s}
                index={i + 1}
                article={isArticle}
                metadataBeforeHeading={
                  page.route === "/news-updates/" &&
                  s.heading === "Features and awards"
                }
              />
            ),
          )}
        </div>
      </div>
    </>
  );
}
export default function ContentPage() {
  const location = useLocation();
  const route = location.pathname.endsWith("/")
    ? location.pathname
    : location.pathname + "/";
  const [page, setPage] = useState<SourcePage | null>(initialPage);
  const [failed, setFailed] = useState(false);
  const scope = usePageMotion(page?.route === route ? route : null);
  useEffect(() => {
    let active = true;
    setFailed(false);
    if (page?.route === route) return;
    setPage(null);
    const load =
      modules["../data/pages/" + route.replaceAll("/", "") + ".json"];
    if (!load) {
      setFailed(true);
      return;
    }
    load()
      .then((m) => {
        if (active) setPage(m.default);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [route, page?.route]);
  if (failed)
    return (
      <div className="container not-found" data-page-ready>
        <Eyebrow>404 / PAGE NOT FOUND</Eyebrow>
        <h1>
          Let’s find
          <br />a clearer path.
        </h1>
        <Button to="/">Back to home</Button>
      </div>
    );
  if (!page || page.route !== route)
    return (
      <div className="container page-loading" data-page-loading role="status">
        Loading page…
      </div>
    );
  return (
    <div ref={scope} data-page-ready data-source-route={route}>
      {route === "/contact/" || route === "/inquiry-form/" ? (
        <Contact demo={route === "/inquiry-form/"} />
      ) : route === "/resource/" ? (
        <Library />
      ) : route === "/products/" ? (
        <Catalog page={page} />
      ) : route === "/awards/" ? (
        <Awards page={page} />
      ) : route === "/team/" ? (
        <Team page={page} />
      ) : (
        <Editorial page={page} />
      )}
      <FinalCTA />
    </div>
  );
}

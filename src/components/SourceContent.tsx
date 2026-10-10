import { Link } from "react-router-dom";
import { ArrowUpRight, Cpu, MonitorCog, Cloud } from "lucide-react";
import { internalHref } from "../data/content";
import type { Block, SourceLink, Section } from "../data/types";

export function SourceAnchor({ link }: { link: SourceLink }) {
  const href = internalHref(link.href);
  return href.startsWith("/") && !href.startsWith("/wp-content") ? (
    <Link to={href}>
      {link.label || "Learn more"}
      <ArrowUpRight size={14} />
    </Link>
  ) : (
    <a
      href={href}
      target={href.startsWith("https:") ? "_blank" : undefined}
      rel="noreferrer"
    >
      {link.label || "Learn more"}
      <ArrowUpRight size={14} />
    </a>
  );
}
export function SourceBlock({ block: b }: { block: Block }) {
  if (b.type === "image")
    return (
      <figure className="source-image">
        <a
          href={b.src}
          target="_blank"
          rel="noreferrer"
          aria-label={`View full image: ${b.alt}`}
        >
          <img
            src={b.src}
            alt={b.alt || ""}
            loading="lazy"
            width={b.width || 900}
            height={b.height || 500}
          />
        </a>
        {b.alt && <figcaption>{b.alt}</figcaption>}
      </figure>
    );
  if (b.type === "h1") return null;
  if (b.type === "p" && b.links?.length === 1 && b.text === b.links[0].label)
    return (
      <div className="source-links">
        <SourceAnchor link={b.links[0]} />
      </div>
    );
  if (b.type === "list")
    return (
      <ul className="source-list">
        {b.items?.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    );
  if (
    b.type === "h3" ||
    b.type === "h4" ||
    b.type === "h5" ||
    b.type === "h6"
  ) {
    const titleLink = b.links?.find((link) => link.label === b.text);
    const otherLinks = b.links?.filter((link) => link !== titleLink) || [];
    return (
      <h3>
        {titleLink ? <SourceAnchor link={titleLink} /> : b.text}
        {!!otherLinks.length && (
          <span className="source-links">
            {otherLinks.map((l, i) => (
              <SourceAnchor link={l} key={i} />
            ))}
          </span>
        )}
      </h3>
    );
  }
  return (
    <div className="source-paragraph">
      <p>{b.text}</p>
      {!!b.links?.length && (
        <div className="source-links">
          {b.links.map((l, i) => (
            <SourceAnchor link={l} key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
export const sectionId = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-$/, "");

export function CapabilitiesSection({
  section,
  index,
}: {
  section: Section;
  index: number;
}) {
  const firstHeading = section.blocks.findIndex((b) => b.type === "h3");
  const introduction = section.blocks
    .slice(0, firstHeading)
    .filter((b) => b.type !== "image");
  const cards: Block[][] = [];
  for (const block of section.blocks.slice(firstHeading)) {
    if (block.type === "image") continue;
    if (block.type === "h3") cards.push([]);
    cards.at(-1)?.push(block);
  }
  const icons = [Cpu, MonitorCog, Cloud];
  return (
    <section
      className="source-section capabilities-section"
      id={sectionId(section.heading)}
    >
      <div className="source-section-heading">
        <span className="mono">{String(index).padStart(2, "0")} /</span>
        <h2>{section.heading}</h2>
      </div>
      <div className="capabilities-intro">
        {introduction.map((block, i) => (
          <SourceBlock key={i} block={block} />
        ))}
      </div>
      <div className="capabilities-grid">
        {cards.map((blocks, i) => {
          const Icon = icons[i] || Cpu;
          return (
            <article
              className="capability-card"
              key={blocks[0].text}
              data-reveal
            >
              <div className="capability-card-top" aria-hidden="true">
                <span className="capability-icon">
                  <Icon size={25} strokeWidth={1.6} />
                </span>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              </div>
              {blocks.map((block, j) => (
                <SourceBlock key={j} block={block} />
              ))}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SourceSection({
  section,
  index,
  article = false,
  metadataBeforeHeading = false,
}: {
  section: Section;
  index: number;
  article?: boolean;
  metadataBeforeHeading?: boolean;
}) {
  const chunks: Block[][] = [];
  let chunk: Block[] = [];
  for (const b of section.blocks) {
    if (b.type === "h3" && chunk.length) {
      const preceding = chunk[chunk.length - 1];
      const headingContext =
        preceding?.type === "image" ||
        (metadataBeforeHeading &&
          preceding?.type === "p" &&
          !preceding.links?.length)
          ? chunk.pop()
          : undefined;
      if (chunk.length) chunks.push(chunk);
      chunk = headingContext ? [headingContext] : [];
    }
    chunk.push(b);
  }
  if (chunk.length) chunks.push(chunk);
  return (
    <section
      className={`source-section ${article ? "article-section" : ""}`}
      id={sectionId(section.heading)}
    >
      <div className="source-section-heading">
        <span className="mono">{String(index).padStart(2, "0")} /</span>
        <h2>{section.heading}</h2>
      </div>
      <div
        className={`${article ? "article-copy" : chunks.length > 2 ? "source-feature-grid" : "source-body"}`}
      >
        {chunks.map((chunk, i) => (
          <div className="source-group" key={i} data-reveal>
            {chunk.map((b, j) => (
              <SourceBlock key={j} block={b} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

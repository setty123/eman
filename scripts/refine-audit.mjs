import fs from "node:fs/promises";
import { load } from "cheerio";
const pages = JSON.parse(await fs.readFile("src/data/original.json", "utf8"));
for (const page of pages) {
  const raw = await fs.readFile(
    "docs/source/" + page.route.replaceAll("/", "_") + ".html",
    "utf8",
  );
  const $ = load(raw);
  const clean = (s) => s.replace(/\s+/g, " ").trim();
  if (!page.blocks.some((b) => b.type === "h1"))
    page.heading =
      page.blocks.find((b) => b.type === "h2")?.text || page.heading;
  $(".e-n-tab-title").each((_, el) => {
    const title = clean($(el).text());
    const panel = $("#" + $(el).attr("aria-controls"));
    const text = clean(panel.find("p").first().text());
    const i = page.blocks.findIndex((b) => b.text === text);
    if (i >= 0 && !page.blocks.some((b) => b.type === "h3" && b.text === title))
      page.blocks.splice(i, 0, { type: "h3", text: title, links: [] });
  });
  const sections = [];
  let section = { heading: "Introduction", blocks: [] };
  for (const b of page.blocks) {
    if (b.type === "h2") {
      if (section.blocks.length || section.heading !== "Introduction")
        sections.push(section);
      section = { heading: b.text, blocks: [] };
    } else section.blocks.push(b);
  }
  if (section.blocks.length || section.heading !== "Introduction")
    sections.push(section);
  page.sections = sections.map((s) => ({
    ...s,
    sourceURL: page.source,
    originalHeading: s.heading,
    proposedLocation:
      page.route +
      "#" +
      s.heading
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-$/, ""),
    proposedComponent: page.route === "/" ? "HomeSections" : "SourceSection",
    preservationStatus:
      "Original content retained; browser comparison tracked in docs/qa.",
  }));
}
await fs.writeFile("src/data/original.json", JSON.stringify(pages, null, 2));
const inventory = JSON.parse(
  await fs.readFile("docs/content-inventory.json", "utf8"),
);
inventory.pages = pages;
inventory.referenceAccess = {
  lenisCorporateShowcase:
    "Inspected in browser. Large typography, image-led layout, category controls.",
  maritimeFusion:
    "Inspected desktop hero and page structure from the corporate showcase: restrained navigation, clear audience segmentation, large infrastructure visualization.",
  suppliedSandOliveSite:
    "Redirected to OpenAI sign-in. Visual design unverified.",
};
await fs.writeFile(
  "docs/content-inventory.json",
  JSON.stringify(inventory, null, 2),
);
await import("./prepare.mjs");

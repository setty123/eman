import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import sharp from "sharp";

const root = process.cwd();
await fs.mkdir("docs/source", { recursive: true });
await fs.mkdir("src/data", { recursive: true });
await fs.mkdir("public/assets", { recursive: true });
const origin = "https://enerman.in";
const extend = process.argv.includes("--extend-sitemap");
const pages = extend
  ? JSON.parse(await fs.readFile("src/data/original.json", "utf8"))
  : [];
const oldAssets = extend
  ? JSON.parse(await fs.readFile("src/data/assets.json", "utf8"))
  : [];
const queue = extend
  ? [
      "/team/",
      "/why-iot-scada-is-revolutionizing-solar-power-plant-operations/",
    ]
  : ["/"];
const visited = new Set(pages.map((p) => p.route));
const assets = new Map(oldAssets.map((a) => [a.original, a]));
const failures = [];
const clean = (s) => s.replace(/\s+/g, " ").trim();
const abs = (url) => {
  try {
    return new URL(url, origin).href;
  } catch {
    return "";
  }
};
const fileFor = (url) =>
  "/assets/" +
  createHash("sha1").update(url).digest("hex").slice(0, 10) +
  "-" +
  decodeURIComponent(new URL(url).pathname.split("/").pop()).replace(
    /[^a-zA-Z0-9._-]/g,
    "-",
  );
while (queue.length && visited.size < 150) {
  const route = queue.shift();
  if (visited.has(route)) continue;
  visited.add(route);
  try {
    const res = await fetch(origin + route);
    if (!res.ok) throw Error(String(res.status));
    const raw = await res.text();
    await fs.writeFile(
      "docs/source/" + (route.replaceAll("/", "_") || "home") + ".html",
      raw,
    );
    const $ = load(raw);
    let main = $("main").first();
    if (!main.length) main = $("#primary").first();
    if (!main.length) main = $("body");
    main
      .find(
        "script,style,svg,form,nav,.elementor-widget-breadcrumbs,.yoast-breadcrumbs,.wpforms-container",
      )
      .remove();
    const links = [];
    $("a[href]").each((_, el) => {
      const href = abs($(el).attr("href"));
      const label = clean($(el).text()) || $(el).attr("aria-label") || "";
      if (!href || href.startsWith("javascript:")) return;
      links.push({ href, label });
      const u = new URL(href);
      if (
        u.origin === origin &&
        !u.search &&
        !/\.(png|jpe?g|gif|webp|svg|pdf|zip|xml|mp4|avif)$/i.test(u.pathname) &&
        !/^\/(wp-|feed|comments|author|tag|category|page)/.test(u.pathname)
      ) {
        const p = u.pathname.endsWith("/") ? u.pathname : u.pathname + "/";
        if (!visited.has(p) && !queue.includes(p)) queue.push(p);
      }
      if (u.origin === origin && /\.(pdf|zip)$/i.test(u.pathname))
        assets.set(href, {
          original: href,
          local: fileFor(href),
          uses: [route],
          type: "download",
          retain: true,
        });
    });
    $("img[src]").each((_, el) => {
      const url = abs($(el).attr("src"));
      if (!url || url.startsWith("data:")) return;
      const current = assets.get(url);
      if (current) current.uses.push(route);
      else
        assets.set(url, {
          original: url,
          local: fileFor(url),
          alt: $(el).attr("alt") || "",
          uses: [route],
          type: "image",
          retain: !/loading|spinner/i.test(url),
        });
    });
    const title = $("title").text();
    const description = $("meta[name=description]").attr("content") || "";
    const blocks = [];
    main
      .find(
        "h1,h2,h3,h4,h5,h6,p,ul,ol,table,img,.elementor-toggle-title,.elementor-button, .elementor-heading-title",
      )
      .each((_, el) => {
        const e = $(el);
        const tag = el.tagName;
        if (e.parents("p,ul,ol,table,h1,h2,h3,h4,h5,h6").length) return;
        if (tag === "img") {
          const url = abs(e.attr("src"));
          if (assets.has(url))
            blocks.push({
              type: "image",
              src: assets.get(url).local,
              original: url,
              alt: e.attr("alt") || "",
              width: Number(e.attr("width")) || 0,
              height: Number(e.attr("height")) || 0,
            });
          return;
        }
        const value = clean(e.text());
        if (!value || /Please enable JavaScript|Home\s*\//i.test(value)) return;
        const type = /^h[1-6]$/.test(tag)
          ? tag
          : e.hasClass("elementor-toggle-title")
            ? "h3"
            : tag === "ul" || tag === "ol"
              ? "list"
              : tag === "table"
                ? "table"
                : "p";
        const contentLinks = e
          .find("a[href]")
          .addBack("a[href]")
          .map((_, a) => ({
            label: clean($(a).text()),
            href: abs($(a).attr("href")),
          }))
          .get();
        blocks.push({
          type,
          text: value,
          items:
            type === "list"
              ? e
                  .find("li")
                  .map((_, li) => clean($(li).text()))
                  .get()
              : undefined,
          links: contentLinks,
        });
      });
    const forms = [];
    const orig = load(raw);
    orig("form").each((_, el) => {
      const e = orig(el);
      forms.push({
        action: e.attr("action"),
        method: e.attr("method"),
        id: e.attr("id"),
        fields: e
          .find("input,textarea,select")
          .map((_, f) => ({
            name: orig(f).attr("name"),
            type: orig(f).attr("type"),
            required: orig(f).attr("required") !== undefined,
            value: /nonce|token/i.test(orig(f).attr("name") || "")
              ? "[ephemeral]"
              : orig(f).attr("value"),
          }))
          .get(),
      });
    });
    const sections = [];
    let section = { heading: "Introduction", blocks: [] };
    for (const b of blocks) {
      if (b.type === "h2") {
        if (section.blocks.length) sections.push(section);
        section = { heading: b.text, blocks: [] };
      } else section.blocks.push(b);
    }
    if (section.blocks.length) sections.push(section);
    const page = {
      route,
      source: origin + route,
      title,
      description,
      heading:
        blocks.find((b) => b.type === "h1")?.text || title.split("|")[0].trim(),
      blocks,
      sections,
      links,
      forms,
      status: "verified",
      proposedLocation: route,
      component:
        route === "/"
          ? "Home"
          : /^\/eti-/.test(route)
            ? "ProductDetail"
            : "EditorialPage",
    };
    pages.push(page);
    console.log(route, blocks.length, "blocks");
  } catch (err) {
    failures.push({ route, error: String(err), status: "unverified" });
    console.log("UNVERIFIED", route, String(err));
  }
}
let completed = 0;
const assetList = [...assets.values()];
for (let i = 0; i < assetList.length; i += 6)
  await Promise.all(
    assetList.slice(i, i + 6).map(async (a) => {
      if (!a.retain || a.status === "downloaded") return;
      try {
        const r = await fetch(a.original);
        if (!r.ok) throw Error(String(r.status));
        const buffer = Buffer.from(await r.arrayBuffer());
        await fs.writeFile(path.join(root, "public", a.local), buffer);
        a.bytes = buffer.length;
        a.status = "downloaded";
        if (a.type === "image" && !/logo|\.svg$|\.gif$/i.test(a.original)) {
          try {
            const target = a.local.replace(/\.[^.]+$/, ".webp");
            const result = await sharp(buffer)
              .resize({ width: 1800, withoutEnlargement: true })
              .webp({ quality: 85 })
              .toBuffer();
            if (result.length < buffer.length) {
              await fs.writeFile(path.join(root, "public", target), result);
              a.optimized = target;
              a.optimizedBytes = result.length;
            }
          } catch {}
        }
      } catch (err) {
        a.status = "unverified";
        a.error = String(err);
      }
      completed++;
    }),
  );
for (const page of pages)
  for (const b of page.blocks)
    if (b.type === "image") {
      const a = assets.get(b.original);
      b.src = a.optimized || a.local;
    }
await fs.writeFile("src/data/original.json", JSON.stringify(pages, null, 2));
await fs.writeFile("src/data/assets.json", JSON.stringify(assetList, null, 2));
await fs.writeFile(
  "docs/content-inventory.json",
  JSON.stringify(
    { auditedAt: new Date().toISOString(), pages, assets: assetList, failures },
    null,
    2,
  ),
);
await fs.writeFile(
  "docs/CONTENT-AUDIT.md",
  "# EnerMAN content and route inventory\n\nSource: https://enerman.in/. Audit performed before UI implementation. Full original section headings, text, links, form field definitions and asset provenance are in `content-inventory.json`; raw page HTML is in `source/`.\n\n" +
    pages
      .map(
        (p) =>
          `- ${p.route} — ${p.heading}; ${p.blocks.length} content blocks; verified; retained at the same route via ${p.component}.`,
      )
      .join("\n") +
    "\n\n## Unverified\n" +
    JSON.stringify(failures, null, 2) +
    "\n\n## Reference access\nLenis homepage, templates and official GitHub documentation read. Corporate showcase could not be fetched via web text tool. The supplied chatgpt.site reference redirects to OpenAI sign-in in the browser and is unverified. No visual behavior has been invented for inaccessible references.\n",
);
console.log(
  JSON.stringify({ pages: pages.length, assets: completed, failures }, null, 2),
);

import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";
const pages = JSON.parse(await fs.readFile("src/data/original.json", "utf8"));
const fontPreloads = (await fs.readdir("dist/assets"))
  .filter((name) => /^(sora|manrope)-latin-wght-normal-.*\.woff2$/.test(name))
  .map(
    (name) =>
      `<link rel="preload" href="/assets/${name}" as="font" type="font/woff2" crossorigin>`,
  )
  .join("");
const html = (await fs.readFile("dist/index.html", "utf8")).replace(
  "</head>",
  fontPreloads + "</head>",
);
const types = {
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const relative = decodeURIComponent(url.pathname).replace(/^\//, "");
    const file = path.resolve("dist", relative);
    if (
      !file.startsWith(path.resolve("dist") + path.sep) &&
      file !== path.resolve("dist")
    ) {
      res.writeHead(403).end();
      return;
    }
    let buffer;
    try {
      buffer = await fs.readFile(file);
      res.setHeader(
        "Content-Type",
        types[path.extname(file)] || "application/octet-stream",
      );
    } catch {
      buffer = html;
      res.setHeader("Content-Type", "text/html");
    }
    res.end(buffer);
  } catch {
    res.writeHead(500).end();
  }
});
await new Promise((resolve) => server.listen(4181, "127.0.0.1", resolve));
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  for (const source of pages) {
    await page.goto("http://127.0.0.1:4181" + source.route, {
      waitUntil: "networkidle",
    });
    await page.locator("h1").waitFor();
    await page.waitForFunction(
      () => !document.querySelector("[data-page-loading]"),
    );
    await page.evaluate(() => document.fonts.ready);
    let rendered = await page.content();
    // Vite adds absolute preload URLs at runtime. Keep snapshots portable.
    rendered = rendered.replaceAll("http://127.0.0.1:4181/", "/");
    rendered = rendered.replace(/(<html[^>]*?) class="[^"]*"/g, "$1");
    rendered = rendered.replace(
      "</body>",
      `<script id="page-data" type="application/json">${JSON.stringify(source).replaceAll("<", "\\u003c")}</script></body>`,
    );
    if (source.route === "/") {
      rendered = rendered.replace(
        "</head>",
        '<script type="application/ld+json">' +
          JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "EnerMAN Technologies Pvt Ltd",
            url: "https://enerman.in/",
            telephone: "+919980698001",
            email: "sales@enerman.in",
            address: {
              "@type": "PostalAddress",
              streetAddress:
                "No. 12 & 13, Daystar Center, 10th Cross, Pampa Extension, Kempapura, Hebbal",
              addressLocality: "Bengaluru",
              addressRegion: "Karnataka",
              postalCode: "560024",
              addressCountry: "IN",
            },
          }) +
          "</script></head>",
      );
    }
    const dir = path.join("dist", source.route);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "index.html"), rendered);
    console.log("Prerendered", source.route);
  }
  await fs.writeFile("dist/404.html", html);
  await fs.writeFile(
    "dist/sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      pages
        .map((p) => "<url><loc>https://enerman.in" + p.route + "</loc></url>")
        .join("") +
      "</urlset>",
  );
} finally {
  await browser?.close();
  server.close();
}

import fs from "node:fs/promises";
import path from "node:path";
import { createServer } from "node:http";
import { chromium } from "@playwright/test";

const design = JSON.parse(
  await fs.readFile("src/redesign/design.json", "utf8"),
);
const redirects = JSON.parse(
  await fs.readFile("src/redesign/redirects.json", "utf8"),
);
const root = path.resolve("dist");
const html = await fs.readFile("dist/index.html", "utf8");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    const file = path.resolve(
      root,
      decodeURIComponent(url.pathname).replace(/^\//, ""),
    );
    if (file !== root && !file.startsWith(root + path.sep)) {
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
  for (const route of design.routes) {
    await page.goto("http://127.0.0.1:4181" + route, {
      waitUntil: "networkidle",
    });
    await page.locator("h1").waitFor();
    await page.evaluate(() => document.fonts.ready);
    const rendered = (await page.content()).replaceAll(
      "http://127.0.0.1:4181/",
      "/",
    );
    const dir = path.join(root, route);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, "index.html"), rendered);
    console.log("Prerendered", route);
  }
  for (const [from, to] of Object.entries(redirects)) {
    const dir = path.join(root, from);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, "index.html"),
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${to}"><link rel="canonical" href="https://enerman.in${to.split("#")[0]}"><title>Continue to EnerMAN</title></head><body><a href="${to}">Continue to EnerMAN</a></body></html>`,
    );
  }
  await fs.writeFile(path.join(root, "404.html"), html);
  await fs.writeFile(
    path.join(root, "sitemap.xml"),
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      design.routes
        .map((route) => `<url><loc>https://enerman.in${route}</loc></url>`)
        .join("") +
      "</urlset>",
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

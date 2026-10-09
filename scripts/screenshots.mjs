import fs from "node:fs/promises";
import { chromium } from "@playwright/test";

await fs.mkdir("docs/qa", { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  for (const [route, name] of [
    ["/", "home-full"],
    ["/eti-sol/", "product-full"],
    ["/about-us/", "company-full"],
    ["/team/", "team-full"],
    ["/news-updates/", "news-full"],
    ["/eti-sol-dashboard-reports-alerts-kpis/", "article-full"],
  ]) {
    await page.goto("http://127.0.0.1:4173" + route, {
      waitUntil: "networkidle",
    });
    await page.locator("h1").waitFor();
    await page.evaluate(async () => {
      const images = [...document.images];
      images.forEach((image) => (image.loading = "eager"));
      await Promise.allSettled(images.map((image) => image.decode()));
      await document.fonts.ready;
    });
    await page.screenshot({ path: `docs/qa/${name}.png`, fullPage: true });
    console.log("Captured", route);
  }
} finally {
  await browser.close();
}

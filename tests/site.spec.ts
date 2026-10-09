import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
const routes = JSON.parse(fs.readFileSync("src/data/routes.json", "utf8")) as {
  route: string;
  title: string;
}[];
const source = JSON.parse(fs.readFileSync("src/data/original.json", "utf8"));
const browserErrors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});
test.afterEach(async ({ page }) => {
  expect(
    browserErrors.get(page) || [],
    "Browser console and runtime errors",
  ).toEqual([]);
});
test("all original routes, page titles, images and internal destinations work", async ({
  page,
}) => {
  test.setTimeout(300000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const missing: any[] = [];
  let allText = "";
  for (const route of routes) {
    await page.goto(route.route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator("[data-page-loading]")).toHaveCount(0);
    const images = await page.evaluate(async () => {
      const imgs = [...document.images];
      imgs.forEach((i) => (i.loading = "eager"));
      await Promise.allSettled(imgs.map((i) => i.decode()));
      return imgs.filter((i) => !i.naturalWidth).map((i) => i.src);
    });
    expect(images, route.route + " broken images").toEqual([]);
    if (route.route === "/team/")
      await expect(page.locator(".team-gallery img")).toHaveCount(7);
    if (route.route === "/news-updates/") {
      const stories = page.locator("#features-and-awards .source-group");
      await expect(stories).toHaveCount(4);
      await expect(stories.nth(0)).toContainText("Power Plant Controller");
      await expect(stories.nth(0)).toContainText(/March\s+2025/);
      await expect(stories.nth(1)).toContainText(/October\s+2023/);
      await expect(stories.nth(2)).toContainText(/February\s+2023/);
      await expect(stories.nth(3)).toContainText(/January\s+2023/);
    }
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")!));
    for (const href of hrefs) {
      const path = href.split("#")[0].split("?")[0];
      if (!path.startsWith("/assets/") && path)
        expect(
          routes.some(
            (r) => r.route === (path.endsWith("/") ? path : path + "/"),
          ),
          href,
        ).toBeTruthy();
    }
    const normalized = await page
      .locator("main")
      .textContent()
      .then((t) => (t || "").replace(/\s+/g, " "));
    allText += " " + normalized;
    const original = source.find((p: any) => p.route === route.route);
    for (const b of original.blocks) {
      if (
        b.type === "p" &&
        b.text?.length > 65 &&
        !normalized.includes(b.text.replace(/\s+/g, " "))
      )
        missing.push({ route: route.route, text: b.text });
    }
  }
  fs.mkdirSync("docs/qa", { recursive: true });
  fs.writeFileSync(
    "docs/qa/content-comparison.json",
    JSON.stringify(
      {
        comparedRoutes: routes.length,
        baseURL: test.info().project.use.baseURL,
        checkedAt: new Date().toISOString(),
        comparison:
          "Exact text comparison of source prose over 65 characters; original product summaries may be regrouped on their detail pages.",
        movedOrRegrouped: missing,
        missingAcrossSite: missing.filter(
          (m) => !allText.includes(m.text.replace(/\s+/g, " ")),
        ),
      },
      null,
      2,
    ),
  );
  expect(
    missing.filter((m) => !allText.includes(m.text.replace(/\s+/g, " "))),
    "Original paragraphs must remain available across the redesigned site",
  ).toEqual([]);
});
for (const width of [360, 390, 768, 1024, 1440, 1920])
  test(`responsive homepage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    ).toBeTruthy();
    await page.screenshot({ path: `docs/qa/home-${width}.png` });
    for (const url of [
      "/eti-sol/",
      "/about-us/",
      "/resource/",
      "/contact/",
      "/awards/",
      "/news-updates/",
    ]) {
      await page.goto(url);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        url + " overflow at " + width,
      ).toBeTruthy();
    }
  });
test("product and dashboard tabs support clicks and keyboard navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "ETi-LOG" }).click();
  await expect(page.locator("#product-preview h3")).toHaveText("ETi-LOG");
  await page.getByRole("tab", { name: "ETi-LOG" }).press("ArrowDown");
  await expect(page.locator("#product-preview h3")).toHaveText("ETi-PPC");
  await page
    .getByRole("tab", { name: "Plant performance", exact: true })
    .click();
  await expect(page.locator("#dashboard-view img")).toHaveAttribute(
    "alt",
    /Plant performance/,
  );
  await page
    .getByRole("tab", { name: "Plant performance", exact: true })
    .press("ArrowRight");
  await expect(page.locator("#dashboard-view img")).toHaveAttribute(
    "alt",
    /Inverter analytics/,
  );
});
test("mobile menu, escape, route navigation, back and forward", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Library" })
    .click();
  await expect(page).toHaveURL(/resource/);
  await expect(page.locator("h1")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("h1")).toContainText("Monitor");
  await page.goForward();
  await expect(page.locator("h1")).toContainText("library");
});
test("anchor scrolling, FAQ state, filters and natural reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Scroll to explore" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(300);
  const faq = page.getByRole("button", { name: /Does EnerMAN SCADA work/ });
  await faq.click();
  await expect(faq).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("region", { name: /Does EnerMAN SCADA work/ }),
  ).toBeVisible();
  await page.goto("/resource/");
  await page.getByRole("button", { name: /Analytics/ }).click();
  await expect(page.locator(".library-grid .article-card")).toHaveCount(1);
  await page.goto("/products/");
  await page.getByRole("button", { name: "Forecast", exact: true }).click();
  await expect(page.locator(".catalog-card")).toHaveCount(1);
});
test("enquiry validates required fields and prepares a real email without claiming submission", async ({
  page,
}) => {
  await page.goto("/inquiry-form/");
  await page.getByRole("button", { name: "Prepare email request" }).click();
  expect(await page.locator("input:invalid").count()).toBeGreaterThan(0);
  await page.getByLabel("First name").fill("Test");
  await page.getByLabel("Last name").fill("Visitor");
  await page.getByLabel("Email", { exact: false }).fill("test@example.com");
  await page.getByLabel("Mobile number").fill("+91 99806 98001");
  await page.getByLabel("Company name").fill("QA example");
  await page.getByRole("button", { name: "Prepare email request" }).click();
  await expect(page.getByRole("status")).toContainText("review and send");
  await expect(
    page.getByRole("link", { name: "Open email app" }),
  ).toHaveAttribute("href", /^mailto:sales@enerman.in\?subject=/);
  await expect(page.getByRole("status")).not.toContainText("accepted");
});
test("normal scrolling stays synchronized and route scroll positions restore", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveClass(/lenis/);
  await page.mouse.move(800, 400);
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(600);
  const previous = await page.evaluate(() => scrollY);
  await page.locator('footer a[href="/about-us/"]').click();
  await expect(page.locator("h1")).toContainText("About EnerMAN");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(20);
  await page.goBack();
  await expect(page.locator("h1")).toContainText("Monitor");
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(previous - 100);
});

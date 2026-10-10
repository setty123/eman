import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
const design = JSON.parse(fs.readFileSync("src/redesign/design.json", "utf8"));
const redirects = JSON.parse(
  fs.readFileSync("src/redesign/redirects.json", "utf8"),
);
const archive = JSON.parse(
  fs.readFileSync("src/redesign/content.json", "utf8"),
);
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const collected: string[] = [];
  errors.set(page, collected);
  page.on("pageerror", (error) => collected.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") collected.push(message.text());
  });
});
test.afterEach(async ({ page }) =>
  expect(errors.get(page), "Browser runtime and console errors").toEqual([]),
);

test("all consolidated pages retain source content, navigation and text-only design", async ({
  page,
}) => {
  let all = "";
  const destinations = new Set<string>();
  for (const route of design.routes) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/EnerMAN/);
    await expect(page.locator("img")).toHaveCount(0);
    await expect(page.locator("[data-design]")).toHaveAttribute(
      "data-design",
      design.name,
    );
    all +=
      " " +
      ((await page.locator("main").textContent()) || "").replace(/\s+/g, " ");
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) =>
        elements.map((el) => el.getAttribute("href")!),
      ))
      destinations.add(href);
  }
  const missing: string[] = [];
  for (const source of Object.values(archive) as any[])
    for (const block of source.blocks)
      if (
        block.type === "p" &&
        block.text?.length > 65 &&
        !all.includes(block.text.replace(/\s+/g, " "))
      )
        missing.push(source.route + ": " + block.text);
  expect(
    missing,
    "Substantive original paragraphs remain available in their consolidated sections",
  ).toEqual([]);
  for (const href of destinations) {
    const [route, hash] = href.split("#");
    const normalized = route.split("?")[0];
    if (
      normalized.startsWith("/assets/") ||
      normalized.startsWith("/wp-content/")
    )
      continue;
    expect(design.routes, href).toContain(normalized);
    if (hash) {
      await page.goto(href);
      await expect(page.locator(`[id="${hash}"]`), href).toHaveCount(1);
    }
  }
});
test("legacy URLs redirect into the correct consolidated section", async ({
  page,
}) => {
  for (const [from, to] of Object.entries(redirects)) {
    await page.goto(from);
    await expect(page).toHaveURL(
      new RegExp(String(to).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$"),
    );
    await expect(page.locator("h1")).toBeVisible();
    const hash = String(to).split("#")[1];
    if (hash) await expect(page.locator(`[id="${hash}"]`)).toBeVisible();
  }
});
test("responsive layouts, mobile menu and route navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of design.routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} overflow at ${width}`,
      ).toBeTruthy();
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: design.solutionsLabel })
    .click();
  await expect(page).toHaveURL(new RegExp(design.solutionsPath + "$"));
  await page.goBack();
  await expect(page.locator("h1")).toContainText("Monitor");
});
test("product filtering, specifications, deep links and article search", async ({
  page,
}) => {
  await page.goto(design.solutionsPath);
  await page.getByRole("button", { name: "Forecast" }).click();
  await expect(page.locator(".product-detail")).toHaveCount(1);
  await expect(page.locator(".product-detail")).toContainText("ETi-CAST");
  await page.getByRole("button", { name: "All", exact: false }).click();
  await expect(page.locator(".product-detail")).toHaveCount(7);
  await page.locator("#eti-sol summary").click();
  await expect(page.locator("#eti-sol")).toHaveAttribute("open", "");
  await expect(page.locator("#eti-sol .reading-copy")).toContainText(
    "Multi-plant view",
  );
  await page.goto(design.solutionsPath + "#eti-ppc-power-plant-controller");
  await expect(page.locator("#eti-ppc-power-plant-controller")).toHaveAttribute(
    "open",
    "",
  );
  await page.goto((design.companyPage ? "/company/" : "/") + "#insights");
  await page.getByRole("searchbox").fill("350 MW");
  await expect(page.locator(".insight-item")).toHaveCount(1);
  await page.locator(".insight-item summary").click();
  await expect(page.locator(".insight-item .reading-copy")).toBeVisible();
  await page.getByRole("searchbox").fill("no-matching-article-xyz");
  await expect(page.getByRole("status")).toContainText("No articles");
});
test("enquiry validation and reviewable email preparation", async ({
  page,
}) => {
  await page.goto("/contact/#enquiry");
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
  await page.goto("/contact/?product=ETi-SOL#enquiry");
  await expect(page.locator("form h2")).toHaveText("ETi-SOL datasheet");
});
test("scroll effects respond to native scrolling and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const before = await page
    .locator("[data-scene]")
    .first()
    .evaluate((el) => (el as HTMLElement).style.getPropertyValue("--phase"));
  await page.mouse.wheel(0, 650);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await expect
    .poll(() =>
      page
        .locator("[data-scene]")
        .first()
        .evaluate((el) =>
          (el as HTMLElement).style.getPropertyValue("--phase"),
        ),
    )
    .not.toBe(before);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveClass(/motion-off/);
  expect(
    await page
      .locator("[data-scene]")
      .first()
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--phase").trim(),
      ),
  ).toBe("1");
  await page.goto("/unavailable-page/");
  await expect(page.locator("h1")).toHaveText("Let’s reconnect.");
});

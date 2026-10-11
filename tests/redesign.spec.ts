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

test("futuristic preview, keyboard product explorer and scroll stages", async ({
  page,
}) => {
  test.skip(design.id !== "helio", "Helio-specific interactions");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const preview = page.locator(".h-console");
  await expect(preview).toContainText("ILLUSTRATIVE DATA · NOT LIVE");
  await preview.getByRole("button", { name: "Analyze", exact: true }).click();
  await expect(
    preview.getByRole("button", { name: "Analyze", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    preview.getByRole("img", {
      name: "Illustrative actual and expected solar generation curves",
    }),
  ).toBeVisible();
  await preview
    .getByRole("button", { name: "Notify", exact: true })
    .press("Enter");
  await expect(preview).toContainText("Inverter 03 · output deviation");
  await expect(preview).not.toContainText("2.48");
  await preview.getByRole("button", { name: "Monitor", exact: true }).click();
  await expect(preview).toContainText("PLANT OUTPUT");

  await page
    .getByRole("group", { name: "Jump to a signal stage" })
    .getByRole("button", { name: /Notify/ })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "The right signal. At the right moment.",
    }),
  ).toBeInViewport();
  await expect(page.locator(".h-processor")).toHaveClass(/stage-2/);
  const picker = page.getByRole("group", { name: "Explore EnerMAN products" });
  await picker.getByRole("button", { name: /ETi-CAST/ }).press("Enter");
  await expect(page.locator(".h-product-display h3")).toHaveText("ETi-CAST");
  await expect(
    page.getByRole("link", { name: "Explore ETi-CAST", exact: true }),
  ).toHaveAttribute("href", "/system/#eti-cast-solar-generation-forecasting");
  await page
    .getByRole("link", { name: "Explore ETi-CAST", exact: true })
    .click();
  await expect(
    page.locator("#eti-cast-solar-generation-forecasting"),
  ).toHaveAttribute("open", "");
  await expect(
    page.locator("#eti-cast-solar-generation-forecasting .reading-copy"),
  ).toBeVisible();
});

test("phone signal stages keep the entire animation visible without auto-scrolling", async ({
  page,
}, testInfo) => {
  test.skip(design.id !== "helio", "Helio-specific phone layout");
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const reducedMotion of ["reduce", "no-preference"] as const) {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const controls = page.getByRole("group", {
        name: "Select a signal stage",
      });
      await controls.scrollIntoViewIfNeeded();
      const processor = page.locator(".h-processor");
      await expect(processor).toBeInViewport({ ratio: 1 });
      const initialScroll = await page.evaluate(() => scrollY);
      for (const [name, index, heading] of [
        ["Analyze", 1, "Find the meaning between the numbers."],
        ["Notify", 2, "The right signal. At the right moment."],
        ["Monitor", 0, "The whole plant. One clear signal."],
      ] as const) {
        await controls.getByRole("button", { name: new RegExp(name) }).click();
        await expect(processor).toHaveClass(new RegExp(`stage-${index}`));
        await expect(processor).toBeInViewport({ ratio: 1 });
        await expect(controls).toBeInViewport({ ratio: 1 });
        await expect(page.locator(".h-signal-step:visible")).toHaveCount(1);
        await expect(
          page
            .locator(".h-signal-step:visible")
            .getByRole("heading", { name: heading, exact: true }),
        ).toBeVisible();
        expect(
          Math.abs((await page.evaluate(() => scrollY)) - initialScroll),
        ).toBeLessThanOrEqual(1);
        if (
          name === "Analyze" &&
          viewport.width === 390 &&
          reducedMotion === "reduce"
        ) {
          await page.screenshot({
            path: testInfo.outputPath("phone-analyze.png"),
          });
        }
      }
    }
  }
});

test("desktop signal flow animates, connects its nodes and follows the visible stage", async ({
  page,
}, testInfo) => {
  test.skip(design.id !== "helio", "Helio-specific circuit animation");
  for (const width of [1280, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const processor = page.locator(".h-processor");
      const particle = processor.locator(".h-travel").first();
      const animationName = () =>
        particle.evaluate((el) => getComputedStyle(el).animationName);
      if (reducedMotion === "reduce") {
        await expect(page.locator("html")).toHaveClass(/motion-off/);
      }
      await expect.poll(animationName).toBe("signal-flow");
      await expect(
        page.getByRole("button", { name: /(?:Play|Pause) signal flow/ }),
      ).toHaveCount(0);
      const offset = await particle.evaluate(
        (el) => getComputedStyle(el).strokeDashoffset,
      );
      await expect
        .poll(() =>
          particle.evaluate((el) => getComputedStyle(el).strokeDashoffset),
        )
        .not.toBe(offset);
      await expect(processor).toHaveAttribute(
        "aria-label",
        /Field data flows through the ETi-LOG logger/,
      );
      await expect(processor.locator(".h-chip > span")).toHaveText("LOGGER");
      await expect(processor.locator(".h-terminal-detail")).toHaveText([
        "ETi-SOL DASHBOARD",
        "ETi-EDGE DASHBOARD",
      ]);
      expect(await processor.locator(".h-travel").count()).toBe(3);
      expect(
        await processor
          .locator("svg > g")
          .evaluateAll((groups) =>
            groups.map((group) => [
              group.getAttribute("data-from"),
              group.getAttribute("data-to"),
            ]),
          ),
      ).toEqual([
        ["field", "logger"],
        ["logger", "cloud"],
        ["logger", "edge"],
      ]);

      const alignmentErrors = await processor.evaluate((el) => {
        const paths = [...el.querySelectorAll<SVGPathElement>(".h-travel")];
        return paths.flatMap((path) => {
          const group = path.parentElement!;
          return ["from", "to"].map((direction) => {
            const name = group.getAttribute(`data-${direction}`);
            const node = el
              .querySelector(
                name === "logger" ? ".h-chip" : `.terminal-${name} > span`,
              )!
              .getBoundingClientRect();
            const endpoint = path.getPointAtLength(
              direction === "from" ? 0 : path.getTotalLength(),
            );
            const point = new DOMPoint(endpoint.x, endpoint.y).matrixTransform(
              path.getScreenCTM()!,
            );
            return Math.hypot(
              point.x - node.left - node.width / 2,
              point.y - node.top - node.height / 2,
            );
          });
        });
      });
      alignmentErrors.forEach((error) => expect(error).toBeLessThan(1));

      for (const index of [2, 1, 0, 1, 2]) {
        await page
          .locator(`#signal-stage-${index}`)
          .evaluate((el) =>
            el.scrollIntoView({ block: "center", behavior: "instant" }),
          );
        await expect(processor).toHaveClass(new RegExp(`stage-${index}`));
        await expect(
          page.locator(".h-stage-switch button").nth(index),
        ).toHaveAttribute("aria-pressed", "true");
      }
      if (width === 1920 && reducedMotion === "reduce") {
        await page.screenshot({
          path: testInfo.outputPath("desktop-signal-flow.png"),
        });
      }
      await expect.poll(animationName).toBe("signal-flow");
    }
  }
});

test("Solar Ignition follows a reversible solar day and retains generation results", async ({
  page,
}, testInfo) => {
  test.skip(design.id !== "solar", "Solar Ignition interactions");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const scene = page.locator(".solar-day");
  const travel = await scene.evaluate(
    (el) => (el as HTMLElement).offsetHeight - innerHeight,
  );
  const move = async (progress: number) => {
    await page.evaluate(
      (top) => window.scrollTo({ top, behavior: "instant" }),
      travel * progress,
    );
    await expect
      .poll(async () => Number(await scene.getAttribute("data-sun-progress")))
      .toBeCloseTo(progress, 2);
    return Number(await scene.getAttribute("data-generation"));
  };
  const dawn = await move(0.12);
  const left = await page.locator(".solar-sun").getAttribute("transform");
  expect(Number(left!.match(/translate\(([-\d.]+)/)![1])).toBeLessThan(300);
  expect(dawn).toBe(0);
  const morning = await move(0.3);
  const peak = await move(0.5);
  expect(peak).toBeGreaterThan(800);
  expect(peak).toBeGreaterThan(morning);
  await expect(
    page.getByRole("heading", { name: "Energy becomes intelligence." }),
  ).toBeVisible();
  expect(
    await page
      .locator(".solar")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(8, 16, 31)");
  await page.screenshot({
    path: testInfo.outputPath("solar-midday-desktop.png"),
  });
  const evening = await move(0.88);
  const right = await page.locator(".solar-sun").getAttribute("transform");
  expect(Number(right!.match(/translate\(([-\d.]+)/)![1])).toBeGreaterThan(900);
  expect(evening).toBeLessThan(peak);
  expect(await move(1)).toBe(0);
  await expect(
    page.getByRole("heading", { name: "The sun sets. The insight stays." }),
  ).toBeVisible();
  expect(
    await page
      .locator(".solar-trace")
      .evaluate((el) => getComputedStyle(el).strokeDashoffset),
  ).toBe("0px");
  const reversedPeak = await move(0.5);
  expect(reversedPeak).toBe(peak);
  await move(0);
  expect(
    await page
      .locator(".solar")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(245, 241, 232)");
  await page.goto("/#intelligence");
  await expect(page.locator(".s-dashboard")).toContainText("Day's generation");
  await expect(page.locator(".s-dashboard")).toContainText("4.28");
  await page.getByRole("tab", { name: /Monitor/ }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Analyze/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator(".s-dashboard")).toContainText("Performance ratio");
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /Notify/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator(".s-dashboard")).toContainText("Plant events");
  await page.goto("/#ecosystem");
  await page.getByRole("button", { name: /ETi-CAST/ }).press("Enter");
  await expect(page.locator(".s-product-description h3")).toHaveText(
    "ETi-CAST",
  );
  await page
    .getByRole("link", { name: "Explore ETi-CAST", exact: true })
    .click();
  await expect(
    page.locator("#eti-cast-solar-generation-forecasting"),
  ).toHaveAttribute("open", "");
});

test("Solar Ignition keeps the complete sun scene and dashboard on phones", async ({
  page,
}, testInfo) => {
  test.skip(design.id !== "solar", "Solar Ignition phone layout");
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    for (const reducedMotion of ["reduce", "no-preference"] as const) {
      await page.emulateMedia({ reducedMotion });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const travel = await page
        .locator(".solar-day")
        .evaluate((el) => (el as HTMLElement).offsetHeight - innerHeight);
      for (const progress of [0.12, 0.5, 0.88]) {
        await page.evaluate(
          (top) => window.scrollTo({ top, behavior: "instant" }),
          travel * progress,
        );
        await expect
          .poll(async () =>
            Number(
              await page
                .locator(".solar-day")
                .getAttribute("data-sun-progress"),
            ),
          )
          .toBeCloseTo(progress, 2);
        await expect(page.locator(".solar-world")).toBeInViewport({ ratio: 1 });
        await expect(page.locator(".solar-instruments")).toBeInViewport({
          ratio: 1,
        });
        await expect(page.locator(".solar-chapter")).toBeInViewport({
          ratio: 1,
        });
      }
      await page.screenshot({
        path: testInfo.outputPath(
          `solar-phone-${viewport.width}-${reducedMotion}.png`,
        ),
      });
      await page.goto("/#intelligence");
      await page
        .locator(".s-tabs")
        .evaluate((el) =>
          el.scrollIntoView({ behavior: "instant", block: "start" }),
        );
      const startScroll = await page.evaluate(() => scrollY);
      for (const mode of ["Analyze", "Notify", "Monitor"]) {
        await page.getByRole("tab", { name: new RegExp(mode) }).click();
        await expect(page.locator(".s-tabs")).toBeInViewport({ ratio: 1 });
        await expect(page.locator(".s-dashboard")).toBeInViewport({ ratio: 1 });
        expect(
          Math.abs((await page.evaluate(() => scrollY)) - startScroll),
        ).toBeLessThan(3);
      }
      await expect(page.locator(".s-flow")).toContainText("FIELD");
      await expect(page.locator(".s-flow")).toContainText("ETi-LOG");
      await expect(page.locator(".s-flow")).toContainText("ETi-SOL");
      await expect(page.locator(".s-flow")).toContainText("ETi-EDGE");
    }
  }
});

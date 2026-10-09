import fs from "node:fs/promises";
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 200000,
    uploadThroughput: 90000,
  });
  await page.addInitScript(() => {
    window.__qa = { cls: 0, lcp: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__qa.cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      window.__qa.lcp = list.getEntries().at(-1)?.startTime || 0;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      window.__qa.longTasks.push(...list.getEntries().map((e) => e.duration));
    }).observe({ type: "longtask", buffered: true });
  });
  await page.goto(process.env.PROFILE_URL || "http://127.0.0.1:4173/", {
    waitUntil: "networkidle",
    timeout: 120000,
  });
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const measurements = await page.evaluate(() => ({
    paint: performance
      .getEntriesByType("paint")
      .map((e) => ({ name: e.name, time: Math.round(e.startTime) })),
    lcp: Math.round(window.__qa.lcp),
    cls: window.__qa.cls,
    longTasks: window.__qa.longTasks.length,
    maxLongTask: Math.round(Math.max(0, ...window.__qa.longTasks)),
    resources: performance.getEntriesByType("resource").map((e) => ({
      name: e.name.split("/").pop(),
      bytes: e.transferSize,
      duration: Math.round(e.duration),
    })),
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 180, y: 650 }],
  });
  for (let i = 1; i <= 8; i++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 180, y: 650 - i * 55 }],
    });
    await page.waitForTimeout(20);
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await page.waitForTimeout(400);
  measurements.touchScrollY = await page.evaluate(() => Math.round(scrollY));
  if (measurements.touchScrollY < 200)
    throw new Error("Native touch scrolling did not advance the mobile page.");
  await fs.mkdir("docs/qa", { recursive: true });
  await fs.writeFile(
    "docs/qa/mobile-performance.json",
    JSON.stringify(
      {
        environment:
          "Chromium; 390×844; 4× CPU slowdown; 150 ms network latency; 200 KB/s download. Local synthetic run, not field Core Web Vitals. Results vary with host load.",
        ...measurements,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify({
      lcp: measurements.lcp,
      cls: measurements.cls,
      longTasks: measurements.longTasks,
      overflow: measurements.overflow,
      touchScrollY: measurements.touchScrollY,
    }),
  );
} finally {
  await browser.close();
}

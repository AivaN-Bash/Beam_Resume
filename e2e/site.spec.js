import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pageMetadata } from "../src/data/portfolio.js";

const routes = Object.entries(pageMetadata);
const publicBaseUrl = "https://aivan-bash.github.io/Beam_Resume/";
const viewports = [
  { width: 320, height: 740, name: "small phone" },
  { width: 390, height: 844, name: "phone" },
  { width: 768, height: 1024, name: "tablet portrait" },
  { width: 1024, height: 768, name: "tablet landscape" },
  { width: 1440, height: 960, name: "desktop" },
];

function routeUrl(route) {
  return route === "/" ? "" : `${route.slice(1)}/`;
}

for (const [route, metadata] of routes) {
  test(`${route} loads directly with its own metadata and no horizontal overflow`, async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(routeUrl(route), { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${route} should load at ${viewport.name}`).toBe(200);
      const staticHtml = await response.text();
      const canonicalUrl = route === "/"
        ? publicBaseUrl
        : new URL(route.slice(1), publicBaseUrl).href;
      expect(staticHtml).toContain(`<title>${metadata.title}</title>`);
      expect(staticHtml).toContain(`<link rel="canonical" href="${canonicalUrl}" />`);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page).toHaveTitle(metadata.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", metadata.description);

      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth, `${route} overflows at ${viewport.name}`).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    }

    expect(pageErrors, `${route} should not throw browser errors`).toEqual([]);
  });
}

test("mobile navigation opens, closes with Escape, and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("", { waitUntil: "domcontentloaded" });

  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  const closeToggle = page.getByRole("button", { name: "Close navigation" });
  await expect(closeToggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: /About/ })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
});

test("home parallax uses the existing portrait and skyline with a smaller phone range", async ({ page }) => {
  const portrait = page.locator(".hero-portrait img[data-scroll-parallax]");
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto("", { waitUntil: "domcontentloaded" });
  await expect(portrait).toBeVisible();
  await page.evaluate(() => { document.scrollingElement.scrollTop = 550; });

  const readOffset = () => portrait.evaluate((element) => Number.parseFloat(
    getComputedStyle(element).getPropertyValue("--scroll-parallax-y"),
  ));
  await expect.poll(readOffset).toBeGreaterThan(5);
  const desktopOffset = await readOffset();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { document.scrollingElement.scrollTop = 0; });
  await page.evaluate(() => { document.scrollingElement.scrollTop = 550; });
  await expect.poll(readOffset).toBeGreaterThan(0);
  expect(await readOffset()).toBeLessThan(desktopOffset);
});

test("reduced-motion mode renders a still canvas scene without starting its frame loop", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFillText = CanvasRenderingContext2D.prototype.fillText;
    const originalRequestAnimationFrame = window.requestAnimationFrame;
    window.__canvasTextPaints = 0;
    window.__canvasFrameRequests = 0;
    CanvasRenderingContext2D.prototype.fillText = function (...args) {
      window.__canvasTextPaints += 1;
      return originalFillText.apply(this, args);
    };
    window.requestAnimationFrame = function (callback) {
      window.__canvasFrameRequests += 1;
      return originalRequestAnimationFrame.call(this, callback);
    };
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("", { waitUntil: "domcontentloaded" });
  await expect.poll(() => page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
  await expect(page.locator(".hero-skyline-canvas")).toBeVisible();
  await expect(page.locator(".hero-portrait img")).toHaveCSS("transform", "none");
  await expect.poll(() => page.evaluate(() => window.__canvasTextPaints)).toBeGreaterThan(0);
  await page.waitForTimeout(1000);
  const activity = await page.evaluate(() => ({
    textPaints: window.__canvasTextPaints,
    frameRequests: window.__canvasFrameRequests,
  }));
  expect(activity.textPaints).toBeGreaterThan(0);
  expect(activity.frameRequests).toBeLessThan(3);
});

test("primary pages meet the automated WCAG 2.1 A and AA checks", async ({ page }) => {
  for (const route of ["/", "/about", "/experience", "/projects", "/skills", "/contact"]) {
    await page.goto(routeUrl(route), { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations, `${route} accessibility violations`).toEqual([]);
  }
});

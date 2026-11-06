// GitHub Pages serves static files with no server-side rewrites, so a
// direct visit or a page refresh on any route other than "/" (e.g.
// /Beam_Resume/projects) returns a real 404 — there's nothing at that path.
//
// GitHub Pages does serve a custom 404.html for any unmatched path, though,
// and it serves it as a normal page load (no redirect), so the browser's
// address bar still shows the route the person asked for. Because
// BrowserRouter reads that real URL, an exact copy of index.html shipped as
// 404.html is enough: the app boots the same way, sees the actual path, and
// react-router renders the right page.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pageMetadata } from "../src/data/portfolio.js";

const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const indexPath = join(distDir, "index.html");
const indexHtml = readFileSync(indexPath, "utf8");
const canonicalMatch = indexHtml.match(/<link\s+rel="canonical"\s+href="([^"]+)"\s*\/>/);

if (!canonicalMatch) throw new Error("Expected a canonical URL in dist/index.html.");

const siteUrl = new URL(canonicalMatch[1]);
if (siteUrl.protocol !== "https:" || !siteUrl.pathname.endsWith("/")) {
  throw new Error("The canonical site URL must be an HTTPS URL ending with a slash.");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`Expected ${label} in dist/index.html.`);
  return html.replace(pattern, replacement);
}

function createRouteHtml(route, metadata) {
  const routeUrl = route === "/" ? siteUrl.href : new URL(route.slice(1), siteUrl).href;
  let html = replaceTag(indexHtml, /<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`, "a title element");

  const metaValues = [
    ["name", "description", metadata.description],
    ["property", "og:title", metadata.title],
    ["property", "og:description", metadata.description],
    ["property", "og:url", routeUrl],
    ["name", "twitter:title", metadata.title],
    ["name", "twitter:description", metadata.description],
  ];

  for (const [attribute, key, value] of metaValues) {
    const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}="${key}")[^>]*>`);
    const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
    html = replaceTag(html, pattern, tag, `the ${key} meta tag`);
  }

  const canonicalPattern = /<link\b(?=[^>]*\brel="canonical")[^>]*>/;
  html = replaceTag(html, canonicalPattern, `<link rel="canonical" href="${escapeHtml(routeUrl)}" />`, "a canonical link");
  return html;
}

const homeMetadata = pageMetadata["/"];
if (!homeMetadata) throw new Error("Missing homepage metadata.");
writeFileSync(indexPath, createRouteHtml("/", homeMetadata));

copyFileSync(indexPath, join(distDir, "404.html"));
console.log("Copied dist/index.html -> dist/404.html for GitHub Pages SPA routing.");

// GitHub Pages does not provide SPA rewrites. Route entry files let direct
// links and refreshes resolve with HTTP 200 while BrowserRouter keeps the path.
for (const [route, metadata] of Object.entries(pageMetadata)) {
  if (route === "/") continue;
  const routeName = route.slice(1);
  if (!/^[a-z0-9-]+$/.test(routeName)) throw new Error(`Invalid static route: ${route}`);
  const routeDir = join(distDir, routeName);
  mkdirSync(routeDir, { recursive: true });
  writeFileSync(join(routeDir, "index.html"), createRouteHtml(route, metadata));
}
console.log("Created static entry points for portfolio routes.");

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
import { copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const distDir = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");

copyFileSync(join(distDir, "index.html"), join(distDir, "404.html"));
console.log("Copied dist/index.html -> dist/404.html for GitHub Pages SPA routing.");

// GitHub Pages does not provide SPA rewrites. Route entry files let direct
// links and refreshes resolve with HTTP 200 while BrowserRouter keeps the path.
for (const route of ["about", "experience", "projects", "skills", "contact"]) {
  const routeDir = join(distDir, route);
  mkdirSync(routeDir, { recursive: true });
  copyFileSync(join(distDir, "index.html"), join(routeDir, "index.html"));
}
console.log("Created static entry points for portfolio routes.");

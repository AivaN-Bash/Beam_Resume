# Phawat Tanajiranon — Portfolio

[![Live Site](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-b6815b?style=flat-square)](https://aivan-bash.github.io/Beam_Resume/)
[![Deploy to GitHub Pages](https://github.com/AivaN-Bash/Beam_Resume/actions/workflows/deploy.yml/badge.svg)](https://github.com/AivaN-Bash/Beam_Resume/actions/workflows/deploy.yml)
[![React 19](https://img.shields.io/badge/React-19-090a0e?style=flat-square&logo=react&logoColor=d9e2e7)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-090a0e?style=flat-square&logo=vite&logoColor=dbd7c8)](https://vite.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20%2B%20Axe-090a0e?style=flat-square)](https://playwright.dev/)

Personal portfolio website for **Phawat Tanajiranon**, showcasing customer service experience, Computer Science studies, interactive ASCII/canvas scenes, projects, skills, and contact details. Built to be fast, accessible, and responsive across phones, tablets, and desktops.

**Live website:** [aivan-bash.github.io/Beam_Resume](https://aivan-bash.github.io/Beam_Resume/)

---

## Pages

| Route | Title | Summary |
| --- | --- | --- |
| `/` | **Home** | Hero portrait, bilingual English/Thai name toggle, scroll parallax, profile summary, and index |
| `/about` | **About** | Background, Computer Science studies at ABAC, and international work story |
| `/experience` | **Experience** | Education and customer-facing roles at Dollywood and in hospitality |
| `/projects` | **Projects** | Software projects with live demos, GitHub links, and custom animated previews |
| `/skills` | **Skills** | Customer service, technical, office, and bilingual communication skills |
| `/contact` | **Contact** | Direct email, phone, location, and role availability |

---

## Run Locally

1. Install [Node.js](https://nodejs.org/) (**LTS** — CI uses Node 24).
2. Open the project folder in a terminal (`Terminal → New Terminal` in VS Code).
3. Install dependencies and start the dev server:

   ```sh
   npm ci
   npm run dev
   ```

4. Open [http://127.0.0.1:5174](http://127.0.0.1:5174) in your browser.
5. Press **Ctrl+C** in the terminal to stop the server.

---

## Updating Content

Most editable text, links, and metadata live in [`src/data/portfolio.js`](src/data/portfolio.js):

| What to update | Where to edit |
| --- | --- |
| Projects, descriptions, and buttons | `projects` in `src/data/portfolio.js` |
| Skill categories and pills | `skillGroups` in `src/data/portfolio.js` |
| Email, phone, location, and GitHub URL | `contactInfo` in `src/data/portfolio.js` |
| Page titles and SEO descriptions | `pageMetadata` in `src/data/portfolio.js` |
| Header and mobile navigation labels | `nav` in `src/data/portfolio.js` |
| Longer narrative copy and timeline items | Page components in `src/pages/` (e.g. `src/pages/Home.jsx`) |
| Hero portrait image | `public/images/phawat-cutout.png` |

Save any file and Vite will hot-reload the preview automatically.

---

## Architecture Highlights

- **React 19 + React Router 7 + Vite 7** with route-level code splitting (`React.lazy` + `Suspense`).
- **Shared ASCII Canvas Engine**: `AsciiScene.jsx`, `AsciiGrid.js`, `canvasSurface.js`, `canvasLoop.js`, and `canvasPause.js` share offscreen pausing (`IntersectionObserver`), scroll/tab-visibility pausing, differential cell painting, webfont-ready redraw, and `prefers-reduced-motion` static frames.
- **GitHub Pages Static Routes**: `scripts/copy-404.mjs` runs on `postbuild` to generate per-route `index.html` entry points (with route-specific `<title>`, `<meta>`, and `<link rel="canonical">`) plus `404.html` fallback routing.
- **Accessibility**: Skip link, keyboard-accessible mobile drawer with `Escape` and outside-click dismissal, bilingual pause-on-hover/focus, and automated WCAG 2.1 A/AA checks via `@axe-core/playwright`.

---

## Contributor Commands

```sh
npm run dev       # Start the local Vite dev server on http://127.0.0.1:5174
npm run dev:lan   # Expose the dev server on your local network
npm run build     # Build the production bundle and static route entry points into dist/
npm run preview   # Preview the production build locally
npm run test:e2e  # Build dist/ and run Playwright route, layout, and accessibility checks
```

> **First-time E2E setup:** Run `npx playwright install chromium` once before running `npm run test:e2e`.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which runs `npm audit --omit=dev --audit-level=high`, builds `dist/`, executes the Playwright + axe-core verification suite, and publishes the site to GitHub Pages.

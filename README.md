# Phawat Tanajiranon - React Portfolio

A recruiter-friendly multi-page React portfolio built with Vite.

## What changed in this pass

- Added a **Projects** page — concrete evidence (chess engine in C++/SFML,
  TipBeam, this site) to back up the Skills page, with a link to GitHub.
- Fixed direct/refreshed deep links (e.g. `/Beam_Resume/projects`) 404ing on
  GitHub Pages: `npm run build` now also mirrors `dist/index.html` as
  `dist/404.html` (see `scripts/copy-404.mjs`) — GitHub Pages serves that for
  any unmatched path, and react-router picks up the real URL from there.
- The EN/TH auto-toggle (hero name, page titles) now stays on English for
  people with `prefers-reduced-motion` set, and pauses on hover/focus instead
  of flipping language out from under someone mid-read.
- Added Open Graph/Twitter meta tags, a Person JSON-LD block, a canonical
  link, `robots.txt`, and `sitemap.xml`.
- Swapped the font `@import` in CSS for preconnected `<link>` tags in
  `index.html`, so fonts stop blocking the rest of the stylesheet from
  loading.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production files are created in `dist/`.

## Deploy

This project is a static Vite site and deploys to GitHub Pages at:

https://aivan-bash.github.io/Beam_Resume/

```bash
npm install
npm run build
```

The production files are created in `dist/`. Pushes to `main` build and deploy automatically through GitHub Actions.
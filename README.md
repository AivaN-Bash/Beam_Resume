# Phawat Tanajiranon Portfolio

A responsive portfolio for Phawat Tanajiranon. It presents customer service and hospitality experience, Computer Science studies, personal software projects, practical skills, and contact information.

The visual system uses an ink and slate base, warm copper accents, editorial display typography, and small animated ASCII scenes. It is designed for desktop, tablet, and phone screens.

## Pages

- **Home:** introduction, portrait, availability, and section links.
- **About:** study and work history, background, and personal statement.
- **Experience:** Computer Science study, Dollywood rental and retail work, and restaurant service.
- **Projects:** chess, TipBeam, and this portfolio.
- **Skills:** customer service, technical, office, and communication skills.
- **Contact:** role interests and ways to get in touch.

## Technology

- React 19 and React Router
- Vite 7
- Canvas-rendered ASCII illustrations
- CSS responsive layouts and reduced-motion support
- GitHub Pages deployment through GitHub Actions

Canvas scenes share one lifecycle manager. It starts scenes near the viewport, pauses them offscreen, during page scrolling, and when the tab is hidden, respects reduced-motion preferences, and releases animation and observer resources on cleanup. The ASCII painter updates changed cells in small batches.

## Run locally

```bash
npm ci
npm run dev
```

Vite serves the site at `http://localhost:5174`. The default server is local to this computer. Run `npm run dev:lan` only when you want to preview from another device on your local network.

## Build and verify

```bash
npm run build
npm run test:e2e
npm audit --audit-level=high
```

The browser checks exercise all pages at phone, tablet, and desktop widths; check direct route loads and page metadata; verify the mobile navigation; and run automated WCAG 2.1 A/AA checks. They use the production build through Vite Preview and require Chromium (`npx playwright install chromium`).

The build creates static route entry points with page-specific title, description, canonical, Open Graph, and Twitter metadata. It also creates `dist/404.html` so GitHub Pages can serve client-side routes on direct visits and refreshes.

## Deployment

Pushing to `main` runs the dependency audit, production build, Chromium browser checks, and GitHub Pages deployment.

**Live site:** https://aivan-bash.github.io/Beam_Resume/

The workflow is in `.github/workflows/deploy.yml`. GitHub Pages controls the site's HTTP response headers; the repository cannot configure arbitrary headers such as `Content-Security-Policy` or `X-Frame-Options` at the server level. The page includes a restrictive CSP meta policy for browser resource loading, but a meta policy cannot provide every response-header directive. Use a host or edge service with header configuration if those additional controls become a requirement.

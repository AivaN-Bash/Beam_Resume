# Phawat Tanajiranon — Portfolio

A responsive, multi-page portfolio for Phawat Tanajiranon, built with React and Vite. It presents customer-service and hospitality experience alongside a Computer Science background, personal software projects, skills, and contact details.

## Pages

- **Home** — introduction, profile highlights, and links to the rest of the portfolio
- **About** — education and personal story
- **Experience** — education and customer-facing work history
- **Projects** — selected software projects and GitHub profile
- **Skills** — technical, office, service, and communication skills
- **Contact** — email, phone, location, and roles of interest

## Product features

- Responsive layouts for desktop, tablet, and mobile screens
- Mobile navigation with keyboard support and an Escape-to-close shortcut
- Memory-conscious, visibility-paused canvas illustrations and bilingual English/Thai headings
- Reduced-motion support, keyboard focus styles, and a skip-to-content link
- Page-specific metadata, social sharing tags, and sitemap/robots files
- GitHub Pages deep-link fallback for refreshed or directly opened routes

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local development URL after the server starts.

## Build and preview

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`. The build also creates `dist/404.html` so GitHub Pages can serve client-side routes.

## Deploy

The site is hosted on GitHub Pages:

<https://aivan-bash.github.io/Beam_Resume/>

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml` to build and deploy the site.

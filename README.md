# Phawat Tanajiranon — Portfolio

A responsive, multi-page portfolio for Phawat Tanajiranon, presenting customer service experience, Computer Science studies, projects, practical skills, and contact details. The visual system pairs an ink, slate, and warm copper palette with oversized display type, editorial serif copy, and small animated ASCII scenes.

## Pages

- **Home** — introduction, portrait, availability, and links to the portfolio sections.
- **About** — background, study and work history, and a personal statement.
- **Experience** — Computer Science study, Dollywood rental and retail work, and restaurant service.
- **Projects** — selected personal projects and GitHub profile link.
- **Skills** — customer service, technical, office, and communication skills.
- **Contact** — role interests, email, phone, and an animated introduction.

## Built with

- React 19 and React Router
- Vite 7
- Canvas-rendered ASCII illustrations
- CSS responsive layouts and motion preferences

The layouts adapt across desktop, tablet, and phone widths. Animated scenes pause while off-screen, during page scrolling, when the tab is hidden, and when reduced motion is requested. Route fallback output supports direct links and refreshes on GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```

Vite serves the site at `http://localhost:5174`.

## Build

```bash
npm run build
```

The production site is written to `dist/`. The post-build script also creates `dist/404.html` for GitHub Pages route fallback.

## Deployment

The site is published with GitHub Actions when changes are pushed to `main`:

**https://aivan-bash.github.io/Beam_Resume/**

The workflow is defined in `.github/workflows/deploy.yml`.

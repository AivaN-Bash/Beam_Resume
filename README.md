# Phawat Tanajiranon — Portfolio

A responsive, multi-page portfolio for Phawat Tanajiranon, presenting customer service experience, Computer Science studies, projects, practical skills, and contact details. The visual system pairs an ink, slate, and warm copper palette with oversized display type, editorial serif copy, and small animated ASCII scenes.

## Pages

- **Home** — introduction, portrait, availability, and links to the portfolio sections.
- **About** — background, study and work history, and a personal statement.
- **Experience** — Computer Science study, Dollywood rental and retail work, and restaurant service.
- **Projects** — selected personal projects, animated ASCII artwork, and a GitHub profile link.
- **Skills** — customer service, technical, office, and communication skills.
- **Contact** — role interests, email, phone, and an animated introduction.

## Built with

- React 19 and React Router
- Vite 7
- Canvas-rendered ASCII illustrations for project diagrams, experience, and the small header mascot
- CSS responsive layouts and motion preferences

The layouts adapt across desktop, tablet, and phone widths. Animated scenes initialize when they approach the viewport, repaint only changed ASCII cells in short batches, and pause while off-screen, during page scrolling, when the tab is hidden, or when reduced motion is requested. This keeps decorative canvas work from blocking the main page content during startup.

## Run locally

```bash
npm install
npm run dev
```

Vite serves the site at `http://localhost:5174`.
The default development server listens only on this computer. Use `npm run dev:lan` when you intentionally need to preview it from another device on your local network.

## Build

```bash
npm run build
```

The production site is written to `dist/`. The post-build script creates route entry points and a `dist/404.html` fallback so GitHub Pages supports direct links and refreshes.

## Deployment

The site is published with GitHub Actions when changes are pushed to `main`:

**https://aivan-bash.github.io/Beam_Resume/**

The workflow is defined in `.github/workflows/deploy.yml`.

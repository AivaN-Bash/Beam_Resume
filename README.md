# Phawat Tanajiranon — Portfolio

This is Phawat’s personal portfolio website. It introduces his customer service experience, Computer Science studies, projects, skills, and contact details. The site is designed to work on phones, tablets, and computers.

## View the website

**Live website:** [aivan-bash.github.io/Beam_Resume](https://aivan-bash.github.io/Beam_Resume/)

## What’s on the site

- **Home** — A short introduction and links to the rest of the site.
- **About** — Background, studies, and work experience.
- **Experience** — Education and previous jobs.
- **Projects** — A few things Phawat has made, with links to try them or see their source.
- **Skills** — Customer service, computer, office, and communication skills.
- **Contact** — How to get in touch about work.

## Run it on your computer

This is optional. It lets you preview changes before the website is published.

1. Install [Node.js](https://nodejs.org/) (the **LTS** version).
2. Open this project folder in a terminal. In VS Code, choose **Terminal → New Terminal**.
3. Run these commands one at a time:

   ```sh
   npm ci
   npm run dev
   ```

4. Open the local address shown in the terminal. It is usually [http://localhost:5174](http://localhost:5174).
5. To stop the preview, click the terminal and press **Ctrl+C**.

## Update the website’s words and links

Most portfolio details are kept together in `src/data/portfolio.js`:

- Change the project descriptions, buttons, and links in the `projects` list.
- Change the skill names in the `skillGroups` list.
- Change page titles and search descriptions in the `pageMetadata` list.
- Change the navigation labels in the `nav` list.

The longer introduction and work history are written in the page files inside `src/pages/`. For example, the home page is `src/pages/Home.jsx`. The portrait image is `public/images/phawat-cutout.png`.

Save a file and the local preview should update automatically. If a change looks wrong, undo it with **Ctrl+Z** or restore the original text.

## Publish changes

The site is published with GitHub Pages. When changes are pushed to the `main` branch, GitHub automatically builds the site, checks that its pages work on different screen sizes, and publishes it. Publishing requires access to this project’s GitHub repository.

## For contributors

The site uses React 19, React Router, and Vite. Its small canvas illustrations share a lifecycle manager that pauses scenes when they are offscreen or the browser tab is hidden, and follows the visitor’s reduced-motion preference. The homepage also uses native scrolling for its gentle parallax effect.

Useful commands:

```sh
npm run dev       # Start the local preview
npm run build     # Create the production site in dist/
npm run preview   # Preview the production build locally
npm run test:e2e  # Check routes, layouts, navigation, and accessibility
```

The browser checks use Playwright and Chromium. Install Chromium once with `npx playwright install chromium`. GitHub Pages serves the built static files; the deployment workflow also checks production dependencies with `npm audit`.

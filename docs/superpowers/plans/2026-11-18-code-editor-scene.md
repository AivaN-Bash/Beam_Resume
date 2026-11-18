# Code Editor Scene Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the Computer Science code editor illustration and add Watt Wise with a clear path to its live calculator and mockup tester.

**Architecture:** Keep the existing canvas renderer, animation lifecycle, palette, and reduced-motion behavior. Add a caption and a restrained frame at the Experience page figure level so the code remains decorative texture while gaining context and visual hierarchy.

**Tech Stack:** React, Vite, CSS, existing canvas scene.

**Spec:** `docs/superpowers/specs/2026-11-18-code-editor-scene-design.md`

## Global Constraints

- Keep the existing lightweight canvas animation, visibility pause, and reduced-motion still frame.
- Do not redesign the Experience page or replace the editor illustration.
- Do not add dependencies or make the canvas interactive.
- Leave the education dates and duration wording unchanged pending factual confirmation.
- Open the Watt Wise live app in a new tab with `noopener noreferrer`.

## Review Focus

- Narrow and mobile layouts: caption and frame remain within the figure width.
- Reduced motion and offscreen rendering: the existing shared canvas lifecycle remains untouched.
- Contrast and density: frame styling does not compete with the timeline entry copy.
- Screen readers: canvas remains decorative and hidden; caption is ordinary figure text.
- Existing sibling illustrations: styles for the editor remain scoped and do not alter other timeline figures.

---

### Task 1: Frame and label the editor illustration

**Files:**
- Modify: `src/pages/Experience.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: existing `CodeEditorScene` React component and `.timeline-illustration` styles.
- Produces: an editor-specific figure class and visible figure caption; no new component API.

- [x] Add an editor-specific class to the Computer Science figure in `Experience.jsx` and a `<figcaption>` with the labels `CODE STUDY / 01` and `RATE LIMITER / TYPESCRIPT`.
- [x] Add scoped CSS in `styles.css` that gives this figure a subtle warm-dark surface, a thin existing-token border, and compact padding; keep its width responsive and its caption aligned with the existing editorial figure captions.
- [x] Inspect `/experience` at desktop and narrow mobile widths in the already-running local Vite app; confirm the frame and caption fit without changing sibling illustrations or the animation lifecycle.

### Task 2: Add the Watt Wise project

**Files:**
- Create: `src/components/calculatorApp.js`
- Create: `src/components/CalculatorAppScene.jsx`
- Modify: `src/data/portfolio.js`
- Modify: `src/pages/Projects.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: the existing `projects` data list, `.text-link`, and `Arrow` component.
- Produces: a Watt Wise project entry with a direct external demo link and a responsive ASCII calculator scene.

- [x] Add Watt Wise first in the projects list, describing its electricity bill estimates and device mockup tester; include the supplied live URL and concise feature tags.
- [x] Render a project action only when `url` is present, open it in a new tab with `rel="noopener noreferrer"`, and style it with the existing text-link language.
- [x] Adapt the supplied keypad sequence into `calculatorApp.js` and render it through the shared canvas loop, palette tokens, and ASCII frame painter in `CalculatorAppScene.jsx`.
- [x] Inspect `/projects` at desktop and mobile widths; confirm the project copy, action, tags, and calculator scene fit the existing layout.

# Code editor scene refinement

Date: 2026-11-18

## Intent

Make the existing animated code editor read as a polished technical illustration beside the Computer Science education entry, while preserving the portfolio's editorial visual identity and page layout.

## Goals

- Improve the editor's framing and visual hierarchy at its current responsive display size.
- Keep the existing lightweight canvas animation, visibility pause, and reduced-motion still frame.
- Preserve the example code and surrounding Experience page content unless a factual correction is confirmed.

## Non-goals

- Redesign the Experience page or replace the editor with a different illustration.
- Add dependencies or make the canvas interactive.

## Approaches

- Refine the current editor's framing and contrast: recommended and selected because it preserves the existing technical illustration while improving its presentation.
- Replace it with a study-related visual: rejected because it removes the existing technical/editorial motif.

## Constraints and implementation calls

- Keep the existing React, canvas lifecycle, and CSS responsive behavior.
- Treat the code as decorative texture at this size; do not claim it is readable evidence.
- Leave the 2021–2023 / three-year education wording untouched pending factual confirmation.

import { useEffect, useRef } from "react";
import createDesertNeedle, { DESERT_PALETTE } from "./desertNeedleSkyline";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { subscribeToCanvasPause } from "./canvasPause";

const WIDTH = 192;
const HEIGHT = 108;
const CELL_WIDTH = 8;
const CELL_HEIGHT = 12;
const FRAME_INTERVAL = 1000 / 10;
const SHADES = ["·", "·", "·", "•", "•", "●", "●", "█"];
const SHADE_LEVELS = "▁▂▃▄▅▆▇█";

/** Renders the animated desert skyline as a low-contrast story backdrop. */
export default function DesertNeedleScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    setupCanvasSurface(canvas, context, WIDTH * CELL_WIDTH, HEIGHT * CELL_HEIGHT);
    context.font = `${CELL_HEIGHT}px "DM Mono", monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderFrame = null;
    let paintFrame = null;
    let animationFrame = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let startedAt = null;
    let visible = typeof IntersectionObserver === "undefined";
    let mounted = true;
    let pagePaused = false;

    function draw(seconds) {
      if (!renderFrame || !paintFrame) return;
      paintFrame(renderFrame(seconds));
    }

    function initialize() {
      if (renderFrame) return;
      renderFrame = createDesertNeedle();
      paintFrame = createAsciiFramePainter(context, {
        columns: WIDTH,
        rows: HEIGHT,
        cellWidth: CELL_WIDTH,
        cellHeight: CELL_HEIGHT,
        colorFor: (key) => DESERT_PALETTE[key] || "#d9e2e7",
        characterFor: (character) => SHADES[SHADE_LEVELS.indexOf(character)] || "·",
      });
      draw(0);
    }

    function stop() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      if (startedAt !== null) {
        elapsed += (performance.now() - startedAt) / 1000;
        startedAt = null;
      }
    }

    function animate(timestamp) {
      if (!mounted || !visible || pagePaused || reducedMotion.matches) {
        animationFrame = 0;
        return;
      }
      if (startedAt === null) startedAt = timestamp;
      if (timestamp - lastFrame >= FRAME_INTERVAL) {
        lastFrame = timestamp;
        draw(elapsed + (timestamp - startedAt) / 1000);
      }
      animationFrame = window.requestAnimationFrame(animate);
    }

    function start() {
      if (mounted && visible && renderFrame && !pagePaused && !reducedMotion.matches && !animationFrame) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    const unsubscribeFromCanvasPause = subscribeToCanvasPause((paused) => {
      pagePaused = paused;
      if (paused) stop();
      else start();
    });

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) { initialize(); start(); }
          else stop();
        }, { threshold: 0.05 });
    observer?.observe(canvas);
    if (visible) { initialize(); start(); }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stop();
        elapsed = 0;
        if (visible) { initialize(); draw(0); }
      } else {
        start();
      }
    }
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      mounted = false;
      unsubscribeFromCanvasPause();
      stop();
      paintFrame?.dispose();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="desert-needle-canvas" aria-hidden="true" />;
}

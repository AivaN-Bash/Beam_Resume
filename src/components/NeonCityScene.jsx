import { useEffect, useRef } from "react";
import createNeonCityRain, { NEON_CITY_PALETTE } from "./neonCityRain";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { subscribeToCanvasPause } from "./canvasPause";

const WIDTH = 100;
const HEIGHT = 36;
const CELL_WIDTH = 10;
const CELL_HEIGHT = 14;
const FRAME_INTERVAL = 1000 / 12;

/** Draws the palette-adapted rain scene and pauses whenever it leaves view. */
export default function NeonCityScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    setupCanvasSurface(canvas, context, WIDTH * CELL_WIDTH, HEIGHT * CELL_HEIGHT);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    context.font = '14px "DM Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";

    let drawScene = null;
    let paintFrame = null;
    let rafId = 0;
    let lastDraw = 0;
    let startTime = null;
    let elapsed = 0;
    let isVisible = typeof IntersectionObserver === "undefined";
    let isMounted = true;
    let pagePaused = false;

    function draw(time) {
      if (!drawScene || !paintFrame) return;
      paintFrame(drawScene(time));
    }

    function initialize() {
      if (drawScene) return;
      drawScene = createNeonCityRain();
      paintFrame = createAsciiFramePainter(context, {
        columns: WIDTH,
        rows: HEIGHT,
        cellWidth: CELL_WIDTH,
        cellHeight: CELL_HEIGHT,
        colorFor: (colorIndex) => NEON_CITY_PALETTE[colorIndex] || "#d9e2e7",
      });
      draw(0);
    }

    function stop() {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      if (startTime !== null) {
        elapsed += (performance.now() - startTime) / 1000;
        startTime = null;
      }
    }

    function animate(timestamp) {
      if (!isMounted || !isVisible || pagePaused || reducedMotion.matches) {
        rafId = 0;
        return;
      }
      if (startTime === null) startTime = timestamp;
      if (timestamp - lastDraw >= FRAME_INTERVAL) {
        lastDraw = timestamp;
        draw(elapsed + (timestamp - startTime) / 1000);
      }
      rafId = window.requestAnimationFrame(animate);
    }

    function start() {
      if (isMounted && isVisible && drawScene && !pagePaused && !reducedMotion.matches && !rafId) rafId = window.requestAnimationFrame(animate);
    }

    const unsubscribeFromCanvasPause = subscribeToCanvasPause((paused) => {
      pagePaused = paused;
      if (paused) stop();
      else start();
    });

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) { initialize(); start(); }
          else stop();
        }, { threshold: 0.08 });
    observer?.observe(canvas);
    if (isVisible) { initialize(); start(); }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stop();
        elapsed = 0;
        if (isVisible) { initialize(); draw(0); }
      } else {
        start();
      }
    }
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      isMounted = false;
      unsubscribeFromCanvasPause();
      stop();
      paintFrame?.dispose();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="neon-city-canvas" aria-hidden="true" />;
}

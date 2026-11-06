import { useEffect, useRef } from "react";
import createTrainFrame, { TRAIN_PALETTE } from "./viaductSteamTrain";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { subscribeToCanvasPause } from "./canvasPause";

const WIDTH = 192;
const HEIGHT = 108;
const CELL_SIZE = 8;
const FRAME_INTERVAL = 100;
const KEY_OFFSET = 0xe000;

/** Displays the ASCII landscape and pauses its motion when it is off screen. */
export default function ViaductTrainScene() {
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = sceneRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    setupCanvasSurface(canvas, context, WIDTH * CELL_SIZE, HEIGHT * CELL_SIZE);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let drawFrame = null;
    let paintFrame = null;
    context.font = '10px "DM Mono", monospace';
    context.textBaseline = "bottom";
    context.textAlign = "left";

    let rafId = 0;
    let lastDraw = 0;
    let startedAt = null;
    let elapsed = 0;
    let isVisible = typeof IntersectionObserver === "undefined";
    let isMounted = true;
    let pagePaused = false;

    function draw(seconds) {
      if (!drawFrame || !paintFrame) return;
      paintFrame(drawFrame(seconds));
    }

    function initialize() {
      if (drawFrame) return;
      drawFrame = createTrainFrame();
      paintFrame = createAsciiFramePainter(context, {
        columns: WIDTH,
        rows: HEIGHT,
        cellWidth: CELL_SIZE,
        cellHeight: CELL_SIZE,
        colorFor: (key) => TRAIN_PALETTE[key.charCodeAt(0) - KEY_OFFSET] || "#d9e2e7",
        textAlign: "left",
        textBaseline: "bottom",
      });
      draw(0);
    }

    function stopAnimation() {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      if (startedAt !== null) {
        elapsed += (performance.now() - startedAt) / 1000;
        startedAt = null;
      }
    }

    function animate(timestamp) {
      if (!isMounted || !isVisible || pagePaused || reducedMotion.matches) {
        rafId = 0;
        return;
      }
      if (startedAt === null) startedAt = timestamp;
      if (timestamp - lastDraw >= FRAME_INTERVAL) {
        lastDraw = timestamp;
        draw(elapsed + (timestamp - startedAt) / 1000);
      }
      rafId = window.requestAnimationFrame(animate);
    }

    function startAnimation() {
      if (isMounted && isVisible && drawFrame && !pagePaused && !reducedMotion.matches && !rafId) {
        rafId = window.requestAnimationFrame(animate);
      }
    }

    const unsubscribeFromCanvasPause = subscribeToCanvasPause((paused) => {
      pagePaused = paused;
      if (paused) stopAnimation();
      else startAnimation();
    });

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) { initialize(); startAnimation(); }
          else stopAnimation();
        }, { threshold: 0.08 });

    observer?.observe(canvas);
    if (isVisible) { initialize(); startAnimation(); }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stopAnimation();
        elapsed = 0;
        if (isVisible) { initialize(); draw(0); }
      } else {
        startAnimation();
      }
    }
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      isMounted = false;
      unsubscribeFromCanvasPause();
      stopAnimation();
      paintFrame?.dispose();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={sceneRef} className="viaduct-train-canvas" aria-hidden="true" />;
}

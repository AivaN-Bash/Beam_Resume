import { useEffect, useRef } from "react";
import createTrainFrame, { TRAIN_PALETTE } from "./viaductSteamTrain";

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

    canvas.width = WIDTH * CELL_SIZE;
    canvas.height = HEIGHT * CELL_SIZE;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const drawFrame = createTrainFrame();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    context.font = '10px "DM Mono", monospace';
    context.textBaseline = "bottom";
    context.textAlign = "left";

    let rafId = 0;
    let lastDraw = 0;
    let startedAt = null;
    let elapsed = 0;
    let isVisible = typeof IntersectionObserver === "undefined";
    let isMounted = true;

    function draw(seconds) {
      const { text, color } = drawFrame(seconds);
      const textRows = text.split("\n");
      const colorRows = color.split("\n");
      context.clearRect(0, 0, canvas.width, canvas.height);

      textRows.forEach((row, y) => {
        const glyphs = [...row];
        const colorKeys = [...(colorRows[y] || "")];
        glyphs.forEach((glyph, x) => {
          if (glyph === " ") return;
          const colorIndex = colorKeys[x]?.charCodeAt(0) - KEY_OFFSET;
          context.fillStyle = TRAIN_PALETTE[colorIndex] || "#d9e2e7";
          context.fillText(glyph, x * CELL_SIZE, (y + 1) * CELL_SIZE);
        });
      });
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
      if (!isMounted || !isVisible || reducedMotion.matches) {
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
      if (isMounted && isVisible && !reducedMotion.matches && !rafId) {
        rafId = window.requestAnimationFrame(animate);
      }
    }

    draw(0);
    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) startAnimation();
          else stopAnimation();
        }, { threshold: 0.08 });

    observer?.observe(canvas);
    if (isVisible) startAnimation();

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stopAnimation();
        elapsed = 0;
        draw(0);
      } else {
        startAnimation();
      }
    }
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      isMounted = false;
      stopAnimation();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={sceneRef} className="viaduct-train-canvas" aria-hidden="true" />;
}

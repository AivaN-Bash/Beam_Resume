import { useEffect, useRef } from "react";
import createHarbourSkyline, { HARBOUR_PALETTE } from "./harbourNeonSkyline";
import { setupCanvasSurface } from "./canvasSurface";
import { subscribeToCanvasPause } from "./canvasPause";

const WIDTH = 192;
const HEIGHT = 108;
const CELL_WIDTH = 8;
const CELL_HEIGHT = 12;
const FRAME_INTERVAL = 1000 / 12;
const DESKTOP_SHADES = ["·", "·", "·", "∙", "•", "▪", "■", "█"];

/** Paints the animated harbour scene as a quiet backdrop for the portrait. */
export default function HarbourSkylineScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const clearCanvas = setupCanvasSurface(canvas, context, WIDTH * CELL_WIDTH, HEIGHT * CELL_HEIGHT);
    context.font = `${CELL_HEIGHT}px "DM Mono", monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const renderFrame = createHarbourSkyline();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopLayout = window.matchMedia("(min-width: 801px)");
    let frameId = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let startedAt = null;
    let visible = typeof IntersectionObserver === "undefined";
    let mounted = true;
    let pagePaused = false;

    function draw(seconds) {
      const frame = renderFrame(seconds);
      const textRows = frame.text.split("\n");
      const colorRows = frame.color.split("\n");
      clearCanvas();

      for (let y = 0; y < HEIGHT; y += 1) {
        const characters = textRows[y] || "";
        const colors = colorRows[y] || "";
        for (let x = 0; x < WIDTH; x += 1) {
          const character = characters.charAt(x);
          if (!character || character === " ") continue;
          const key = colors.charAt(x);
          const displayCharacter = desktopLayout.matches
            ? DESKTOP_SHADES["▁▂▃▄▅▆▇█".indexOf(character)] || "·"
            : character;
          context.fillStyle = HARBOUR_PALETTE[key] || "#d9e2e7";
          context.fillText(displayCharacter, x * CELL_WIDTH + CELL_WIDTH / 2, y * CELL_HEIGHT + CELL_HEIGHT / 2);
        }
      }
    }

    function stop() {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      if (startedAt !== null) {
        elapsed += (performance.now() - startedAt) / 1000;
        startedAt = null;
      }
    }

    function animate(timestamp) {
      if (!mounted || !visible || pagePaused || reducedMotion.matches) {
        frameId = 0;
        return;
      }
      if (startedAt === null) startedAt = timestamp;
      if (timestamp - lastFrame >= FRAME_INTERVAL) {
        lastFrame = timestamp;
        draw(elapsed + (timestamp - startedAt) / 1000);
      }
      frameId = window.requestAnimationFrame(animate);
    }

    function start() {
      if (mounted && visible && !pagePaused && !reducedMotion.matches && !frameId) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    const unsubscribeFromCanvasPause = subscribeToCanvasPause((paused) => {
      pagePaused = paused;
      if (paused) stop();
      else start();
    });

    draw(0);
    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
          else stop();
        }, { threshold: 0.05 });
    observer?.observe(canvas);
    if (visible) start();

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stop();
        elapsed = 0;
        draw(0);
      } else {
        start();
      }
    }
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      mounted = false;
      unsubscribeFromCanvasPause();
      stop();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-skyline-canvas" aria-hidden="true" />;
}

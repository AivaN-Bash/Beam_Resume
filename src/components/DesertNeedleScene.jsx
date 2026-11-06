import { useEffect, useRef } from "react";
import createDesertNeedle, { DESERT_PALETTE } from "./desertNeedleSkyline";

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

    canvas.width = WIDTH * CELL_WIDTH;
    canvas.height = HEIGHT * CELL_HEIGHT;
    context.font = `${CELL_HEIGHT}px "DM Mono", monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const renderFrame = createDesertNeedle();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let startedAt = null;
    let visible = typeof IntersectionObserver === "undefined";
    let mounted = true;

    function draw(seconds) {
      const frame = renderFrame(seconds);
      const textRows = frame.text.split("\n");
      const colorRows = frame.color.split("\n");
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < HEIGHT; y += 1) {
        const text = textRows[y] || "";
        const colors = colorRows[y] || "";
        for (let x = 0; x < WIDTH; x += 1) {
          const character = text.charAt(x);
          if (!character || character === " ") continue;
          const shade = SHADE_LEVELS.indexOf(character);
          const displayCharacter = SHADES[shade] || "·";
          const key = colors.charAt(x);
          context.fillStyle = DESERT_PALETTE[key] || "#d9e2e7";
          context.fillText(displayCharacter, x * CELL_WIDTH + CELL_WIDTH / 2, y * CELL_HEIGHT + CELL_HEIGHT / 2);
        }
      }
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
      if (!mounted || !visible || reducedMotion.matches) {
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
      if (mounted && visible && !reducedMotion.matches && !animationFrame) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

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
      stop();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="desert-needle-canvas" aria-hidden="true" />;
}

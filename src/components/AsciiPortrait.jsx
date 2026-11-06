import { useEffect, useRef } from "react";
import { createRobotFrame } from "./robotWave";
import { setupCanvasSurface } from "./canvasSurface";

const COLUMNS = 64;
const ROWS = 30;
const CELL_WIDTH = 10;
const CELL_HEIGHT = 12;
const CROP_LEFT = 14;
const CROP_COLUMNS = 48;
const FRAME_INTERVAL = 1000 / 24;

/** Renders the adapted waving robot inside the compact hero decoration slot. */
export default function AsciiPortrait({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const clearCanvas = setupCanvasSurface(canvas, context, CROP_COLUMNS * CELL_WIDTH, ROWS * CELL_HEIGHT);
    const styles = getComputedStyle(canvas);
    const createFrame = createRobotFrame({
      slate: styles.getPropertyValue("--slate").trim() || "#d9e2e7",
      sand: styles.getPropertyValue("--sand").trim() || "#dbd7c8",
      caramel: styles.getPropertyValue("--caramel").trim() || "#b6815b",
      ink: "#806453",
    });
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    context.font = '14px "DM Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";

    let animationFrame = 0;
    let previousFrame = 0;
    let startTime = null;
    let isActive = true;

    function draw(timeSeconds) {
      const frame = createFrame(timeSeconds);
      clearCanvas();

      for (let y = 0; y < ROWS; y += 1) {
        for (let x = CROP_LEFT; x < CROP_LEFT + CROP_COLUMNS; x += 1) {
          const [character, color] = frame[y * COLUMNS + x];
          if (character === " ") continue;
          context.fillStyle = color;
          context.fillText(character, (x - CROP_LEFT) * CELL_WIDTH + CELL_WIDTH / 2, y * CELL_HEIGHT + CELL_HEIGHT / 2);
        }
      }
    }

    function animate(timestamp) {
      if (!isActive || motionPreference.matches) return;
      if (startTime === null) startTime = timestamp;
      if (timestamp - previousFrame >= FRAME_INTERVAL) {
        previousFrame = timestamp;
        draw((timestamp - startTime) / 1000);
      }
      animationFrame = window.requestAnimationFrame(animate);
    }

    function handleMotionPreferenceChange() {
      window.cancelAnimationFrame(animationFrame);
      if (motionPreference.matches) {
        startTime = null;
        draw(0);
      } else {
        animationFrame = window.requestAnimationFrame(animate);
      }
    }

    draw(0);
    if (!motionPreference.matches) animationFrame = window.requestAnimationFrame(animate);
    motionPreference.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      isActive = false;
      window.cancelAnimationFrame(animationFrame);
      motionPreference.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, []);

  return (
    <span className={"ascii-portrait " + className} aria-hidden="true">
      <canvas ref={canvasRef} width={CROP_COLUMNS * CELL_WIDTH} height={ROWS * CELL_HEIGHT} />
    </span>
  );
}

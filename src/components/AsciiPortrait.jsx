import { useEffect, useRef } from "react";
import { createRobotFrame } from "./robotWave";
import { setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";

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
    context.font = '14px "DM Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";

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

    return startCanvasLoop(canvas, () => ({ draw }), { frameInterval: FRAME_INTERVAL });
  }, []);

  return (
    <span className={"ascii-portrait " + className} aria-hidden="true">
      <canvas ref={canvasRef} width={CROP_COLUMNS * CELL_WIDTH} height={ROWS * CELL_HEIGHT} />
    </span>
  );
}

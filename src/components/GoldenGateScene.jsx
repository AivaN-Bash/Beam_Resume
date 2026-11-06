import { useEffect, useRef } from "react";
import createGoldenGateFog, { GOLDEN_GATE_PALETTE } from "./goldenGateFog";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";

const WIDTH = 100;
const HEIGHT = 36;
const CELL_WIDTH = 10;
const CELL_HEIGHT = 14;
const FRAME_INTERVAL = 1000 / 12;

/** Renders the animated bridge and fog scene in the existing timeline column. */
export default function GoldenGateScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    setupCanvasSurface(canvas, context, WIDTH * CELL_WIDTH, HEIGHT * CELL_HEIGHT);
    context.font = '14px "DM Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";
    return startCanvasLoop(canvas, () => {
      const drawScene = createGoldenGateFog();
      const paintFrame = createAsciiFramePainter(context, {
        columns: WIDTH,
        rows: HEIGHT,
        cellWidth: CELL_WIDTH,
        cellHeight: CELL_HEIGHT,
        colorFor: (colorIndex) => GOLDEN_GATE_PALETTE[colorIndex] || "#d9e2e7",
      });
      return {
        draw: (time) => paintFrame(drawScene(time)),
        staticTime: drawScene.staticTime,
        duration: drawScene.duration,
        dispose: paintFrame.dispose,
      };
    }, { frameInterval: FRAME_INTERVAL });
  }, []);

  return <canvas ref={canvasRef} className="golden-gate-canvas" aria-hidden="true" />;
}

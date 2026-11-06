import { useEffect, useRef } from "react";
import createNeonCityRain, { NEON_CITY_PALETTE } from "./neonCityRain";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";

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
    context.font = '14px "DM Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";
    return startCanvasLoop(canvas, () => {
      const drawScene = createNeonCityRain();
      const paintFrame = createAsciiFramePainter(context, {
        columns: WIDTH,
        rows: HEIGHT,
        cellWidth: CELL_WIDTH,
        cellHeight: CELL_HEIGHT,
        colorFor: (colorIndex) => NEON_CITY_PALETTE[colorIndex] || "#d9e2e7",
      });
      return {
        draw: (time) => paintFrame(drawScene(time)),
        staticTime: drawScene.staticTime,
        duration: drawScene.duration,
        dispose: paintFrame.dispose,
      };
    }, { frameInterval: FRAME_INTERVAL });
  }, []);

  return <canvas ref={canvasRef} className="neon-city-canvas" aria-hidden="true" />;
}

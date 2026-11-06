import { useEffect, useRef } from "react";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";
import createChessReplay from "./chessReplay";

const WIDTH = 86;
const HEIGHT = 28;
const CELL_WIDTH = 10;
const CELL_HEIGHT = 14;
const FRAME_INTERVAL = 1000 / 12;

/** Replay a compact ASCII chess game using the portfolio's restrained palette. */
export default function ChessReplayScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    setupCanvasSurface(canvas, context, WIDTH * CELL_WIDTH, HEIGHT * CELL_HEIGHT);
    const styles = getComputedStyle(canvas);
    const paper = styles.getPropertyValue("--paper").trim() || "#01040e";
    const slate = styles.getPropertyValue("--slate").trim() || "#d9e2e7";
    const caramel = styles.getPropertyValue("--caramel").trim() || "#b6815b";
    const sand = styles.getPropertyValue("--sand").trim() || "#dbd7c8";
    const palette = [slate, "color-mix(in srgb, " + sand + " 64%, " + paper + ")", caramel, paper, sand, caramel, "color-mix(in srgb, " + caramel + " 72%, " + sand + ")", "color-mix(in srgb, " + slate + " 16%, " + paper + ")", "color-mix(in srgb, " + sand + " 14%, " + paper + ")"];
    context.font = '14px "DM Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";
    return startCanvasLoop(canvas, () => {
      const drawScene = createChessReplay();
      const paintFrame = createAsciiFramePainter(context, {
        columns: WIDTH,
        rows: HEIGHT,
        cellWidth: CELL_WIDTH,
        cellHeight: CELL_HEIGHT,
        colorFor: (key) => palette[Number(key)] || slate,
      });
      return {
        draw: (time) => paintFrame(drawScene(time)),
        staticTime: drawScene.staticTime,
        duration: drawScene.duration,
        dispose: paintFrame.dispose,
      };
    }, { frameInterval: FRAME_INTERVAL });
  }, []);

  return <canvas ref={canvasRef} className="chess-replay-canvas" aria-hidden="true" />;
}

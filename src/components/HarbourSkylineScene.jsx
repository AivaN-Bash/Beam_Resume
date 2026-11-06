import { useEffect, useRef } from "react";
import createHarbourSkyline, { HARBOUR_PALETTE } from "./harbourNeonSkyline";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";

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

    setupCanvasSurface(canvas, context, WIDTH * CELL_WIDTH, HEIGHT * CELL_HEIGHT);
    context.font = `${CELL_HEIGHT}px "DM Mono", monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    const desktopLayout = window.matchMedia("(min-width: 801px)");
    let renderFrame = null;
    let paintFrame = null;

    function draw(seconds) {
      if (!renderFrame || !paintFrame) return;
      paintFrame(renderFrame(seconds));
    }

    function initialize() {
      if (renderFrame) return;
      renderFrame = createHarbourSkyline();
      paintFrame = createAsciiFramePainter(context, {
        columns: WIDTH,
        rows: HEIGHT,
        cellWidth: CELL_WIDTH,
        cellHeight: CELL_HEIGHT,
        colorFor: (key) => HARBOUR_PALETTE[key] || "#d9e2e7",
        characterFor: (character) => desktopLayout.matches
          ? DESKTOP_SHADES["▁▂▃▄▅▆▇█".indexOf(character)] || "·"
          : character,
      });
    }

    return startCanvasLoop(canvas, () => {
      initialize();
      return {
        draw,
        staticTime: renderFrame.staticTime,
        duration: renderFrame.duration,
        dispose: () => paintFrame?.dispose(),
      };
    }, { frameInterval: FRAME_INTERVAL, threshold: 0.05 });
  }, []);

  return <canvas ref={canvasRef} className="hero-skyline-canvas" aria-hidden="true" />;
}

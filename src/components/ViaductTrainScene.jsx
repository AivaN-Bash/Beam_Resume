import { useEffect, useRef } from "react";
import createTrainFrame, { TRAIN_PALETTE } from "./viaductSteamTrain";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";

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
    let drawFrame = null;
    let paintFrame = null;
    context.font = '10px "DM Mono", monospace';
    context.textBaseline = "bottom";
    context.textAlign = "left";

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
    }

    return startCanvasLoop(canvas, () => {
      initialize();
      return {
        draw,
        staticTime: drawFrame.staticTime,
        duration: drawFrame.duration,
        dispose: () => paintFrame?.dispose(),
      };
    }, { frameInterval: FRAME_INTERVAL });
  }, []);

  return <canvas ref={sceneRef} className="viaduct-train-canvas" aria-hidden="true" />;
}

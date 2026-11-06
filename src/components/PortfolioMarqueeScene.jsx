import { useEffect, useRef } from "react";
import { createAsciiFramePainter, setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";
import createPortfolioMarquee from "./portfolioMarquee";

const WIDTH = 84;
const HEIGHT = 17;
const CELL_WIDTH = 10;
const CELL_HEIGHT = 14;
const FRAME_INTERVAL = 1000 / 12;

/** Render the portfolio's project marquee with low-cost, accessible motion. */
export default function PortfolioMarqueeScene() {
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
    const palette = [slate, "color-mix(in srgb, " + sand + " 64%, " + paper + ")", caramel, "color-mix(in srgb, " + sand + " 20%, " + paper + ")", sand];
    context.font = '14px "DM Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";
    return startCanvasLoop(canvas, () => {
      const drawScene = createPortfolioMarquee();
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

  return <canvas ref={canvasRef} className="portfolio-marquee-canvas" aria-hidden="true" />;
}

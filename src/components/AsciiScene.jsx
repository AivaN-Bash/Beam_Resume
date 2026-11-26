import { useEffect, useRef } from "react";
import { createAsciiFramePainter, getThemeColors, setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";

/** Shared React wrapper for procedural ASCII canvas scenes. */
export default function AsciiScene({
  className,
  columns,
  rows,
  cellWidth,
  cellHeight,
  frameInterval = 1000 / 12,
  font = '14px "DM Mono", monospace',
  textAlign = "center",
  textBaseline = "middle",
  threshold = 0.08,
  createScene,
  createColorFor,
  createCharacterFor,
  ...canvasProps
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    setupCanvasSurface(canvas, context, columns * cellWidth, rows * cellHeight);
    context.font = font;
    context.textAlign = textAlign;
    context.textBaseline = textBaseline;

    const theme = getThemeColors(canvas);
    const colorFor = createColorFor(theme);
    const characterFor = createCharacterFor?.();

    return startCanvasLoop(canvas, () => {
      const drawScene = createScene();
      const paintFrame = createAsciiFramePainter(context, {
        columns,
        rows,
        cellWidth,
        cellHeight,
        colorFor,
        characterFor,
        textAlign,
        textBaseline,
      });

      return {
        draw: (time) => paintFrame(drawScene(time)),
        staticTime: drawScene.staticTime,
        duration: drawScene.duration,
        invalidate: paintFrame.invalidate,
        dispose: paintFrame.dispose,
      };
    }, { frameInterval, threshold });
  }, [
    cellHeight,
    cellWidth,
    columns,
    createCharacterFor,
    createColorFor,
    createScene,
    font,
    frameInterval,
    rows,
    textAlign,
    textBaseline,
    threshold,
  ]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" {...canvasProps} />;
}

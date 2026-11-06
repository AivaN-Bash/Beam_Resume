import { useEffect, useRef } from "react";
import { setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";
import createDogMascot from "./dogMascot";

const WIDTH = 40;
const HEIGHT = 24;
const FRAME_INTERVAL = 1000 / 12;

/** A transparent pixel-ASCII pup kept small beside the brand mark. */
export default function PuppyMascot() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    setupCanvasSurface(canvas, context, WIDTH, HEIGHT);
    const styles = getComputedStyle(canvas);
    const paper = styles.getPropertyValue("--paper").trim() || "#01040e";
    const caramel = styles.getPropertyValue("--caramel").trim() || "#b6815b";
    const sand = styles.getPropertyValue("--sand").trim() || "#dbd7c8";
    const palette = [
      `color-mix(in srgb, ${caramel} 42%, ${paper})`,
      `color-mix(in srgb, ${caramel} 64%, ${paper})`,
      caramel,
      `color-mix(in srgb, ${caramel} 48%, ${sand})`,
      sand,
      styles.getPropertyValue("--slate").trim() || "#d9e2e7",
      paper,
    ];
    return startCanvasLoop(canvas, () => {
      const renderFrame = createDogMascot();
      const previousColors = new Int8Array(WIDTH * HEIGHT).fill(-1);
      let currentFillStyle = "";

      function draw(time) {
        const colors = renderFrame(time);
        for (let index = 0; index < colors.length; index += 1) {
          const color = colors[index];
          if (color === previousColors[index]) continue;
          const x = index % WIDTH;
          const y = Math.floor(index / WIDTH);
          context.clearRect(x, y, 1, 1);
          if (color >= 0) {
            const fillStyle = palette[color] || palette[2];
            if (fillStyle !== currentFillStyle) {
              context.fillStyle = fillStyle;
              currentFillStyle = fillStyle;
            }
            context.fillRect(x, y, 1.05, 1.05);
          }
          previousColors[index] = color;
        }
      }

      return { draw };
    }, { frameInterval: FRAME_INTERVAL, threshold: 0.01 });
  }, []);

  return <span className="brand-pup" aria-hidden="true"><canvas ref={canvasRef} /></span>;
}

import { useEffect, useRef } from "react";

const COLUMNS = 24;
const ROWS = 30;
const CELL_SIZE = 10;

export default function AsciiPortrait({ src, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    const image = new Image();
    image.decoding = "async";

    function drawPortrait() {
      const sample = document.createElement("canvas");
      sample.width = COLUMNS;
      sample.height = ROWS;

      const sampleContext = sample.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) return;

      const scale = Math.min(COLUMNS / image.naturalWidth, ROWS / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      sampleContext.drawImage(image, (COLUMNS - width) / 2, (ROWS - height) / 2, width, height);

      const pixels = sampleContext.getImageData(0, 0, COLUMNS, ROWS).data;
      const styles = getComputedStyle(canvas);
      const slate = styles.getPropertyValue("--slate").trim();
      const sand = styles.getPropertyValue("--sand").trim();
      const caramel = styles.getPropertyValue("--caramel").trim();

      canvas.width = COLUMNS * CELL_SIZE;
      canvas.height = ROWS * CELL_SIZE;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = `600 14px "DM Mono", monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (let row = 0; row < ROWS; row += 1) {
        for (let column = 0; column < COLUMNS; column += 1) {
          const offset = (row * COLUMNS + column) * 4;
          const alpha = pixels[offset + 3] / 255;
          if (alpha < 0.18) continue;

          const luminance = pixels[offset] * 0.2126 + pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722;
          context.globalAlpha = Math.min(0.9, alpha * 0.92);
          context.fillStyle = luminance > 165 ? slate : luminance > 72 ? sand : caramel;
          context.fillText(luminance > 72 ? "+" : "·", column * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2);
        }
      }

      context.globalAlpha = 1;
    }

    image.addEventListener("load", drawPortrait, { once: true });
    image.src = src;
    if (image.complete && image.naturalWidth > 0) drawPortrait();

    return () => image.removeEventListener("load", drawPortrait);
  }, [src]);

  return (
    <span className={`ascii-portrait ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} width={COLUMNS * CELL_SIZE} height={ROWS * CELL_SIZE} />
      <svg className="ascii-portrait-orbit" viewBox="0 0 80 100" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="ascii-portrait-orbit-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop className="ascii-orbit-caramel" offset="0%" />
            <stop className="ascii-orbit-sand" offset="52%" />
            <stop className="ascii-orbit-slate" offset="100%" />
          </linearGradient>
        </defs>
        <rect className="ascii-orbit-track" x="2" y="2" width="76" height="96" rx="9" pathLength="100" />
        <rect className="ascii-orbit-light" x="2" y="2" width="76" height="96" rx="9" pathLength="100" />
      </svg>
    </span>
  );
}

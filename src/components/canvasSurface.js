export function setupCanvasSurface(canvas, context, width, height) {
  const renderScale = Math.min(1.5, Math.max(1, (window.devicePixelRatio || 1) * 0.75));
  canvas.width = Math.round(width * renderScale);
  canvas.height = Math.round(height * renderScale);
  context.scale(renderScale, renderScale);

  return () => context.clearRect(0, 0, width, height);
}

/** Read the portfolio CSS palette tokens from an element with safe defaults. */
export function getThemeColors(element) {
  const styles = getComputedStyle(element);
  return {
    paper: styles.getPropertyValue("--paper").trim() || "#01040e",
    slate: styles.getPropertyValue("--slate").trim() || "#d9e2e7",
    caramel: styles.getPropertyValue("--caramel").trim() || "#b6815b",
    sand: styles.getPropertyValue("--sand").trim() || "#dbd7c8",
  };
}

/** Paint only the glyph cells that changed since the previous frame. */
export function createAsciiFramePainter(context, {
  columns,
  rows,
  cellWidth,
  cellHeight,
  colorFor,
  characterFor = (character) => character,
  textAlign = "center",
  textBaseline = "middle",
  chunkRows = 16,
}) {
  const length = columns * rows;
  const previousCharacters = new Array(length).fill(" ");
  const previousColors = new Array(length).fill(" ");
  let currentFillStyle = "";
  let pendingFrame = null;
  let activeFrame = null;
  let isPainting = false;
  let chunkTimer = 0;

  function normalizeFrame(frame) {
    return typeof frame.text === "string"
      ? { textRows: frame.text.split("\n"), colorRows: frame.color.split("\n"), cells: null }
      : { textRows: null, colorRows: null, cells: frame };
  }

  function paintRows(frame, startRow, endRow) {
    for (let y = startRow; y < endRow; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const index = y * columns + x;
        const rawCell = frame.textRows
          ? [frame.textRows[y]?.charAt(x) || " ", frame.colorRows?.[y]?.charAt(x) || " "]
          : frame.cells[index] || [" ", " "];
        const character = characterFor(rawCell[0], rawCell[1]);
        const color = rawCell[1];

        if (character === previousCharacters[index] && color === previousColors[index]) continue;

        const left = x * cellWidth;
        const top = y * cellHeight;
        if (previousCharacters[index] !== " ") context.clearRect(left, top, cellWidth, cellHeight);
        if (character !== " ") {
          const fillStyle = colorFor(color);
          if (fillStyle !== currentFillStyle) {
            context.fillStyle = fillStyle;
            currentFillStyle = fillStyle;
          }
          const textX = textAlign === "left" ? left : textAlign === "right" ? left + cellWidth : left + cellWidth / 2;
          const textY = textBaseline === "top" ? top : textBaseline === "bottom" ? top + cellHeight : top + cellHeight / 2;
          context.fillText(character, textX, textY);
        }

        previousCharacters[index] = character;
        previousColors[index] = color;
      }
    }
  }

  function startPaint(frame) {
    activeFrame = frame;
    isPainting = true;
    let nextRow = 0;
    const paintChunk = () => {
      const endRow = Math.min(rows, nextRow + chunkRows);
      paintRows(activeFrame, nextRow, endRow);
      nextRow = endRow;

      if (nextRow < rows) {
        chunkTimer = window.setTimeout(paintChunk, 0);
        return;
      }

      isPainting = false;
      if (pendingFrame !== activeFrame) startPaint(pendingFrame);
    };

    chunkTimer = window.setTimeout(paintChunk, 0);
  }

  function paint(frame) {
    pendingFrame = normalizeFrame(frame);
    if (!isPainting) startPaint(pendingFrame);
  }

  paint.invalidate = () => {
    window.clearTimeout(chunkTimer);
    isPainting = false;
    context.clearRect(0, 0, columns * cellWidth, rows * cellHeight);
    previousCharacters.fill(" ");
    previousColors.fill(" ");
  };

  paint.dispose = () => {
    window.clearTimeout(chunkTimer);
    isPainting = false;
  };

  return paint;
}

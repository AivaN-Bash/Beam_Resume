export function setupCanvasSurface(canvas, context, width, height) {
  const renderScale = Math.min(1.5, Math.max(1, (window.devicePixelRatio || 1) * 0.75));
  canvas.width = Math.round(width * renderScale);
  canvas.height = Math.round(height * renderScale);
  context.scale(renderScale, renderScale);

  return () => context.clearRect(0, 0, width, height);
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
}) {
  const length = columns * rows;
  const previousCharacters = new Array(length).fill(" ");
  const previousColors = new Array(length).fill(" ");
  let hasPainted = false;
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
        if (hasPainted) context.clearRect(left, top, cellWidth, cellHeight);
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

    hasPainted = true;
  }

  function startPaint(frame) {
    activeFrame = frame;
    isPainting = true;
    let nextRow = 0;
    const paintChunk = () => {
      const endRow = Math.min(rows, nextRow + 4);
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

  paint.dispose = () => {
    window.clearTimeout(chunkTimer);
    isPainting = false;
  };

  return paint;
}

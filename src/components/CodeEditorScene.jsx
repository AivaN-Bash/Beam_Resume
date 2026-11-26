import AsciiGrid from "./AsciiGrid";
import AsciiScene from "./AsciiScene";

const WIDTH = 86;
const HEIGHT = 30;
const CELL_WIDTH = 12;
const CELL_HEIGHT = 20;
const FRAME_INTERVAL = 1000 / 12;

const SOURCE = [
  'import { Store } from "./store";',
  "",
  "export interface Limit {",
  "  windowMs: number;",
  "  max: number;",
  "}",
  "",
  "// Sliding window rate limiter, one key per client.",
  "export async function allow(",
  "  store: Store,",
  "  key: string,",
  "  limit: Limit,",
  "): Promise<boolean> {",
  "  const now = Date.now();",
  "  const start = now - limit.windowMs;",
  "  await store.trim(key, start);",
  "  const count = await store.count(key);",
  "  if (count >= limit.max) {",
  "    return false;",
  "  }",
  "  await store.push(key, now);",
  "  return true;",
  "}",
].join("\n");

const KEYWORDS = new Set(["import", "from", "export", "interface", "async", "function", "const", "await", "if", "return", "true", "false"]);
const TYPES = new Set(["Store", "Limit", "Promise", "boolean", "number", "string", "Date"]);

function colorLine(line) {
  const colors = new Array(line.length).fill("0");
  const commentIndex = line.indexOf("//");
  if (commentIndex >= 0) {
    for (let index = commentIndex; index < line.length; index += 1) colors[index] = "1";
  }
  const codeEnd = commentIndex >= 0 ? commentIndex : line.length;
  let index = 0;
  while (index < codeEnd) {
    const character = line[index];
    if (character === '"') {
      let end = index + 1;
      while (end < codeEnd && line[end] !== '"') end += 1;
      for (let cursor = index; cursor <= end; cursor += 1) colors[cursor] = "9";
      index = end + 1;
      continue;
    }
    if (/[A-Za-z_]/.test(character)) {
      let end = index;
      while (end < codeEnd && /[A-Za-z0-9_]/.test(line[end])) end += 1;
      const word = line.slice(index, end);
      const color = KEYWORDS.has(word)
        ? (word === "true" || word === "false" ? "3" : "5")
        : TYPES.has(word) ? "4" : line[end] === "(" ? "6" : line[index - 1] === "." ? "3" : "0";
      for (let cursor = index; cursor < end; cursor += 1) colors[cursor] = color;
      index = end;
      continue;
    }
    if (/[0-9]/.test(character)) {
      colors[index] = "3";
      index += 1;
      continue;
    }
    if (/[{}()<>;:,.=\-]/.test(character)) colors[index] = character === "=" || character === ">" || character === "-" ? "5" : "1";
    index += 1;
  }
  return colors;
}

function createEditorFrame() {
  const grid = new AsciiGrid(WIDTH, HEIGHT, "0");
  const lines = SOURCE.split("\n");
  const syntax = lines.map(colorLine);
  const keys = [];
  let typingTime = 0.3;

  lines.forEach((line, lineIndex) => {
    const indentation = line.length - line.trimStart().length;
    for (let index = 0; index < line.length; index += 1) {
      if (index >= indentation) typingTime += /[ (.]/.test(line[index]) ? 0.03 : 0.016 + ((index * 7 + lineIndex * 13) % 5) * 0.004;
      keys.push([lineIndex, index, typingTime]);
    }
    typingTime += line.length ? 0.16 : 0.06;
    keys.push([lineIndex + 1, -1, typingTime]);
  });

  const period = typingTime + 2.5;
  const top = 4;
  const visibleLines = HEIGHT - 7;

  function draw(time) {
    grid.clear();
    const localTime = time % period;
    let keyIndex = 0;
    while (keyIndex < keys.length && keys[keyIndex][2] <= localTime) keyIndex += 1;
    let currentLine = 0;
    let currentColumn = 0;
    if (keyIndex) {
      const previous = keys[keyIndex - 1];
      currentLine = previous[0];
      currentColumn = previous[1] + 1;
      if (previous[1] < 0) currentColumn = lines[currentLine] ? lines[currentLine].length - lines[currentLine].trimStart().length : 0;
    }

    grid.box(0, 0, WIDTH, HEIGHT, "7", "rounded");
    grid.text(2, 0, "●", "5");
    grid.text(4, 0, "●", "4");
    grid.text(6, 0, "●", "2");
    grid.text(WIDTH / 2 - 12, 0, " rate-limit.ts · api-gateway ", "1");
    grid.text(2, 1, "• rate-limit.ts", "0");
    grid.set(18, 1, "●", "0");
    grid.text(21, 1, "• store.ts", "1");
    grid.text(33, 1, "• index.ts", "1");
    grid.hline(1, WIDTH - 2, 2, "─", "8");
    grid.hline(2, 17, 2, "━", "3");
    grid.text(2, 3, "src / middleware / rate-limit.ts", "7");

    const scroll = Math.max(0, currentLine - visibleLines + 2);
    for (let row = 0; row < visibleLines; row += 1) {
      const lineIndex = row + scroll;
      const y = top + row;
      if (lineIndex >= lines.length || lineIndex > currentLine) break;
      grid.text(2, y, String(lineIndex + 1).padStart(3), lineIndex === currentLine ? "0" : "7");
      const line = lines[lineIndex];
      const length = lineIndex < currentLine ? line.length : Math.min(line.length, currentColumn);
      for (let index = 0; index < length; index += 1) grid.set(7 + index, y, line[index], syntax[lineIndex][index]);
      const minimapLength = Math.min(12, Math.ceil(line.trim().length / 4));
      const indentation = Math.floor((line.length - line.trimStart().length) / 2);
      for (let index = 0; index < minimapLength; index += 1) grid.set(WIDTH - 15 + indentation + index, y, "▪", lineIndex === currentLine ? "1" : "8");
    }

    grid.vline(WIDTH - 17, 3, HEIGHT - 4, "│", "8");
    const cursorY = top + currentLine - scroll;
    if (currentLine < lines.length && Math.floor(localTime * 2.5) % 2 === 0) grid.set(7 + currentColumn, cursorY, "▌", "3");
    grid.hline(1, WIDTH - 2, HEIGHT - 3, "─", "8");
    grid.text(2, HEIGHT - 2, "◆ main", "6");
    grid.text(10, HEIGHT - 2, "✓ 0 problems", "2");
    const status = "Ln " + (Math.min(currentLine, lines.length - 1) + 1) + ", Col " + (currentColumn + 1);
    grid.text(WIDTH - 46, HEIGHT - 2, status.padEnd(14) + "Spaces: 2   UTF-8   TypeScript", "1");
    return grid.frame();
  }

  draw.staticTime = period - 0.8;
  return draw;
}

const createColorFor = ({ paper, slate, caramel, sand }) => {
  const muted = `color-mix(in srgb, ${sand} 62%, ${paper})`;
  const dim = `color-mix(in srgb, ${caramel} 52%, ${paper})`;
  const line = `color-mix(in srgb, ${sand} 24%, ${paper})`;
  const palette = [slate, muted, caramel, sand, slate, caramel, sand, dim, line, sand, paper];
  return (key) => palette[Number(key)] || slate;
};

/** The editor pauses offscreen and uses a readable still when motion is disabled. */
export default function CodeEditorScene() {
  return (
    <AsciiScene
      className="code-editor-canvas"
      columns={WIDTH}
      rows={HEIGHT}
      cellWidth={CELL_WIDTH}
      cellHeight={CELL_HEIGHT}
      frameInterval={FRAME_INTERVAL}
      font='17px "DM Mono", monospace'
      createScene={createEditorFrame}
      createColorFor={createColorFor}
    />
  );
}

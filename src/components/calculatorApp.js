const WIDTH = 48;
const HEIGHT = 31;
const KEY_INTERVAL = 0.42;

const KEYS = [
  ["AC", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "DEL", "="],
];

const SEQUENCES = [
  ["AC", "2", "1", "4", "8", "+", "1", "4", "7", "5", ".", "1", "3", "="],
  ["AC", "9", "6", "0", "÷", "1", "2", "-", "4", ".", "5", "="],
  ["AC", "2", "5", "%", "×", "8", "0", "0", "="],
];

const LARGE_GLYPHS = {
  "0": ["###", "# #", "# #", "# #", "###"],
  "1": ["  #", "  #", "  #", "  #", "  #"],
  "2": ["###", "  #", "###", "#  ", "###"],
  "3": ["###", "  #", "###", "  #", "###"],
  "4": ["# #", "# #", "###", "  #", "  #"],
  "5": ["###", "#  ", "###", "  #", "###"],
  "6": ["###", "#  ", "###", "# #", "###"],
  "7": ["###", "  #", "  #", "  #", "  #"],
  "8": ["###", "# #", "###", "# #", "###"],
  "9": ["###", "# #", "###", "  #", "###"],
  ".": ["   ", "   ", "   ", "   ", "  #"],
  "-": ["   ", "   ", "###", "   ", "   "],
};

class CalculatorGrid {
  constructor() {
    this.characters = new Array(WIDTH * HEIGHT).fill(" ");
    this.colors = new Array(WIDTH * HEIGHT).fill("0");
  }

  set(x, y, character, color = "0") {
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
    const index = y * WIDTH + x;
    this.characters[index] = [...character][0] || " ";
    this.colors[index] = String(color);
  }

  text(x, y, value, color = "0") {
    [...String(value)].forEach((character, offset) => this.set(x + offset, y, character, color));
  }

  fill(x, y, width, height, character, color) {
    for (let row = y; row < y + height; row += 1) {
      for (let column = x; column < x + width; column += 1) this.set(column, row, character, color);
    }
  }

  box(x, y, width, height, color) {
    for (let column = x + 1; column < x + width - 1; column += 1) {
      this.set(column, y, "-", color);
      this.set(column, y + height - 1, "-", color);
    }
    for (let row = y + 1; row < y + height - 1; row += 1) {
      this.set(x, row, "|", color);
      this.set(x + width - 1, row, "|", color);
    }
    this.set(x, y, "+", color);
    this.set(x + width - 1, y, "+", color);
    this.set(x, y + height - 1, "+", color);
    this.set(x + width - 1, y + height - 1, "+", color);
  }

  frame() {
    return this.characters.map((character, index) => [character, this.colors[index]]);
  }
}

function evaluate(keys) {
  let accumulator = null;
  let operator = null;
  let current = "";
  let history = "";
  const apply = (left, op, right) => {
    if (op === "+") return left + right;
    if (op === "-") return left - right;
    if (op === "×") return left * right;
    if (op === "÷") return right === 0 ? left : left / right;
    return right;
  };

  for (const key of keys) {
    if (key === "AC") {
      accumulator = null;
      operator = null;
      current = "";
      history = "";
      continue;
    }
    if (/^[0-9.]$/.test(key)) {
      if (key !== "." || !current.includes(".")) current += key;
      history += key;
      continue;
    }
    if (key === "DEL") {
      current = current.slice(0, -1);
      history = history.slice(0, -1);
      continue;
    }
    if (key === "±") {
      current = String(-Number(current || "0"));
      history += " +/-";
      continue;
    }
    if (key === "%") {
      current = String(Number(current || "0") / 100);
      history += "%";
      continue;
    }

    const value = Number(current || "0");
    accumulator = accumulator === null ? value : apply(accumulator, operator, value);
    if (key === "=") {
      current = String(Math.round(accumulator * 1e6) / 1e6);
      return { shown: current, history, done: true };
    }
    operator = key;
    current = "";
    history += ` ${key} `;
  }

  return { shown: current || String(accumulator ?? 0), history, done: false };
}

function drawLargeText(grid, x, y, value, color, clipTop, clipBottom) {
  [...value].forEach((character, index) => {
    const glyph = LARGE_GLYPHS[character] || LARGE_GLYPHS["0"];
    glyph.forEach((line, row) => {
      const targetY = y + row;
      if (targetY >= clipTop && targetY <= clipBottom) grid.text(x + index * 4, targetY, line, color);
    });
  });
}

/** Animate calculator input and a monthly bill estimate in a compact ASCII grid. */
export default function createCalculatorApp() {
  const grid = new CalculatorGrid();
  const segments = SEQUENCES.map((sequence) => sequence.length * KEY_INTERVAL + 2.1);
  const period = segments.reduce((total, segment) => total + segment, 0);

  function draw(time) {
    const localTime = time % period;
    let remaining = localTime;
    let sequenceIndex = 0;
    while (remaining >= segments[sequenceIndex]) {
      remaining -= segments[sequenceIndex];
      sequenceIndex += 1;
    }

    const sequence = SEQUENCES[sequenceIndex];
    const entered = Math.min(sequence.length, Math.floor(remaining / KEY_INTERVAL) + 1);
    const lastKeyTime = (entered - 1) * KEY_INTERVAL;
    const pressed = remaining - lastKeyTime < 0.18 ? sequence[entered - 1] : null;
    const result = evaluate(sequence.slice(0, entered));
    grid.characters.fill(" ");
    grid.colors.fill("0");

    grid.box(0, 0, WIDTH, HEIGHT, "5");
    grid.text(3, 0, "WATT WISE / BILL CALCULATOR", "2");
    grid.box(2, 2, WIDTH - 4, 9, "7");
    grid.text(4, 3, "MONTHLY ESTIMATE / THB", "1");

    const visibleHistory = result.history.slice(-(WIDTH - 10));
    grid.text(WIDTH - 4 - visibleHistory.length, 4, visibleHistory, "1");
    const shown = result.shown.slice(0, 9);
    const rolling = result.done && remaining - lastKeyTime < 0.3;
    const rollOffset = rolling ? Math.ceil((0.3 - (remaining - lastKeyTime)) / 0.075) : 0;
    const shownColor = rolling ? "3" : result.done ? "2" : "0";
    const digitsWidth = shown.length * 4;
    drawLargeText(grid, WIDTH - 5 - digitsWidth, 5 + rollOffset, shown, shownColor, 5, 9);

    KEYS.forEach((row, rowIndex) => row.forEach((key, columnIndex) => {
      const x = 2 + columnIndex * 11;
      const y = 11 + rowIndex * 4;
      const operation = columnIndex === 3;
      const functionKey = rowIndex === 0 && columnIndex < 3;
      const down = pressed === key;
      const borderColor = down ? "2" : operation ? "2" : functionKey ? "1" : "5";
      const labelColor = down ? "3" : operation ? "2" : functionKey ? "1" : "0";

      grid.box(x, y, 9, 3, borderColor);
      if (down) grid.fill(x + 1, y + 1, 7, 1, ".", "2");
      grid.text(x + 4 - Math.floor(key.length / 2), y + 1, key, labelColor);
    }));

    return grid.frame();
  }

  draw.staticTime = period - 0.12;
  draw.duration = period;
  return draw;
}

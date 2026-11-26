const BOX_STYLES = {
  ascii: { h: "-", v: "|", tl: "+", tr: "+", bl: "+", br: "+" },
  rounded: { h: "─", v: "│", tl: "╭", tr: "╮", bl: "╰", br: "╯" },
};

/** Shared 2D character and color-key grid for procedural ASCII scenes. */
export default class AsciiGrid {
  constructor(width, height, defaultColor = "0") {
    this.width = width;
    this.height = height;
    this.defaultColor = defaultColor;
    this.characters = new Array(width * height);
    this.colors = new Array(width * height);
    this.clear();
  }

  clear() {
    this.characters.fill(" ");
    this.colors.fill(this.defaultColor);
  }

  set(x, y, character, color = this.defaultColor) {
    const column = Math.round(x);
    const row = Math.round(y);
    if (column < 0 || column >= this.width || row < 0 || row >= this.height) return;
    const index = row * this.width + column;
    this.characters[index] = [...String(character)][0] || " ";
    this.colors[index] = typeof this.defaultColor === "number" ? color : String(color);
  }

  text(x, y, value, color = this.defaultColor) {
    [...String(value)].forEach((character, offset) => this.set(x + offset, y, character, color));
  }

  hline(x0, x1, y, character = "-", color = this.defaultColor) {
    for (let x = Math.ceil(x0); x <= Math.floor(x1); x += 1) this.set(x, y, character, color);
  }

  vline(x, y0, y1, character = "|", color = this.defaultColor) {
    for (let y = Math.ceil(y0); y <= Math.floor(y1); y += 1) this.set(x, y, character, color);
  }

  line(x0, y0, x1, y1, character, color = this.defaultColor) {
    let x = Math.round(x0);
    let y = Math.round(y0);
    const endX = Math.round(x1);
    const endY = Math.round(y1);
    const dx = Math.abs(endX - x);
    const sx = x < endX ? 1 : -1;
    const dy = -Math.abs(endY - y);
    const sy = y < endY ? 1 : -1;
    let error = dx + dy;
    while (true) {
      this.set(x, y, character, color);
      if (x === endX && y === endY) break;
      const doubled = 2 * error;
      if (doubled >= dy) { error += dy; x += sx; }
      if (doubled <= dx) { error += dx; y += sy; }
    }
  }

  fill(x, y, width, height, character, color = this.defaultColor) {
    for (let row = y; row < y + height; row += 1) {
      for (let column = x; column < x + width; column += 1) this.set(column, row, character, color);
    }
  }

  box(x, y, width, height, color = this.defaultColor, style = "ascii") {
    const chars = BOX_STYLES[style] || BOX_STYLES.ascii;
    this.hline(x + 1, x + width - 2, y, chars.h, color);
    this.hline(x + 1, x + width - 2, y + height - 1, chars.h, color);
    this.vline(x, y + 1, y + height - 2, chars.v, color);
    this.vline(x + width - 1, y + 1, y + height - 2, chars.v, color);
    this.set(x, y, chars.tl, color);
    this.set(x + width - 1, y, chars.tr, color);
    this.set(x, y + height - 1, chars.bl, color);
    this.set(x + width - 1, y + height - 1, chars.br, color);
  }

  frame() {
    return this.characters.map((character, index) => [character, this.colors[index]]);
  }
}

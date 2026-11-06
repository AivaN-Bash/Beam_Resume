const clamp = (value) => Math.max(0, Math.min(1, value));
const smooth = (value) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function mixColor(a, b, amount) {
  const from = a.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16));
  const to = b.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16));
  return "#" + from.map((value, index) => Math.round(value + (to[index] - value) * amount).toString(16).padStart(2, "0")).join("");
}

function gradient(stops, size) {
  return Array.from({ length: size }, (_, index) => {
    const position = (index / Math.max(1, size - 1)) * (stops.length - 1);
    const stop = Math.floor(position);
    return mixColor(stops[stop], stops[Math.min(stop + 1, stops.length - 1)], position - stop);
  });
}

class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.ch = new Array(cols * rows);
    this.co = new Array(cols * rows);
    this.clear();
  }

  clear() {
    this.ch.fill(" ");
    this.co.fill(0);
  }

  set(x, y, character, color) {
    const col = Math.round(x);
    const row = Math.round(y);
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
    const index = row * this.cols + col;
    this.ch[index] = [...character][0] || " ";
    this.co[index] = color;
  }

  text(x, y, value, color) {
    [...value].forEach((character, index) => this.set(x + index, y, character, color));
  }

  vline(x, y0, y1, character, color) {
    for (let y = Math.ceil(y0); y <= Math.floor(y1); y += 1) this.set(x, y, character, color);
  }
}

const ell = (grid, cx, cy, rx, ry, draw) => {
  for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
      const dx = (x + 0.5 - cx) / rx;
      const dy = (y + 0.5 - cy) / ry;
      const distance = dx * dx + dy * dy;
      if (distance <= 1) draw(x, y, dx, dy, distance);
    }
  }
};

const limb = (x0, y0, x1, y1, radius, draw) => {
  const steps = Math.ceil(Math.hypot(x1 - x0, (y1 - y0) * 2) * 2) + 1;
  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;
    const x = x0 + (x1 - x0) * progress;
    const y = y0 + (y1 - y0) * progress;
    for (let row = Math.floor(y - radius); row <= y + radius; row += 1) {
      for (let col = Math.floor(x - radius); col <= x + radius; col += 1) {
        if (Math.hypot(col + 0.5 - x, (row - y) * 2) <= radius) draw(col, row, progress);
      }
    }
  }
};

const roundedBox = (grid, x0, y0, width, height, draw) => {
  for (let y = y0; y < y0 + height; y += 1) {
    for (let x = x0; x < x0 + width; x += 1) {
      const u = ((x - x0) / (width - 1)) * 2 - 1;
      const v = ((y - y0) / (height - 1)) * 2 - 1;
      if ((x === x0 || x === x0 + width - 1) && (y === y0 || y === y0 + height - 1)) continue;
      draw(x, y, u, v, x === x0 || x === x0 + width - 1 || y === y0 || y === y0 + height - 1);
    }
  }
};

/** Builds the supplied tin-robot animation using the portfolio's colors. */
export function createRobotFrame(colors) {
  const palette = [];
  const add = (entries) => {
    const offset = palette.length;
    palette.push(...entries);
    return offset;
  };

  const metal = add(gradient([colors.caramel, colors.sand, colors.slate], 12));
  const dark = add([colors.ink, mixColor(colors.ink, colors.slate, 0.08), mixColor(colors.ink, colors.slate, 0.16)]);
  const eye = add([colors.caramel, colors.sand, colors.slate, colors.slate]);
  const red = add([colors.caramel, colors.sand, mixColor(colors.caramel, colors.ink, 0.42)]);
  const accent = add([colors.sand, colors.caramel, colors.slate]);

  const cols = 64;
  const rows = 30;
  const grid = new Grid(cols, rows);
  const metalShade = (u, v, edge) => [
    edge ? "▓" : "█",
    metal + Math.min(11, Math.max(0, Math.floor(clamp(0.62 - v * 0.3 - u * 0.22) * 12) - (edge ? 3 : 0))),
  ];

  return (time) => {
    grid.clear();
    const phase = time % 6;
    const wave = phase < 0.5 ? smooth(phase / 0.5) : phase < 3.4 ? 1 : phase < 3.9 ? 1 - smooth((phase - 3.4) / 0.5) : 0;
    const bob = Math.round(Math.sin(time * 2.2) * 0.6);

    // Legs and feet
    for (const legX of [27, 35]) {
      for (let y = 23; y < 26; y += 1) grid.text(legX, y, "▐█▌", metal + 4 + (y % 2));
      grid.text(legX - 1, 26, "▄███▄", metal + 6);
    }

    // Body and status lights
    const bodyY = 15 + bob;
    roundedBox(grid, 23, bodyY, 18, 10, (x, y, u, v, edge) => {
      const [character, color] = metalShade(u, v, edge);
      grid.set(x, y, character, color);
    });
    roundedBox(grid, 26, bodyY + 2, 12, 5, (x, y) => grid.set(x, y, "█", dark));
    for (let index = 0; index < 4; index += 1) {
      const height = 1 + Math.floor((Math.sin(time * 3.1 + index * 1.7) * 0.5 + 0.5) * 3);
      for (let level = 0; level < height; level += 1) grid.set(28 + index * 2, bodyY + 5 - level, "▆", accent + 1);
    }
    grid.set(35, bodyY + 3, "♥", red);
    grid.text(27, bodyY + 8, "● ● ●", accent);
    grid.text(29, bodyY - 1, "▓▓▓▓▓▓", dark + 2);

    // One arm rests while the other follows the source's wave motion.
    const leftShoulder = [22, bodyY + 2];
    const rightShoulder = [41, bodyY + 2];
    const restingHand = [17.5, bodyY + 8];
    limb(leftShoulder[0], leftShoulder[1], restingHand[0], restingHand[1], 1.3, (x, y) => grid.set(x, y, "█", metal + 5));
    ell(grid, restingHand[0], restingHand[1] + 0.4, 1.8, 1.1, (x, y, dx, dy) => grid.set(x, y, "█", metal + (dy < 0 ? 8 : 6)));
    const armPhase = 0.3 + wave * 1.45;
    const handPhase = 0.5 + wave * (2.34 + Math.sin(time * 9) * 0.42);
    const elbowX = rightShoulder[0] + Math.sin(armPhase) * 7;
    const elbowY = rightShoulder[1] + Math.cos(armPhase) * 3.5;
    const handX = elbowX + Math.sin(handPhase) * 9;
    const handY = elbowY + Math.cos(handPhase) * 4.5;
    limb(rightShoulder[0], rightShoulder[1], elbowX, elbowY, 1.3, (x, y) => grid.set(x, y, "█", metal + 7));
    limb(elbowX, elbowY, handX, handY, 1.2, (x, y) => grid.set(x, y, "█", metal + 8));
    ell(grid, handX, handY, 2.3, 1.5, (x, y, dx, dy) => grid.set(x, y, "█", metal + (dy < 0 ? 10 : 8)));
    if (wave > 0.8) {
      const direction = Math.sin(time * 9) > 0 ? 1 : -1;
      grid.set(handX + 3 * direction, handY - 1, direction > 0 ? ")" : "(", eye + 2);
      grid.set(handX + 4 * direction, handY - 1, direction > 0 ? ")" : "(", eye + 1);
    }

    // Head and side details
    const headY = 4 + bob;
    for (const sideX of [18, 44]) {
      grid.text(sideX, headY + 4, "▐█", metal + 3);
      grid.text(sideX, headY + 5, "▐█", metal + 2);
    }
    roundedBox(grid, 20, headY, 24, 10, (x, y, u, v, edge) => {
      const [character, color] = metalShade(u, v, edge);
      grid.set(x, y, character, color);
    });
    roundedBox(grid, 22, headY + 1, 20, 7, (x, y, u, v, edge) => grid.set(x, y, "█", dark + (edge ? 1 : 0)));

    // Antenna pulses gently, with no page-wide glow.
    grid.vline(32, headY - 2, headY - 1, "│", metal + 6);
    const antennaOn = Math.floor(time * 2) % 2 === 0;
    grid.text(31, headY - 3, "▄█▄", antennaOn ? red : red + 2);
    if (antennaOn) {
      grid.set(29, headY - 3, "-", red + 1);
      grid.set(35, headY - 3, "-", red + 1);
    }

    // The eyes blink and glance while the robot waves.
    const blinkPhase = time % 4.1;
    const blinkAt = (center) => {
      const distance = Math.abs(blinkPhase - center);
      return distance < 0.13 ? 1 - distance / 0.13 : 0;
    };
    const blink = Math.max(blinkAt(2.2), Math.floor(time / 4.1) % 2 ? blinkAt(2.55) : 0);
    const look = wave > 0.5 ? 0 : Math.sin(time * 0.9) * 0.8;
    for (const centerX of [27, 37]) {
      const eyeHeight = 2.3 * (1 - blink);
      const centerY = headY + 4.2;
      if (eyeHeight < 0.7) {
        grid.text(centerX - 3, Math.round(centerY), "▀▀▀▀▀▀", eye);
        continue;
      }
      if (wave > 0.85) {
        grid.text(centerX - 2, Math.round(centerY) - 1, "▄▀▀▄", eye + 1);
        grid.text(centerX - 3, Math.round(centerY), "▀    ▀", eye + 1);
        continue;
      }
      ell(grid, centerX, centerY, 3.3, eyeHeight, (x, y, dx, dy, distance) => grid.set(x, y, "█", eye + (distance > 0.6 ? 0 : 1)));
      ell(grid, centerX + look * 1.2, centerY + 0.3, 1.2, eyeHeight * 0.45, (x, y) => grid.set(x, y, "█", dark));
      grid.set(centerX + look * 1.2 - 1, centerY - 1, "█", eye + 3);
    }

    // Mouth and cheeks
    const mouthY = headY + 7;
    grid.text(29, mouthY, wave > 0.5 ? "▀▄▄▄▄▀" : "▀▀▀▀▀▀", eye + (wave > 0.5 ? 1 : 0));
    grid.text(23, mouthY, "▄▄", red + 1);
    grid.text(39, mouthY, "▄▄", red + 1);

    return grid.ch.map((character, index) => [character, palette[grid.co[index]]]);
  };
}

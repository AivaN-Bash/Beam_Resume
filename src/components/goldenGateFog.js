import { clamp, fbm, noise2 } from "./viaductNoise";

const WIDTH = 100;
const HEIGHT = 36;
const palette = [];

const mixHex = (first, second, amount) => {
  const a = first.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16));
  const b = second.match(/[a-f\d]{2}/gi).map((value) => parseInt(value, 16));
  return "#" + a.map((value, index) => Math.round(value + (b[index] - value) * amount).toString(16).padStart(2, "0")).join("");
};

const gradient = (colors, steps) => Array.from({ length: steps }, (_, index) => {
  const position = index / Math.max(1, steps - 1) * (colors.length - 1);
  const start = Math.floor(position);
  return mixHex(colors[start], colors[Math.min(start + 1, colors.length - 1)], position - start);
});

const group = (colors) => {
  const offset = palette.length;
  palette.push(...colors);
  return (value) => offset + (value <= 0 ? 0 : value >= 1 ? colors.length - 1 : Math.floor(value * colors.length));
};

const SKY = group(gradient(["#01040e", "#171a22", "#30313a", "#765b4b", "#dbd7c8"], 12));
const HILL = group(["#252832", "#383940", "#55545d"]);
const SEA = group(gradient(["#090a0e", "#15171d", "#29252b"], 5));
const BRIDGE = group(["#4b3932", "#735440", "#b6815b", "#dbd7c8"]);
const FOG = group(gradient(["#777d84", "#9da6ac", "#c2ccd2", "#d9e2e7"], 8));
const LIGHT = group(["#dbd7c8"]);

export const GOLDEN_GATE_PALETTE = palette;

class SceneGrid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.characters = new Array(width * height);
    this.colors = new Array(width * height);
    this.clear();
  }

  clear() {
    this.characters.fill(" ");
    this.colors.fill(0);
  }

  set(x, y, character, color) {
    const column = Math.round(x);
    const row = Math.round(y);
    if (column < 0 || row < 0 || column >= this.width || row >= this.height) return;
    const index = row * this.width + column;
    this.characters[index] = [...character][0] || " ";
    this.colors[index] = color;
  }

  frame() {
    return this.characters.map((character, index) => [character, this.colors[index]]);
  }
}

const DECK = 21;
const TOWER_LEFT = 27;
const TOWER_RIGHT = 73;
const TOP = 3;
const HORIZON = 23;

/** Creates a palette-toned bridge scene with drifting fog. */
export default function createGoldenGateFog() {
  const grid = new SceneGrid(WIDTH, HEIGHT);
  const cable = Float32Array.from({ length: WIDTH }, (_, x) => {
    if (x < TOWER_LEFT) {
      const u = x / TOWER_LEFT;
      return DECK - 3 - (DECK - 3 - TOP - 1) * u * u;
    }
    if (x > TOWER_RIGHT) {
      const u = (WIDTH - 1 - x) / (WIDTH - 1 - TOWER_RIGHT);
      return DECK - 3 - (DECK - 3 - TOP - 1) * u * u;
    }
    const u = (x - (TOWER_LEFT + TOWER_RIGHT) / 2) / ((TOWER_RIGHT - TOWER_LEFT) / 2);
    return DECK - 2 - (DECK - 2 - TOP - 1) * u * u;
  });
  const hill = Float32Array.from({ length: WIDTH }, (_, x) => HORIZON - 1
    - Math.max(0, 6 * Math.exp(-(((x - 90) / 14) ** 2)) + 4 * Math.exp(-(((x - 6) / 12) ** 2)))
    - fbm(x * 0.1, 1, 2, 3) * 1.5);

  const tower = (centerX, belowDeck) => {
    for (let y = TOP; y < HEIGHT; y += 1) {
      if (belowDeck ? y <= DECK + 1 : y > DECK + 1) continue;
      for (const edgeX of [centerX - 2, centerX + 2]) {
        grid.set(edgeX, y, "█", BRIDGE(edgeX > centerX ? 0.72 : 0.86));
        grid.set(edgeX + (edgeX > centerX ? 1 : -1), y, "▌", BRIDGE(0.1));
      }
      if (!belowDeck && [TOP, TOP + 5, TOP + 10, TOP + 14].includes(y)) {
        for (let x = centerX - 1; x <= centerX + 1; x += 1) grid.set(x, y, y === TOP ? "█" : "▀", BRIDGE(0.82));
      }
    }
    if (!belowDeck) {
      grid.set(centerX - 2, TOP - 1, "▄", BRIDGE(0.82));
      grid.set(centerX + 2, TOP - 1, "▄", BRIDGE(0.82));
    }
  };

  return (time) => {
    grid.clear();

    // Deep evening sky, softened peaks, and a muted bay.
    for (let y = 0; y < HORIZON; y += 1) {
      for (let x = 0; x < WIDTH; x += 1) {
        const value = clamp(Math.pow(y / HORIZON, 1.2)
          + (fbm(x * 0.03 - time * 0.03, y * 0.3, 3, 2) - 0.5) * 0.3
          + Math.exp(-Math.hypot((x - 50) / 30, y - HORIZON) / 3) * 0.1);
        grid.set(x, y, value > 0.35 ? "█" : "▓", SKY(value));
      }
    }
    for (let x = 0; x < WIDTH; x += 1) {
      for (let y = Math.ceil(hill[x]); y < HORIZON; y += 1) grid.set(x, y, "█", HILL(y - hill[x] < 1 ? 0.9 : 0.4));
    }
    for (let y = HORIZON; y < HEIGHT; y += 1) {
      for (let x = 0; x < WIDTH; x += 1) {
        const wave = noise2(x * 0.2 - time * 0.3, y * 0.9, 4);
        grid.set(x, y, wave > 0.6 ? "▓" : "█", SEA(clamp((y - HORIZON) / 12 + (wave - 0.5) * 0.6)));
      }
    }

    tower(TOWER_LEFT, true);
    tower(TOWER_RIGHT, true);

    // Fog rolls through the bridge arches in slow, uneven layers.
    for (let y = 12; y < HEIGHT; y += 1) {
      for (let x = 0; x < WIDTH; x += 1) {
        const noise = fbm(x * 0.05 - time * 0.35, y * 0.22 + Math.sin(time * 0.2) * 0.3, 4, 7);
        const body = y > DECK ? 0.9 - (y - DECK) * 0.02 : 0.9 - (DECK - y) * 0.11;
        const roll = Math.sin(x * 0.09 - time * 0.6 + y * 0.2) * 0.12;
        const density = noise * body * 1.6 + roll - 0.62;
        if (density > 0) grid.set(x, y, density > 0.24 ? "█" : density > 0.12 ? "▓" : "▒", FOG(clamp(0.2 + density * 2.2)));
      }
    }

    // Towers, suspension cables, and the lit deck sit above the mist.
    tower(TOWER_LEFT, false);
    tower(TOWER_RIGHT, false);
    for (let x = 0; x < WIDTH; x += 1) {
      const cableY = cable[x];
      grid.set(x, cableY, "█", BRIDGE(0.7));
      if (x % 2 === 0 && Math.abs(x - TOWER_LEFT) > 2 && Math.abs(x - TOWER_RIGHT) > 2) {
        for (let y = Math.floor(cableY) + 1; y < DECK; y += 1) grid.set(x, y, "│", BRIDGE(0.42));
      }
      grid.set(x, DECK, "▀", BRIDGE(1));
      grid.set(x, DECK + 1, "█", BRIDGE(0));
      if (x % 6 === Math.floor(time * 8) % 6) grid.set(x, DECK, "▀", LIGHT(0));
    }
    for (const towerX of [TOWER_LEFT, TOWER_RIGHT]) grid.set(towerX, TOP - 2, "•", LIGHT(0));

    // Light wisps move across the deck while the lower fog continues to drift.
    for (let y = DECK - 3; y < DECK + 3; y += 1) {
      for (let x = 0; x < WIDTH; x += 1) {
        const noise = fbm(x * 0.07 - time * 0.5, y * 0.4 + 9, 3, 11);
        if (noise > 0.66) grid.set(x, y, noise > 0.72 ? "▓" : "▒", FOG(clamp((noise - 0.6) * 5)));
      }
    }

    return grid.frame();
  };
}

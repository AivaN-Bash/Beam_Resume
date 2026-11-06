import { clamp, fbm, noise2 } from "./viaductNoise";

const WIDTH = 100;
const HEIGHT = 36;
const CITY_HEIGHT = 23;
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

const SKY = group(gradient(["#01040e", "#171a22", "#30313a", "#765b4b"], 8));
const BACK = group(gradient(["#151821", "#292a32"], 3));
const FRONT = group(["#090a0e", "#15171d", "#25262d"]);
const WINDOW_LIGHT = group(["#765b4b", "#b6815b", "#dbd7c8"]);
const NEON = [
  group(["#503038", "#85504a", "#b6815b", "#dbb99c"]),
  group(["#252f41", "#596a79", "#a9bdc5", "#d9e2e7"]),
  group(["#594127", "#98734f", "#c29463", "#dbd7c8"]),
  group(["#292d32", "#55545d", "#9da6ac", "#d9e2e7"]),
  group(["#4e2829", "#85504a", "#b6815b", "#dbd7c8"]),
];
const STREET = group(gradient(["#01040e", "#090a0e", "#171a22", "#30313a"], 6));
const RAIN = group(["#59656e", "#c2ccd2"]);
const CURB = group(["#30313a", "#8a7769"]);

export const NEON_CITY_PALETTE = palette;

const hash = (first, second) => {
  let value = Math.imul(first, 374761393) ^ Math.imul(second, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
};

function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

class CityGrid {
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
    const index = column + row * this.width;
    this.characters[index] = [...character][0] || " ";
    this.colors[index] = color;
  }

  frame() {
    return this.characters.map((character, index) => [character, this.colors[index]]);
  }
}

/** Creates a looping rain-soaked street with palette-colored sign glow. */
export default function createNeonCityRain() {
  const grid = new CityGrid(WIDTH, HEIGHT);
  const random = createRandom(23);
  const kind = new Int8Array(WIDTH * CITY_HEIGHT);
  const secondary = new Int16Array(WIDTH * CITY_HEIGHT);
  const signs = [
    { x: 4, y: 7, text: "BAR", vertical: true, color: 0 },
    { x: 14, y: 14, text: "NOODLES", vertical: false, color: 1 },
    { x: 33, y: 9, text: "HOTEL", vertical: true, color: 2 },
    { x: 44, y: 16, text: "OPEN 24H", vertical: false, color: 4 },
    { x: 60, y: 6, text: "KARAOKE", vertical: true, color: 3 },
    { x: 70, y: 12, text: "CAFE", vertical: false, color: 0 },
    { x: 88, y: 8, text: "RAMEN", vertical: true, color: 1 },
    { x: 78, y: 18, text: "PARKING", vertical: false, color: 2 },
  ];

  for (let x = 0; x < WIDTH;) {
    const buildingWidth = 5 + Math.floor(random() * 9);
    const top = 2 + Math.floor(random() * 8);
    for (let column = x; column < Math.min(WIDTH, x + buildingWidth); column += 1) {
      for (let y = top; y < CITY_HEIGHT; y += 1) {
        const index = column + y * WIDTH;
        kind[index] = 1;
        if ((column - x) % 3 === 1 && y % 2 === 0 && y > top) {
          kind[index] = 3;
          secondary[index] = 100 + Math.floor(random() * 1000);
        }
      }
    }
    x += buildingWidth;
  }

  for (let x = 0; x < WIDTH;) {
    const buildingWidth = 8 + Math.floor(random() * 12);
    const top = 6 + Math.floor(random() * 9);
    if (random() < 0.25) {
      x += 3;
      continue;
    }
    for (let column = x; column < Math.min(WIDTH, x + buildingWidth); column += 1) {
      for (let y = top; y < CITY_HEIGHT; y += 1) {
        const index = column + y * WIDTH;
        kind[index] = 2;
        if ((column - x) % 3 !== 0 && y % 3 !== 0 && y > top && column - x > 0 && column - x < buildingWidth - 1) {
          kind[index] = 3;
          secondary[index] = Math.floor(random() * 1000);
        }
      }
    }
    x += buildingWidth;
  }

  const signCells = signs.map((sign, id) => {
    const cells = [];
    const width = sign.vertical ? 3 : sign.text.length + 4;
    const height = sign.vertical ? sign.text.length + 2 : 3;
    for (let row = 0; row < height; row += 1) {
      for (let column = 0; column < width; column += 1) {
        const edgeX = column === 0 || column === width - 1;
        const edgeY = row === 0 || row === height - 1;
        let character = " ";
        if (edgeX && edgeY) character = ["╭", "╮", "╰", "╯"][(column ? 1 : 0) + (row ? 2 : 0)];
        else if (edgeY) character = "─";
        else if (edgeX) character = "│";
        else character = sign.vertical ? sign.text[row - 1] : (sign.text[column - 2] || " ");
        cells.push([sign.x + column, sign.y + row, character, edgeX || edgeY]);
      }
    }
    return { id, cells, x: sign.x, y: sign.y, width, height };
  });

  const drops = Array.from({ length: 170 }, () => [random() * WIDTH, random() * HEIGHT, 22 + random() * 14, random() < 0.3 ? 1 : 0]);
  const splashes = Array.from({ length: 40 }, () => [Math.floor(random() * WIDTH), CITY_HEIGHT + 1 + Math.floor(random() * (HEIGHT - CITY_HEIGHT - 1)), random()]);
  const litColor = new Array(WIDTH * CITY_HEIGHT);
  const litCharacter = new Array(WIDTH * CITY_HEIGHT);
  const signMask = new Uint8Array(WIDTH * HEIGHT);
  for (const sign of signCells) {
    for (const [x, y] of sign.cells) {
      if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) signMask[x + y * WIDTH] = 1;
    }
  }
  const onSign = (x, y) => {
    const column = Math.floor(x);
    const row = Math.floor(y);
    return column >= 0 && column < WIDTH && row >= 0 && row < HEIGHT && signMask[column + row * WIDTH] === 1;
  };

  return (time) => {
    grid.clear();
    const tick = Math.floor(time * 6);

    for (let y = 0; y < CITY_HEIGHT; y += 1) {
      for (let x = 0; x < WIDTH; x += 1) {
        const index = x + y * WIDTH;
        const type = kind[index];
        litColor[index] = null;
        if (type === 0) {
          const value = clamp(y / CITY_HEIGHT + (fbm(x * 0.04 + time * 0.05, y * 0.2, 3, 2) - 0.5) * 0.5);
          grid.set(x, y, value > 0.55 ? "▒" : "░", SKY(value));
        } else if (type === 1) {
          grid.set(x, y, "▓", BACK((x * 7 + y) % 5 === 0 ? 1 : 0));
        } else if (type === 2) {
          grid.set(x, y, "█", FRONT(0));
        } else {
          const seed = secondary[index];
          const lit = hash(seed, Math.floor(time * 0.4 + seed * 0.01)) > 0.45;
          const warmth = lit ? (seed % 4 === 0 ? 1 : 0.5) : 0;
          const color = WINDOW_LIGHT(warmth);
          grid.set(x, y, lit ? "█" : "▪", color);
          if (lit) {
            litColor[index] = color;
            litCharacter[index] = "░";
          }
        }
      }
    }

    // Sign glow is warm and restrained, with occasional small flickers.
    for (const signFrame of signCells) {
      const sign = signs[signFrame.id];
      const flicker = hash(signFrame.id + 7, tick) < 0.06 ? 0 : 1;
      const pulse = 0.5 + 0.5 * Math.sin(time * 2 + signFrame.id);
      const colorGroup = NEON[sign.color];
      for (let row = -2; row < signFrame.height + 2; row += 1) {
        for (let column = -3; column < signFrame.width + 3; column += 1) {
          const x = signFrame.x + column;
          const y = signFrame.y + row;
          if (x < 0 || x >= WIDTH || y < 0 || y >= CITY_HEIGHT) continue;
          if (flicker && (column < 0 || row < 0 || column >= signFrame.width || row >= signFrame.height)) {
            const glowColor = colorGroup(0);
            grid.set(x, y, "▒", glowColor);
            litColor[x + y * WIDTH] = glowColor;
            litCharacter[x + y * WIDTH] = "░";
          }
        }
      }
      for (const [x, y, character, edge] of signFrame.cells) {
        if (x >= WIDTH || y >= CITY_HEIGHT) continue;
        const color = flicker ? colorGroup(edge ? 0.5 + pulse * 0.25 : 0.99) : colorGroup(0);
        grid.set(x, y, character === " " ? "█" : character, character === " " ? colorGroup(0) : color);
        if (character !== " ") {
          litColor[x + y * WIDTH] = flicker ? colorGroup(0.6) : colorGroup(0);
          litCharacter[x + y * WIDTH] = "▒";
        }
      }
    }

    // Rain-darkened street and curb.
    for (let x = 0; x < WIDTH; x += 1) grid.set(x, CITY_HEIGHT, x % 6 === 0 ? "┴" : "─", CURB(1));
    for (let y = CITY_HEIGHT + 1; y < HEIGHT; y += 1) {
      const depth = (y - CITY_HEIGHT) / (HEIGHT - CITY_HEIGHT);
      for (let x = 0; x < WIDTH; x += 1) {
        const wobble = Math.round(Math.sin(y * 1.9 + time * 4 + x * 0.15) * (0.5 + depth * 1.5));
        const sourceY = 2 * CITY_HEIGHT - y + Math.floor(depth * 2);
        const sourceX = x + wobble;
        const noise = noise2(x * 0.15, y * 0.9 + time * 2, 4);
        const sourceIndex = sourceX + sourceY * WIDTH;
        const reflectedColor = sourceY >= 0 && sourceY < CITY_HEIGHT && sourceX >= 0 && sourceX < WIDTH ? litColor[sourceIndex] : null;
        if (reflectedColor !== null && reflectedColor !== undefined && noise > 0.25) {
          const character = noise > 0.6 && litCharacter[sourceIndex] === "▒" ? "▓" : noise > 0.6 ? "▒" : "░";
          grid.set(x, y, character, reflectedColor);
        } else {
          const value = clamp(0.2 + depth * 0.5 + (noise - 0.5) * 0.6);
          grid.set(x, y, value > 0.5 ? "▓" : "▒", STREET(value));
        }
      }
    }

    // Rain streaks and small pavement splashes.
    for (const [startX, startY, speed, bright] of drops) {
      const y = ((startY + time * speed) % (HEIGHT + 4)) - 2;
      const x = ((startX + y * 0.35) % WIDTH + WIDTH) % WIDTH;
      if (onSign(x, y)) continue;
      grid.set(x, y, "/", RAIN(bright));
      if (bright && !onSign(x - 0.35, y - 1)) grid.set(x - 0.35, y - 1, "/", RAIN(0));
    }
    for (const [x, y, phase] of splashes) {
      const frame = (time * 1.3 + phase) % 1;
      if (frame < 0.25) grid.set(x, y, frame < 0.12 ? "°" : "·", RAIN(1));
    }

    return grid.frame();
  };
}

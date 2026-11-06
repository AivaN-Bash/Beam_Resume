const WIDTH = 40;
const HEIGHT = 24;
const CENTER_X = 19;
const CROP_TOP = 5;

function ellipse(grid, centerX, centerY, radiusX, radiusY, paint) {
  const left = Math.floor(centerX - radiusX);
  const right = Math.ceil(centerX + radiusX);
  const top = Math.floor(centerY - radiusY);
  const bottom = Math.ceil(centerY + radiusY);

  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const dx = (x + 0.5 - centerX) / radiusX;
      const dy = (y + 0.5 - centerY) / radiusY;
      const distance = dx * dx + dy * dy;
      if (distance <= 1) grid.set(x, y, paint(dx, dy, distance));
    }
  }
}

class PuppyGrid {
  constructor() {
    this.colors = new Array(WIDTH * HEIGHT);
  }

  clear() {
    this.colors.fill(-1);
  }

  set(x, y, color) {
    const column = Math.round(x);
    const row = Math.round(y - CROP_TOP);
    if (column < 0 || column >= WIDTH || row < 0 || row >= HEIGHT) return;
    this.colors[row * WIDTH + column] = color;
  }

  line(x, y, colors) {
    [...colors].forEach((color, offset) => this.set(x + offset, y, color));
  }
}

function furShade(dx, dy, distance) {
  const light = 0.56 - dx * 0.18 - dy * 0.2 + Math.sqrt(Math.max(0, 1 - distance)) * 0.2;
  return Math.max(1, Math.min(4, Math.round(light * 5)));
}

/** Return transparent puppy cells with a wag, blink, pant, and gentle head tilt. */
export default function createDogMascot() {
  const grid = new PuppyGrid();

  return (time) => {
    grid.clear();
    const wag = Math.sin(time * 9);
    const tiltPhase = time % 6.4;
    const tilt = tiltPhase > 3.1 && tiltPhase < 5.4
      ? Math.min(1, (tiltPhase - 3.1) / 0.35) * (tiltPhase > 5.05 ? Math.max(0, 1 - (tiltPhase - 5.05) / 0.35) : 1)
      : 0;
    const headX = CENTER_X + tilt * 0.8;
    const headY = 11 + Math.sin(time * 2.8) * 0.18 + tilt * 0.2;

    // Wagging tail sits behind the body and stays inside the cropped sprite.
    for (let index = 0; index < 8; index += 1) {
      const progress = index / 7;
      const angle = -0.55 - progress * 0.9 + wag * 0.62 * progress;
      const x = CENTER_X + 7 + Math.cos(angle) * progress * 7;
      const y = 24 + Math.sin(angle) * progress * 5;
      grid.set(x, y, progress > 0.8 ? 4 : 2);
    }

    // Compact seated body, paws, and a simple copper collar.
    ellipse(grid, CENTER_X, 21.5, 8, 5.4, (dx, dy, distance) => furShade(dx, dy, distance));
    ellipse(grid, CENTER_X, 21, 3.4, 4, (_dx, dy) => dy < 0 ? 4 : 3);
    for (const legX of [CENTER_X - 5, CENTER_X + 3]) {
      for (let y = 21; y <= 26; y += 1) grid.line(legX, y, [3, 3, 3]);
      grid.line(legX - 1, 27, [4, 4, 4, 4, 4]);
    }
    for (let x = CENTER_X - 6; x <= CENTER_X + 6; x += 1) grid.set(x, 17, 2);
    grid.set(CENTER_X, 18, 4);

    // Floppy ears are drawn before the head so their edges stay soft.
    for (const side of [-1, 1]) {
      const flop = Math.sin(time * 3 + side) * 0.3 + (side > 0 ? tilt : -tilt) * 0.6;
      ellipse(grid, headX + side * 7.6, headY + 1.7, 2.4, 4.4 + flop * 0.4, (_dx, dy, distance) => {
        return distance < 0.28 || dy > 0.35 ? 1 : 2;
      });
    }
    ellipse(grid, headX, headY, 7.2, 5.3, (dx, dy, distance) => furShade(dx, dy - dx * tilt * 0.16, distance));
    ellipse(grid, headX, headY + 3, 4, 2.2, (_dx, dy) => dy < 0 ? 5 : 4);

    // Eyes blink independently of the tail, with a small slate glint.
    const blink = Math.abs((time % 4.2) - 1.8) < 0.11;
    for (const side of [-1, 1]) {
      const eyeX = Math.round(headX + side * 3);
      const eyeY = Math.round(headY - 1 + (side > 0 ? -tilt * 0.4 : tilt * 0.3));
      if (blink) {
        grid.set(eyeX - 1, eyeY, 6);
        grid.set(eyeX, eyeY, 6);
        grid.set(eyeX + 1, eyeY, 6);
      } else {
        grid.set(eyeX, eyeY, 6);
        grid.set(eyeX, eyeY - 1, 5);
      }
    }

    // Nose, smile, and a short panting tongue use the warm accent tones.
    grid.set(headX, headY + 2, 6);
    grid.set(headX - 1, headY + 2, 6);
    grid.set(headX + 1, headY + 2, 6);
    grid.set(headX - 1, headY + 3, 1);
    grid.set(headX + 1, headY + 3, 1);
    const panting = Math.floor(time * 3) % 2 === 0;
    if (panting) {
      grid.set(headX, headY + 4, 2);
      grid.set(headX, headY + 5, 3);
    }

    return grid.colors.slice();
  };
}

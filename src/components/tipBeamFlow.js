const WIDTH = 76;
const HEIGHT = 26;
const BUS_Y = 10;
const NODE_WIDTH = 15;
const NODES = [
  ["Viewer", "supporter", 2],
  ["TipBeam", "tip page", 21],
  ["PromptPay", "QR payment", 40],
  ["OBS Overlay", "OBS source", 59],
];

const STEPS = [
  [0, 1, "open donation page", ["GET /tip", "streamer: Phawat"]],
  [0, 1, "enter amount and message", ["amount: THB 100", "note: Thanks for the stream!"]],
  [1, 0, "show PromptPay QR", ["PromptPay QR generated", "amount: THB 100"]],
  [0, 2, "scan and pay", ["bank app: PromptPay", "payment: in progress"]],
  [2, 1, "confirm payment", ["payment status: confirmed", "amount: THB 100"]],
  [1, 3, "send donation alert", ["overlay event: new tip", "note: Thanks for the stream!"]],
  [3, 1, "show alert in OBS", ["browser source: active", "donation alert: visible"]],
];

const STEP_DURATION = 1.8;
const TRAVEL_DURATION = 1.15;
const END_HOLD = 2.4;
const TOTAL_DURATION = STEPS.length * STEP_DURATION + END_HOLD;

class TipBeamGrid {
  constructor() {
    this.characters = new Array(WIDTH * HEIGHT);
    this.colors = new Array(WIDTH * HEIGHT);
    this.clear();
  }

  clear() {
    this.characters.fill(" ");
    this.colors.fill("0");
  }

  set(x, y, character, color = "0") {
    const column = Math.round(x);
    const row = Math.round(y);
    if (column < 0 || column >= WIDTH || row < 0 || row >= HEIGHT) return;
    const index = row * WIDTH + column;
    this.characters[index] = character;
    this.colors[index] = String(color);
  }

  text(x, y, value, color = "0") {
    [...String(value)].forEach((character, offset) => this.set(x + offset, y, character, color));
  }

  horizontal(x1, x2, y, character, color) {
    for (let x = x1; x <= x2; x += 1) this.set(x, y, character, color);
  }

  vertical(x, y1, y2, character, color) {
    for (let y = y1; y <= y2; y += 1) this.set(x, y, character, color);
  }

  box(x, y, width, height, color) {
    this.horizontal(x + 1, x + width - 2, y, "-", color);
    this.horizontal(x + 1, x + width - 2, y + height - 1, "-", color);
    this.vertical(x, y + 1, y + height - 2, "|", color);
    this.vertical(x + width - 1, y + 1, y + height - 2, "|", color);
    this.set(x, y, "+", color);
    this.set(x + width - 1, y, "+", color);
    this.set(x, y + height - 1, "+", color);
    this.set(x + width - 1, y + height - 1, "+", color);
  }

  frame() {
    return this.characters.map((character, index) => [character, this.colors[index]]);
  }
}

function createPath(fromIndex, toIndex) {
  const from = NODES[fromIndex];
  const to = NODES[toIndex];
  const fromCenter = from[2] + Math.floor(NODE_WIDTH / 2);
  const toCenter = to[2] + Math.floor(NODE_WIDTH / 2);
  const direction = Math.sign(toCenter - fromCenter);
  const path = [];

  for (let y = 7; y < BUS_Y; y += 1) path.push([fromCenter, y]);
  for (let x = fromCenter; x !== toCenter; x += direction) path.push([x, BUS_Y]);
  path.push([toCenter, BUS_Y]);
  for (let y = BUS_Y - 1; y >= 7; y -= 1) path.push([toCenter, y]);
  return path;
}

function drawNodes(grid, active, stepIndex, isFinished) {
  NODES.forEach(([name, detail, x], index) => {
    const isActive = active === index;
    const status = index === 0
      ? (isFinished ? "submitted" : stepIndex >= 3 ? "paid" : stepIndex >= 1 ? "tip details" : "select tip")
      : index === 1
        ? (isFinished || stepIndex >= 5 ? "alert sent" : stepIndex >= 2 ? "QR ready" : "waiting tip")
        : index === 2
          ? (isFinished || stepIndex >= 4 ? "paid" : stepIndex >= 3 ? "paying now" : "QR ready")
          : (isFinished || stepIndex >= 6 ? "alert shown" : stepIndex >= 5 ? "queued" : "waiting");
    const color = isActive ? "2" : isFinished || stepIndex > index ? "4" : "5";

    grid.box(x, 2, NODE_WIDTH, 5, color);
    grid.text(x + 2, 3, name, isActive ? "0" : "4");
    grid.text(x + 2, 4, detail, "1");
    grid.text(x + 2, 5, status, isFinished || stepIndex > index ? "4" : "1");
    grid.vertical(x + Math.floor(NODE_WIDTH / 2), 7, BUS_Y - 1, "|", "5");
  });
  grid.horizontal(9, 66, BUS_Y, "-", "5");
}

function drawPayload(grid, stepIndex, progress, complete) {
  const [from, to, label, lines] = STEPS[stepIndex];
  const y = 14;
  grid.box(2, y, WIDTH - 4, 9, "5");
  grid.text(4, y, ` ${NODES[from][0]} -> ${NODES[to][0]} / ${label.toUpperCase()} `, "4");
  grid.text(4, y + 2, "TIPBEAM FLOW", "2");

  const totalCharacters = lines.reduce((total, line) => total + line.length, 0);
  let remaining = complete ? totalCharacters : Math.floor(Math.max(0, Math.min(1, (progress - 0.12) / 0.72)) * totalCharacters);
  lines.forEach((line, index) => {
    const visible = line.slice(0, Math.max(0, remaining));
    remaining -= line.length;
    grid.text(20, y + 2 + index, visible, index === 0 ? "4" : "0");
  });

  const percent = Math.round(progress * 100);
  grid.text(WIDTH - 13, y + 2, `${String(percent).padStart(3)}%`, "2");
  grid.horizontal(4, WIDTH - 5, y + 6, "-", "5");
  grid.text(4, y + 7, "PROMPTPAY QR", "1");
  grid.text(WIDTH - 20, y + 7, "OBS BROWSER OVERLAY", "1");
}

/** Animate the conceptual donation path from a viewer to TipBeam and an OBS alert. */
export default function createTipBeamFlow() {
  const grid = new TipBeamGrid();
  const paths = STEPS.map(([from, to]) => createPath(from, to));

  function draw(time) {
    grid.clear();
    const localTime = time % TOTAL_DURATION;
    const isFinished = localTime >= STEPS.length * STEP_DURATION;
    const stepIndex = isFinished ? STEPS.length - 1 : Math.floor(localTime / STEP_DURATION);
    const stepTime = isFinished ? STEP_DURATION : localTime - stepIndex * STEP_DURATION;
    const progress = isFinished ? 1 : Math.min(1, stepTime / TRAVEL_DURATION);
    const [, to] = STEPS[stepIndex];

    grid.text(2, 0, "TIPBEAM / DONATION FLOW", "0");
    grid.text(55, 0, "PROMPTPAY -> OBS", "2");
    drawNodes(grid, isFinished ? -1 : to, stepIndex, isFinished);

    const path = paths[stepIndex];
    const packetIndex = Math.min(path.length - 1, Math.round(progress * (path.length - 1)));
    if (!isFinished) {
      for (let index = 0; index <= packetIndex; index += 1) {
        const [x, y] = path[index];
        grid.set(x, y, y === BUS_Y ? "=" : "|", "6");
      }
      const [packetX, packetY] = path[packetIndex];
      grid.set(packetX, packetY, "@", "4");
    } else {
      grid.text(79, 8, "*", "2");
    }

    drawPayload(grid, stepIndex, progress, isFinished);
    grid.text(2, HEIGHT - 1, isFinished ? "TIP RECEIVED / ALERT ON STREAM" : `STEP ${String(stepIndex + 1).padStart(2, "0")} / ${String(STEPS.length).padStart(2, "0")}`, isFinished ? "2" : "1");
    grid.text(WIDTH - 22, HEIGHT - 1, "THB 100 / DEMO FLOW", "1");
    return grid.frame();
  }

  draw.duration = TOTAL_DURATION;
  return draw;
}

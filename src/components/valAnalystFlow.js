const WIDTH = 76;
const HEIGHT = 26;
const NODE_WIDTH = 15;
const NODES = [
  ["Match data", "recent sample", 2],
  ["30 questions", "tactical Qs", 21],
  ["7 dimensions", "skill profile", 40],
  ["Evidence", "this browser", 59],
];
const STEPS = [
  [0, 1, "add recent match sample", ["sample limits stay visible", "missing data is not zero"]],
  [1, 2, "answer tactical questions", ["30 answers shape tendencies", "not raw stats alone"]],
  [2, 3, "review performance profile", ["mechanics / opening / survival", "team / clutch / consistency / adapt"]],
  [3, 2, "inspect supporting evidence", ["stats provide context", "snapshot saved locally"]],
];
const STEP_DURATION = 2.6;
const END_HOLD = 2.4;
const TOTAL_DURATION = STEPS.length * STEP_DURATION + END_HOLD;

class Grid {
  constructor() {
    this.characters = new Array(WIDTH * HEIGHT);
    this.colors = new Array(WIDTH * HEIGHT);
    this.clear();
  }
  clear() { this.characters.fill(" "); this.colors.fill("0"); }
  set(x, y, character, color = "0") {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return;
    const index = y * WIDTH + x;
    this.characters[index] = character; this.colors[index] = String(color);
  }
  text(x, y, value, color = "0") { [...String(value)].forEach((c, i) => this.set(x + i, y, c, color)); }
  h(x1, x2, y, char, color) { for (let x = x1; x <= x2; x += 1) this.set(x, y, char, color); }
  v(x, y1, y2, char, color) { for (let y = y1; y <= y2; y += 1) this.set(x, y, char, color); }
  box(x, y, w, h, color) {
    this.h(x + 1, x + w - 2, y, "-", color); this.h(x + 1, x + w - 2, y + h - 1, "-", color);
    this.v(x, y + 1, y + h - 2, "|", color); this.v(x + w - 1, y + 1, y + h - 2, "|", color);
    this.set(x, y, "+", color); this.set(x + w - 1, y, "+", color);
    this.set(x, y + h - 1, "+", color); this.set(x + w - 1, y + h - 1, "+", color);
  }
  frame() { return this.characters.map((character, i) => [character, this.colors[i]]); }
}

function pathBetween(from, to) {
  const x1 = NODES[from][2] + 7; const x2 = NODES[to][2] + 7; const path = [];
  for (let y = 7; y < 10; y += 1) path.push([x1, y]);
  for (let x = x1; x !== x2; x += Math.sign(x2 - x1)) path.push([x, 10]);
  path.push([x2, 10]);
  for (let y = 9; y >= 7; y -= 1) path.push([x2, y]);
  return path;
}

/** Animate match input through the browser based analysis and evidence review. */
export default function createValAnalystFlow() {
  const grid = new Grid();
  const paths = STEPS.map(([from, to]) => pathBetween(from, to));
  function draw(time) {
    grid.clear();
    const local = time % TOTAL_DURATION;
    const finished = local >= STEPS.length * STEP_DURATION;
    const step = finished ? STEPS.length - 1 : Math.floor(local / STEP_DURATION);
    const progress = finished ? 1 : Math.min(1, (local - step * STEP_DURATION) / (STEP_DURATION * 0.72));
    const [from, to, label, lines] = STEPS[step];
    grid.text(2, 0, "VAL ANALYST / EVIDENCE FLOW", "0");
    grid.text(56, 0, "BROWSER ONLY", "2");
    NODES.forEach(([name, detail], index) => {
      const active = !finished && (index === from || index === to);
      const color = active ? "2" : finished || index < to ? "4" : "5";
      grid.box(NODES[index][2], 2, NODE_WIDTH, 5, color);
      grid.text(NODES[index][2] + 1, 3, name, active ? "0" : "4");
      grid.text(NODES[index][2] + 1, 4, detail, "1");
      grid.text(NODES[index][2] + 1, 5, index === 3 ? "local save" : index === to ? "in progress" : "ready", color);
      grid.v(NODES[index][2] + 7, 7, 9, "|", "5");
    });
    grid.h(9, 66, 10, "-", "5");
    const path = paths[step];
    const packet = Math.min(path.length - 1, Math.round(progress * (path.length - 1)));
    if (!finished) {
      for (let i = 0; i <= packet; i += 1) grid.set(path[i][0], path[i][1], path[i][1] === 10 ? "=" : "|", "6");
      grid.set(path[packet][0], path[packet][1], "@", "4");
    }
    grid.box(2, 14, WIDTH - 4, 9, "5");
    grid.text(4, 14, ` ANALYSIS / ${label.toUpperCase()} `, "4");
    grid.text(4, 16, "EVIDENCE FIRST", "2");
    grid.text(24, 16, lines[0], "4"); grid.text(24, 17, lines[1], "0");
    grid.text(WIDTH - 13, 16, `${String(Math.round(progress * 100)).padStart(3)}%`, "2");
    grid.h(4, WIDTH - 5, 20, "-", "5");
    grid.text(4, 21, "TENDENCIES + MATCH CONTEXT", "1");
    grid.text(WIDTH - 20, 21, "NO SERVER API", "1");
    grid.text(2, HEIGHT - 1, finished ? "PROFILE READY / SAVED IN THIS BROWSER" : `STEP ${String(step + 1).padStart(2, "0")} / ${String(STEPS.length).padStart(2, "0")}`, finished ? "2" : "1");
    grid.text(WIDTH - 19, HEIGHT - 1, "VALORANT ANALYSIS", "1");
    return grid.frame();
  }
  draw.duration = TOTAL_DURATION;
  return draw;
}

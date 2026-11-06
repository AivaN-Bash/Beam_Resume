import { useEffect, useRef } from "react";

const WIDTH = 96;
const HEIGHT = 28;
const CELL_WIDTH = 8;
const CELL_HEIGHT = 12;
const FRAME_INTERVAL = 1000 / 12;

const NODES = [
  ["laptop", "stub client", 3, 11],
  ["resolver", "10.0.0.1", 23, 11],
  ["root", "a.root-servers", 50, 2],
  ["TLD .dev", "ns1.tld-dev", 74, 7],
  ["authoritative", "ns.example.dev", 74, 16],
];
const BOX_WIDTH = 18;
const BOX_HEIGHT = 4;
const HOPS = [
  [0, 1, "A? shop.example.dev", 0],
  [1, 2, "A? shop.example.dev", 0],
  [2, 1, "refer: .dev NS", 1],
  [1, 3, "A? shop.example.dev", 0],
  [3, 1, "refer: example.dev NS", 1],
  [1, 4, "A? shop.example.dev", 0],
  [4, 1, "A 203.0.113.42 ttl 300", 1],
  [1, 0, "A 203.0.113.42", 1],
];
const HOP_DURATION = 1.1;
const LOOP_DURATION = 0.6 + HOPS.length * HOP_DURATION + 3.2;
const RESPONSE_MS = [1, 18, 18, 22, 22, 31, 31, 1];

class DnsGrid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.characters = new Array(width * height);
    this.colors = new Array(width * height);
    this.clear();
  }

  clear() {
    this.characters.fill(" ");
    this.colors.fill("0");
  }

  set(x, y, character, color) {
    const column = Math.round(x);
    const row = Math.round(y);
    if (column < 0 || row < 0 || column >= this.width || row >= this.height) return;
    const index = column + row * this.width;
    this.characters[index] = [...character][0] || " ";
    this.colors[index] = String(color);
  }

  text(x, y, value, color) {
    [...String(value)].forEach((character, offset) => this.set(x + offset, y, character, color));
  }

  hline(x0, x1, y, character, color) {
    for (let x = Math.ceil(x0); x <= Math.floor(x1); x += 1) this.set(x, y, character, color);
  }

  vline(x, y0, y1, character, color) {
    for (let y = Math.ceil(y0); y <= Math.floor(y1); y += 1) this.set(x, y, character, color);
  }

  line(x0, y0, x1, y1, character, color) {
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

  box(x, y, width, height, color) {
    this.hline(x + 1, x + width - 2, y, "─", color);
    this.hline(x + 1, x + width - 2, y + height - 1, "─", color);
    this.vline(x, y + 1, y + height - 2, "│", color);
    this.vline(x + width - 1, y + 1, y + height - 2, "│", color);
    this.set(x, y, "╭", color);
    this.set(x + width - 1, y, "╮", color);
    this.set(x, y + height - 1, "╰", color);
    this.set(x + width - 1, y + height - 1, "╯", color);
  }

  frame() {
    return this.characters.map((character, index) => [character, this.colors[index]]);
  }
}

function createDnsFrame() {
  const grid = new DnsGrid(WIDTH, HEIGHT);
  const center = (index) => [NODES[index][2] + BOX_WIDTH / 2, NODES[index][3] + BOX_HEIGHT / 2];
  const edge = (from, to) => {
    const [startX, startY] = center(from);
    const [endX, endY] = center(to);
    const leftToRight = endX > startX;
    return [
      leftToRight ? NODES[from][2] + BOX_WIDTH : NODES[from][2] - 1,
      startY,
      leftToRight ? NODES[to][2] - 1 : NODES[to][2] + BOX_WIDTH,
      endY,
    ];
  };

  function draw(time) {
    grid.clear();
    const localTime = time % LOOP_DURATION;
    const hopIndex = Math.floor((localTime - 0.6) / HOP_DURATION);
    const hopProgress = ((localTime - 0.6) % HOP_DURATION) / HOP_DURATION;
    const currentHop = hopIndex >= 0 && hopIndex < HOPS.length ? HOPS[hopIndex] : null;

    for (const [from, to] of [[0, 1], [1, 2], [1, 3], [1, 4]]) {
      const [x0, y0, x1, y1] = edge(from, to);
      const active = currentHop && ((currentHop[0] === from && currentHop[1] === to) || (currentHop[0] === to && currentHop[1] === from));
      grid.line(x0, y0, x1, y1, active ? "•" : "·", active ? "3" : "7");
    }

    NODES.forEach(([name, subtitle, x, y], index) => {
      const isActive = currentHop && (currentHop[0] === index || currentHop[1] === index);
      const isResolved = hopIndex >= HOPS.length && (index === 0 || index === 1);
      const borderColor = isActive ? (currentHop[3] ? "2" : "9") : isResolved ? "2" : "7";
      grid.box(x, y, BOX_WIDTH, BOX_HEIGHT, borderColor);
      grid.text(x + 2, y + 1, name, isActive ? "0" : "3");
      grid.text(x + 2, y + 2, subtitle, "1");
    });

    if (currentHop) {
      const [x0, y0, x1, y1] = edge(currentHop[0], currentHop[1]);
      const progress = Math.min(1, hopProgress * 1.25);
      const packetX = x0 + (x1 - x0) * progress;
      const packetY = y0 + (y1 - y0) * progress;
      for (let step = 1; step <= 4; step += 1) {
        const trail = Math.max(0, progress - step * 0.05);
        grid.set(Math.round(x0 + (x1 - x0) * trail), Math.round(y0 + (y1 - y0) * trail), step < 2 ? "•" : "·", currentHop[3] ? "2" : "9");
      }
      grid.set(Math.round(packetX), Math.round(packetY), "●", currentHop[3] ? "2" : "9");
      const label = NODES[currentHop[0]][0] + " → " + NODES[currentHop[1]][0] + ": " + currentHop[2];
      grid.text(2, 18, "▶ " + label, currentHop[3] ? "2" : "9");
    }

    grid.text(2, 1, "query", "1");
    grid.text(8, 1, "shop.example.dev", "0");
    grid.text(25, 1, "type A · class IN", "1");
    grid.text(2, 2, "recursion desired · edns 1232", "7");
    if (hopIndex >= 6 || hopIndex < 0) grid.text(24, 16, hopIndex < 0 ? "cache: empty" : "cache: stored 300s", hopIndex < 0 ? "7" : "a");

    const logY = 21;
    grid.hline(0, WIDTH - 1, logY - 1, "─", "8");
    grid.text(1, logY, "$ dig shop.example.dev +trace", "0");
    const shown = HOPS.slice(0, Math.max(0, Math.min(HOPS.length, hopIndex + (hopProgress > 0.8 ? 1 : 0))));
    shown.slice(-4).forEach((hop, index) => {
      const y = logY + 1 + index;
      grid.text(1, y, (NODES[hop[0]][0] + " → " + NODES[hop[1]][0]).padEnd(30), "1");
      grid.text(32, y, hop[2], hop[3] ? "2" : "9");
      grid.text(60, y, RESPONSE_MS[HOPS.indexOf(hop)] + " ms", "7");
    });
    if (hopIndex >= HOPS.length) {
      grid.text(1, HEIGHT - 1, ";; ANSWER  shop.example.dev.  300  IN  A  203.0.113.42", "2");
      grid.text(WIDTH - 26, HEIGHT - 1, "Query time: 143 msec", "1");
    }
    return grid.frame();
  }

  draw.staticTime = LOOP_DURATION - 0.2;
  return draw;
}

/** A compact query-flow diagram that stops when hidden or reduced motion is set. */
export default function DnsResolverScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    canvas.width = WIDTH * CELL_WIDTH;
    canvas.height = HEIGHT * CELL_HEIGHT;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const styles = getComputedStyle(canvas);
    const slate = styles.getPropertyValue("--slate").trim() || "#d9e2e7";
    const sand = styles.getPropertyValue("--sand").trim() || "#dbd7c8";
    const caramel = styles.getPropertyValue("--caramel").trim() || "#b6815b";
    const palette = [slate, "#aaa79e", caramel, sand, slate, caramel, sand, "#6e6864", "#39363a", "#d1a17e", "#8a6c58"];
    const drawFrame = createDnsFrame();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    context.font = '12px "DM Mono", monospace';
    context.textAlign = "center";
    context.textBaseline = "middle";

    let rafId = 0;
    let lastDraw = 0;
    let startTime = null;
    let elapsed = 0;
    let isVisible = typeof IntersectionObserver === "undefined";
    let isMounted = true;

    function draw(time) {
      const frame = drawFrame(time);
      context.clearRect(0, 0, canvas.width, canvas.height);
      frame.forEach(([character, colorKey], index) => {
        if (character === " ") return;
        const x = index % WIDTH;
        const y = Math.floor(index / WIDTH);
        context.fillStyle = palette[parseInt(colorKey, 16)] || slate;
        context.fillText(character, x * CELL_WIDTH + CELL_WIDTH / 2, y * CELL_HEIGHT + CELL_HEIGHT / 2);
      });
    }

    function stop() {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      if (startTime !== null) {
        elapsed += (performance.now() - startTime) / 1000;
        startTime = null;
      }
    }

    function animate(timestamp) {
      if (!isMounted || !isVisible || reducedMotion.matches) {
        rafId = 0;
        return;
      }
      if (startTime === null) startTime = timestamp;
      if (timestamp - lastDraw >= FRAME_INTERVAL) {
        lastDraw = timestamp;
        draw(elapsed + (timestamp - startTime) / 1000);
      }
      rafId = window.requestAnimationFrame(animate);
    }

    function start() {
      if (isMounted && isVisible && !reducedMotion.matches && !rafId) rafId = window.requestAnimationFrame(animate);
    }

    draw(reducedMotion.matches ? drawFrame.staticTime : 0);
    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) start();
          else stop();
        }, { threshold: 0.08 });
    observer?.observe(canvas);
    if (isVisible) start();

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stop();
        elapsed = 0;
        draw(drawFrame.staticTime);
      } else {
        start();
      }
    }
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      isMounted = false;
      stop();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="dns-resolver-canvas" aria-hidden="true" />;
}

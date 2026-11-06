import { useEffect, useRef } from "react";
import { setupCanvasSurface } from "./canvasSurface";
import { startCanvasLoop } from "./canvasLoop";

const WIDTH = 72;
const HEIGHT = 24;
const CELL_WIDTH = 9;
const CELL_HEIGHT = 13;
const FRAME_INTERVAL = 1000 / 12;
const MESSAGES = [
  ["visitor", "What kind of roles are you open to?"],
  ["phawat", "Customer service, hospitality, support, or junior tech."],
  ["visitor", "Could you tell me about your experience?"],
  ["phawat", "Of course. I would be happy to talk."],
];

function wrap(text, width) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

class ChatGrid {
  constructor() {
    this.characters = new Array(WIDTH * HEIGHT);
    this.colors = new Array(WIDTH * HEIGHT);
    this.clear();
  }

  clear() {
    this.characters.fill(" ");
    this.colors.fill(0);
  }

  set(x, y, character, color = 0) {
    const column = Math.round(x);
    const row = Math.round(y);
    if (column < 0 || row < 0 || column >= WIDTH || row >= HEIGHT) return;
    const index = row * WIDTH + column;
    this.characters[index] = character;
    this.colors[index] = color;
  }

  text(x, y, value, color = 0) {
    [...String(value)].forEach((character, index) => this.set(x + index, y, character, color));
  }

  hline(x0, x1, y, character, color = 0) {
    for (let x = x0; x <= x1; x += 1) this.set(x, y, character, color);
  }

  box(x, y, width, height, color = 0) {
    this.hline(x + 1, x + width - 2, y, "─", color);
    this.hline(x + 1, x + width - 2, y + height - 1, "─", color);
    for (let row = y + 1; row < y + height - 1; row += 1) {
      this.set(x, row, "│", color);
      this.set(x + width - 1, row, "│", color);
    }
    this.set(x, y, "╭", color);
    this.set(x + width - 1, y, "╮", color);
    this.set(x, y + height - 1, "╰", color);
    this.set(x + width - 1, y + height - 1, "╯", color);
  }

  frame() {
    return this.characters.map((character, index) => [character, this.colors[index]]);
  }
}

function createChatFrame() {
  const grid = new ChatGrid();
  let time = 0.55;
  const events = MESSAGES.map(([speaker, message]) => {
    const typeAt = time;
    const shownAt = typeAt + Math.min(1.25, 0.3 + message.length * 0.014);
    time = shownAt + 0.55;
    return { speaker, message, typeAt, shownAt };
  });
  const period = time + 2.1;

  function draw(seconds) {
    grid.clear();
    const localTime = seconds % period;
    grid.text(2, 1, "● OPEN TO WORK", 2);
    grid.text(49, 1, "A QUICK INTRO", 1);
    grid.hline(1, WIDTH - 2, 2, "─", 4);

    const visible = [];
    let typing = null;
    for (const event of events) {
      if (event.shownAt <= localTime) visible.push(event);
      else if (event.typeAt <= localTime) typing = event;
      else break;
    }

    let bottom = HEIGHT - 6;
    const bubbles = typing ? [...visible, { speaker: typing.speaker, typing: true }] : visible;
    for (let index = bubbles.length - 1; index >= 0; index -= 1) {
      const bubble = bubbles[index];
      const lines = bubble.typing ? [""] : wrap(bubble.message, 49);
      const width = bubble.typing ? 13 : Math.max(...lines.map((line) => line.length)) + 4;
      const height = lines.length + 2;
      const top = bottom - height + 1;
      if (top < 4) break;
      const isPhawat = bubble.speaker === "phawat";
      const x = isPhawat ? WIDTH - width - 2 : 2;
      const border = isPhawat ? 2 : 4;
      grid.box(x, top, width, height, border);
      if (bubble.typing) {
        for (let dot = 0; dot < 3; dot += 1) {
          const phase = Math.sin(localTime * 7 - dot * 0.8);
          grid.set(x + 4 + dot * 2, top + 1, phase > 0.25 ? "●" : "·", phase > 0.25 ? 3 : 1);
        }
      } else {
        lines.forEach((line, row) => grid.text(x + 2, top + 1 + row, line, isPhawat ? 3 : 0));
      }
      bottom = top - 1;
    }

    grid.box(1, HEIGHT - 4, WIDTH - 2, 3, 4);
    grid.text(3, HEIGHT - 3, "Send me a message...", 1);
    grid.text(WIDTH - 12, HEIGHT - 3, "EMAIL ↗", 2);
    return grid.frame();
  }

  draw.staticTime = period - 0.2;
  return draw;
}

/** Draws a short portfolio introduction and pauses when hidden or motion-reduced. */
export default function ContactChatScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const clearCanvas = setupCanvasSurface(canvas, context, WIDTH * CELL_WIDTH, HEIGHT * CELL_HEIGHT);
    const styles = getComputedStyle(canvas);
    const slate = styles.getPropertyValue("--slate").trim() || "#d9e2e7";
    const sand = styles.getPropertyValue("--sand").trim() || "#dbd7c8";
    const caramel = styles.getPropertyValue("--caramel").trim() || "#b6815b";
    const palette = [slate, "#999a98", caramel, sand, "#39363a"];
    context.font = `${CELL_HEIGHT}px "DM Mono", monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    return startCanvasLoop(canvas, () => {
      const drawFrame = createChatFrame();
      function draw(seconds) {
        const frame = drawFrame(seconds);
        clearCanvas();
        frame.forEach(([character, color], index) => {
          if (character === " ") return;
          const x = index % WIDTH;
          const y = Math.floor(index / WIDTH);
          context.fillStyle = palette[color] || slate;
          context.fillText(character, x * CELL_WIDTH + CELL_WIDTH / 2, y * CELL_HEIGHT + CELL_HEIGHT / 2);
        });
      }
      return { draw, staticTime: drawFrame.staticTime, duration: drawFrame.duration };
    }, { frameInterval: FRAME_INTERVAL });
  }, []);

  return <canvas className="contact-chat-canvas" ref={canvasRef} aria-hidden="true" />;
}

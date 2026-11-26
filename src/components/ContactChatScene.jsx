import AsciiGrid from "./AsciiGrid";
import AsciiScene from "./AsciiScene";

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

function createChatFrame() {
  const grid = new AsciiGrid(WIDTH, HEIGHT, 0);
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
      grid.box(x, top, width, height, border, "rounded");
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

    grid.box(1, HEIGHT - 4, WIDTH - 2, 3, 4, "rounded");
    grid.text(3, HEIGHT - 3, "Send me a message...", 1);
    grid.text(WIDTH - 12, HEIGHT - 3, "EMAIL ↗", 2);
    return grid.frame();
  }

  draw.staticTime = period - 0.2;
  return draw;
}

const createColorFor = ({ slate, caramel, sand }) => {
  const palette = [slate, "#999a98", caramel, sand, "#39363a"];
  return (color) => palette[Number(color)] || slate;
};

/** Draws a short portfolio introduction and pauses when hidden or motion-reduced. */
export default function ContactChatScene() {
  return (
    <AsciiScene
      className="contact-chat-canvas"
      columns={WIDTH}
      rows={HEIGHT}
      cellWidth={CELL_WIDTH}
      cellHeight={CELL_HEIGHT}
      frameInterval={FRAME_INTERVAL}
      font={`${CELL_HEIGHT}px "DM Mono", monospace`}
      createScene={createChatFrame}
      createColorFor={createColorFor}
    />
  );
}

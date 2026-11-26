import AsciiGrid from "./AsciiGrid";

const WIDTH = 84;
const HEIGHT = 17;

// Five-row block letters keep the message crisp at the portfolio's small canvas size.
const FONT = {
  A: " ### |#   #|#####|#   #|#   #", B: "#### |#   #|#### |#   #|#### ", C: " ####|#    |#    |#    | ####",
  D: "#### |#   #|#   #|#   #|#### ", E: "#####|#    |#### |#    |#####", F: "#####|#    |#### |#    |#    ",
  G: " ####|#    |#  ##|#   #| ####", H: "#   #|#   #|#####|#   #|#   #", I: "#####|  #  |  #  |  #  |#####",
  J: "  ###|    #|    #|#   #| ### ", K: "#   #|#  # |###  |#  # |#   #", L: "#    |#    |#    |#    |#####",
  M: "#   #|## ##|# # #|#   #|#   #", N: "#   #|##  #|# # #|#  ##|#   #", O: " ### |#   #|#   #|#   #| ### ",
  P: "#### |#   #|#### |#    |#    ", R: "#### |#   #|#### |#  # |#   #", S: " ####|#    | ### |    #|#### ",
  T: "#####|  #  |  #  |  #  |  #  ", U: "#   #|#   #|#   #|#   #| ### ", V: "#   #|#   #|#   #| # # |  #  ",
  W: "#   #|#   #|# # #|## ##|#   #", Y: "#   #| # # |  #  |  #  |  #  ",
  "'": "  #  |  #  |     |     |     ", "+": "     |  #  |#####|  #  |     ",
  "·": "     |     |  #  |     |     ",
  ".": "     |     |     |     |  #  ", " ": "     |     |     |     |     ",
};
const GLYPHS = Object.fromEntries(Object.entries(FONT).map(([character, rows]) => [character, rows.split("|")]));
const MESSAGE = "PHAWAT TANAJIRANON  ·  BUILT WITH REACT + VITE  ·  ";
const MESSAGE_GLYPHS = [...MESSAGE].map((character) => GLYPHS[character] || GLYPHS[" "]);
const TOPLINE = "PHAWAT TANAJIRANON / PORTFOLIO";
const FOOTLINE = "REACT + VITE / PERSONAL PORTFOLIO";

function createBulbPath() {
  const bulbs = [];
  for (let x = 1; x < WIDTH - 1; x += 2) bulbs.push([x, 0]);
  for (let y = 1; y < HEIGHT - 1; y += 1) bulbs.push([WIDTH - 1, y]);
  for (let x = WIDTH - 2; x >= 1; x -= 2) bulbs.push([x, HEIGHT - 1]);
  for (let y = HEIGHT - 2; y > 0; y -= 1) bulbs.push([0, y]);
  return bulbs;
}

function drawMessage(grid, offset) {
  for (let x = 4; x < WIDTH - 4; x += 1) {
    const position = x - 4 + offset;
    const glyphIndex = Math.floor(position / 6) % MESSAGE_GLYPHS.length;
    const glyphColumn = position % 6;
    if (glyphColumn >= 5) continue;
    MESSAGE_GLYPHS[glyphIndex].forEach((line, row) => {
      if (line[glyphColumn] === "#") grid.set(x, 5 + row, "#", (glyphIndex + Math.floor(offset / 4)) % 9 === 0 ? "2" : "4");
    });
  }
}

/** Animate a restrained copper marquee for the portfolio project card. */
export default function createPortfolioMarquee() {
  const grid = new AsciiGrid(WIDTH, HEIGHT, "0");
  const bulbs = createBulbPath();

  return (time) => {
    grid.clear();
    const bulbStep = Math.floor(time * 6);
    bulbs.forEach(([x, y], index) => {
      const lit = (index + bulbStep) % 4 === 0;
      grid.set(x, y, lit ? "*" : ".", lit ? "2" : "3");
    });

    grid.box(2, 1, WIDTH - 4, HEIGHT - 2, "3");
    grid.text(Math.floor((WIDTH - TOPLINE.length) / 2), 3, TOPLINE, "0");
    grid.text(Math.floor((WIDTH - FOOTLINE.length) / 2), HEIGHT - 3, FOOTLINE, "1");
    grid.hline(4, WIDTH - 5, 4, "-", "3");
    grid.hline(4, WIDTH - 5, HEIGHT - 4, "-", "3");

    drawMessage(grid, Math.floor(time * 8) % (MESSAGE_GLYPHS.length * 6));
    return grid.frame();
  };
}

import AsciiGrid from "./AsciiGrid";

const WIDTH = 76;
const HEIGHT = 30;
const PERIOD = 10;
const ENTRIES = [
  "SERIES",
  "FILMS",
  "ANIME",
  "GAMES",
  "MUSIC",
];

/** Animate the media archive and its personal rating/review flow. */
export default function createHallOfFame() {
  const grid = new AsciiGrid(WIDTH, HEIGHT, "0");

  function draw(time) {
    const lt = time % PERIOD;
    const active = Math.floor((lt / PERIOD) * ENTRIES.length) % ENTRIES.length;
    const rating = lt < 4.8 ? 4 : 5;
    const posted = lt >= 7.2;

    grid.clear();
    grid.box(0, 0, WIDTH, HEIGHT, "2", "rounded");
    grid.text(3, 1, "HALL OF FAME / PERSONAL ARCHIVE", "2");
    grid.text(58, 1, "MEDIA + MEMORY", "1");

    grid.text(4, 4, "MY FAVORITES", "4");
    ENTRIES.forEach((entry, index) => {
      const y = 6 + index * 2;
      grid.text(4, y, active === index ? ">" : ".", active === index ? "2" : "1");
      grid.text(7, y, entry, active === index ? "0" : "1");
    });

    grid.box(24, 4, 48, 23, "7", "rounded");
    grid.text(27, 6, "WHY I LOVE IT", "2");
    grid.text(27, 8, "DARK", "0");
    grid.text(27, 9, "SERIES / SCI-FI / 2017", "1");

    for (let index = 0; index < 5; index += 1) {
      const x = 27 + index * 7;
      grid.text(x, 12, "  ▲  ", index < rating ? "4" : "1");
      grid.text(x, 13, "▀████▀", index < rating ? "4" : "1");
    }
    grid.text(64, 12, rating === 5 ? "EXCELLENT" : "GREAT", "4");

    grid.text(27, 16, "“Time, family and every choice", "0");
    grid.text(27, 17, " that changes what comes after.”", "0");
    grid.text(27, 19, "A story I return to because", "1");
    grid.text(27, 20, "it makes the impossible feel human.", "1");

    grid.box(27, 23, 21, 3, "2", "rounded");
    grid.text(31, 24, posted ? "SAVED  ✓" : "SAVE ENTRY", posted ? "4" : "2");
    grid.text(51, 24, posted ? "ARCHIVED" : "VIEW ENTRY", "1");

    grid.hline(1, 74, 28, "-", "7");
    grid.text(3, 29, "PRIVATE ARCHIVE / PUBLIC STORIES", "2");
    grid.text(56, 29, "SERIES / FILM / GAME", "1");
    return grid.frame();
  }

  draw.staticTime = PERIOD - 0.01;
  draw.duration = PERIOD;
  return draw;
}

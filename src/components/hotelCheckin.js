import AsciiGrid from "./AsciiGrid";

const WIDTH = 76;
const HEIGHT = 30;
const STEP_DURATION = 1.1;
const JOURNEY = [
  "FIND BOOKING",
  "YOUR STAY",
  "ID CHECK",
  "DEPOSIT",
  "YOUR ROOM",
  "COMPLETE",
];

/** Animate the hotel kiosk's check-in journey as a compact ASCII interface. */
export default function createHotelCheckin() {
  const grid = new AsciiGrid(WIDTH, HEIGHT, "0");
  const duration = JOURNEY.length * STEP_DURATION;

  function draw(time) {
    const selected = Math.floor(time / STEP_DURATION) % JOURNEY.length;
    grid.clear();

    grid.box(0, 0, WIDTH, HEIGHT, "2");
    grid.text(3, 1, "THE ASTER HOTEL / SELF CHECK-IN", "2");
    grid.text(53, 1, "BANGKOK / THAILAND", "1");
    grid.hline(1, WIDTH - 2, 3, "-", "7");

    grid.text(4, 5, "A QUIETER KIND OF LUXURY", "2");
    grid.text(4, 8, "Your stay,", "0");
    grid.text(4, 10, "beautifully begun.", "0");
    grid.text(4, 13, "A warm welcome, at your own pace.", "1");

    grid.box(4, 16, 19, 3, "2");
    grid.text(7, 17, "CHECK IN  >", "2");
    grid.box(25, 16, 18, 3, "5");
    grid.text(27, 17, "CHECK OUT  >", "1");

    grid.text(4, 22, "ENGLISH + THAI", "4");
    grid.text(4, 24, "ID, DEPOSIT AND QR KEY ARE DEMO ONLY", "1");

    grid.box(45, 5, 27, 21, "7");
    grid.text(47, 7, "GUEST JOURNEY", "2");
    grid.text(64, 7, "01 / 06", "1");
    grid.hline(46, 70, 8, "-", "7");
    JOURNEY.forEach((step, index) => {
      const y = 10 + index * 2;
      const active = selected === index;
      const complete = selected > index;
      grid.text(47, y, active ? ">" : complete ? "+" : ".", active ? "2" : complete ? "4" : "1");
      grid.text(50, y, step, active ? "0" : complete ? "4" : "1");
    });

    grid.hline(1, WIDTH - 2, 27, "-", "7");
    grid.text(3, 28, "TOUCH-FRIENDLY SELF SERVICE", "2");
    grid.text(53, 28, "CHECK-IN / CHECK-OUT", "1");
    return grid.frame();
  }

  draw.staticTime = duration - 0.01;
  draw.duration = duration;
  return draw;
}

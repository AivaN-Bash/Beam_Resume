import AsciiScene from "./AsciiScene";
import createHarbourSkyline, { HARBOUR_PALETTE } from "./harbourNeonSkyline";

const DESKTOP_SHADES = ["·", "·", "·", "∙", "•", "▪", "■", "█"];
const createColorFor = () => (key) => HARBOUR_PALETTE[key] || "#d9e2e7";
const createCharacterFor = () => {
  const desktopLayout = window.matchMedia("(min-width: 801px)");
  return (character) => (desktopLayout.matches
    ? DESKTOP_SHADES["▁▂▃▄▅▆▇█".indexOf(character)] || "·"
    : character);
};

/** Paints the animated harbour scene as a quiet backdrop for the portrait. */
export default function HarbourSkylineScene() {
  return (
    <AsciiScene
      className="hero-skyline-canvas"
      columns={192}
      rows={108}
      cellWidth={8}
      cellHeight={12}
      frameInterval={1000 / 12}
      font='12px "DM Mono", monospace'
      threshold={0.05}
      createScene={createHarbourSkyline}
      createColorFor={createColorFor}
      createCharacterFor={createCharacterFor}
      data-scroll-parallax="34"
    />
  );
}

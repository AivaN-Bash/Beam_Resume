import AsciiScene from "./AsciiScene";
import createDesertNeedle, { DESERT_PALETTE } from "./desertNeedleSkyline";

const SHADES = ["·", "·", "·", "•", "•", "●", "●", "█"];
const SHADE_LEVELS = "▁▂▃▄▅▆▇█";
const createColorFor = () => (key) => DESERT_PALETTE[key] || "#d9e2e7";
const createCharacterFor = () => (character) => SHADES[SHADE_LEVELS.indexOf(character)] || "·";

/** Renders the animated desert skyline as a low-contrast story backdrop. */
export default function DesertNeedleScene() {
  return (
    <AsciiScene
      className="desert-needle-canvas"
      columns={192}
      rows={108}
      cellWidth={8}
      cellHeight={12}
      frameInterval={1000 / 10}
      font='12px "DM Mono", monospace'
      threshold={0.05}
      createScene={createDesertNeedle}
      createColorFor={createColorFor}
      createCharacterFor={createCharacterFor}
    />
  );
}

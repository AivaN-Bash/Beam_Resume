import AsciiScene from "./AsciiScene";
import createNeonCityRain, { NEON_CITY_PALETTE } from "./neonCityRain";

const createColorFor = () => (colorIndex) => NEON_CITY_PALETTE[colorIndex] || "#d9e2e7";

/** Draws the palette-adapted rain scene and pauses whenever it leaves view. */
export default function NeonCityScene() {
  return (
    <AsciiScene
      className="neon-city-canvas"
      columns={100}
      rows={36}
      cellWidth={10}
      cellHeight={14}
      createScene={createNeonCityRain}
      createColorFor={createColorFor}
    />
  );
}

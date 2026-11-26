import AsciiScene from "./AsciiScene";
import createGoldenGateFog, { GOLDEN_GATE_PALETTE } from "./goldenGateFog";

const createColorFor = () => (colorIndex) => GOLDEN_GATE_PALETTE[colorIndex] || "#d9e2e7";

/** Renders the animated bridge and fog scene in the existing timeline column. */
export default function GoldenGateScene() {
  return (
    <AsciiScene
      className="golden-gate-canvas"
      columns={100}
      rows={36}
      cellWidth={10}
      cellHeight={14}
      createScene={createGoldenGateFog}
      createColorFor={createColorFor}
    />
  );
}

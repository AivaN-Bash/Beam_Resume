import AsciiScene from "./AsciiScene";
import createTrainFrame, { TRAIN_PALETTE } from "./viaductSteamTrain";

const KEY_OFFSET = 0xe000;
const createColorFor = () => (key) => TRAIN_PALETTE[key.charCodeAt(0) - KEY_OFFSET] || "#d9e2e7";

/** Displays the ASCII landscape and pauses its motion when it is off screen. */
export default function ViaductTrainScene() {
  return (
    <AsciiScene
      className="viaduct-train-canvas"
      columns={192}
      rows={108}
      cellWidth={8}
      cellHeight={8}
      frameInterval={100}
      font='10px "DM Mono", monospace'
      textAlign="left"
      textBaseline="bottom"
      createScene={createTrainFrame}
      createColorFor={createColorFor}
    />
  );
}

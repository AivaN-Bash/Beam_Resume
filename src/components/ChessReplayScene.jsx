import AsciiScene from "./AsciiScene";
import createChessReplay from "./chessReplay";

const createColorFor = ({ paper, slate, caramel, sand }) => {
  const palette = [
    slate,
    `color-mix(in srgb, ${sand} 64%, ${paper})`,
    caramel,
    paper,
    sand,
    caramel,
    `color-mix(in srgb, ${caramel} 72%, ${sand})`,
    `color-mix(in srgb, ${slate} 16%, ${paper})`,
    `color-mix(in srgb, ${sand} 14%, ${paper})`,
  ];
  return (key) => palette[Number(key)] || slate;
};

/** Replay a compact ASCII chess game using the portfolio's restrained palette. */
export default function ChessReplayScene() {
  return (
    <AsciiScene
      className="chess-replay-canvas"
      columns={86}
      rows={28}
      cellWidth={10}
      cellHeight={14}
      createScene={createChessReplay}
      createColorFor={createColorFor}
    />
  );
}

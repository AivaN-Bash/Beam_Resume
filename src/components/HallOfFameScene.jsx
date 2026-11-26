import AsciiScene from "./AsciiScene";
import createHallOfFame from "./hallOfFame";

const createColorFor = ({ paper, slate, caramel, sand }) => {
  const palette = [
    slate,
    `color-mix(in srgb, ${sand} 64%, ${paper})`,
    caramel,
    `color-mix(in srgb, ${sand} 30%, ${paper})`,
    `color-mix(in srgb, ${caramel} 72%, ${sand})`,
    `color-mix(in srgb, ${sand} 22%, ${paper})`,
    `color-mix(in srgb, ${slate} 18%, ${paper})`,
  ];
  return (key) => palette[Number(key)] || slate;
};

/** Presents the Hall of Fame media archive in the Projects page style. */
export default function HallOfFameScene() {
  return (
    <AsciiScene
      className="hall-of-fame-canvas"
      columns={76}
      rows={30}
      cellWidth={10}
      cellHeight={14}
      createScene={createHallOfFame}
      createColorFor={createColorFor}
    />
  );
}

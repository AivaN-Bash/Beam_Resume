import AsciiScene from "./AsciiScene";
import createValAnalystFlow from "./valAnalystFlow";

const createColorFor = ({ paper, slate, caramel, sand }) => {
  const palette = [
    slate,
    `color-mix(in srgb, ${sand} 64%, ${paper})`,
    caramel,
    paper,
    sand,
    `color-mix(in srgb, ${slate} 24%, ${paper})`,
    `color-mix(in srgb, ${caramel} 72%, ${sand})`,
  ];
  return (key) => palette[Number(key)] || slate;
};

/** Show how match details become an evidence based player analysis. */
export default function ValAnalystScene() {
  return (
    <AsciiScene
      className="val-analyst-canvas"
      columns={76}
      rows={26}
      cellWidth={10}
      cellHeight={14}
      createScene={createValAnalystFlow}
      createColorFor={createColorFor}
    />
  );
}

import AsciiScene from "./AsciiScene";
import createCalculatorApp from "./calculatorApp";

const createColorFor = ({ paper, slate, caramel, sand }) => {
  const palette = [
    slate,
    `color-mix(in srgb, ${sand} 64%, ${paper})`,
    caramel,
    sand,
    `color-mix(in srgb, ${caramel} 72%, ${sand})`,
    `color-mix(in srgb, ${sand} 22%, ${paper})`,
    paper,
    `color-mix(in srgb, ${sand} 14%, ${paper})`,
  ];
  return (key) => palette[Number(key)] || slate;
};

/** Show a compact Watt Wise bill estimate as an animated decorative keypad. */
export default function CalculatorAppScene() {
  return (
    <AsciiScene
      className="calculator-app-canvas"
      columns={48}
      rows={31}
      cellWidth={12}
      cellHeight={16}
      createScene={createCalculatorApp}
      createColorFor={createColorFor}
    />
  );
}

import AsciiScene from "./AsciiScene";
import createHotelCheckin from "./hotelCheckin";

const createColorFor = ({ paper, slate, caramel, sand }) => {
  const palette = [
    slate,
    `color-mix(in srgb, ${sand} 64%, ${paper})`,
    caramel,
    `color-mix(in srgb, ${sand} 30%, ${paper})`,
    `color-mix(in srgb, ${caramel} 72%, ${sand})`,
    `color-mix(in srgb, ${sand} 22%, ${paper})`,
    `color-mix(in srgb, ${slate} 18%, ${paper})`,
    `color-mix(in srgb, ${sand} 14%, ${paper})`,
  ];
  return (key) => palette[Number(key)] || slate;
};

/** Animates the hotel check-in kiosk preview for the Projects page. */
export default function HotelCheckinScene() {
  return (
    <AsciiScene
      className="hotel-checkin-canvas"
      columns={76}
      rows={30}
      cellWidth={10}
      cellHeight={14}
      createScene={createHotelCheckin}
      createColorFor={createColorFor}
    />
  );
}

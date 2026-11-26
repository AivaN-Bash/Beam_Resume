import AsciiScene from "./AsciiScene";
import createPortfolioMarquee from "./portfolioMarquee";

const createColorFor = ({ paper, slate, caramel, sand }) => {
  const palette = [
    slate,
    `color-mix(in srgb, ${sand} 64%, ${paper})`,
    caramel,
    `color-mix(in srgb, ${sand} 20%, ${paper})`,
    sand,
  ];
  return (key) => palette[Number(key)] || slate;
};

/** Render the portfolio's project marquee with low-cost, accessible motion. */
export default function PortfolioMarqueeScene() {
  return (
    <AsciiScene
      className="portfolio-marquee-canvas"
      columns={84}
      rows={17}
      cellWidth={10}
      cellHeight={14}
      createScene={createPortfolioMarquee}
      createColorFor={createColorFor}
    />
  );
}

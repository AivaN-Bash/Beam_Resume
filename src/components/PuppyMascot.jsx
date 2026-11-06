import { useEffect, useRef } from "react";
import { setupCanvasSurface } from "./canvasSurface";
import { subscribeToCanvasPause } from "./canvasPause";
import createDogMascot from "./dogMascot";

const WIDTH = 40;
const HEIGHT = 24;
const FRAME_INTERVAL = 1000 / 12;

/** A transparent pixel-ASCII pup kept small beside the brand mark. */
export default function PuppyMascot() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return undefined;

    setupCanvasSurface(canvas, context, WIDTH, HEIGHT);
    const styles = getComputedStyle(canvas);
    const paper = styles.getPropertyValue("--paper").trim() || "#01040e";
    const caramel = styles.getPropertyValue("--caramel").trim() || "#b6815b";
    const sand = styles.getPropertyValue("--sand").trim() || "#dbd7c8";
    const palette = [
      `color-mix(in srgb, ${caramel} 42%, ${paper})`,
      `color-mix(in srgb, ${caramel} 64%, ${paper})`,
      caramel,
      `color-mix(in srgb, ${caramel} 48%, ${sand})`,
      sand,
      styles.getPropertyValue("--slate").trim() || "#d9e2e7",
      paper,
    ];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderFrame = createDogMascot();
    const previousColors = new Int8Array(WIDTH * HEIGHT).fill(-1);
    let currentFillStyle = "";
    let rafId = 0;
    let lastDraw = 0;
    let startTime = null;
    let elapsed = 0;
    let isVisible = typeof IntersectionObserver === "undefined";
    let isMounted = true;
    let pagePaused = false;

    function draw(time) {
      const colors = renderFrame(time);
      for (let index = 0; index < colors.length; index += 1) {
        const color = colors[index];
        if (color === previousColors[index]) continue;
        const x = index % WIDTH;
        const y = Math.floor(index / WIDTH);
        context.clearRect(x, y, 1, 1);
        if (color >= 0) {
          const fillStyle = palette[color] || palette[2];
          if (fillStyle !== currentFillStyle) {
            context.fillStyle = fillStyle;
            currentFillStyle = fillStyle;
          }
          context.fillRect(x, y, 1.05, 1.05);
        }
        previousColors[index] = color;
      }
    }

    function stop() {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      if (startTime !== null) {
        elapsed += (performance.now() - startTime) / 1000;
        startTime = null;
      }
    }

    function animate(timestamp) {
      if (!isMounted || !isVisible || pagePaused || reducedMotion.matches) {
        rafId = 0;
        return;
      }
      if (startTime === null) startTime = timestamp;
      if (timestamp - lastDraw >= FRAME_INTERVAL) {
        lastDraw = timestamp;
        draw(elapsed + (timestamp - startTime) / 1000);
      }
      rafId = window.requestAnimationFrame(animate);
    }

    function start() {
      if (isMounted && isVisible && !pagePaused && !reducedMotion.matches && !rafId) {
        rafId = window.requestAnimationFrame(animate);
      }
    }

    const unsubscribeFromCanvasPause = subscribeToCanvasPause((paused) => {
      pagePaused = paused;
      if (paused) stop();
      else start();
    });

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            draw(reducedMotion.matches ? 0 : elapsed);
            start();
          } else {
            stop();
          }
        }, { threshold: 0.01 });
    observer?.observe(canvas);
    if (isVisible) {
      draw(0);
      start();
    }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stop();
        elapsed = 0;
        if (isVisible) draw(0);
      } else {
        start();
      }
    }
    reducedMotion.addEventListener("change", handleMotionChange);

    return () => {
      isMounted = false;
      unsubscribeFromCanvasPause();
      stop();
      observer?.disconnect();
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return <span className="brand-pup" aria-hidden="true"><canvas ref={canvasRef} /></span>;
}

import { subscribeToCanvasPause } from "./canvasPause";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Owns the shared visibility, pause, reduced-motion, and RAF lifecycle for a canvas scene. */
export function startCanvasLoop(canvas, createRenderer, {
  frameInterval = 1000 / 12,
  threshold = 0.08,
  observe = true,
} = {}) {
  if (!canvas) return () => {};

  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  const canObserve = observe && typeof IntersectionObserver !== "undefined";
  let renderer = null;
  let animationFrame = 0;
  let lastDraw = 0;
  let startedAt = null;
  let elapsed = 0;
  let visible = !canObserve;
  let pagePaused = false;
  let mounted = true;

  function staticTime() {
    if (typeof renderer?.staticTime === "function") return renderer.staticTime();
    if (Number.isFinite(renderer?.staticTime)) return renderer.staticTime;
    if (Number.isFinite(renderer?.duration)) return Math.max(0, renderer.duration - 0.01);
    return 0;
  }

  function draw(time) {
    renderer?.draw(time);
  }

  function initialize() {
    if (renderer || !visible || !mounted) return;
    const created = createRenderer();
    if (!created || typeof created.draw !== "function") {
      throw new TypeError("A canvas renderer must return a draw(time) function.");
    }
    renderer = created;
    draw(reducedMotion.matches ? staticTime() : 0);
  }

  function stop() {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    if (startedAt !== null) {
      elapsed += Math.max(0, (performance.now() - startedAt) / 1000);
      startedAt = null;
    }
  }

  function animate(timestamp) {
    if (!mounted || !visible || pagePaused || reducedMotion.matches) {
      animationFrame = 0;
      return;
    }
    if (startedAt === null) startedAt = timestamp;
    if (timestamp - lastDraw >= frameInterval) {
      lastDraw = timestamp;
      draw(elapsed + (timestamp - startedAt) / 1000);
    }
    animationFrame = window.requestAnimationFrame(animate);
  }

  function start() {
    if (mounted && visible && renderer && !pagePaused && !reducedMotion.matches && !animationFrame) {
      animationFrame = window.requestAnimationFrame(animate);
    }
  }

  const observer = canObserve
    ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          initialize();
          start();
        } else {
          stop();
        }
      }, { threshold })
    : null;
  observer?.observe(canvas);

  const unsubscribeFromCanvasPause = subscribeToCanvasPause((paused) => {
    pagePaused = paused;
    if (paused) stop();
    else start();
  });

  if (visible) {
    initialize();
    start();
  }

  function handleMotionChange() {
    if (reducedMotion.matches) {
      stop();
      elapsed = 0;
      initialize();
      if (visible) draw(staticTime());
    } else {
      start();
    }
  }
  reducedMotion.addEventListener("change", handleMotionChange);

  return () => {
    mounted = false;
    unsubscribeFromCanvasPause();
    stop();
    observer?.disconnect();
    reducedMotion.removeEventListener("change", handleMotionChange);
    renderer?.dispose?.();
  };
}

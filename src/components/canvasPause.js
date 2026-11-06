const subscribers = new Set();
let resumeTimer = 0;
let isPaused = document.visibilityState === "hidden";

function setPaused(paused) {
  if (isPaused === paused) return;
  isPaused = paused;
  subscribers.forEach((subscriber) => subscriber(isPaused));
}

function handleScroll() {
  setPaused(true);
  window.clearTimeout(resumeTimer);
  resumeTimer = window.setTimeout(() => {
    setPaused(document.visibilityState === "hidden");
    resumeTimer = 0;
  }, 160);
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    setPaused(true);
  } else if (!resumeTimer) {
    setPaused(false);
  }
}

window.addEventListener("scroll", handleScroll, { passive: true });
document.addEventListener("visibilitychange", handleVisibilityChange);

export function subscribeToCanvasPause(subscriber) {
  subscribers.add(subscriber);
  subscriber(isPaused);
  return () => subscribers.delete(subscriber);
}

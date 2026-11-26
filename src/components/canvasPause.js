const subscribers = new Set();
let resumeTimer = 0;
let isPaused = typeof document !== "undefined" && document.visibilityState === "hidden";
let listening = false;

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

function startListening() {
  if (listening || typeof window === "undefined" || typeof document === "undefined") return;
  isPaused = document.visibilityState === "hidden";
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  listening = true;
}

function stopListening() {
  if (!listening) return;
  window.clearTimeout(resumeTimer);
  resumeTimer = 0;
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  listening = false;
}

/** Subscribe to shared scroll/tab-visibility canvas pause updates. */
export function subscribeToCanvasPause(subscriber) {
  startListening();
  subscribers.add(subscriber);
  subscriber(isPaused);
  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) stopListening();
  };
}

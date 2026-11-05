import { useEffect, useRef, useState } from "react";

const PROGRESS_RING_LENGTH = 135.09;

export default function BackToTop() {
  const sentinelRef = useRef(null);
  const progressRingRef = useRef(null);
  const [pastTop, setPastTop] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const isVisible = pastTop || hasFocus;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return undefined;

    if (!("IntersectionObserver" in window)) {
      const updateVisibility = () => setPastTop(window.scrollY > 280);
      window.addEventListener("scroll", updateVisibility, { passive: true });
      updateVisibility();
      return () => window.removeEventListener("scroll", updateVisibility);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPastTop(!entry.isIntersecting),
      { rootMargin: "280px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrame = 0;

    function updateProgress() {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        const documentHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );
        const scrollableHeight = documentHeight - window.innerHeight;
        const progress = scrollableHeight > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
          : 0;
        const offset = PROGRESS_RING_LENGTH * (1 - progress);

        progressRingRef.current?.setAttribute("stroke-dashoffset", offset.toFixed(2));
      });
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector(".brand")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <>
      <span className="scroll-sentinel" ref={sentinelRef} aria-hidden="true" />
      <button
        className={`back-to-top${isVisible ? " is-visible" : ""}`}
        type="button"
        aria-label="Scroll to top"
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        onClick={scrollToTop}
      >
        <svg viewBox="0 0 52 52" aria-hidden="true" focusable="false">
          <circle className="back-to-top-track" cx="26" cy="26" r="21.5" />
          <circle
            ref={progressRingRef}
            className="back-to-top-progress"
            cx="26"
            cy="26"
            r="21.5"
            strokeDasharray={PROGRESS_RING_LENGTH}
            strokeDashoffset={PROGRESS_RING_LENGTH}
          />
          <path className="back-to-top-arrow" d="M26 32V20m-8 8 8-8 8 8" />
        </svg>
      </button>
    </>
  );
}

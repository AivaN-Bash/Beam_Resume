import { useEffect } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Move marked layers at different rates while their section scrolls past. */
export default function useScrollParallax(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const layers = [...section.querySelectorAll("[data-scroll-parallax]")].map((element) => ({
      element,
      speed: clamp(Number(element.dataset.scrollParallax) || 0, 0, 70) / 100,
    }));
    if (layers.length === 0) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactScreen = window.matchMedia("(max-width: 800px)");
    let frameId = 0;
    let isVisible = typeof IntersectionObserver === "undefined";

    function reset() {
      layers.forEach(({ element }) => element.style.setProperty("--scroll-parallax-y", "0px"));
    }

    function update() {
      frameId = 0;
      if (reducedMotion.matches) {
        reset();
        return;
      }

      const sectionTop = section.getBoundingClientRect().top;
      const distanceScrolled = Math.max(0, -sectionTop);
      const progress = clamp(distanceScrolled / Math.max(section.offsetHeight, 1), 0, 1);
      const screenScale = compactScreen.matches ? 0.62 : 1;

      layers.forEach(({ element, speed }) => {
        const layerHeight = element.clientHeight || section.clientHeight;
        const offset = progress * layerHeight * speed * screenScale;
        element.style.setProperty("--scroll-parallax-y", `${offset.toFixed(2)}px`);
      });
    }

    function scheduleUpdate() {
      if (!isVisible || reducedMotion.matches || frameId) return;
      frameId = window.requestAnimationFrame(update);
    }

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) scheduleUpdate();
          else if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
          }
        }, { rootMargin: "96px 0px" });

    observer?.observe(section);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    function handleMotionPreferenceChange() {
      if (reducedMotion.matches) {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        reset();
      } else {
        scheduleUpdate();
      }
    }

    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
    compactScreen.addEventListener("change", scheduleUpdate);
    if (isVisible) scheduleUpdate();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
      compactScreen.removeEventListener("change", scheduleUpdate);
      reset();
    };
  }, [sectionRef]);
}

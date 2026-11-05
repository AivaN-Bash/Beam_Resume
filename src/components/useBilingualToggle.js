import { useEffect, useRef, useState } from "react";

export default function useBilingualToggle(intervalMs = 5000) {
  const [showThai, setShowThai] = useState(false);
  const pointerInsideRef = useRef(false);
  const focusInsideRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const id = window.setInterval(() => {
      if (!pointerInsideRef.current && !focusInsideRef.current) {
        setShowThai((value) => !value);
      }
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs]);

  const pauseHandlers = {
    onPointerEnter: () => { pointerInsideRef.current = true; },
    onPointerLeave: () => { pointerInsideRef.current = false; },
    onFocus: () => { focusInsideRef.current = true; },
    onBlur: (event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        focusInsideRef.current = false;
      }
    },
  };

  return [showThai, pauseHandlers];
}

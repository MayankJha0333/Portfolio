"use client";

import { useEffect } from "react";

// One listener for the whole page: tells the .spot card under the pointer where the pointer is.
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;

    function apply() {
      frame = 0;
      if (!last) return;
      const el = (last.target as Element | null)?.closest<HTMLElement>(".spot");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${last.clientX - r.left}px`);
      el.style.setProperty("--my", `${last.clientY - r.top}px`);
    }
    function move(e: PointerEvent) {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    }
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}

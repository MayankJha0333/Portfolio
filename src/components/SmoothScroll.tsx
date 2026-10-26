"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// Inertia scrolling on desktop. Off for reduced motion and touch (native scroll is better there).
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: { offset: -88 },
      autoRaf: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
}

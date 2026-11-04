"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// The longest frame the scroll clock counts. A stall, like a WebGL scene mounting
// mid-jump, then pauses the motion instead of leaping past whatever it missed.
const MAX_FRAME_MS = 50;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

// Further takes longer, but not proportionally: crossing the whole page stays under 2.2s.
function jumpDuration(distance: number) {
  return Math.min(2.2, 0.5 + 0.4 * Math.sqrt(distance / window.innerHeight));
}

// Inertia scrolling on desktop. Off for reduced motion and touch (native scroll is better there).
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    // The wheel uses Lenis's default damping: a fixed duration restarts its curve on every wheel event.
    const lenis = new Lenis({
      prevent: (node) => node instanceof HTMLTextAreaElement && node.scrollHeight > node.clientHeight,
    });

    let frame = 0;
    let last = 0;
    let clock = 0;
    const tick = (now: number) => {
      clock += Math.min(now - last, MAX_FRAME_MS);
      last = now;
      lenis.raf(clock);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame((now) => {
      last = now;
      tick(now);
    });

    // Lenis's own anchor option lets the browser's hash jump run too, and doesn't move focus.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!(e.target instanceof Element)) return;
      const link = e.target.closest<HTMLAnchorElement>('a[href^="#"]');
      const target = link && document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!link || !target) return;

      e.preventDefault();
      // The landing offset comes from scroll-padding-top in globals.css, which Lenis reads.
      lenis.scrollTo(target, {
        duration: jumpDuration(Math.abs(target.getBoundingClientRect().top)),
        easing: easeInOutCubic,
      });
      if (window.location.hash !== link.hash) window.history.pushState(null, "", link.hash);

      // Keyboard and screen reader users continue from the section they jumped to.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}

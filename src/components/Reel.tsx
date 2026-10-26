"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Showreel } from "./Showreel";
import { useMedia } from "./useMedia";

/*
  The reel starts as a framed preview and grows to fill the screen as you scroll,
  like zooming from the canvas into the shipped product.
*/
export function Reel() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 1024px)");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0.05, 0.62], [0.58, 1]);
  const radius = useTransform(scrollYProgress, [0.05, 0.62], [40, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.5, 0.66], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.5, 0.66], [16, 0]);

  const animated = desktop && !reduce;

  return (
    <section ref={ref} aria-label="Showreel" className={animated ? "relative h-[230vh]" : "relative px-4 sm:px-6"}>
      <div className={animated ? "sticky top-0 grid h-[100svh] place-items-center overflow-hidden" : ""}>
        <motion.div
          style={animated ? { scale, borderRadius: radius } : undefined}
          className={`relative overflow-hidden bg-[#0b0c22] ${
            animated
              ? "aspect-video w-[min(100vw,calc(100svh*16/9))] will-change-transform"
              : "mx-auto aspect-video max-w-7xl rounded-[28px] shadow-[var(--shadow)]"
          }`}
        >
          <Showreel />
          {animated && (
            <motion.p
              style={{ opacity: captionOpacity, y: captionY }}
              className="pointer-events-none absolute bottom-6 left-8 max-w-[40ch] text-lg font-medium text-white [text-shadow:0_2px_20px_rgb(0_0_0/0.5)]"
            >
              Six products, designed, built and shipped end to end.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

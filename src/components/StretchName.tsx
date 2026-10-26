"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// The footer wordmark widens from condensed to full width as the page reaches its end.
export function StretchName({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wdth = useTransform(scrollYProgress, [0, 1], [50, 150]);
  const wght = useTransform(scrollYProgress, [0, 1], [300, 900]);
  const settings = useTransform([wdth, wght], ([w, g]) => `"wdth" ${w}, "wght" ${g}`);

  return (
    <div ref={ref} aria-hidden className="overflow-hidden">
      <motion.p
        style={reduce ? { fontVariationSettings: '"wdth" 150, "wght" 900' } : { fontVariationSettings: settings }}
        className="display whitespace-nowrap pb-[0.12em] text-center text-[9.6vw] leading-[0.8] tracking-[-0.03em] text-ink"
      >
        {text}
      </motion.p>
    </div>
  );
}

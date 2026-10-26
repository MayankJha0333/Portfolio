"use client";

import { motion, useScroll, useSpring } from "motion/react";

// A thin gradient line along the top edge that fills as you read down the page.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-gradient fixed inset-x-0 top-0 z-[70] h-[2px] origin-left"
    />
  );
}

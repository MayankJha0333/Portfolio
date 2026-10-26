"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { toolkit } from "@/content/site";

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-14 pr-14" aria-hidden={hidden || undefined}>
      {toolkit.map((t) => (
        <li key={t.slug} className="flex items-center gap-3 text-ink/85 transition-colors hover:text-accent">
          {/* A mask lets one CDN logo take the current theme's colour. */}
          <span
            className="block size-7 bg-current"
            style={{
              maskImage: `url(https://cdn.simpleicons.org/${t.slug})`,
              WebkitMaskImage: `url(https://cdn.simpleicons.org/${t.slug})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
          <span className="display whitespace-nowrap text-[26px] [--wdth:112] [--wght:600]">{t.name}</span>
        </li>
      ))}
    </ul>
  );
}

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

// Drifts on its own, speeds up with scroll and flips direction when you scroll back up.
export function Toolkit() {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const direction = useRef(1);
  const hovered = useRef(false);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < -0.05) direction.current = -1;
    else if (b > 0.05) direction.current = 1;
    const speed = hovered.current ? 0.3 : 1;
    const move = direction.current * -1.6 * (delta / 1000) * speed + -direction.current * Math.abs(b) * (delta / 1000);
    base.set(base.get() + move);
  });

  return (
    <section
      aria-label="Toolkit"
      className="border-y border-line bg-bg-2 py-7"
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <motion.div className="flex w-max" style={{ x }}>
          <Row />
          <Row hidden />
        </motion.div>
      </div>
    </section>
  );
}

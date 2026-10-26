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
  type MotionValue,
} from "motion/react";
import { useRef } from "react";
import { toolkit } from "@/content/site";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Logo({ slug }: { slug: string }) {
  // A mask lets one CDN logo take whatever colour the band needs.
  return (
    <span
      className="block size-7 shrink-0 bg-current"
      style={{
        maskImage: `url(https://cdn.simpleicons.org/${slug})`,
        WebkitMaskImage: `url(https://cdn.simpleicons.org/${slug})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

function Row({ hidden, variant }: { hidden?: boolean; variant: "bold" | "glass" }) {
  return (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {toolkit.map((t) => (
        <li key={t.slug} className="flex items-center gap-3.5">
          <Logo slug={t.slug} />
          <span
            className={`display whitespace-nowrap text-[clamp(1.4rem,2.6vw,2.1rem)] leading-none ${
              variant === "bold" ? "[--wdth:125] [--wght:850]" : "[--wdth:110] [--wght:500]"
            }`}
          >
            {t.name}
          </span>
          {/* Four-point spark between items */}
          <svg aria-hidden viewBox="0 0 24 24" className="ml-8 size-5 shrink-0 opacity-70">
            <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

function Band({
  boost,
  dir,
  speed,
  variant,
  className,
}: {
  boost: MotionValue<number>;
  dir: 1 | -1;
  speed: number;
  variant: "bold" | "glass";
  className: string;
}) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const direction = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const b = boost.get();
    if (b < -0.05) direction.current = -1;
    else if (b > 0.05) direction.current = 1;
    const d = direction.current * dir;
    base.set(base.get() - d * (speed + Math.abs(b)) * (delta / 1000));
  });

  return (
    <div className={`flex overflow-hidden py-5 ${className}`}>
      <motion.div className="flex w-max" style={{ x }}>
        <Row variant={variant} />
        <Row variant={variant} hidden />
      </motion.div>
    </div>
  );
}

// Two tilted bands that cross like tape and run in opposite directions; scrolling speeds them up.
export function Toolkit() {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });

  return (
    <section aria-label="Toolkit" className="relative overflow-x-clip py-16 sm:py-24">
      <h2 className="sr-only">Toolkit</h2>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,var(--glow-b),transparent_70%)]" />
      <div className="relative">
        <Band
          boost={boost}
          dir={1}
          speed={1.4}
          variant="glass"
          className="-mx-8 rotate-[3deg] border-y border-line bg-surface text-ink/85 shadow-[var(--shadow)]"
        />
        <Band
          boost={boost}
          dir={-1}
          speed={1.8}
          variant="bold"
          className="bg-gradient relative -mx-8 mt-3 -rotate-[2.5deg] sm:-mt-12 text-on-gradient shadow-[0_30px_80px_-30px_var(--accent)]"
        />
      </div>
    </section>
  );
}

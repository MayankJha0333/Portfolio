"use client";

import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { featured, type Project } from "@/content/site";
import { RevealText } from "./RevealText";
import { useMedia } from "./useMedia";

function Links({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {p.live && (
        <a
          href={p.live}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-bg transition-[transform,background-color,color] duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink"
        >
          {p.slug === "klaude" ? "Install" : "Open live site"}
          <ArrowUpRight size={14} weight="bold" />
        </a>
      )}
      {p.code && (
        <a
          href={p.code}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-5 text-sm font-medium transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong"
        >
          <GithubLogo size={15} weight="bold" />
          Code
        </a>
      )}
      {p.extra && (
        <a
          href={p.extra.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-5 text-sm font-medium transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong"
        >
          {p.extra.label}
          <ArrowUpRight size={14} weight="bold" />
        </a>
      )}
    </div>
  );
}

// The screenshot sits in a browser frame on a glow of the product's colour,
// tilts toward the pointer and drifts slightly as the card scrolls.
function Media({ p }: { p: Project }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sry = useSpring(ry, { stiffness: 200, damping: 20 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -28]);
  const href = p.live ?? p.code;
  const host = (p.live ?? p.code ?? "").replace(/^https?:\/\//, "").split("/")[0];

  function move(e: React.PointerEvent<HTMLAnchorElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    ry.set(nx * 7);
    rx.set(-ny * 7);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      tabIndex={-1}
      aria-hidden
      data-cursor={p.live ? "Visit" : "Code"}
      onPointerMove={move}
      onPointerLeave={reset}
      className="relative grid h-full min-h-[260px] place-items-center overflow-hidden rounded-[22px] border border-line bg-surface-2 p-[6%] [perspective:1400px]"
      style={{ "--tint": p.tint } as React.CSSProperties}
    >
      {/* Product-coloured light from above, fading into the card */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,color-mix(in_srgb,var(--tint)_55%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="blueprint absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]"
      />
      <motion.div style={{ y: drift }} className="relative w-full">
        <motion.div
          style={{ rotateX: srx, rotateY: sry }}
          className="overflow-hidden rounded-[14px] bg-[#0c0d20] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.65),0_0_0_1px_rgb(255_255_255/0.08)] [transform-style:preserve-3d]"
        >
          {/* Browser chrome */}
          <div className="flex h-8 items-center gap-3 border-b border-white/[0.06] bg-[#13142b] px-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="mx-auto truncate rounded-md bg-white/[0.06] px-3 py-0.5 text-[11px] text-white/60">{host}</span>
            <span className="w-[42px]" />
          </div>
          <div className="relative aspect-video">
            <Image
              src={p.image}
              alt={p.imageAlt}
              fill
              quality={90}
              sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 92vw"
              className="object-cover object-top"
            />
          </div>
        </motion.div>
      </motion.div>
    </a>
  );
}

function Card({
  p,
  i,
  total,
  progress,
}: {
  p: Project;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 1024px)");
  const animated = desktop && !reduce;
  // Each card shrinks and dims a little as the ones after it slide over.
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - i) * 0.035]);
  const shade = useTransform(progress, [start, 1], [0, (total - 1 - i) * 0.07]);

  return (
    <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center">
      <motion.article
        style={animated ? { scale, top: i * 16 } : undefined}
        className="spot relative flex w-full origin-top flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-3 shadow-[var(--shadow)] lg:grid lg:h-[min(660px,calc(100svh-150px))] lg:grid-cols-12 lg:gap-4"
      >
        <div className="flex flex-col px-4 pb-6 pt-5 sm:px-6 lg:col-span-5 lg:px-8 lg:py-9">
          <div className="flex items-center gap-3">
            <span aria-hidden className="size-2.5 rounded-full shadow-[0_0_12px_var(--tint)]" style={{ backgroundColor: p.tint, "--tint": p.tint } as React.CSSProperties} />
            <p className="text-[15px] text-muted">{p.kind}</p>
          </div>
          <h3 className="display mt-4 text-[clamp(2.5rem,4.6vw,4.25rem)] leading-[0.9] [--wdth:108] [--wght:800]">
            {p.name}
          </h3>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-muted">{p.summary}</p>
          <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted">
            <span className="text-ink">Built with</span> {p.stack.join(", ")}
          </p>
          <div className="mt-8 lg:mt-auto">
            <Links p={p} />
          </div>
        </div>
        <div className="order-first lg:order-none lg:col-span-7">
          <Media p={p} />
        </div>
        {animated && (
          <motion.div
            aria-hidden
            style={{ opacity: shade }}
            className="pointer-events-none absolute inset-0 z-10 hidden bg-bg lg:block"
          />
        )}
      </motion.article>
    </div>
  );
}

export function Work() {
  const stack = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stack, offset: ["start start", "end end"] });

  return (
    <section id="work" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-12 lg:pt-32">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <RevealText
          text="Selected work"
          className="display text-[clamp(3rem,8vw,7rem)] leading-[0.85] [--wdth:132] [--wght:800]"
        />
        <p className="max-w-[40ch] text-lg leading-relaxed text-muted lg:pb-2 lg:text-right">
          Six products I designed, built and shipped, from the database to the store listing.
        </p>
      </div>
      <div ref={stack} className="mt-10 flex flex-col gap-6 pb-20 lg:mt-4 lg:gap-0 lg:pb-[10svh]">
        {featured.map((p, i) => (
          <Card key={p.slug} p={p} i={i} total={featured.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

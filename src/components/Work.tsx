"use client";

import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { featured, type Project } from "@/content/site";
import { ProjectLinks } from "./ProjectLinks";
import { RevealText } from "./RevealText";
import { useMedia } from "./useMedia";
import { WorkStage } from "./WorkStage";

function Media({ p }: { p: Project }) {
  const host = (p.live ?? p.code ?? "").replace(/^https?:\/\//, "").split("/")[0];

  return (
    <a
      href={p.live ?? p.code}
      target="_blank"
      rel="noreferrer"
      tabIndex={-1}
      aria-hidden
      data-cursor={p.live ? "Visit" : "Code"}
      className="relative grid h-full min-h-[260px] place-items-center overflow-hidden rounded-[22px] border border-line bg-surface-2 p-[6%]"
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
      <div className="relative w-full overflow-hidden rounded-[14px] bg-[#0c0d20] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.65),0_0_0_1px_rgb(255_255_255/0.08)]">
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
      </div>
    </a>
  );
}

// Phones, tablets, reduced motion and no-JS get plain cards.
function Card({ p }: { p: Project }) {
  return (
    <div className="lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:items-center">
      <article className="spot relative flex w-full flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-3 shadow-[var(--shadow)] lg:grid lg:h-[min(660px,calc(100svh-150px))] lg:grid-cols-12 lg:gap-4">
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
            <ProjectLinks p={p} />
          </div>
        </div>
        <div className="order-first lg:order-none lg:col-span-7">
          <Media p={p} />
        </div>
      </article>
    </div>
  );
}

export function Work() {
  const reduce = useReducedMotion();
  const desktop = useMedia("(min-width: 1024px)");

  return (
    <section id="work" className="pt-20 lg:pt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-12">
        <RevealText
          text="Selected work"
          className="display text-[clamp(3rem,8vw,7rem)] leading-[0.85] [--wdth:132] [--wght:800]"
        />
        <p className="max-w-[40ch] text-lg leading-relaxed text-muted lg:pb-2 lg:text-right">
          Six products I designed, built and shipped, from the database to the store listing.
        </p>
      </div>
      {desktop && !reduce ? (
        <WorkStage />
      ) : (
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-6 px-4 pb-20 sm:px-6 lg:mt-4 lg:gap-0 lg:px-12 lg:pb-[10svh]">
          {featured.map((p) => (
            <Card key={p.slug} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}

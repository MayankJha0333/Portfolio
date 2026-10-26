"use client";

import { useEffect, useRef, useState } from "react";
import { KineticTitle } from "./KineticTitle";

const TICKS = Array.from({ length: 40 }, (_, i) => i * 96);

/*
  The hero is a design-tool canvas: rulers on two edges, guides that follow the
  pointer, and the headline sitting in a live selection frame whose size label
  updates as the letters stretch.
*/
export function HeroStage({ children }: { children: React.ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const guideX = useRef<HTMLDivElement>(null);
  const guideY = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const markX = useRef<HTMLDivElement>(null);
  const markY = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  // Live W x H of the headline frame.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      const w = Math.round(box ? box.inlineSize : entry.contentRect.width);
      const h = Math.round(box ? box.blockSize : entry.contentRect.height);
      setSize((s) => (s && s.w === w && s.h === h ? s : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Guides and ruler markers follow the pointer. Written straight to the DOM, no re-renders.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function move(e: PointerEvent) {
      if (!stage || e.pointerType !== "mouse") return;
      const r = stage.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      stage.dataset.pointer = "on";
      stage.style.setProperty("--gx", `${x}px`);
      stage.style.setProperty("--gy", `${y}px`);
      guideX.current?.style.setProperty("transform", `translate3d(${x}px,0,0)`);
      guideY.current?.style.setProperty("transform", `translate3d(0,${y}px,0)`);
      markX.current?.style.setProperty("transform", `translate3d(${x}px,0,0)`);
      markY.current?.style.setProperty("transform", `translate3d(0,${y}px,0)`);
      if (readout.current) {
        readout.current.textContent = `${Math.round(x)}, ${Math.round(y)}`;
        readout.current.style.transform = `translate3d(${x + 14}px,${y + 14}px,0)`;
      }
    }
    function leave() {
      if (stage) stage.dataset.pointer = "off";
    }
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    return () => {
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      data-pointer="off"
      className="group/stage relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Blueprint grid, fading out toward the edges */}
      <div
        aria-hidden
        className="blueprint absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_30%,transparent_100%)]"
      />

      {/* Aurora: two slow-drifting colour fields, plus a soft light that follows the pointer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div className="aurora-a absolute -left-[15%] -top-[25%] h-[85%] w-[70%] rounded-full bg-[radial-gradient(closest-side,var(--glow-a),transparent)]" />
        <div className="aurora-b absolute -right-[10%] top-[10%] h-[75%] w-[60%] rounded-full bg-[radial-gradient(closest-side,var(--glow-b),transparent)]" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-data-[pointer=on]/stage:opacity-100 bg-[radial-gradient(520px_circle_at_var(--gx,50%)_var(--gy,40%),var(--glow-a),transparent_70%)]" />
      </div>

      {/* Rulers (desktop only) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 hidden h-6 border-b border-line bg-bg/60 backdrop-blur-md lg:block">
        <svg className="absolute inset-0 h-full w-full text-muted" aria-hidden>
          <defs>
            <pattern id="tick-x" width="96" height="24" patternUnits="userSpaceOnUse">
              {Array.from({ length: 8 }, (_, i) => (
                <line key={i} x1={i * 12 + 0.5} x2={i * 12 + 0.5} y1={i === 0 ? 7 : 17} y2="24" stroke="currentColor" strokeOpacity={i === 0 ? 0.55 : 0.28} />
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tick-x)" />
        </svg>
        {TICKS.map((t) => (
          <span key={t} className="absolute top-0.5 font-mono text-[9px] text-muted" style={{ left: t + 4 }}>
            {t}
          </span>
        ))}
        <div ref={markX} className="absolute bottom-0 left-0 h-full w-px bg-accent opacity-0 transition-opacity duration-200 group-data-[pointer=on]/stage:opacity-100" />
      </div>
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 top-6 hidden w-6 border-r border-line bg-bg/60 backdrop-blur-md lg:block">
        <svg className="absolute inset-0 h-full w-full text-muted" aria-hidden>
          <defs>
            <pattern id="tick-y" width="24" height="96" patternUnits="userSpaceOnUse">
              {Array.from({ length: 8 }, (_, i) => (
                <line key={i} y1={i * 12 + 0.5} y2={i * 12 + 0.5} x1={i === 0 ? 7 : 17} x2="24" stroke="currentColor" strokeOpacity={i === 0 ? 0.55 : 0.28} />
              ))}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tick-y)" />
        </svg>
        <div ref={markY} className="absolute left-0 top-[-24px] h-px w-full bg-accent opacity-0 transition-opacity duration-200 group-data-[pointer=on]/stage:opacity-100" />
      </div>

      {/* Pointer guides */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden opacity-0 transition-opacity duration-300 group-data-[pointer=on]/stage:opacity-100 lg:block">
        <div ref={guideX} className="absolute inset-y-0 left-0 w-px bg-[linear-gradient(to_bottom,var(--accent)_50%,transparent_50%)] bg-[length:1px_6px] opacity-50" />
        <div ref={guideY} className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,var(--accent)_50%,transparent_50%)] bg-[length:6px_1px] opacity-50" />
        <span ref={readout} className="absolute left-0 top-0 rounded-[4px] bg-accent px-1.5 py-0.5 font-mono text-[10px] text-accent-ink" />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 sm:px-6 lg:px-12">
        <div className="pt-28 sm:pt-32 lg:pt-32">
          <p className="rise glass mb-6 inline-flex items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4 text-sm text-muted [--d:200ms]">
            <span className="pulse-dot relative size-2 rounded-full bg-emerald-400" />
            Open to new projects
          </p>
          <br />
          {/* Selection frame around the headline */}
          <div ref={frameRef} className="relative inline-block max-w-full px-2 py-3 sm:px-4 sm:py-4">
            <div aria-hidden className="draw-frame pointer-events-none absolute inset-0 border border-accent">
              {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-bottom-[5px] -left-[5px]", "-bottom-[5px] -right-[5px]"].map((pos) => (
                <span key={pos} className={`absolute size-[9px] border border-accent bg-surface ${pos}`} />
              ))}
            </div>
            <KineticTitle hostRef={stageRef} />
            {size && (
              <span
                aria-hidden
                className="pop absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[5px] bg-accent px-2 py-0.5 font-mono text-[11px] tabular-nums text-accent-ink shadow-[0_6px_20px_-6px_var(--accent)] [--d:1.5s]"
              >
                {size.w} × {size.h}
              </span>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

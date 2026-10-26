"use client";

import { useEffect, useRef } from "react";

type Line = { text: string; outline?: boolean; wdth: number; wght: number };

const lines: Line[] = [
  { text: "From idea", outline: true, wdth: 60, wght: 100 },
  { text: "to launch.", wdth: 132, wght: 820 },
];


/*
  The headline is the product story in type: "idea" is a condensed hairline draft,
  "launch" is wide and solid. Letters near the pointer stretch toward full width.
  The hairline ones gain weight and ink as you pass, so you "build" the idea by looking at it,
  and the solid ones pick up the selection blue, like hovering a layer in a design tool.
*/
export function KineticTitle({ hostRef }: { hostRef: React.RefObject<HTMLElement | null> }) {
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const letters = lettersRef.current.filter(Boolean);
    let px = -9999;
    let py = -9999;
    let frame = 0;
    // Smoothed influence per letter, so letters ease rather than snap.
    const current = letters.map(() => 0);
    // Influence scales with the type, so huge desktop letters still react as a group.
    let radius = 240;
    const measure = () => {
      radius = Math.max(220, parseFloat(getComputedStyle(letters[0]).fontSize) * 1.7);
    };
    measure();
    window.addEventListener("resize", measure);

    function tick() {
      frame = 0;
      let moving = false;
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(px - cx, py - cy);
        const target = Math.max(0, 1 - d / radius) ** 2;
        const next = current[i] + (target - current[i]) * 0.18;
        if (Math.abs(next - current[i]) > 0.001) moving = true;
        current[i] = next;

        const restW = Number(el.dataset.w);
        const restG = Number(el.dataset.g);
        el.style.setProperty("--w", String(restW + (150 - restW) * next));
        el.style.setProperty("--g", String(restG + (900 - restG) * next));
        el.style.setProperty("--f", String(next));
      });
      if (moving) frame = requestAnimationFrame(tick);
    }

    let release = 0;
    function move(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
    }
    // On touch, a tap swells the letters under the finger, then they settle back.
    function tap(e: PointerEvent) {
      if (e.pointerType === "mouse") return;
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
      clearTimeout(release);
      release = window.setTimeout(leave, 650);
    }
    function leave() {
      px = -9999;
      py = -9999;
      if (!frame) frame = requestAnimationFrame(tick);
    }

    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerdown", tap);
    return () => {
      clearTimeout(release);
      window.removeEventListener("resize", measure);
      host.removeEventListener("pointerdown", tap);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, [hostRef]);

  let n = 0;
  return (
    <h1 className="display text-[16.5vw] leading-[0.86] tracking-[-0.02em] sm:text-[min(11.2vw,10.5rem)]">
      <span className="sr-only">I take products from idea to launch.</span>
      {lines.map((line) => (
        <span key={line.text} aria-hidden className={`block whitespace-nowrap ${line.outline ? "text-[1.4em] sm:text-[1em]" : ""}`}>
          {Array.from(line.text).map((ch, i) => {
            const idx = n++;
            // On phones "launch." drops to its own line so the type can be bigger.
            if (ch === " ")
              return line.text === "to launch." ? (
                <span key={i}>
                  {" "}
                  <br className="sm:hidden" />
                </span>
              ) : (
                <span key={i}> </span>
              );
            return (
              <span
                key={i}
                ref={(el) => {
                  if (el) lettersRef.current[idx] = el;
                }}
                data-w={line.wdth}
                data-g={line.wght}
                data-outline={line.outline ? "1" : undefined}
                className={`kinetic-letter inline-block ${line.outline ? "kinetic-draft" : "kinetic-solid"}`}
                style={
                  {
                    "--w": line.wdth,
                    "--g": line.wght,
                    "--f": 0,
                    "--i": idx,
                  } as React.CSSProperties
                }
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

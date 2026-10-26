"use client";

import { List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#open-source", label: "Open source" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Tuck the bar away while reading down, bring it back on any scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 320 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });

  // Highlight the section in view.
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-3 z-50 lg:top-9"
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-12"
          aria-label="Main"
        >
          <a
            href="#top"
            className="display flex h-12 items-center rounded-full glass px-5 text-[17px] [--wdth:118] [--wght:800]"
          >
            Mayank Jha
          </a>

          <div className="hidden h-12 items-center gap-1 glass rounded-full pl-1.5 pr-1 md:flex">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors ${isActive ? "text-bg" : "text-muted hover:text-ink"}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full bg-ink"
                    />
                  )}
                  {l.label}
                </a>
              );
            })}
            <ThemeToggle />
          </div>

          <div className="flex h-12 items-center gap-1 glass rounded-full px-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-10 place-items-center rounded-full transition hover:bg-surface-2 active:scale-95"
            >
              {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 36px)" }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-surface px-5 pb-12 md:hidden"
          >
            <ul>
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: reduce ? 0 : 0.18 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-line"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display block py-4 text-[2.75rem] leading-none [--wdth:125] [--wght:800]"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

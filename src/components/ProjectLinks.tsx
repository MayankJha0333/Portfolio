import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import type { Project } from "@/content/site";
import { GlassFill } from "./GlassFill";

export function ProjectLinks({ p }: { p: Project }) {
  return (
    // Product colours are all bright, so they take dark text in both themes.
    <div className="flex flex-wrap gap-2" style={{ "--tint": p.tint, "--tint-ink": "#07081a" } as React.CSSProperties}>
      {p.live && (
        <a
          href={p.live}
          target="_blank"
          rel="noreferrer"
          className="glass-link inline-flex h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-medium text-bg"
        >
          <GlassFill />
          {p.slug === "klaude" ? "Install" : "Open live site"}
          <ArrowUpRight size={14} weight="bold" />
        </a>
      )}
      {p.code && (
        <a
          href={p.code}
          target="_blank"
          rel="noreferrer"
          className="glass-link inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-5 text-sm font-medium"
        >
          <GlassFill />
          <GithubLogo size={15} weight="bold" />
          Code
        </a>
      )}
      {p.extra && (
        <a
          href={p.extra.href}
          target="_blank"
          rel="noreferrer"
          className="glass-link inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-5 text-sm font-medium"
        >
          <GlassFill />
          {p.extra.label}
          <ArrowUpRight size={14} weight="bold" />
        </a>
      )}
    </div>
  );
}

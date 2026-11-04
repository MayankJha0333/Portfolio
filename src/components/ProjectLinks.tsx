import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import type { Project } from "@/content/site";

export function ProjectLinks({ p }: { p: Project }) {
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

import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import type { Project } from "@/content/site";

// Six triangles that tile the button exactly. Each flies in from its own offset and locks into place.
const SHARDS: { clip: string; x: number; y: number; r: number }[] = [
  { clip: "0 0, 38% 0, 0 100%", x: 50, y: -18, r: -35 },
  { clip: "38% 0, 30% 100%, 0 100%", x: 70, y: 20, r: 30 },
  { clip: "38% 0, 72% 0, 30% 100%", x: 60, y: -22, r: 25 },
  { clip: "72% 0, 64% 100%, 30% 100%", x: 80, y: 18, r: -30 },
  { clip: "72% 0, 100% 0, 64% 100%", x: 55, y: -16, r: -25 },
  { clip: "100% 0, 100% 100%, 64% 100%", x: 70, y: 16, r: 35 },
];

function GlassFill() {
  return (
    <span aria-hidden className="glass-fill">
      <i className="glass-solid" />
      {SHARDS.map((s, i) => (
        <i
          key={s.clip}
          className="glass-shard"
          style={
            {
              "--i": i,
              "--x": `${s.x}px`,
              "--y": `${s.y}px`,
              "--r": `${s.r}deg`,
              clipPath: `polygon(${s.clip})`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

export function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap gap-2" style={{ "--tint": p.tint } as React.CSSProperties}>
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

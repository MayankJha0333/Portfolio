import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/ssr";
import { moreProjects, profile } from "@/content/site";
import { RevealText } from "./RevealText";

export function MoreProjects() {
  return (
    <section aria-labelledby="more-title" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-12 lg:pb-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <RevealText
          id="more-title"
          text="More things I've built"
          className="display text-[clamp(2rem,4vw,3.25rem)] leading-none [--wdth:120] [--wght:750]"
        />
        <a
          href={`${profile.github}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
        >
          All repositories <ArrowUpRight size={14} weight="bold" />
        </a>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {moreProjects.map((p) => (
          <li
            key={p.name}
            className="spot group flex flex-col rounded-[22px] border border-line bg-surface p-6 shadow-[var(--shadow)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold tracking-[-0.02em]">{p.name}</h3>
            <p className="mt-2 leading-relaxed text-muted">{p.summary}</p>
            <p className="mt-4 text-sm text-muted/80">{p.stack}</p>
            <div className="mt-auto flex gap-5 pt-6 text-sm font-medium">
              <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink">
                <GithubLogo size={15} weight="bold" /> Code
              </a>
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted transition-colors hover:text-ink">
                  Live <ArrowUpRight size={14} weight="bold" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

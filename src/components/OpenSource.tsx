import { ArrowUpRight, GitMerge } from "@phosphor-icons/react/ssr";
import { contributions, mergedTotal, profile } from "@/content/site";
import { CountUp } from "./CountUp";

export function OpenSource() {
  return (
    <section id="open-source" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-12 lg:py-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h2 className="display flex items-baseline gap-3 text-[clamp(1.25rem,2vw,1.625rem)] leading-tight [--wdth:115] [--wght:700]">
          <span className="text-gradient pr-1 text-[clamp(2.25rem,3.5vw,3rem)] leading-none [--wdth:140] [--wght:850]">
            <CountUp to={mergedTotal} />
          </span>
          merged pull requests
        </h2>
        <p className="text-sm text-muted">
          In open-source projects I didn&apos;t start. Older work is on{" "}
          <a href={profile.githubOld} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ink">
            @MayankJha014
          </a>
          .
        </p>
      </div>

      <ul className="mt-6 grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
        {contributions.map((c) => (
          <li key={c.project} className="border-b border-line">
            <a href={c.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 py-3.5">
              <span className="min-w-0">
                <span className="block font-medium tracking-[-0.01em]">{c.project}</span>
                <span className="block text-sm text-muted">{c.blurb}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm tabular-nums text-muted transition-colors group-hover:text-ink">
                <GitMerge size={14} weight="bold" className="text-accent" />
                {c.merged}
                <ArrowUpRight size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

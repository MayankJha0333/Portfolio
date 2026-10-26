import { ArrowUpRight, GitMerge } from "@phosphor-icons/react/ssr";
import { contributions, mergedTotal, profile } from "@/content/site";
import { CountUp } from "./CountUp";
import { RevealText } from "./RevealText";

export function OpenSource() {
  return (
    <section id="open-source" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12 lg:py-32">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <p className="display text-gradient w-fit pr-2 text-[clamp(8rem,24vw,19rem)] leading-[0.82] [--wdth:150] [--wght:900] lg:col-span-6">
          <CountUp to={mergedTotal} />
        </p>
        <div className="lg:col-span-6 lg:pb-6">
          <RevealText
            text="merged pull requests"
            className="display text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95] [--wdth:120] [--wght:750]"
          />
          <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-muted">
            Fixes, features and test suites in open-source projects I didn&apos;t start.
          </p>
        </div>
      </div>

      <ul className="mt-16 border-t border-line">
        {contributions.map((c) => (
          <li key={c.project} className="border-b border-line">
            <a
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="group relative grid gap-3 py-8 sm:grid-cols-12 sm:gap-6 lg:py-10"
            >
              {/* Accent wash that sweeps in from the left on hover */}
              <span
                aria-hidden
                className="absolute inset-y-0 -left-4 -right-4 origin-left scale-x-0 rounded-[18px] border border-line bg-surface shadow-[var(--shadow)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 sm:-left-6 sm:-right-6"
              />
              <div className="relative sm:col-span-5">
                <p className="text-sm text-muted">{c.org}</p>
                <h3 className="display mt-1 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-tight [--wdth:110] [--wght:700] transition-[font-variation-settings] duration-500 group-hover:[--wdth:130]">
                  {c.project}
                </h3>
                <p className="mt-1 text-sm text-muted">{c.blurb}</p>
              </div>
              <p className="relative max-w-[56ch] leading-relaxed sm:col-span-5">{c.did}</p>
              <div className="relative flex items-center justify-between gap-4 sm:col-span-2 sm:flex-col sm:items-end sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm tabular-nums">
                  <GitMerge size={14} weight="bold" className="text-accent" />
                  {c.merged} merged
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors group-hover:text-ink">
                  View PRs
                  <ArrowUpRight size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-sm text-muted">
        Plus one merged PR to LiquidGalaxyLAB. Older work lives on my first account,{" "}
        <a href={profile.githubOld} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-ink">
          @MayankJha014
        </a>
        .
      </p>
    </section>
  );
}

import { ArrowDown, EnvelopeSimple } from "@phosphor-icons/react/ssr";
import { profile } from "@/content/site";
import { HeroStage } from "./HeroStage";
import { Magnetic } from "./Magnetic";

export function Hero() {
  return (
    <section id="top" className="relative">
      <HeroStage>
        <div className="grid gap-10 pb-14 pt-10 sm:pt-12 lg:grid-cols-12 lg:items-end lg:pb-16">
          <div className="rise [--d:700ms] lg:col-span-6">
            <p className="max-w-[44ch] text-lg leading-relaxed text-muted sm:text-xl">
              <span className="font-medium text-ink">I&apos;m {profile.name}.</span> I design and build web apps,
              mobile apps and VS Code extensions, often with AI inside, and see them through to launch. Currently a
              full-stack intern at Pulsegen.
            </p>
          </div>
          <div className="rise flex flex-wrap items-center gap-3 [--d:820ms] lg:col-span-6 lg:justify-end">
            <Magnetic>
              <a
                href="#work"
                className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-full bg-ink px-7 text-[15px] font-medium text-bg shadow-[0_10px_30px_-10px_var(--accent)]"
              >
                {/* Gradient sweeps up from below on hover */}
                <span
                  aria-hidden
                  className="bg-gradient absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
                />
                <span className="relative">See my work</span>
                <ArrowDown size={16} weight="bold" className="relative transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={`mailto:${profile.email}`}
                className="glass inline-flex h-14 items-center gap-2 rounded-full px-7 text-[15px] font-medium transition-colors hover:border-line-strong"
              >
                <EnvelopeSimple size={16} weight="bold" />
                Email me
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="rise mt-auto flex items-center gap-3 pb-8 text-sm text-muted [--d:1000ms]">
          <span aria-hidden className="relative block h-8 w-px overflow-hidden bg-line">
            <span className="scroll-cue absolute inset-0 bg-ink" />
          </span>
          Scroll to see the work
        </div>
      </HeroStage>
    </section>
  );
}

import { ArrowUpRight, FileText } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { education, experience, profile } from "@/content/site";
import { GlassFill } from "./GlassFill";
import { RevealText } from "./RevealText";
import { ScrollWords } from "./ScrollWords";

const story =
  "I like owning a product end to end: the design, the code, the release and whatever breaks after it. Most days that means React, Next.js and Node, with Expo or Flutter for mobile. Lately I'm going deeper on agentic operating systems, where AI agents plan, remember and work together.";

export function About() {
  return (
    <section id="about" className="border-t border-line bg-surface/30 backdrop-blur-[2px]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-12 lg:py-28">
        {/* Stays in view while the work history scrolls past */}
        <div className="self-start lg:sticky lg:top-28 lg:col-span-5">
          <div className="flex items-center gap-4">
            <Image
              src="/work/avatar.png"
              alt="Mayank Jha"
              width={460}
              height={460}
              className="size-16 rounded-full object-cover ring-2 ring-accent/60 ring-offset-4 ring-offset-bg"
            />
            <RevealText text="About" className="display text-[clamp(2.5rem,5vw,4.25rem)] leading-none [--wdth:132] [--wght:800]" />
          </div>

          <ScrollWords
            text={story}
            className="display mt-8 text-[clamp(1.25rem,1.9vw,1.625rem)] leading-[1.3] [--wdth:96] [--wght:520]"
          />

          <div className="mt-8 flex flex-wrap gap-2">
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="glass glass-link inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium"
            >
              <GlassFill />
              <FileText size={16} weight="bold" />
              Read my resume
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="glass glass-link inline-flex h-11 items-center gap-1.5 rounded-full px-5 text-sm font-medium"
            >
              <GlassFill />
              LinkedIn
              <ArrowUpRight size={14} weight="bold" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h3 className="text-sm font-medium text-muted">Where I&apos;ve worked</h3>
          <ol className="mt-4 border-t border-line">
            {experience.map((r) => (
              <li key={r.company} className="grid gap-x-8 gap-y-2 border-b border-line py-6 sm:grid-cols-[10.5rem_1fr]">
                <div className="text-sm text-muted sm:pt-1.5">
                  <p className="tabular-nums">{r.period}</p>
                  <p>{r.location}</p>
                </div>
                <div>
                  <p className="display flex items-center gap-3 text-[clamp(1.5rem,2.3vw,1.875rem)] leading-tight [--wdth:108] [--wght:700]">
                    {r.company}
                    {r.current && (
                      <span aria-label="Current role" className="pulse-dot relative block size-2 shrink-0 rounded-full bg-accent" />
                    )}
                  </p>
                  <p className="mt-0.5 font-medium">{r.title}</p>
                  {r.detail && <p className="mt-2 max-w-[56ch] leading-relaxed text-muted">{r.detail}</p>}
                </div>
              </li>
            ))}
          </ol>

          <h3 className="mt-12 text-sm font-medium text-muted">Education</h3>
          <div className="mt-4 grid gap-x-8 gap-y-2 border-y border-line py-6 sm:grid-cols-[10.5rem_1fr]">
            <p className="text-sm tabular-nums text-muted sm:pt-1">{education.period}</p>
            <div>
              <p className="text-lg font-semibold tracking-[-0.02em]">{education.school}</p>
              <p className="mt-0.5 text-muted">{education.degree}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

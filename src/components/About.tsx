import { FileText } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import { education, experience, profile } from "@/content/site";
import { RevealText } from "./RevealText";
import { ScrollWords } from "./ScrollWords";

const story =
  "I like owning a product end to end: the design, the code, the release and whatever breaks after it. Most days that means React, Next.js and Node, with Expo or Flutter for mobile. Lately I'm going deeper on RAG pipelines and system design at scale.";

export function About() {
  return (
    <section id="about" className="border-t border-line bg-surface/30 backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12 lg:py-32">
        <div className="flex items-center gap-4">
          <Image
            src="/work/avatar.png"
            alt="Mayank Jha"
            width={460}
            height={460}
            className="size-16 rounded-full object-cover ring-2 ring-accent/60 ring-offset-4 ring-offset-bg sm:size-20"
          />
          <RevealText text="About" className="display text-[clamp(2.5rem,6vw,5rem)] leading-none [--wdth:132] [--wght:800]" />
        </div>

        <ScrollWords
          text={story}
          className="display mt-10 max-w-[30ch] text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.12] [--wdth:96] [--wght:560]"
        />

        <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h3 className="text-lg font-semibold">Experience</h3>
            <ol className="mt-6 space-y-8 border-l border-line pl-8">
              {experience.map((r, i) => (
                <li key={r.company} className="relative">
                  <span
                    aria-hidden
                    className={`absolute -left-[37px] top-1.5 size-2.5 rounded-full ring-4 ring-bg ${i === 0 ? "bg-accent" : "bg-muted/50"}`}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className="text-lg font-semibold tracking-[-0.02em]">
                      {r.company}
                      {r.title && <span className="font-normal text-muted">, {r.title}</span>}
                    </p>
                    <p className="text-sm tabular-nums text-muted">{r.period}</p>
                  </div>
                  <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">{r.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-lg font-semibold">Education</h3>
            <p className="mt-6 text-lg font-semibold tracking-[-0.02em]">{education.degree}</p>
            <p className="mt-1 leading-relaxed text-muted">{education.school}</p>
            <p className="mt-1 text-sm tabular-nums text-muted">{education.period}</p>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="glass mt-10 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-line-strong"
            >
              <FileText size={16} weight="bold" />
              Read my resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

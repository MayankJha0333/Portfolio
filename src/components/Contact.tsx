import { ArrowUpRight, GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react/ssr";
import { profile } from "@/content/site";
import { CopyEmail } from "./CopyEmail";
import { Magnetic } from "./Magnetic";
import { RevealText } from "./RevealText";
import { StretchName } from "./StretchName";

const socials = [
  { label: "GitHub", href: profile.github, Icon: GithubLogo },
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedinLogo },
  { label: "X", href: profile.x, Icon: XLogo },
];

const ring = "Let's build something together · Let's build something together · ";

export function Contact() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line">
      {/* Glow rising from the bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,var(--glow-a),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-12 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <RevealText
              text="Building something? I'd like to hear about it."
              className="display max-w-[16ch] text-[clamp(2.5rem,5.6vw,5rem)] leading-[0.95] [--wdth:110] [--wght:800]"
            />
            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted">
              Open to collaborating on full-stack, AI-powered and product-led projects.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopyEmail email={profile.email} />
              <p className="text-sm text-muted select-all">{profile.email}</p>
            </div>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Magnetic strength={0.4}>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email me"
                className="group relative grid size-48 place-items-center sm:size-56"
              >
                {/* Text circling the button */}
                <svg viewBox="0 0 200 200" aria-hidden className="spin-slow absolute inset-0 size-full text-muted">
                  <defs>
                    <path id="ring" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
                  </defs>
                  <text className="fill-current text-[11.5px] font-medium tracking-[0.12em]">
                    <textPath href="#ring">{ring}</textPath>
                  </text>
                </svg>
                <span className="bg-gradient relative grid size-32 place-items-center rounded-full text-accent-ink shadow-[0_20px_60px_-15px_var(--accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 sm:size-36">
                  <span className="flex items-center gap-1 text-base font-semibold">
                    Email me
                    <ArrowUpRight size={16} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="mt-20 flex flex-col-reverse items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">© 2026 Mayank Jha. Hero reel rendered with HyperFrames.</p>
          <ul className="flex items-center gap-1">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full text-muted transition hover:-translate-y-0.5 hover:bg-surface-2 hover:text-ink"
                >
                  <Icon size={20} weight="bold" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 pb-4">
        <StretchName text={profile.name} />
      </div>
    </footer>
  );
}

"use client";

import { ArrowRight, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { profile } from "@/content/site";

type Status =
  | { state: "idle" | "sending" }
  | { state: "sent"; name: string; email: string }
  // `message` is a fix the visitor can make; without one, sending itself failed.
  | { state: "error"; message?: string };

const field =
  "w-full rounded-[14px] border border-line bg-surface/70 px-4 text-base transition-colors placeholder:text-muted/70 hover:border-line-strong focus:border-accent";
const label = "mb-1.5 block text-sm font-medium";

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const thanks = useRef<HTMLDivElement>(null);

  // The form disappears on success, so keyboard and screen-reader users land on the confirmation.
  useEffect(() => {
    if (status.state === "sent") thanks.current?.focus();
  }, [status.state]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus({ state: "sent", name: data.name.trim(), email: data.email.trim() });
      } else {
        const json = await res.json().catch(() => null);
        setStatus({ state: "error", message: res.status === 400 ? json?.error : undefined });
      }
    } catch {
      setStatus({ state: "error" });
    }
  }

  if (status.state === "sent") {
    return (
      <div
        ref={thanks}
        tabIndex={-1}
        role="status"
        className="glass flex min-h-[420px] flex-col items-start justify-center rounded-[28px] p-6 sm:p-8"
      >
        <CheckCircle size={40} weight="fill" className="text-accent" />
        <p className="display mt-5 text-[clamp(1.75rem,3vw,2.5rem)] leading-tight [--wdth:110] [--wght:750]">
          Thanks, {status.name}.
        </p>
        <p className="mt-2 max-w-[42ch] text-lg leading-relaxed text-muted">
          Your message is on its way. I&apos;ll reply to {status.email}.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className="mt-6 text-sm font-medium underline underline-offset-4 hover:text-accent"
        >
          Send another message
        </button>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    <form onSubmit={submit} aria-label="Contact form" className="glass rounded-[28px] p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={label}>
            Name
          </label>
          <input id="contact-name" name="name" required maxLength={100} autoComplete="name" className={`${field} h-12`} />
        </div>
        <div>
          <label htmlFor="contact-email" className={label}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            className={`${field} h-12`}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className={label}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          placeholder="What are you building?"
          className={`${field} block resize-y py-3 leading-relaxed`}
        />
      </div>

      {/* Hidden from people; bots that fill it in are ignored by the server */}
      <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-[transform,background-color,color,opacity] duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-ink disabled:translate-y-0 disabled:opacity-70"
        >
          {sending ? "Sending" : "Send message"}
          {sending ? (
            <CircleNotch size={16} weight="bold" className="animate-spin" />
          ) : (
            <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </button>
        <p role="alert" className="text-sm leading-relaxed">
          {status.state === "error" &&
            (status.message ?? (
              <>
                That didn&apos;t send. Your message is still here, or email me at{" "}
                <a href={`mailto:${profile.email}`} className="underline underline-offset-4 hover:text-accent">
                  {profile.email}
                </a>
                .
              </>
            ))}
        </p>
      </div>
    </form>
  );
}

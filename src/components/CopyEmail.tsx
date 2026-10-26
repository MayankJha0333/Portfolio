"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(t);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition hover:border-line-strong active:scale-[0.98]"
    >
      {state === "copied" ? <Check size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed, select the address" : "Copy address"}
      </span>
    </button>
  );
}

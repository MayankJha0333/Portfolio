"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Showreel() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  // null = follow visibility; true/false = the visitor chose.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const wantsPause = userPaused ?? Boolean(reduce);
    if (wantsPause) {
      video.pause();
      return;
    }
    // Stop decoding while the reel is scrolled away.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, [reduce, userPaused]);

  return (
    <div className="relative h-full w-full">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        src="/media/showreel.mp4"
        poster="/media/showreel-poster.jpg"
        width={1920}
        height={1080}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="Showreel of Dovli, CrestClip, Rent Rush, Klaude, VizPilot and Sahayak"
      />
      <button
        type="button"
        onClick={() => setUserPaused(playing)}
        aria-label={playing ? "Pause showreel" : "Play showreel"}
        className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-black/45 text-white backdrop-blur-md transition hover:bg-black/65 active:scale-95"
      >
        {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
      </button>
    </div>
  );
}

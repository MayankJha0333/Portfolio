"use client";

import { Pause, Play } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { featured } from "@/content/site";
import { damp, rand, triangulate } from "./shards";
import { Showreel } from "./Showreel";

/*
  The showreel as a 3D shatter: the video is cut into glass triangles that
  fly in from the right and lock together as you scroll, with loose shards
  still drifting around the edges. Three.js loads only when this section
  is close to the screen. Reduced motion gets the plain video.

  The merge runs only while the section is pinned, and it can't fall more than
  MAX_LAG behind the scroll, so even a hard flick finishes it well before release.
*/

const COLS = 14;
const ROWS = 8;
const LOOSE = 70; // shards that never lock in and keep drifting
const W = 16;
const H = 9;
const MAX_LAG = 0.08;

const vertexShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  attribute vec3 aCentroid;
  attribute vec3 aOffset;
  attribute vec4 aRot;
  attribute float aDelay;
  attribute float aLoose;
  attribute vec3 aBary;
  varying vec2 vUv;
  varying vec3 vBary;
  varying float vSet;
  varying float vFacing;
  varying float vLoose;

  mat3 rotation(vec3 axis, float a) {
    axis = normalize(axis);
    float s = sin(a), c = cos(a), oc = 1.0 - c;
    return mat3(
      oc * axis.x * axis.x + c,          oc * axis.x * axis.y + axis.z * s, oc * axis.z * axis.x - axis.y * s,
      oc * axis.x * axis.y - axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z + axis.x * s,
      oc * axis.z * axis.x + axis.y * s, oc * axis.y * axis.z - axis.x * s, oc * axis.z * axis.z + c
    );
  }

  void main() {
    float p = clamp((uProgress - aDelay) / 0.42, 0.0, 1.0);
    p = mix(p, 0.0, aLoose);
    float e = 1.0 - pow(1.0 - p, 3.0);
    float inv = 1.0 - e;

    // Loose shards tumble slowly forever; the rest unwind to flat as they lock in.
    float angle = aRot.w * inv + aLoose * uTime * 0.35 * sign(aRot.w);
    mat3 R = rotation(aRot.xyz, angle);
    vec3 local = R * (position * mix(0.86, 1.0, e));

    vec3 drift = vec3(
      sin(uTime * 0.6 + aDelay * 31.0),
      cos(uTime * 0.5 + aDelay * 17.0),
      sin(uTime * 0.4 + aDelay * 11.0)
    ) * 0.12 * inv;

    vec3 pos = aCentroid + aOffset * inv + local + drift;

    vUv = uv;
    vBary = aBary;
    vSet = e;
    vLoose = aLoose;
    vFacing = abs((R * vec3(0.0, 0.0, 1.0)).z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec3 uRimA;
  uniform vec3 uRimB;
  varying vec2 vUv;
  varying vec3 vBary;
  varying float vSet;
  varying float vFacing;
  varying float vLoose;

  void main() {
    vec3 tex = texture2D(uMap, vUv).rgb;
    float edge = min(min(vBary.x, vBary.y), vBary.z);

    // Glass rim: bright, colour-shifting edges while flying, a fine seam once locked in.
    float rim = 1.0 - smoothstep(0.0, 0.04, edge);
    vec3 iri = mix(uRimA, uRimB, 0.5 + 0.5 * sin(vUv.x * 6.0 + vUv.y * 4.0 + uTime));
    float flying = 1.0 - vSet;

    vec3 col = tex * mix(0.45, 1.0, vFacing);
    col = mix(col, col * 0.35, vLoose * 0.55);
    col += iri * rim * (0.04 + 0.9 * flying);
    col += pow(1.0 - vFacing, 3.0) * iri * 0.6 * flying;
    float seam = 1.0 - smoothstep(0.0, 0.012, edge);
    col = mix(col, col * 0.5, seam * vSet * 0.45);

    // Video pixels are already display-ready, so they pass straight through with no colour conversion.
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Three = typeof import("three");

function buildGeometry(THREE: Three) {
  const r = rand(20261026);
  const tris = triangulate(COLS, ROWS, W, H, r);

  // Loose shards: random triangles cut from random parts of the video.
  const loose: [number, number][][] = [];
  for (let k = 0; k < LOOSE; k++) {
    const cx = (r() - 0.5) * W * 0.9;
    const cy = (r() - 0.5) * H * 0.9;
    const s = 0.5 + r() * 0.8;
    const a0 = r() * Math.PI * 2;
    loose.push([0, 1, 2].map((n) => {
      const a = a0 + (n * Math.PI * 2) / 3 + (r() - 0.5) * 0.6;
      return [cx + Math.cos(a) * s, cy + Math.sin(a) * s] as [number, number];
    }));
  }

  const all = [...tris.map((t) => ({ t, loose: 0 })), ...loose.map((t) => ({ t, loose: 1 }))];
  const n = all.length * 3;
  const position = new Float32Array(n * 3);
  const uv = new Float32Array(n * 2);
  const centroid = new Float32Array(n * 3);
  const offset = new Float32Array(n * 3);
  const rot = new Float32Array(n * 4);
  const delay = new Float32Array(n);
  const looseAttr = new Float32Array(n);
  const bary = new Float32Array(n * 3);

  all.forEach(({ t, loose: isLoose }, k) => {
    const cx = (t[0][0] + t[1][0] + t[2][0]) / 3;
    const cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
    const u = (cx + W / 2) / W;

    // Shards stream in from the right and from behind, like a swarm landing.
    let ox: number, oy: number, oz: number;
    if (isLoose) {
      const side = r() > 0.35 ? 1 : -1;
      ox = side * (W * 0.55 + r() * W * 0.35) - cx;
      oy = (r() - 0.5) * H * 1.5 - cy * 0.3;
      oz = (r() - 0.5) * 6;
    } else {
      ox = W * (0.5 + r() * 0.9) + (1 - u) * W * 0.4;
      oy = (r() - 0.5) * H * 1.3 + Math.sin(u * Math.PI * 2) * H * 0.25;
      oz = -2 + r() * 7;
    }
    const ax = r() - 0.5, ay = r() - 0.5, az = r() - 0.5;
    const angle = (r() > 0.5 ? 1 : -1) * (1.5 + r() * 4);
    const d = isLoose ? 2 : u * 0.45 + r() * 0.13;

    for (let v = 0; v < 3; v++) {
      const idx = k * 3 + v;
      const [x, y] = t[v];
      position.set([x - cx, y - cy, 0], idx * 3);
      uv.set([Math.min(1, Math.max(0, (x + W / 2) / W)), Math.min(1, Math.max(0, (y + H / 2) / H))], idx * 2);
      centroid.set([cx, cy, 0], idx * 3);
      offset.set([ox, oy, oz], idx * 3);
      rot.set([ax, ay, az, angle], idx * 4);
      delay[idx] = d;
      looseAttr[idx] = isLoose;
      bary.set([v === 0 ? 1 : 0, v === 1 ? 1 : 0, v === 2 ? 1 : 0], idx * 3);
    }
  });

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(position, 3));
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  g.setAttribute("aCentroid", new THREE.BufferAttribute(centroid, 3));
  g.setAttribute("aOffset", new THREE.BufferAttribute(offset, 3));
  g.setAttribute("aRot", new THREE.BufferAttribute(rot, 4));
  g.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));
  g.setAttribute("aLoose", new THREE.BufferAttribute(looseAttr, 1));
  g.setAttribute("aBary", new THREE.BufferAttribute(bary, 3));
  return g;
}

export function ShatterReel() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHost = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);

  // 0 is the moment the section pins, 1 the moment it lets go.
  const { scrollYProgress: pinned } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const assemble = useTransform(pinned, [0.02, 0.62], [0, 1]);
  const captionOpacity = useTransform(pinned, [0.62, 0.7], [0, 1]);
  const captionY = useTransform(pinned, [0.62, 0.7], [20, 0]);
  const controlsEvents = useTransform(pinned, (v) => (v > 0.62 ? "auto" : "none"));
  const introOpacity = useTransform(pinned, [0.06, 0.22], [1, 0]);

  // Play only while on screen and not paused by the visitor. Starts a little early so frames are ready.
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || reduce) return;
    if (userPaused) {
      video.pause();
      return;
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { rootMargin: "400px 0px" });
    io.observe(section);
    return () => io.disconnect();
  }, [reduce, userPaused]);

  useEffect(() => {
    if (reduce) return;
    const host = canvasHost.current;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!host || !section || !video) return;

    let disposed = false;
    let cleanup = () => {};

    // Load Three.js only when the section is about to be seen.
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const THREE = await import("three");
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor(0x000000, 0);
        host.appendChild(renderer.domElement);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        // The poster fills the glass until the video has a frame, so shards are never black.
        let hasImage = false;
        const poster = new THREE.TextureLoader().load("/media/showreel-poster.jpg", () => {
          hasImage = true;
        });
        poster.minFilter = THREE.LinearFilter;
        poster.generateMipmaps = false;

        const css = getComputedStyle(document.documentElement);
        // Raw 0-1 RGB from a CSS hex colour, matching the raw video pixels.
        const rgb = (name: string, fallback: string) => {
          const hex = (css.getPropertyValue(name).trim() || fallback).replace("#", "");
          const n = parseInt(hex.length === 3 ? hex.replace(/./g, "$&$&") : hex, 16);
          return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
        };
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          side: THREE.DoubleSide,
          uniforms: {
            uMap: { value: poster },
            uProgress: { value: 0 },
            uTime: { value: 0 },
            uRimA: { value: rgb("--accent", "#8b7dff") },
            uRimB: { value: rgb("--accent-2", "#3dd8ff") },
          },
        });
        const showVideo = () => {
          hasImage = true;
          material.uniforms.uMap.value = texture;
        };
        if (video.readyState >= 2) showVideo();
        else video.addEventListener("loadeddata", showVideo, { once: true });

        const geometry = buildGeometry(THREE);
        const mesh = new THREE.Mesh(geometry, material);
        const group = new THREE.Group();
        group.add(mesh);
        scene.add(group);

        function resize() {
          const w = host!.clientWidth;
          const h = host!.clientHeight;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          const t = 2 * Math.tan((camera.fov * Math.PI) / 360);
          // Fit the assembled video: 86% of the width or 66% of the height, whichever is tighter.
          // The height leaves room for the caption under the nav and the controls below.
          camera.position.z = Math.max(W / (0.86 * camera.aspect * t), H / (0.66 * t));
          camera.updateProjectionMatrix();
        }
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);

        let mx = 0;
        let my = 0;
        const onMove = (e: PointerEvent) => {
          mx = (e.clientX / window.innerWidth) * 2 - 1;
          my = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", onMove, { passive: true });

        let visible = true;
        const vis = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
        vis.observe(section);

        let smooth = assemble.get();
        let merged = false;
        let raf = 0;
        let first = true;
        const clock = new THREE.Clock();
        const tick = () => {
          raf = requestAnimationFrame(tick);
          const dt = Math.min(clock.getDelta(), 0.1);
          const target = assemble.get();
          // Off screen there's nothing to animate: come back already at the right state.
          if (!visible) {
            smooth = target;
            return;
          }
          smooth = damp(smooth, target, 9, dt);
          smooth = Math.min(Math.max(smooth, target - MAX_LAG), target + MAX_LAG);
          // Start from the first product at the moment the picture locks together.
          if (smooth > 0.995 && !merged) {
            merged = true;
            video.currentTime = 0;
          } else if (smooth < 0.5) {
            merged = false;
          }
          if (!hasImage) return;
          material.uniforms.uProgress.value = smooth;
          material.uniforms.uTime.value = clock.elapsedTime;
          const loose = 1 - smooth;
          group.rotation.y = damp(group.rotation.y, -0.38 * loose + mx * 0.08, 4, dt);
          group.rotation.x = damp(group.rotation.x, 0.16 * loose + my * 0.05, 4, dt);
          group.position.x = 1.2 * loose;
          renderer.render(scene, camera);
          if (first) {
            first = false;
            setReady(true);
          }
        };
        tick();

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          vis.disconnect();
          window.removeEventListener("pointermove", onMove);
          video.removeEventListener("loadeddata", showVideo);
          geometry.dispose();
          material.dispose();
          poster.dispose();
          texture.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(section);

    return () => {
      disposed = true;
      io.disconnect();
      cleanup();
    };
  }, [reduce, assemble]);

  if (reduce) {
    return (
      <section ref={sectionRef} aria-label="Showreel" className="relative px-4 sm:px-6">
        <div className="mx-auto aspect-video max-w-7xl overflow-hidden rounded-[28px] bg-[#0b0c22] shadow-[var(--shadow)]">
          <Showreel />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="Showreel" className="relative h-[300vh] lg:h-[360vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Light behind the glass */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_50%,var(--glow-a),transparent_70%)]"
        />

        <motion.p
          style={{ opacity: introOpacity }}
          className="display pointer-events-none absolute inset-x-0 top-[12svh] z-10 text-center text-[clamp(1.75rem,4vw,3.5rem)] leading-none [--wdth:125] [--wght:800]"
        >
          Every product starts in pieces.
        </motion.p>

        {/* Poster until the first 3D frame is drawn */}
        <div
          aria-hidden
          className={`absolute inset-0 grid place-items-center transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/showreel-poster.jpg" alt="" className="w-[78%] max-w-5xl rounded-[20px] opacity-30 blur-sm" />
        </div>

        <div ref={canvasHost} className="absolute inset-0" />

        <video
          ref={videoRef}
          src="/media/showreel.mp4"
          muted
          loop
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration) setReelIndex(Math.min(Math.floor((v.currentTime / v.duration) * featured.length), featured.length - 1));
          }}
          className="pointer-events-none absolute h-px w-px opacity-0"
          aria-label="Showreel of Dovli, CrestClip, Rent Rush, Klaude, VizPilot and Sahayak"
        />

        <motion.p
          style={{ opacity: captionOpacity, y: captionY }}
          className="display pointer-events-none absolute inset-x-0 top-20 z-10 px-4 text-center text-[clamp(1.25rem,2.4vw,2rem)] leading-tight [--wdth:120] [--wght:750] lg:top-[88px]"
        >
          Six products, designed, built and shipped.
        </motion.p>
        <motion.div
          style={{ opacity: captionOpacity, pointerEvents: controlsEvents }}
          className="absolute inset-x-4 bottom-[4svh] z-10 flex items-center justify-center gap-4 sm:inset-x-6 lg:inset-x-12"
        >
          {/* Shows which product is on screen; click to jump to one that was missed */}
          <div className="glass flex flex-wrap items-center justify-center gap-1 rounded-[22px] p-1">
            {featured.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                aria-current={reelIndex === i || undefined}
                onClick={() => {
                  const v = videoRef.current;
                  if (v?.duration) v.currentTime = (i / featured.length) * v.duration + 0.01;
                }}
                className={`h-9 rounded-full px-3 text-xs font-medium transition-colors sm:text-sm ${
                  reelIndex === i ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setUserPaused(playing)}
            aria-label={playing ? "Pause showreel" : "Play showreel"}
            className="glass grid size-12 shrink-0 place-items-center rounded-full transition hover:border-line-strong active:scale-95"
          >
            {playing ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

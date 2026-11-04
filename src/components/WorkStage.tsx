"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { featured, type Project } from "@/content/site";
import { ProjectLinks } from "./ProjectLinks";
import { damp, rand, triangulate } from "./shards";

/*
  Selected work as one pinned browser window. Scrolling breaks the current
  product's screen into the same glass as the showreel and assembles the next
  one in its place. At rest the frame shows the crisp <Image>; the canvas only
  draws during a change. Without WebGL the screens simply crossfade.
*/

const STEP_SVH = 120; // scroll distance per project
const TAIL = 0.35; // extra hold on the last project, in steps
const HOLD = 0.3; // share of a step spent still before the change starts
const MORPH = 0.6; // share of a step the change takes
const MAX_LAG = 0.5; // the stage may trail the scrollbar by at most half a step

const n = featured.length;
const W = 16;
const H = 9;

const vertexShader = /* glsl */ `
  uniform float uU;
  uniform float uIncoming;
  attribute vec3 aCentroid;
  attribute vec3 aOffset;
  attribute vec4 aRot;
  attribute float aDelay;
  attribute vec3 aBary;
  varying vec2 vUv;
  varying vec3 vBary;
  varying float vFlying;
  varying float vFacing;
  varying float vAlpha;

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
    float local, scatter;
    if (uIncoming > 0.5) {
      // Lands from the right, left side first, finishing exactly at uU = 1.
      local = clamp((uU - 0.3 - aDelay * 0.25) / 0.45, 0.0, 1.0);
      scatter = pow(1.0 - local, 3.0);
      vAlpha = smoothstep(0.0, 0.3, local);
    } else {
      // Peels away to the left, starting exactly at uU = 0.
      local = clamp((uU - aDelay * 0.3) / 0.5, 0.0, 1.0);
      scatter = local * local * local;
      vAlpha = 1.0 - smoothstep(0.55, 1.0, local);
    }

    mat3 R = rotation(aRot.xyz, aRot.w * scatter);
    vec3 dir = vec3(aOffset.x * (uIncoming > 0.5 ? 1.0 : -1.0), aOffset.y, aOffset.z);
    vec3 pos = aCentroid + dir * scatter + R * (position * mix(1.0, 0.86, scatter));

    vUv = uv;
    vBary = aBary;
    vFlying = scatter;
    vFacing = abs((R * vec3(0.0, 0.0, 1.0)).z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec4 uCrop;
  uniform vec3 uRimA;
  uniform vec3 uRimB;
  varying vec2 vUv;
  varying vec3 vBary;
  varying float vFlying;
  varying float vFacing;
  varying float vAlpha;

  void main() {
    vec3 col = texture2D(uMap, uCrop.xy + vUv * uCrop.zw).rgb;
    float edge = min(min(vBary.x, vBary.y), vBary.z);
    float rim = 1.0 - smoothstep(0.0, 0.04, edge);
    vec3 iri = mix(uRimA, uRimB, 0.5 + 0.5 * sin(vUv.x * 6.0 + vUv.y * 4.0));
    float flying = smoothstep(0.0, 0.15, vFlying);

    // At rest a shard is the plain image, so the swap to and from <Image> doesn't show.
    col *= mix(1.0, mix(0.45, 1.0, vFacing), flying);
    col += iri * rim * 0.9 * flying;
    gl_FragColor = vec4(col, vAlpha);
  }
`;

type Three = typeof import("three");

function buildGeometry(THREE: Three) {
  const r = rand(20261104);
  const tris = triangulate(12, 7, W, H, r);
  const count = tris.length * 3;
  const position = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const centroid = new Float32Array(count * 3);
  const offset = new Float32Array(count * 3);
  const rot = new Float32Array(count * 4);
  const delay = new Float32Array(count);
  const bary = new Float32Array(count * 3);

  tris.forEach((t, k) => {
    const cx = (t[0][0] + t[1][0] + t[2][0]) / 3;
    const cy = (t[0][1] + t[1][1] + t[2][1]) / 3;
    const u = (cx + W / 2) / W;
    const ox = W * (0.9 + r() * 1.1);
    const oy = (r() - 0.5) * H * 1.6;
    const oz = -4 + r() * 12;
    const ax = r() - 0.5, ay = r() - 0.5, az = r() - 0.5;
    const angle = (r() > 0.5 ? 1 : -1) * (1.5 + r() * 4);
    const d = u * 0.8 + r() * 0.2;

    for (let v = 0; v < 3; v++) {
      const idx = k * 3 + v;
      const [x, y] = t[v];
      position.set([x - cx, y - cy, 0], idx * 3);
      uv.set([(x + W / 2) / W, (y + H / 2) / H], idx * 2);
      centroid.set([cx, cy, 0], idx * 3);
      offset.set([ox, oy, oz], idx * 3);
      rot.set([ax, ay, az, angle], idx * 4);
      delay[idx] = d;
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
  g.setAttribute("aBary", new THREE.BufferAttribute(bary, 3));
  return g;
}

// Draws one moment of a change. Returns false until both screens' textures are in.
type Draw = (from: number, to: number, u: number) => boolean;

function Panel({
  p,
  k,
  at,
  onFocusLink,
}: {
  p: Project;
  k: number;
  at: MotionValue<number>;
  onFocusLink: (k: number) => void;
}) {
  // The old text is gone before the new one starts, so they never overlap.
  const opacity = useTransform(at, [k - 0.45, k - 0.15, k + 0.15, k + 0.45], [0, 1, 1, 0]);
  const y = useTransform(at, [k - 0.55, k, k + 0.55], [36, 0, -36]);
  const pointerEvents = useTransform(at, (v) => (Math.abs(v - k) < 0.5 ? "auto" : "none"));

  return (
    <motion.article
      style={{ opacity, y, pointerEvents }}
      // Every panel stays in the tab order; reaching one by keyboard scrolls it into view.
      onFocusCapture={(e) => {
        if (e.target.matches(":focus-visible")) onFocusLink(k);
      }}
      className="absolute inset-0 flex flex-col"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="size-2.5 rounded-full shadow-[0_0_12px_var(--tint)]"
          style={{ backgroundColor: p.tint, "--tint": p.tint } as React.CSSProperties}
        />
        <p className="text-[15px] text-muted">{p.kind}</p>
      </div>
      <h3 className="display mt-4 text-[clamp(2.5rem,4.6vw,4.25rem)] leading-[0.9] [--wdth:108] [--wght:800]">{p.name}</h3>
      <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-muted">{p.summary}</p>
      <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted">
        <span className="text-ink">Built with</span> {p.stack.join(", ")}
      </p>
      <div className="mt-auto pt-4">
        <ProjectLinks p={p} />
      </div>
    </motion.article>
  );
}

function Tint({ p, k, at }: { p: Project; k: number; at: MotionValue<number> }) {
  const opacity = useTransform(at, [k - 1, k, k + 1], [0, 1, 0]);
  return (
    <motion.div
      aria-hidden
      style={{ opacity, "--tint": p.tint } as React.ComponentProps<typeof motion.div>["style"]}
      className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,color-mix(in_srgb,var(--tint)_55%,transparent),transparent_70%)]"
    />
  );
}

function Tick({ k, at, tint }: { k: number; at: MotionValue<number>; tint: string }) {
  const scaleX = useTransform(at, [k - 1, k], [0, 1]);
  return (
    <span aria-hidden className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line">
      <motion.span style={{ scaleX, backgroundColor: tint }} className="absolute inset-0 origin-left rounded-full" />
    </span>
  );
}

export function WorkStage() {
  const stage = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLDivElement | null)[]>([]);
  const draw = useRef<Draw | null>(null);
  const smooth = useRef<number | null>(null);
  const last = useRef("");

  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end end"] });
  // Whole numbers are projects at rest; 2.5 is halfway from the third to the fourth.
  const at = useMotionValue(0);
  useMotionValueEvent(at, "change", (v) => setActive(Math.round(v)));

  useAnimationFrame((_, delta) => {
    const target = Math.min(scrollYProgress.get() * (n - 1 + TAIL), n - 1);
    const dt = Math.min(delta / 1000, 0.1);
    let pos = smooth.current === null ? target : damp(smooth.current, target, 9, dt);
    pos = Math.min(Math.max(pos, target - MAX_LAG), target + MAX_LAG);
    smooth.current = pos;

    const from = Math.min(Math.floor(pos), n - 1);
    const to = Math.min(from + 1, n - 1);
    const u = Math.min(Math.max((pos - from - HOLD) / MORPH, 0), 1);
    const key = `${from}:${u.toFixed(4)}`;
    if (key === last.current) return;
    last.current = key;
    at.set(from + u);

    const live = u > 0 && u < 1 && (draw.current?.(from, to, u) ?? false);
    if (!live && draw.current) draw.current(0, 0, -1);
    images.current.forEach((el, k) => {
      if (!el) return;
      const o = live ? 0 : from === to ? +(k === from) : k === from ? 1 - u : k === to ? u : 0;
      el.style.opacity = String(o);
    });
  });

  useEffect(() => {
    const hostEl = host.current;
    const screenEl = screen.current;
    const stageEl = stage.current;
    if (!hostEl || !screenEl || !stageEl) return;

    let disposed = false;
    let cleanup = () => {};

    // Three.js and the textures load only when the stage is about to be seen.
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const THREE = await import("three");
        if (disposed) return;

        let renderer: import("three").WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        } catch {
          return; // No WebGL: the screens keep crossfading.
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        const canvas = renderer.domElement;
        canvas.style.cssText = "width:100%;height:100%;display:block;visibility:hidden";
        hostEl.appendChild(canvas);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 1, 20000);
        const group = new THREE.Group();
        scene.add(group);

        const css = getComputedStyle(document.documentElement);
        const rgb = (name: string, fallback: string) => {
          const hex = (css.getPropertyValue(name).trim() || fallback).replace("#", "");
          const v = parseInt(hex.length === 3 ? hex.replace(/./g, "$&$&") : hex, 16);
          return new THREE.Vector3(((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255);
        };
        const rimA = rgb("--accent", "#8b7dff");
        const rimB = rgb("--accent-2", "#3dd8ff");

        const geometry = buildGeometry(THREE);
        const makeMesh = (incoming: number) => {
          const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            depthWrite: false,
            uniforms: {
              uMap: { value: null },
              uCrop: { value: new THREE.Vector4(0, 0, 1, 1) },
              uU: { value: 0 },
              uIncoming: { value: incoming },
              uRimA: { value: rimA },
              uRimB: { value: rimB },
            },
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.frustumCulled = false;
          mesh.renderOrder = incoming ? 1 : 2; // Leaving glass passes over what's arriving.
          group.add(mesh);
          return { mesh, material };
        };
        const incoming = makeMesh(1);
        const outgoing = makeMesh(0);

        // Same crop as the <Image>: cover the 16:9 screen, anchored to the top.
        const textures: { tex: import("three").Texture; crop: [number, number, number, number] }[] = [];
        const loader = new THREE.TextureLoader();
        featured.forEach((p, k) => {
          loader.load(p.image, (tex) => {
            if (disposed) return tex.dispose();
            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            const img = tex.image as { width: number; height: number };
            const ar = img.width / img.height;
            const sw = Math.min((W / H) / ar, 1);
            const sh = Math.min(ar / (W / H), 1);
            textures[k] = { tex, crop: [(1 - sw) / 2, 1 - sh, sw, sh] };
          });
        });

        // One world unit is one CSS pixel at z = 0, so the glass lines up with the frame exactly.
        function layout() {
          const hr = hostEl!.getBoundingClientRect();
          const sr = screenEl!.getBoundingClientRect();
          renderer.setSize(hr.width, hr.height, false);
          camera.aspect = hr.width / hr.height;
          camera.position.z = hr.height / (2 * Math.tan((camera.fov * Math.PI) / 360));
          camera.updateProjectionMatrix();
          group.position.set(sr.left + sr.width / 2 - hr.left - hr.width / 2, hr.height / 2 - (sr.top + sr.height / 2 - hr.top), 0);
          group.scale.setScalar(sr.width / W);
        }
        layout();
        const ro = new ResizeObserver(layout);
        ro.observe(hostEl);
        ro.observe(screenEl);

        let shown = false;
        draw.current = (from, to, u) => {
          if (u < 0) {
            if (shown) canvas.style.visibility = "hidden";
            shown = false;
            return false;
          }
          const a = textures[from];
          const b = textures[to];
          if (!a || !b) return false;
          outgoing.material.uniforms.uMap.value = a.tex;
          outgoing.material.uniforms.uCrop.value.set(...a.crop);
          outgoing.material.uniforms.uU.value = u;
          incoming.material.uniforms.uMap.value = b.tex;
          incoming.material.uniforms.uCrop.value.set(...b.crop);
          incoming.material.uniforms.uU.value = u;
          if (!shown) layout();
          renderer.render(scene, camera);
          if (!shown) canvas.style.visibility = "visible";
          shown = true;
          return true;
        };

        cleanup = () => {
          draw.current = null;
          ro.disconnect();
          geometry.dispose();
          outgoing.material.dispose();
          incoming.material.dispose();
          textures.forEach((t) => t?.tex.dispose());
          renderer.dispose();
          canvas.remove();
        };
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(stageEl);

    return () => {
      disposed = true;
      io.disconnect();
      cleanup();
    };
  }, []);

  function focusProject(k: number) {
    const el = stage.current;
    if (!el) return;
    const distance = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + (k / (n - 1 + TAIL)) * distance;
    window.scrollTo({ top, behavior: "instant" });
  }

  const current = featured[active];
  const hostName = (current.live ?? current.code ?? "").replace(/^https?:\/\//, "").split("/")[0];

  return (
    <div ref={stage} style={{ height: `${100 + (n - 1 + TAIL) * STEP_SVH}svh` }} className="relative mt-4">
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="mx-auto w-full max-w-7xl px-12">
          <div className="spot relative grid h-[min(660px,calc(100svh-150px))] grid-cols-12 gap-4 overflow-hidden rounded-[28px] border border-line bg-surface p-3 shadow-[var(--shadow)]">
            <div className="col-span-5 flex flex-col px-8 py-8">
              <div className="flex items-center gap-3">
                <p aria-hidden className="text-sm tabular-nums text-muted">
                  {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </p>
                <div className="flex flex-1 gap-1.5">
                  {featured.map((p, k) => (
                    <Tick key={p.slug} k={k} at={at} tint={p.tint} />
                  ))}
                </div>
              </div>
              <div className="relative mt-6 flex-1">
                {featured.map((p, k) => (
                  <Panel key={p.slug} p={p} k={k} at={at} onFocusLink={focusProject} />
                ))}
              </div>
            </div>

            <a
              href={current.live ?? current.code}
              target="_blank"
              rel="noreferrer"
              tabIndex={-1}
              aria-hidden
              data-cursor={current.live ? "Visit" : "Code"}
              className="relative col-span-7 grid h-full place-items-center overflow-hidden rounded-[22px] border border-line bg-surface-2 p-[6%]"
            >
              {featured.map((p, k) => (
                <Tint key={p.slug} p={p} k={k} at={at} />
              ))}
              <div
                aria-hidden
                className="blueprint absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]"
              />
              <div className="relative w-full overflow-hidden rounded-b-[4px] rounded-t-[14px] bg-[#0c0d20] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.65),0_0_0_1px_rgb(255_255_255/0.08)]">
                <div className="flex h-8 items-center gap-3 border-b border-white/[0.06] bg-[#13142b] px-3">
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="mx-auto truncate rounded-md bg-white/[0.06] px-3 py-0.5 text-[11px] text-white/60">{hostName}</span>
                  <span className="w-[42px]" />
                </div>
                <div ref={screen} className="relative aspect-video">
                  {featured.map((p, k) => (
                    <div
                      key={p.slug}
                      ref={(el) => {
                        images.current[k] = el;
                      }}
                      style={{ opacity: k === 0 ? 1 : 0 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={p.image}
                        alt={p.imageAlt}
                        fill
                        quality={90}
                        sizes="(min-width: 1280px) 640px, 50vw"
                        className="object-cover object-top"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </div>
        </div>
        {/* Glass flies over the whole screen, not just the frame */}
        <div ref={host} aria-hidden className="pointer-events-none absolute inset-0 z-10" />
      </div>
    </div>
  );
}

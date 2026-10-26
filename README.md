# Mayank Jha, portfolio

Next.js 16 (App Router, static) + Tailwind v4 + Motion. The hero showreel is a HyperFrames composition in `showreel/`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Edit content

Everything visible (projects, open-source PRs, experience, toolkit) lives in `src/content/site.ts`.
Project screenshots are in `public/work/`.

## Showreel

`showreel/` is a HyperFrames project: `index.html` mounts one scene per project from `compositions/`.

```bash
cd showreel
npx hyperframes preview          # edit in the Studio preview
npx hyperframes check
npx hyperframes render -o renders/showreel.mp4 -q delivery
```

Then re-encode the render for the site:

```bash
ffmpeg -y -i showreel/renders/showreel.mp4 -c copy -movflags +faststart -an public/media/showreel.mp4
ffmpeg -y -ss 1.5 -i showreel/renders/showreel.mp4 -frames:v 1 -q:v 2 public/media/showreel-poster.jpg
```

## Design notes

The concept is a design-tool canvas: the hero headline sits in a live selection frame with rulers and pointer guides.

- Dark is the default theme (light is one click away and remembered). Film grain on top hides colour banding.
- A short intro counter plays once per browser session (`Intro.tsx`, pure CSS).
- Cards light up along their edge under the cursor (`.spot` in `globals.css` + `SpotlightTracker.tsx`).
- Project screenshots use the lossless PNGs in `public/work/hd/`, served as AVIF at quality 90. The site reel is the full 1920px HyperFrames render.
- Display type is **Anybody** (variable width 50-150). Hero letters stretch, gain weight and pick up the accent near the pointer (`src/components/KineticTitle.tsx`).
- Fonts live in `src/app/fonts/` and load with `next/font/local`, so builds don't need Google Fonts.
- Scroll motion: the showreel grows to full screen (`Reel.tsx`), project panels stack (`Work.tsx`), About text lights up word by word (`ScrollWords.tsx`), the footer name stretches (`StretchName.tsx`).
- Smooth scrolling is Lenis (`SmoothScroll.tsx`), off on touch screens and for reduced motion.
- Every animation is off when the visitor's system asks for reduced motion.
- Project colours (`tint`) and one-line descriptions (`kind`) are in `src/content/site.ts`.
- The previous design is saved in `_previous-design-backup.tgz`.

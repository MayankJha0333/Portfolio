// Pure CSS intro (see .intro in globals.css). Hidden unless the boot script marks a first visit.
export function Intro() {
  return (
    <div
      aria-hidden
      className="intro fixed inset-0 z-[90] flex-col justify-between bg-[#07081a] px-6 py-8 text-[#f3f3ff] sm:px-12 sm:py-12"
    >
      <p className="display text-xl [--wdth:118] [--wght:800]">Mayank Jha</p>
      <div>
        <p className="display intro-count text-[clamp(5rem,18vw,14rem)] leading-[0.8] tabular-nums [--wdth:150] [--wght:900]" />
        <div className="mt-6 h-px w-full bg-white/10">
          <div className="intro-bar h-px origin-left bg-[linear-gradient(90deg,#8577ff,#38d6ff)]" />
        </div>
        <p className="mt-4 text-sm text-[#9b9ec8]">Designing, building and shipping products</p>
      </div>
    </div>
  );
}

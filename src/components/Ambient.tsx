// Page-wide living background: three slow colour fields behind every section.
// Only transforms animate, so it stays cheap; reduced motion freezes it.
export function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-a absolute -left-[20%] top-[-30%] h-[90vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,var(--glow-a),transparent)]" />
      <div className="aurora-b absolute -right-[20%] top-[20%] h-[80vh] w-[60vw] rounded-full bg-[radial-gradient(closest-side,var(--glow-b),transparent)]" />
      <div className="aurora-c absolute bottom-[-35%] left-[15%] h-[85vh] w-[65vw] rounded-full bg-[radial-gradient(closest-side,var(--glow-c),transparent)]" />
      {/* Darken the edges a touch so content in the middle reads first */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,var(--bg)_100%)] opacity-70" />
    </div>
  );
}

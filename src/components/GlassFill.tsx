// Six triangles that tile the button exactly. Each flies in from its own offset and locks into place.
const SHARDS: { clip: string; x: number; y: number; r: number }[] = [
  { clip: "0 0, 38% 0, 0 100%", x: 50, y: -18, r: -35 },
  { clip: "38% 0, 30% 100%, 0 100%", x: 70, y: 20, r: 30 },
  { clip: "38% 0, 72% 0, 30% 100%", x: 60, y: -22, r: 25 },
  { clip: "72% 0, 64% 100%, 30% 100%", x: 80, y: 18, r: -30 },
  { clip: "72% 0, 100% 0, 64% 100%", x: 55, y: -16, r: -25 },
  { clip: "100% 0, 100% 100%, 64% 100%", x: 70, y: 16, r: 35 },
];

// The Glass lock hover. Goes inside any element with the .glass-link class (see globals.css).
export function GlassFill() {
  return (
    <span aria-hidden className="glass-fill">
      <i className="glass-solid" />
      {SHARDS.map((s, i) => (
        <i
          key={s.clip}
          className="glass-shard"
          style={
            {
              "--i": i,
              "--x": `${s.x}px`,
              "--y": `${s.y}px`,
              "--r": `${s.r}deg`,
              clipPath: `polygon(${s.clip})`,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}

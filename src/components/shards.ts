// Shared by the showreel and the Selected Work stage: one way of cutting a rectangle into glass.

export type Tri = [number, number][];

export function rand(seed: number) {
  // Small deterministic PRNG so the shatter pattern is the same on every visit.
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Jittered grid points keep the triangles irregular but still tiling perfectly.
export function triangulate(cols: number, rows: number, w: number, h: number, r: () => number): Tri[] {
  const pts: [number, number][] = [];
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      const edgeX = i === 0 || i === cols;
      const edgeY = j === 0 || j === rows;
      const jx = edgeX ? 0 : (r() - 0.5) * 0.7;
      const jy = edgeY ? 0 : (r() - 0.5) * 0.7;
      pts.push([((i + jx) / cols) * w - w / 2, ((j + jy) / rows) * h - h / 2]);
    }
  }
  const at = (i: number, j: number) => pts[j * (cols + 1) + i];

  const tris: Tri[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
      if (r() > 0.5) tris.push([a, b, c], [a, c, d]);
      else tris.push([a, b, d], [b, c, d]);
    }
  }
  return tris;
}

// Moves `from` toward `to` at the same speed whatever the frame rate.
export function damp(from: number, to: number, rate: number, dt: number) {
  return to + (from - to) * Math.exp(-rate * dt);
}

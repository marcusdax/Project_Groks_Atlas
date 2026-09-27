/**
 * Roof measurement engine.
 *
 * A building footprint (lng/lat ring) is projected into a local plane in feet,
 * then run through a straight skeleton (CGAL via the `straight-skeleton` Wasm
 * build). The skeleton of a polygon is exactly the plan view of a hip roof
 * with one uniform pitch: every skeleton vertex carries its offset distance
 * ("time"), so its height is `time * rise / 12`.
 *
 * Gable ends are produced by collapsing an edge's hip face into a vertical
 * wall: the interior vertices of that face are projected onto the eave line,
 * which turns the two hips bounding it into rakes.
 *
 * Pure module — the skeleton builder is injected so this runs in Node tests
 * and in the browser alike.
 */
import type { LngLat } from "./types.ts";

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type EdgeKind = "eave" | "rake" | "ridge" | "hip" | "valley";

export type Skeleton = { vertices: Vec3[]; polygons: number[][] };
export type SkeletonBuilder = (rings: number[][][]) => Skeleton | null;

export interface RoofInput {
  /** Footprint ring, open (first vertex not repeated), any winding. */
  footprint: LngLat[];
  /** Pitch as rise over a 12" run. */
  pitchRise: number;
  /** Indices into `footprint` of edges (i -> i+1) that end in a gable. */
  gableEdges?: number[];
}

export interface RoofFacet {
  id: string;
  label: string;
  /** Edge index of the footprint this facet drains to. */
  edge: number;
  points: Vec3[];
  planSqft: number;
  sqft: number;
  pitchRise: number;
  /** Compass bearing the facet faces (downslope), 0 = north. */
  azimuth: number;
}

export interface RoofEdge {
  kind: EdgeKind;
  a: Vec3;
  b: Vec3;
  lengthFt: number;
  /** Footprint edge index for eaves/rakes, so the UI can toggle gables. */
  footprintEdge?: number;
}

export interface RoofTotals {
  areaSqft: number;
  planSqft: number;
  squares: number;
  facets: number;
  eaveFt: number;
  rakeFt: number;
  ridgeFt: number;
  hipFt: number;
  valleyFt: number;
  perimeterFt: number;
  ridgeHeightFt: number;
  predominantPitch: number;
}

export interface RoofModel {
  origin: LngLat;
  /** Footprint in local feet, CCW. Index i matches the caller's edge i. */
  footprintFt: Vec2[];
  facets: RoofFacet[];
  /** Vertical gable walls (triangles) — rendered, not counted as roof. */
  gables: Vec3[][];
  edges: RoofEdge[];
  totals: RoofTotals;
  warnings: string[];
}

const FT_PER_M = 3.280839895;
const EPS = 1e-6;

/** Meters per degree at a latitude (WGS84 series; sub-cm error at building scale). */
function metersPerDegree(latDeg: number) {
  const φ = (latDeg * Math.PI) / 180;
  return {
    lat: 111132.92 - 559.82 * Math.cos(2 * φ) + 1.175 * Math.cos(4 * φ),
    lng: 111412.84 * Math.cos(φ) - 93.5 * Math.cos(3 * φ) + 0.118 * Math.cos(5 * φ),
  };
}

export function makeProjection(origin: LngLat) {
  const m = metersPerDegree(origin[1]);
  return {
    toFt([lng, lat]: LngLat): Vec2 {
      return [(lng - origin[0]) * m.lng * FT_PER_M, (lat - origin[1]) * m.lat * FT_PER_M];
    },
    toLngLat([x, y]: Vec2 | Vec3): LngLat {
      return [origin[0] + x / FT_PER_M / m.lng, origin[1] + y / FT_PER_M / m.lat];
    },
  };
}

export function pitchFactor(rise: number) {
  return Math.sqrt(1 + (rise / 12) ** 2);
}

export function pitchDegrees(rise: number) {
  return (Math.atan(rise / 12) * 180) / Math.PI;
}

export function signedArea(ring: Vec2[]) {
  let s = 0;
  for (let i = 0; i < ring.length; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

/** Newell's method: area vector of a (near-)planar 3D polygon. */
function newell(points: Vec3[]): Vec3 {
  let nx = 0;
  let ny = 0;
  let nz = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1, z1] = points[i];
    const [x2, y2, z2] = points[(i + 1) % points.length];
    nx += (y1 - y2) * (z1 + z2);
    ny += (z1 - z2) * (x1 + x2);
    nz += (x1 - x2) * (y1 + y2);
  }
  return [nx / 2, ny / 2, nz / 2];
}

const len3 = (v: Vec3) => Math.hypot(v[0], v[1], v[2]);
const dist3 = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export function centroid2(points: (Vec2 | Vec3)[]): Vec2 {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    const f = x1 * y2 - x2 * y1;
    a += f;
    cx += (x1 + x2) * f;
    cy += (y1 + y2) * f;
  }
  if (Math.abs(a) < EPS) {
    const n = points.length || 1;
    return [points.reduce((s, p) => s + p[0], 0) / n, points.reduce((s, p) => s + p[1], 0) / n];
  }
  return [cx / (3 * a), cy / (3 * a)];
}

/**
 * Drop repeated closing vertices, near-duplicates (< 0.25 ft) and collinear
 * points. Returns the kept indices so gable edge indices can be remapped.
 */
export function cleanRing(ring: Vec2[]): number[] {
  let keep = ring.map((_, i) => i);
  if (keep.length > 1) {
    const f = ring[0];
    const l = ring[keep.length - 1];
    if (Math.hypot(f[0] - l[0], f[1] - l[1]) < 0.25) keep.pop();
  }
  let changed = true;
  while (changed && keep.length > 3) {
    changed = false;
    for (let k = 0; k < keep.length; k += 1) {
      const p = ring[keep[(k - 1 + keep.length) % keep.length]];
      const c = ring[keep[k]];
      const n = ring[keep[(k + 1) % keep.length]];
      const dup = Math.hypot(c[0] - p[0], c[1] - p[1]) < 0.25;
      const cross = (c[0] - p[0]) * (n[1] - c[1]) - (c[1] - p[1]) * (n[0] - c[0]);
      const span = Math.hypot(n[0] - p[0], n[1] - p[1]) || 1;
      if (dup || Math.abs(cross) / span < 0.05) {
        keep = keep.filter((_, j) => j !== k);
        changed = true;
        break;
      }
    }
  }
  return keep;
}

function projectOntoLine(p: Vec3, a: Vec2, b: Vec2): Vec3 {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1);
  return [a[0] + t * dx, a[1] + t * dy, p[2]];
}

function bearing(dx: number, dy: number) {
  return ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
}

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export function compass(deg: number) {
  return COMPASS[Math.round(deg / 45) % 8];
}

export function buildRoofModel(input: RoofInput, build: SkeletonBuilder): RoofModel {
  const warnings: string[] = [];
  const raw = input.footprint;
  if (raw.length < 3) throw new Error("A footprint needs at least three corners.");

  const origin: LngLat = [
    raw.reduce((s, p) => s + p[0], 0) / raw.length,
    raw.reduce((s, p) => s + p[1], 0) / raw.length,
  ];
  const proj = makeProjection(origin);
  const projected = raw.map((p) => proj.toFt(p));
  const kept = cleanRing(projected);
  if (kept.length < 3) throw new Error("Footprint collapses to a line.");
  if (kept.length !== projected.length) {
    warnings.push(`Dropped ${projected.length - kept.length} duplicate or collinear corner(s).`);
  }

  // Map caller edge i (raw i -> i+1) onto cleaned edges by their start vertex.
  let ring = kept.map((i) => projected[i]);
  const gableRaw = new Set(input.gableEdges ?? []);
  let gableSet = new Set(kept.flatMap((rawIdx, k) => (gableRaw.has(rawIdx) ? [k] : [])));
  // Caller edge index for each cleaned edge, used to report back for toggles.
  let edgeSource = kept.slice();

  if (signedArea(ring) < 0) {
    // Reverse to CCW. Edge k (v_k -> v_k+1) becomes edge n-2-k in the new order.
    const n = ring.length;
    ring = ring.slice().reverse();
    const remap = (k: number) => (n - 2 - k + n) % n;
    gableSet = new Set([...gableSet].map(remap));
    const src = edgeSource.slice();
    edgeSource = src.map((_, k) => src[remap(k)]);
  }
  const n = ring.length;

  const skel = build([[...ring, ring[0]].map(([x, y]) => [x, y])]);
  if (!skel) throw new Error("Could not solve a roof for this footprint (self-intersecting?).");

  const rise = input.pitchRise;
  const slope = rise / 12;
  const verts: Vec3[] = skel.vertices.map(([x, y, t]) => [x, y, t * slope]);

  // Which skeleton vertex is footprint corner k?
  const cornerOf = new Map<number, number>();
  skel.vertices.forEach(([x, y, t], vi) => {
    if (t > EPS) return;
    let best = -1;
    let bestD = Infinity;
    ring.forEach(([rx, ry], k) => {
      const d = Math.hypot(rx - x, ry - y);
      if (d < bestD) {
        bestD = d;
        best = k;
      }
    });
    if (bestD < 0.01) cornerOf.set(vi, best);
  });

  // Footprint edge each skeleton face drains to.
  const faceEdge = skel.polygons.map((poly) => {
    for (let i = 0; i < poly.length; i += 1) {
      const a = cornerOf.get(poly[i]);
      const b = cornerOf.get(poly[(i + 1) % poly.length]);
      if (a === undefined || b === undefined) continue;
      if ((a + 1) % n === b) return a;
      if ((b + 1) % n === a) return b;
    }
    return -1;
  });

  // Gables: pull the face's interior vertices onto its eave line.
  const vertical = new Set<number>();
  const moved = new Map<number, number>();
  skel.polygons.forEach((poly, fi) => {
    const e = faceEdge[fi];
    if (e < 0 || !gableSet.has(e)) return;
    vertical.add(fi);
    const a = ring[e];
    const b = ring[(e + 1) % n];
    for (const vi of poly) {
      if (cornerOf.has(vi)) continue;
      if (moved.has(vi) && moved.get(vi) !== e) {
        warnings.push("Two gables share a ridge point; gable geometry is approximate.");
      }
      verts[vi] = projectOntoLine(verts[vi], a, b);
      moved.set(vi, e);
    }
  });

  const facets: RoofFacet[] = [];
  const gables: Vec3[][] = [];
  skel.polygons.forEach((poly, fi) => {
    const pts = poly.map((vi) => verts[vi]);
    if (vertical.has(fi)) {
      gables.push(pts);
      return;
    }
    const nrm = newell(pts);
    const area = len3(nrm);
    const planArea = Math.abs(nrm[2]);
    if (planArea < 0.5) return; // sliver from a degenerate split
    const facetRise = 12 * Math.tan(Math.acos(Math.min(1, planArea / (area || 1))));
    const e = faceEdge[fi];
    // Downslope direction is the horizontal component of the upward normal.
    const up: Vec3 = nrm[2] < 0 ? [-nrm[0], -nrm[1], -nrm[2]] : nrm;
    facets.push({
      id: `f${fi}`,
      label: "",
      edge: e >= 0 ? edgeSource[e] : -1,
      points: pts,
      planSqft: planArea,
      sqft: area,
      pitchRise: Math.round(facetRise * 10) / 10,
      azimuth: bearing(up[0], up[1]),
    });
  });
  facets
    .sort((a, b) => b.sqft - a.sqft)
    .forEach((f, i) => {
      f.label = `${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ""} · ${compass(f.azimuth)}`;
    });

  // Classify every edge once.
  type Seen = { a: number; b: number; faces: number[] };
  const seen = new Map<string, Seen>();
  skel.polygons.forEach((poly, fi) => {
    for (let i = 0; i < poly.length; i += 1) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      if (dist3(verts[a], verts[b]) < 0.05) continue;
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      const hit = seen.get(key) ?? { a, b, faces: [] };
      hit.faces.push(fi);
      seen.set(key, hit);
    }
  });

  const edges: RoofEdge[] = [];
  for (const { a, b, faces } of seen.values()) {
    const va = verts[a];
    const vb = verts[b];
    const length = dist3(va, vb);
    const ca = cornerOf.get(a);
    const cb = cornerOf.get(b);
    const onFootprint =
      ca !== undefined && cb !== undefined && ((ca + 1) % n === cb || (cb + 1) % n === ca);
    const vf = faces.filter((f) => vertical.has(f));
    const rf = faces.filter((f) => !vertical.has(f));

    if (onFootprint) {
      const e = (ca! + 1) % n === cb ? ca! : cb!;
      if (vf.length) continue; // bottom of a gable wall
      edges.push({ kind: "eave", a: va, b: vb, lengthFt: length, footprintEdge: edgeSource[e] });
      continue;
    }
    if (vf.length && rf.length) {
      const e = faceEdge[vf[0]];
      edges.push({ kind: "rake", a: va, b: vb, lengthFt: length, footprintEdge: edgeSource[e] });
      continue;
    }
    if (rf.length < 2) continue; // gable-internal line or degenerate
    if (Math.abs(va[2] - vb[2]) < 0.05 && va[2] > EPS) {
      edges.push({ kind: "ridge", a: va, b: vb, lengthFt: length });
      continue;
    }
    // Convex fold (hip) if face B sits below face A's plane.
    const pa = skel.polygons[rf[0]].map((vi) => verts[vi]);
    const pb = skel.polygons[rf[1]].map((vi) => verts[vi]);
    const nA = newell(pa);
    const up: Vec3 = nA[2] < 0 ? [-nA[0], -nA[1], -nA[2]] : nA;
    const other = pb.find((p) => dist3(p, va) > 0.05 && dist3(p, vb) > 0.05);
    let kind: EdgeKind = "hip";
    if (other) {
      const d =
        up[0] * (other[0] - va[0]) + up[1] * (other[1] - va[1]) + up[2] * (other[2] - va[2]);
      kind = d > 0.01 ? "valley" : "hip";
    }
    edges.push({ kind, a: va, b: vb, lengthFt: length });
  }

  const sum = (k: EdgeKind) =>
    edges.filter((e) => e.kind === k).reduce((s, e) => s + e.lengthFt, 0);
  const areaSqft = facets.reduce((s, f) => s + f.sqft, 0);
  const planSqft = facets.reduce((s, f) => s + f.planSqft, 0);
  const pitchArea = new Map<number, number>();
  for (const f of facets) {
    const r = Math.round(f.pitchRise);
    pitchArea.set(r, (pitchArea.get(r) ?? 0) + f.sqft);
  }
  const predominantPitch =
    [...pitchArea.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? Math.round(rise);

  let perimeterFt = 0;
  for (let i = 0; i < n; i += 1) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % n];
    perimeterFt += Math.hypot(x2 - x1, y2 - y1);
  }

  if (Math.abs(planSqft - Math.abs(signedArea(ring))) > Math.max(5, 0.01 * planSqft)) {
    warnings.push("Roof facets do not tile the footprint exactly; check the outline.");
  }

  // Report the footprint in caller order so edge indices line up in the UI.
  const footprintFt = raw.map((p) => proj.toFt(p));

  return {
    origin,
    footprintFt,
    facets,
    gables,
    edges,
    totals: {
      areaSqft,
      planSqft,
      squares: areaSqft / 100,
      facets: facets.length,
      eaveFt: sum("eave"),
      rakeFt: sum("rake"),
      ridgeFt: sum("ridge"),
      hipFt: sum("hip"),
      valleyFt: sum("valley"),
      perimeterFt,
      ridgeHeightFt: verts.reduce((m, v) => Math.max(m, v[2]), 0),
      predominantPitch,
    },
    warnings,
  };
}

/**
 * Waste heuristic in the spirit of the published aerial-report waste tables:
 * more facets and more cut lines (hips + valleys) per square mean more
 * trimmed shingles, with diminishing returns on facet count.
 * Gable rectangle ≈ 7%, plain hip ≈ 11%, heavily cut-up ≈ 18–20%.
 */
export function suggestedWastePct(totals: RoofTotals) {
  const squares = Math.max(totals.squares, 1);
  const cutsPerSquare = (totals.hipFt + totals.valleyFt) / squares;
  const raw = 4 + 2.5 * Math.log2(Math.max(totals.facets, 1)) + 0.6 * cutsPerSquare;
  return Math.min(25, Math.max(5, Math.round(raw)));
}

export const WASTE_STEPS = [0, 5, 10, 12, 15, 17, 20, 22, 25];

/** Squares at a waste %, rounded up to the next ⅓ square (a bundle). */
export function squaresWithWaste(areaSqft: number, wastePct: number) {
  const sq = (areaSqft * (1 + wastePct / 100)) / 100;
  return Math.ceil(sq * 3 - 1e-9) / 3;
}

/** Lng/lat GeoJSON for the map overlay. */
export function roofToGeoJSON(model: RoofModel) {
  const proj = makeProjection(model.origin);
  const close = (pts: LngLat[]) => [...pts, pts[0]];
  return {
    facets: {
      type: "FeatureCollection" as const,
      features: model.facets.map((f) => ({
        type: "Feature" as const,
        id: f.id,
        properties: { id: f.id, label: f.label, sqft: Math.round(f.sqft) },
        geometry: {
          type: "Polygon" as const,
          coordinates: [close(f.points.map((p) => proj.toLngLat(p)))],
        },
      })),
    },
    edges: {
      type: "FeatureCollection" as const,
      features: model.edges.map((e, i) => ({
        type: "Feature" as const,
        id: i,
        properties: { kind: e.kind, length: Math.round(e.lengthFt) },
        geometry: {
          type: "LineString" as const,
          coordinates: [proj.toLngLat(e.a), proj.toLngLat(e.b)],
        },
      })),
    },
  };
}

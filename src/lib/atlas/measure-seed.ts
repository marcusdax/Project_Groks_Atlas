import { makeProjection, pitchFactor, type Vec2 } from "./roof-geometry.ts";
import type { MeasurementInput, PropertyRecord } from "./types.ts";

export function parsePitch(pitch: string) {
  const rise = Number.parseFloat(pitch.split(":")[0] ?? "");
  return Number.isFinite(rise) && rise > 0 ? rise : 6;
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Placeholder outline for a parcel that has not been traced yet: a main block
 * plus a garage wing, sized so the sloped area matches the record's roof sqft.
 * Replaced by an OpenStreetMap trace or a hand-drawn outline in Measure.
 */
export function seedMeasurement(p: PropertyRecord): MeasurementInput {
  const rise = parsePitch(p.pitch);
  const plan = p.sqft / pitchFactor(rise);
  const h = hash(p.id);
  const wingShare = 0.22;
  const depth = Math.sqrt((plan * (1 - wingShare)) / 1.6);
  const width = 1.6 * depth;
  const wing = Math.sqrt(plan * wingShare);
  const local: Vec2[] = [
    [0, 0],
    [width - wing, 0],
    [width - wing, -wing],
    [width, -wing],
    [width, depth],
    [0, depth],
  ];
  const angle = (((h % 40) - 20) * Math.PI) / 180;
  const cx = width / 2;
  const cy = depth / 2 - wing / 2;
  const proj = makeProjection([p.lng, p.lat]);
  const footprint = local.map(([x, y]) => {
    const dx = x - cx;
    const dy = y - cy;
    return proj.toLngLat([
      dx * Math.cos(angle) - dy * Math.sin(angle),
      dx * Math.sin(angle) + dy * Math.cos(angle),
    ]);
  });
  return {
    footprint,
    pitchRise: rise,
    // Every third house gets gables on the main block's end and the wing's end.
    gableEdges: h % 3 === 0 ? [2, 5] : [],
    stories: p.stories,
    layers: 1,
    source: "seed",
    updatedAt: "2026-09-25T09:14:00-05:00",
  };
}

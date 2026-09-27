/**
 * Building outlines from OpenStreetMap via the public Overpass API — free, no
 * key, CORS-enabled. Coverage is best in metros; misses fall back to drawing.
 */
import type { LngLat } from "./types.ts";

const OVERPASS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

type OverpassWay = {
  type: "way";
  id: number;
  tags?: Record<string, string>;
  geometry?: { lat: number; lon: number }[];
};

export type BuildingHit = { osmId: number; footprint: LngLat[]; containsPoint: boolean };

export function pointInRing([x, y]: LngLat, ring: LngLat[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Pick the building under the pin, else the nearest outline. */
export function pickBuilding(elements: unknown[], at: LngLat): BuildingHit | null {
  const cosLat = Math.cos((at[1] * Math.PI) / 180);
  let best: (BuildingHit & { d: number }) | null = null;
  for (const el of elements as OverpassWay[]) {
    if (el?.type !== "way" || !el.geometry || el.geometry.length < 4) continue;
    let ring: LngLat[] = el.geometry.map((g) => [g.lon, g.lat]);
    const [f, l] = [ring[0], ring[ring.length - 1]];
    if (f[0] === l[0] && f[1] === l[1]) ring = ring.slice(0, -1);
    if (ring.length < 3) continue;
    const inside = pointInRing(at, ring);
    const c = ring.reduce((s, p) => [s[0] + p[0] / ring.length, s[1] + p[1] / ring.length], [0, 0]);
    const d = inside ? -1 : Math.hypot((c[0] - at[0]) * cosLat, c[1] - at[1]);
    if (!best || d < best.d) best = { osmId: el.id, footprint: ring, containsPoint: inside, d };
  }
  if (!best) return null;
  const { d: _d, ...hit } = best;
  return hit;
}

export async function fetchOsmBuilding(
  at: LngLat,
  signal?: AbortSignal,
): Promise<BuildingHit | null> {
  const [lng, lat] = at;
  const query = `[out:json][timeout:15];way(around:45,${lat.toFixed(6)},${lng.toFixed(6)})["building"];out geom;`;
  let lastError: unknown;
  for (const url of OVERPASS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: new URLSearchParams({ data: query }),
        signal: signal ?? AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      const json = (await res.json()) as { elements?: unknown[] };
      return pickBuilding(json.elements ?? [], at);
    } catch (err) {
      if (signal?.aborted) throw err;
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Overpass unavailable");
}

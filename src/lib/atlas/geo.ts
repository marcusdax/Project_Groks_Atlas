import type { PropertyRecord, StormEvent } from "./types";
import { dpsTone } from "./format";

export const DFW = {
  lng: -96.897,
  lat: 32.776,
  zoom: 9,
};

export const NEXRAD_SITES = [
  { id: "KFWS", name: "Fort Worth", lng: -97.303, lat: 32.573 },
] as const;

export function circleRing(
  lng: number,
  lat: number,
  radiusKm: number,
  steps = 72,
): [number, number][] {
  const latDelta = radiusKm / 110.574;
  const lngDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * Math.PI * 2;
    ring.push([lng + lngDelta * Math.cos(t), lat + latDelta * Math.sin(t)]);
  }
  return ring;
}

export function stormsToGeoJSON(storms: StormEvent[]) {
  return {
    type: "FeatureCollection" as const,
    features: storms.map((s) => ({
      type: "Feature" as const,
      id: s.id,
      properties: {
        id: s.id,
        name: s.name,
        hailIn: s.hailIn,
        windMph: s.windMph,
        severity: s.severity,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [circleRing(s.lng, s.lat, s.radiusKm)],
      },
    })),
  };
}

export function stormCoresToGeoJSON(storms: StormEvent[]) {
  return {
    type: "FeatureCollection" as const,
    features: storms.map((s) => ({
      type: "Feature" as const,
      id: `${s.id}-core`,
      properties: { id: s.id, name: s.name },
      geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] as [number, number] },
    })),
  };
}

export function propertiesToGeoJSON(properties: PropertyRecord[], focusId?: string | null) {
  return {
    type: "FeatureCollection" as const,
    features: properties.map((p) => ({
      type: "Feature" as const,
      id: p.id,
      properties: {
        id: p.id,
        address: p.address,
        city: p.city,
        dps: p.dps,
        tone: dpsTone(p.dps),
        focused: p.id === focusId,
        estRepair: p.estRepair,
        owner: p.owner,
      },
      geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] as [number, number] },
    })),
  };
}

export function sitesToGeoJSON() {
  return {
    type: "FeatureCollection" as const,
    features: NEXRAD_SITES.map((s) => ({
      type: "Feature" as const,
      id: s.id,
      properties: { id: s.id, name: s.name },
      geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] as [number, number] },
    })),
  };
}

import type { StyleSpecification } from "maplibre-gl";

// CARTO's raster basemaps now answer every keyless request with an
// "API KEY REQUIRED" tile, so the dark canvas and labels come from Esri's
// public tile services instead (same host as the imagery, no key).
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const DARK_BASE = `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`;
const DARK_LABELS = `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`;
const SAT_LABELS = `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`;

const SAT =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

export function atlasMapStyle(): StyleSpecification {
  return {
    version: 8,
    name: "atlas-ops",
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      ops: {
        type: "raster",
        tiles: [DARK_BASE],
        tileSize: 256,
        maxzoom: 16,
        attribution: "Esri · HERE · Garmin · © OpenStreetMap",
      },
      "ops-labels": {
        type: "raster",
        tiles: [DARK_LABELS],
        tileSize: 256,
        maxzoom: 16,
      },
      sat: {
        type: "raster",
        tiles: [SAT],
        tileSize: 256,
        maxzoom: 19,
        attribution: "Esri · Maxar · Earthstar",
      },
      labels: {
        type: "raster",
        tiles: [SAT_LABELS],
        tileSize: 256,
        maxzoom: 19,
        attribution: "Esri",
      },
    },
    layers: [
      { id: "ops", type: "raster", source: "ops" },
      { id: "ops-labels", type: "raster", source: "ops-labels" },
      {
        id: "sat",
        type: "raster",
        source: "sat",
        layout: { visibility: "none" },
      },
      {
        id: "labels",
        type: "raster",
        source: "labels",
        layout: { visibility: "none" },
      },
    ],
  };
}

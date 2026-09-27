import type { StyleSpecification } from "maplibre-gl";

const CARTO = [
  "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
  "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
  "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
];

const CARTO_LABELS = [
  "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
  "https://b.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png",
];

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
        tiles: CARTO,
        tileSize: 256,
        maxzoom: 20,
        attribution: "© OpenStreetMap © CARTO",
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
        tiles: CARTO_LABELS,
        tileSize: 256,
        maxzoom: 20,
        attribution: "© CARTO",
      },
    },
    layers: [
      { id: "ops", type: "raster", source: "ops" },
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

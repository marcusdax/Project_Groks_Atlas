"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoJSONSource, Map as MapLibreMap, RasterTileSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Pause, Play } from "lucide-react";
import { PROPERTIES, STORMS } from "@/lib/atlas/data";
import {
  propertiesToGeoJSON,
  sitesToGeoJSON,
  stormCoresToGeoJSON,
  stormsToGeoJSON,
} from "@/lib/atlas/geo";
import { useNwsAlerts, useRadarLoop, useStormReports } from "@/lib/atlas/live";
import { atlasMapStyle } from "@/lib/atlas/map-style";
import { formatFrameClock, type RadarProduct } from "@/lib/atlas/radar";
import { alertsToGeoJSON, reportsToGeoJSON } from "@/lib/atlas/weather";
import type { PropertyRecord, StormEvent } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

const EMPTY = { type: "FeatureCollection" as const, features: [] as never[] };

type Basemap = "ops" | "sat";

export function OpsMap({
  storms = STORMS,
  properties = PROPERTIES,
  focusId,
  onSelect,
  className,
  basemap = "ops",
  product = "n0q",
  showRadar = true,
  showAlerts = true,
  showReports = true,
  showChrome = true,
  followFocus = false,
  center,
  zoom,
  interactive = true,
}: {
  storms?: StormEvent[];
  properties?: PropertyRecord[];
  focusId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
  basemap?: Basemap;
  product?: RadarProduct;
  showRadar?: boolean;
  showAlerts?: boolean;
  showReports?: boolean;
  showChrome?: boolean;
  followFocus?: boolean;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [ready, setReady] = useState(false);

  const { frames, index, setIndex, playing, setPlaying, frame, status } = useRadarLoop(product);
  const alerts = useNwsAlerts();
  const reports = useStormReports();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;
    let map: MapLibreMap | undefined;
    let ro: ResizeObserver | undefined;

    void import("maplibre-gl").then((mod) => {
      if (cancelled || !rootRef.current) return;
      const gl = (mod as { default?: typeof import("maplibre-gl") }).default ?? mod;
      gl.setWorkerCount?.(0);
      map = new gl.Map({
        container: rootRef.current,
        style: atlasMapStyle(),
        center: center ?? [-96.897, 32.776],
        zoom: zoom ?? 9,
        attributionControl: false,
        interactive,
        fadeDuration: 0,
      });
      map.addControl(
        new gl.NavigationControl({ showCompass: false, visualizePitch: false }),
        "bottom-right",
      );
      map.addControl(new gl.AttributionControl({ compact: true }), "bottom-left");
      map.on("load", () => {
        if (!map) return;
        map.addSource("radar", {
          type: "raster",
          tiles: [
            "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          maxzoom: 12,
          attribution: "IEM · NWS NEXRAD · RainViewer",
        });
        map.addLayer({
          id: "radar",
          type: "raster",
          source: "radar",
          paint: { "raster-opacity": 0.7, "raster-fade-duration": 0 },
        });
        map.addSource("alerts", { type: "geojson", data: EMPTY });
        map.addLayer({
          id: "alerts-fill",
          type: "fill",
          source: "alerts",
          paint: {
            "fill-color": [
              "match",
              ["get", "severity"],
              "Extreme",
              "rgba(193,122,110,0.28)",
              "Severe",
              "rgba(196,181,154,0.22)",
              "rgba(142,140,134,0.14)",
            ],
            "fill-outline-color": "rgba(236,234,228,0.28)",
          },
        });
        map.addSource("storms", { type: "geojson", data: stormsToGeoJSON(storms) });
        map.addLayer({
          id: "storms-fill",
          type: "fill",
          source: "storms",
          paint: {
            "fill-color": "rgba(236,234,228,0.06)",
            "fill-outline-color": "rgba(236,234,228,0.22)",
          },
        });
        map.addSource("storm-cores", { type: "geojson", data: stormCoresToGeoJSON(storms) });
        map.addLayer({
          id: "storm-cores",
          type: "circle",
          source: "storm-cores",
          paint: {
            "circle-radius": 3,
            "circle-color": "#eceae4",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#0b0c0e",
          },
        });
        map.addSource("reports", { type: "geojson", data: EMPTY });
        map.addLayer({
          id: "reports",
          type: "circle",
          source: "reports",
          paint: {
            "circle-radius": 4,
            "circle-color": ["case", ["in", "HAIL", ["get", "type"]], "#c17a6e", "#c4b59a"],
            "circle-stroke-width": 1,
            "circle-stroke-color": "#0b0c0e",
          },
        });
        map.addSource("properties", {
          type: "geojson",
          data: propertiesToGeoJSON(properties, focusId),
        });
        map.addLayer({
          id: "properties",
          type: "circle",
          source: "properties",
          paint: {
            "circle-radius": ["case", ["boolean", ["get", "focused"], false], 8, 5],
            "circle-color": [
              "match",
              ["get", "tone"],
              "bad",
              "#c17a6e",
              "warn",
              "#c4b59a",
              "ok",
              "#8aa58a",
              "#5c5b57",
            ],
            "circle-stroke-width": ["case", ["boolean", ["get", "focused"], false], 2, 1],
            "circle-stroke-color": "#eceae4",
          },
        });
        map.addSource("sites", { type: "geojson", data: sitesToGeoJSON() });
        map.addLayer({
          id: "sites",
          type: "circle",
          source: "sites",
          paint: {
            "circle-radius": 4,
            "circle-color": "transparent",
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#d8d4cc",
          },
        });
        map.on("click", "properties", (e) => {
          const id = e.features?.[0]?.properties?.id;
          if (typeof id === "string") onSelectRef.current?.(id);
        });
        map.on("mouseenter", "properties", () => {
          map!.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "properties", () => {
          map!.getCanvas().style.cursor = "";
        });
        if (!cancelled) setReady(true);
      });
      mapRef.current = map;
      ro = new ResizeObserver(() => map?.resize());
      ro.observe(rootRef.current);
    });

    return () => {
      cancelled = true;
      setReady(false);
      ro?.disconnect();
      map?.remove();
      mapRef.current = null;
    };
    // Created once per mount. Prop sync lives in the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    setVis(map, "ops", basemap === "ops");
    setVis(map, "sat", basemap === "sat");
    setVis(map, "labels", basemap === "sat");
  }, [basemap, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !frame) return;
    const src = map.getSource("radar") as RasterTileSource | undefined;
    src?.setTiles(frame.tiles);
    map.setPaintProperty("radar", "raster-opacity", showRadar ? 0.7 : 0);
    setVis(map, "radar", showRadar);
  }, [frame, showRadar, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource("storms") as GeoJSONSource | undefined)?.setData(stormsToGeoJSON(storms));
    (map.getSource("storm-cores") as GeoJSONSource | undefined)?.setData(
      stormCoresToGeoJSON(storms),
    );
  }, [storms, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource("properties") as GeoJSONSource | undefined)?.setData(
      propertiesToGeoJSON(properties, focusId),
    );
  }, [properties, focusId, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource("alerts") as GeoJSONSource | undefined)?.setData(alertsToGeoJSON(alerts.data));
    setVis(map, "alerts-fill", showAlerts);
  }, [alerts.data, showAlerts, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map) return;
    (map.getSource("reports") as GeoJSONSource | undefined)?.setData(
      reportsToGeoJSON(reports.data),
    );
    setVis(map, "reports", showReports);
  }, [reports.data, showReports, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !center) return;
    map.easeTo({ center, zoom: zoom ?? map.getZoom(), duration: 500 });
  }, [center?.[0], center?.[1], zoom, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !followFocus || !focusId) return;
    const hit = properties.find((p) => p.id === focusId);
    if (!hit) return;
    map.easeTo({ center: [hit.lng, hit.lat], zoom: Math.max(map.getZoom(), 11), duration: 450 });
  }, [focusId, properties, followFocus, ready]);

  return (
    <div className={cn("atlas-map relative overflow-hidden rounded-lg bg-raised", className)}>
      <div ref={rootRef} className="absolute inset-0" />
      {showChrome && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3">
          <div className="pointer-events-auto rounded-md bg-background/80 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm">
            <p className="font-mono text-xs uppercase tracking-wider text-faint">
              {product === "composite" ? "RainViewer" : "IEM NEXRAD"} ·{" "}
              {status === "ready" ? "live" : status}
            </p>
            <p className="font-mono text-sm tabular-nums">
              {frame ? formatFrameClock(frame.time) : "Waiting on tiles"}
            </p>
          </div>
          <div className="pointer-events-auto flex items-center gap-2 rounded-md bg-background/80 px-2 py-1 shadow-[var(--shadow-border)] backdrop-blur-sm">
            <button
              type="button"
              className="grid size-10 place-items-center rounded-sm hover:bg-accent"
              onClick={() => setPlaying((v) => !v)}
              aria-label={playing ? "Pause radar" : "Play radar"}
            >
              {playing ? <Pause className="size-4" /> : <Play className="ml-px size-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={Math.max(0, frames.length - 1)}
              value={index}
              onChange={(e) => {
                setPlaying(false);
                setIndex(Number(e.target.value));
              }}
              className="w-28 accent-primary"
              aria-label="Radar time"
            />
          </div>
        </div>
      )}
      {showChrome && (
        <div className="pointer-events-none absolute bottom-8 left-3 z-10">
          <div className="rounded-md bg-background/80 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm">
            <p className="font-mono text-xs uppercase tracking-wider text-faint">Reflectivity</p>
            <div className="radar-scale mt-1 h-1.5 w-40 rounded-full" />
            <div className="mt-1 flex justify-between font-mono text-xs text-faint">
              <span>20</span>
              <span>hail</span>
              <span>70 dBZ</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function setVis(map: MapLibreMap, layer: string, on: boolean) {
  if (!map.getLayer(layer)) return;
  map.setLayoutProperty(layer, "visibility", on ? "visible" : "none");
}

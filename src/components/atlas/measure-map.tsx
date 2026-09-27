"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoJSONSource, Map as MapLibreMap } from "maplibre-gl";
import { OpsMap } from "@/components/atlas/ops-map";
import { roofToGeoJSON, type RoofModel } from "@/lib/atlas/roof-geometry";
import { EDGE_COLORS } from "@/lib/atlas/roof-style";
import type { LngLat, PropertyRecord } from "@/lib/atlas/types";

export type MeasureMode = "view" | "edit" | "draw";

const EMPTY = { type: "FeatureCollection" as const, features: [] as never[] };

/**
 * Satellite takeoff: the solved roof drawn over imagery, and a Terra Draw
 * editor for tracing or adjusting the building outline.
 */
export function MeasureMap({
  property,
  footprint,
  model,
  mode,
  onFootprint,
  className,
}: {
  property: PropertyRecord;
  footprint: LngLat[];
  model: RoofModel | null;
  mode: MeasureMode;
  onFootprint: (ring: LngLat[]) => void;
  className?: string;
}) {
  const [map, setMap] = useState<MapLibreMap | null>(null);

  // Roof overlay.
  useEffect(() => {
    if (!map) return;
    if (!map.getSource("roof-facets")) {
      map.addSource("roof-facets", { type: "geojson", data: EMPTY });
      map.addSource("roof-edges", { type: "geojson", data: EMPTY });
      map.addLayer({
        id: "roof-facets",
        type: "fill",
        source: "roof-facets",
        paint: { "fill-color": "#d8d4cc", "fill-opacity": 0.12 },
      });
      map.addLayer({
        id: "roof-edges",
        type: "line",
        source: "roof-edges",
        layout: { "line-cap": "round" },
        paint: {
          "line-width": 2.5,
          "line-color": [
            "match",
            ["get", "kind"],
            "eave",
            EDGE_COLORS.eave,
            "rake",
            EDGE_COLORS.rake,
            "ridge",
            EDGE_COLORS.ridge,
            "hip",
            EDGE_COLORS.hip,
            "valley",
            EDGE_COLORS.valley,
            "#eceae4",
          ],
        },
      });
    }
    const geo = model ? roofToGeoJSON(model) : null;
    (map.getSource("roof-facets") as GeoJSONSource).setData(geo?.facets ?? EMPTY);
    (map.getSource("roof-edges") as GeoJSONSource).setData(geo?.edges ?? EMPTY);
    const vis = mode === "view" ? "visible" : "none";
    map.setLayoutProperty("roof-facets", "visibility", vis);
    map.setLayoutProperty("roof-edges", "visibility", vis);
  }, [map, model, mode]);

  // Outline editor. It re-seeds only when the outline changes from outside
  // (auto-trace, reset, another property) — not on its own edits.
  const footprintRef = useRef(footprint);
  footprintRef.current = footprint;
  const onFootprintRef = useRef(onFootprint);
  onFootprintRef.current = onFootprint;
  const emitted = useRef<string | null>(null);
  const footprintKey = JSON.stringify(footprint);
  const [seedKey, setSeedKey] = useState(footprintKey);
  useEffect(() => {
    if (footprintKey !== emitted.current) setSeedKey(footprintKey);
  }, [footprintKey]);

  useEffect(() => {
    if (!map || mode === "view") return;
    let stopped = false;
    let cleanup: (() => void) | undefined;

    void Promise.all([import("terra-draw"), import("terra-draw-maplibre-gl-adapter")]).then(
      ([td, { TerraDrawMapLibreGLAdapter }]) => {
        if (stopped) return;
        const line = "#eceae4" as const;
        const draw = new td.TerraDraw({
          adapter: new TerraDrawMapLibreGLAdapter({ map }),
          modes: [
            new td.TerraDrawPolygonMode({
              snapping: { toCoordinate: true },
              styles: {
                fillColor: line,
                fillOpacity: 0.12,
                outlineColor: line,
                outlineWidth: 2,
                closingPointColor: line,
                closingPointOutlineColor: "#0b0c0e",
              },
            }),
            new td.TerraDrawSelectMode({
              flags: {
                polygon: {
                  feature: {
                    draggable: true,
                    coordinates: { midpoints: true, draggable: true, deletable: true },
                  },
                },
              },
              styles: {
                selectedPolygonColor: line,
                selectedPolygonFillOpacity: 0.12,
                selectedPolygonOutlineColor: line,
                selectedPolygonOutlineWidth: 2,
                selectionPointColor: line,
                selectionPointOutlineColor: "#0b0c0e",
                selectionPointWidth: 5,
                midPointColor: "#8e8c86",
                midPointOutlineColor: "#0b0c0e",
              },
            }),
          ],
        });
        draw.start();

        const emit = (id: string | number) => {
          const f = draw.getSnapshotFeature(id);
          if (f?.geometry.type !== "Polygon") return;
          const ring = (f.geometry.coordinates[0] as LngLat[]).slice(0, -1);
          if (ring.length < 3) return;
          const next: LngLat[] = ring.map(([x, y]) => [x, y]);
          emitted.current = JSON.stringify(next);
          onFootprintRef.current(next);
        };

        const footprint = footprintRef.current;
        if (mode === "edit" && footprint.length >= 3) {
          const id = draw.getFeatureId();
          draw.addFeatures([
            {
              id,
              type: "Feature",
              geometry: { type: "Polygon", coordinates: [[...footprint, footprint[0]]] },
              properties: { mode: "polygon" },
            },
          ]);
          draw.setMode("select");
          draw.selectFeature(id);
        } else {
          draw.setMode("polygon");
        }

        draw.on("finish", (id) => {
          emit(id);
          if (draw.getMode() === "polygon") {
            // One outline per roof: keep only the one just closed, then edit it.
            const others = draw
              .getSnapshot()
              .filter((f) => f.id !== id)
              .map((f) => f.id!);
            if (others.length) draw.removeFeatures(others);
            draw.setMode("select");
            draw.selectFeature(id);
          }
        });

        cleanup = () => {
          try {
            draw.stop();
          } catch {
            // Map already torn down.
          }
        };
      },
    );

    return () => {
      stopped = true;
      cleanup?.();
    };
  }, [map, mode, seedKey]);

  return (
    <OpsMap
      className={className}
      storms={[]}
      properties={[property]}
      focusId={property.id}
      basemap="sat"
      showChrome={false}
      showRadar={false}
      showAlerts={false}
      showReports={false}
      center={[property.lng, property.lat]}
      zoom={19}
      onMapReady={(m) => {
        setMap(m);
        return () => setMap(null);
      }}
    />
  );
}

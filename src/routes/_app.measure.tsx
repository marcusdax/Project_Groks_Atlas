"use client";

import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, PenTool, Printer, RotateCcw, ScanSearch, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { MeasureMap, type MeasureMode } from "@/components/atlas/measure-map";
import { Roof3D } from "@/components/atlas/roof-3d";
import { RoofPlan } from "@/components/atlas/roof-plan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROPERTIES } from "@/lib/atlas/data";
import { downloadFile, slug } from "@/lib/atlas/download";
import { buildMeasuredLineItems, mergeMeasuredLines } from "@/lib/atlas/estimate-engine";
import { fetchOsmBuilding } from "@/lib/atlas/footprint";
import {
  pitchDegrees,
  roofToGeoJSON,
  squaresWithWaste,
  suggestedWastePct,
  WASTE_STEPS,
  type RoofModel,
} from "@/lib/atlas/roof-geometry";
import { EDGE_COLORS } from "@/lib/atlas/roof-style";
import { useAtlas } from "@/lib/atlas/store";
import type { FootprintSource, PropertyRecord } from "@/lib/atlas/types";
import { useRoofModel } from "@/lib/atlas/use-roof-model";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/measure")({
  validateSearch: z.object({ property: z.string().optional() }),
  component: MeasurePage,
});

const SOURCE_LABEL: Record<FootprintSource, string> = {
  osm: "OpenStreetMap outline",
  drawn: "Traced on imagery",
  seed: "Estimated outline",
};

const PITCHES = Array.from({ length: 18 }, (_, i) => i + 1);

function MeasurePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const id = PROPERTIES.some((p) => p.id === search.property) ? search.property! : PROPERTIES[0].id;
  const property = PROPERTIES.find((p) => p.id === id)!;

  const measurement = useAtlas((s) => s.measurements[id]);
  const setMeasurement = useAtlas((s) => s.setMeasurement);
  const resetMeasurement = useAtlas((s) => s.resetMeasurement);
  const estimate = useAtlas((s) => s.estimates[`est-${id}`]);
  const replaceLines = useAtlas((s) => s.replaceLines);
  const roof = useRoofModel(measurement);

  const [mode, setMode] = useState<MeasureMode>("view");
  const [tracing, setTracing] = useState(false);
  const [waste, setWaste] = useState<number | null>(null);
  useEffect(() => {
    setMode("view");
    setWaste(null);
  }, [id]);

  const suggested = roof.model ? suggestedWastePct(roof.model.totals) : 10;
  const wastePct = waste ?? suggested;

  async function autoTrace() {
    setTracing(true);
    try {
      const hit = await fetchOsmBuilding([property.lng, property.lat]);
      if (!hit) {
        toast("No building outline in OpenStreetMap here", {
          description: "Trace it on the imagery with Draw.",
        });
        return;
      }
      setMeasurement(id, { footprint: hit.footprint, gableEdges: [], source: "osm" });
      setMode("view");
      toast(hit.containsPoint ? "Outline traced from OpenStreetMap" : "Nearest building traced", {
        description: hit.containsPoint
          ? `OSM way ${hit.osmId} · ${hit.footprint.length} corners`
          : "The pin is not inside a mapped building — check it matches the house.",
      });
    } catch (err) {
      toast("Auto-trace is unavailable right now", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setTracing(false);
    }
  }

  function buildEstimate(model: RoofModel) {
    if (!estimate || !measurement) return;
    const lines = buildMeasuredLineItems({
      totals: model.totals,
      roofKind: property.roofKind,
      wastePct,
      layers: measurement.layers,
      stories: measurement.stories,
    });
    replaceLines(estimate.id, mergeMeasuredLines(estimate.lineItems, lines), wastePct);
    toast("Estimate rebuilt from measurement", {
      description: `${lines.length} measured lines · ${wastePct}% waste`,
    });
    void navigate({ to: "/estimates/$estimateId", params: { estimateId: estimate.id } });
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="no-print">
        <p className="font-mono text-xs uppercase tracking-wider text-faint">Measurement</p>
        <h1 className="font-display text-4xl tracking-tight">From outline to takeoff.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Trace the footprint, set pitch and gable ends. Facets, ridges, hips, valleys and waste are
          solved from the geometry and carried straight into the estimate.
        </p>
      </header>

      <div className="no-print flex gap-2 overflow-x-auto pb-1">
        {PROPERTIES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => void navigate({ search: { property: p.id }, replace: true })}
            className={cn(
              "min-h-11 shrink-0 rounded-md px-3 text-sm",
              p.id === id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {p.address.split(" ")[0]} {p.city}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="no-print">
          <CardHeader className="gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{property.address}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {property.city} · {property.stories} story · {property.roofKind}
                </p>
              </div>
              {measurement && (
                <Badge variant={measurement.source === "seed" ? "warn" : "ok"}>
                  {SOURCE_LABEL[measurement.source]}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={autoTrace} disabled={tracing}>
                <ScanSearch className="size-4" />
                {tracing ? "Tracing…" : "Auto-trace"}
              </Button>
              <Button
                size="sm"
                variant={mode === "edit" ? "default" : "secondary"}
                onClick={() => setMode(mode === "edit" ? "view" : "edit")}
              >
                <SquarePen className="size-4" />
                {mode === "edit" ? "Done" : "Edit outline"}
              </Button>
              <Button
                size="sm"
                variant={mode === "draw" ? "default" : "secondary"}
                onClick={() => setMode(mode === "draw" ? "view" : "draw")}
              >
                <PenTool className="size-4" />
                {mode === "draw" ? "Cancel" : "Draw"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  resetMeasurement(id);
                  setMode("view");
                }}
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {measurement && (
              <MeasureMap
                className="h-80"
                property={property}
                footprint={measurement.footprint}
                model={roof.model}
                mode={mode}
                onFootprint={(footprint) =>
                  setMeasurement(id, {
                    footprint,
                    // Edge indices only shift when corners are added or removed.
                    gableEdges:
                      footprint.length === measurement.footprint.length
                        ? measurement.gableEdges
                        : [],
                    source: "drawn",
                  })
                }
              />
            )}
            <p className="text-xs text-muted-foreground">
              {mode === "draw"
                ? "Click each corner of the roof’s drip line; click the first corner to close."
                : mode === "edit"
                  ? "Drag corners to the drip line. Drag a midpoint to add a corner; right-click a corner to remove it."
                  : measurement?.source === "seed"
                    ? "This outline is estimated from the record. Auto-trace or draw it for a real measurement."
                    : "Esri World Imagery. Lines are colour-coded by type."}
            </p>
          </CardContent>
        </Card>

        <Card className="print-plain">
          <CardHeader>
            <CardTitle>Roof model</CardTitle>
            <p className="text-sm text-muted-foreground">
              Straight-skeleton solve · tap an eave to turn that end into a gable
            </p>
          </CardHeader>
          <CardContent>
            {roof.status === "ready" ? (
              <Tabs defaultValue="plan">
                <TabsList className="no-print mb-3">
                  <TabsTrigger value="plan">Plan</TabsTrigger>
                  <TabsTrigger value="3d">3D</TabsTrigger>
                </TabsList>
                <TabsContent value="plan">
                  <RoofPlan
                    model={roof.model}
                    onToggleGable={(edge) => {
                      if (!measurement) return;
                      const has = measurement.gableEdges.includes(edge);
                      setMeasurement(id, {
                        gableEdges: has
                          ? measurement.gableEdges.filter((e) => e !== edge)
                          : [...measurement.gableEdges, edge],
                      });
                    }}
                  />
                </TabsContent>
                <TabsContent value="3d">
                  <Roof3D
                    className="h-80"
                    model={roof.model}
                    stories={measurement?.stories ?? property.stories}
                    roofKind={property.roofKind}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="grid h-72 place-items-center rounded-lg bg-raised p-6 text-center text-sm text-muted-foreground">
                {roof.status === "loading"
                  ? "Solving roof…"
                  : `Can’t solve this outline: ${roof.error} Redraw it without crossing edges.`}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {measurement && (
        <Card className="no-print">
          <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
            <Stepper
              label="Pitch"
              value={`${measurement.pitchRise}/12 · ${pitchDegrees(measurement.pitchRise).toFixed(1)}°`}
              onDec={() =>
                setMeasurement(id, { pitchRise: Math.max(1, measurement.pitchRise - 1) })
              }
              onInc={() =>
                setMeasurement(id, {
                  pitchRise: Math.min(PITCHES.length, measurement.pitchRise + 1),
                })
              }
            />
            <Stepper
              label="Stories"
              value={String(measurement.stories)}
              onDec={() => setMeasurement(id, { stories: Math.max(1, measurement.stories - 1) })}
              onInc={() => setMeasurement(id, { stories: Math.min(4, measurement.stories + 1) })}
            />
            <Stepper
              label="Layers to remove"
              value={String(measurement.layers)}
              onDec={() => setMeasurement(id, { layers: Math.max(1, measurement.layers - 1) })}
              onInc={() => setMeasurement(id, { layers: Math.min(3, measurement.layers + 1) })}
            />
          </CardContent>
        </Card>
      )}

      {roof.model && measurement && (
        <MeasurementReport
          model={roof.model}
          property={property}
          wastePct={wastePct}
          suggested={suggested}
          onWaste={setWaste}
          onBuild={() => buildEstimate(roof.model!)}
          source={measurement.source}
        />
      )}
    </div>
  );
}

function Stepper({
  label,
  value,
  onDec,
  onInc,
}: {
  label: string;
  value: string;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div>
      <p className="text-faint text-sm">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <Button size="icon" variant="secondary" onClick={onDec} aria-label={`Decrease ${label}`}>
          −
        </Button>
        <span className="min-w-28 text-center font-mono text-lg tabular-nums">{value}</span>
        <Button size="icon" variant="secondary" onClick={onInc} aria-label={`Increase ${label}`}>
          +
        </Button>
      </div>
    </div>
  );
}

function MeasurementReport({
  model,
  property,
  wastePct,
  suggested,
  onWaste,
  onBuild,
  source,
}: {
  model: RoofModel;
  property: PropertyRecord;
  wastePct: number;
  suggested: number;
  onWaste: (n: number) => void;
  onBuild: () => void;
  source: FootprintSource;
}) {
  const t = model.totals;
  const steps = useMemo(
    () => [...new Set([...WASTE_STEPS, suggested, wastePct])].sort((a, b) => a - b),
    [suggested, wastePct],
  );
  const ft = (n: number) => `${Math.round(n).toLocaleString()} ft`;
  const lines: [string, string, string?][] = [
    ["Ridges", ft(t.ridgeFt), EDGE_COLORS.ridge],
    ["Hips", ft(t.hipFt), EDGE_COLORS.hip],
    ["Valleys", ft(t.valleyFt), EDGE_COLORS.valley],
    ["Eaves", ft(t.eaveFt), EDGE_COLORS.eave],
    ["Rakes", ft(t.rakeFt), EDGE_COLORS.rake],
    ["Drip edge (eaves + rakes)", ft(t.eaveFt + t.rakeFt)],
    ["Ridge cap (ridges + hips)", ft(t.ridgeFt + t.hipFt)],
    ["Perimeter", ft(t.perimeterFt)],
  ];

  function exportGeoJSON() {
    const geo = roofToGeoJSON(model);
    const doc = {
      type: "FeatureCollection",
      properties: {
        address: `${property.address}, ${property.city}, ${property.state} ${property.zip}`,
        source,
        wastePct,
        totals: t,
      },
      features: [...geo.facets.features, ...geo.edges.features],
    };
    downloadFile(
      `${slug(property.address)}-roof.geojson`,
      JSON.stringify(doc, null, 2),
      "application/geo+json",
    );
  }

  return (
    <Card className="print-plain">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle>Measurement report</CardTitle>
          <p className="text-sm text-muted-foreground">
            {property.address}, {property.city} · {t.facets} facets · predominant{" "}
            {t.predominantPitch}/12
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={exportGeoJSON}>
            <Download className="size-4" />
            GeoJSON
          </Button>
          <Button size="sm" variant="secondary" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button size="sm" onClick={onBuild}>
            Build estimate
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-3">
        <dl className="grid grid-cols-2 gap-4 text-sm lg:col-span-1">
          <Metric label="Roof area" value={`${Math.round(t.areaSqft).toLocaleString()} sf`} />
          <Metric label="Squares" value={t.squares.toFixed(2)} />
          <Metric label="Footprint" value={`${Math.round(t.planSqft).toLocaleString()} sf`} />
          <Metric label="Ridge height" value={`${t.ridgeHeightFt.toFixed(1)} ft`} />
        </dl>
        <table className="w-full text-sm lg:col-span-1">
          <tbody>
            {lines.map(([label, value, color]) => (
              <tr key={label} className="border-b border-border last:border-0">
                <td className="py-1.5 text-muted-foreground">
                  <span className="flex items-center gap-2">
                    {color && (
                      <span className="h-0.5 w-3 rounded-full" style={{ background: color }} />
                    )}
                    {label}
                  </span>
                </td>
                <td className="py-1.5 text-right font-mono tabular-nums">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="lg:col-span-1">
          <p className="text-sm text-faint">Waste · squares to order</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {steps.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => onWaste(w)}
                className={cn(
                  "rounded-md px-2 py-2 text-left",
                  w === wastePct ? "bg-primary text-primary-foreground" : "bg-secondary",
                )}
              >
                <span className="block font-mono text-xs opacity-70">
                  {w}%{w === suggested ? " · rec" : ""}
                </span>
                <span className="font-mono tabular-nums">
                  {squaresWithWaste(t.areaSqft, w).toFixed(2)}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Recommended from facet count and hip/valley cut length. Rounded up to whole bundles.
          </p>
        </div>
        {model.warnings.length > 0 && (
          <ul className="text-sm text-warn lg:col-span-3">
            {model.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-faint">{label}</dt>
      <dd className="font-mono text-lg tabular-nums">{value}</dd>
    </div>
  );
}

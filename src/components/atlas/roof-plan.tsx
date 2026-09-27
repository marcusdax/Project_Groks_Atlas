"use client";

import { useMemo, useState } from "react";
import { centroid2, compass, type RoofModel } from "@/lib/atlas/roof-geometry";
import { EDGE_COLORS, EDGE_LABELS, EDGE_ORDER } from "@/lib/atlas/roof-style";
import { cn } from "@/lib/utils";

const W = 400;
const H = 280;
const PAD = 28;

/**
 * Plan view generated from the solved roof: facets, colour-coded lines with
 * lengths, and — when `onToggleGable` is set — clickable eaves/rakes that flip
 * an end between hip and gable.
 */
export function RoofPlan({
  model,
  onToggleGable,
  showLengths = true,
  className,
}: {
  model: RoofModel;
  onToggleGable?: (footprintEdge: number) => void;
  showLengths?: boolean;
  className?: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const active = model.facets.find((f) => f.id === hover);

  const { tx, ty, scale } = useMemo(() => {
    const pts = model.footprintFt;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const [minX, maxX, minY, maxY] = [
      Math.min(...xs),
      Math.max(...xs),
      Math.min(...ys),
      Math.max(...ys),
    ];
    const s = Math.min((W - PAD * 2) / (maxX - minX || 1), (H - PAD * 2) / (maxY - minY || 1));
    const ox = (W - (maxX - minX) * s) / 2;
    const oy = (H - (maxY - minY) * s) / 2;
    return {
      scale: s,
      tx: (x: number) => ox + (x - minX) * s,
      ty: (y: number) => H - oy - (y - minY) * s, // north up
    };
  }, [model]);

  const path = (pts: number[][]) =>
    pts.map((p, i) => `${i ? "L" : "M"}${tx(p[0]).toFixed(1)} ${ty(p[1]).toFixed(1)}`).join(" ") +
    " Z";

  const labelEdges = showLengths && model.edges.length <= 60;
  // Scale bar: a round number of feet near 1/4 of the width.
  const barFt = [5, 10, 20, 25, 50, 100].find((f) => f * scale > W / 6) ?? 100;

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-raised p-3", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-manipulation"
        role="img"
        aria-label={`Roof plan, ${model.totals.facets} facets, ${Math.round(model.totals.areaSqft)} square feet`}
      >
        {model.facets.map((f) => (
          <path
            key={f.id}
            d={path(f.points)}
            className={cn(
              "transition-colors duration-150",
              hover === f.id ? "fill-primary/25" : "fill-foreground/[0.07]",
            )}
            onMouseEnter={() => setHover(f.id)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        {model.edges.map((e, i) => {
          const toggle = onToggleGable && e.footprintEdge !== undefined;
          return (
            <g key={i}>
              <line
                x1={tx(e.a[0])}
                y1={ty(e.a[1])}
                x2={tx(e.b[0])}
                y2={ty(e.b[1])}
                stroke={EDGE_COLORS[e.kind]}
                strokeWidth={e.kind === "eave" || e.kind === "rake" ? 2 : 1.5}
                strokeLinecap="round"
                pointerEvents="none"
              />
              {toggle && (
                <line
                  x1={tx(e.a[0])}
                  y1={ty(e.a[1])}
                  x2={tx(e.b[0])}
                  y2={ty(e.b[1])}
                  stroke="transparent"
                  strokeWidth={14}
                  className="cursor-pointer hover:stroke-primary/30"
                  onClick={() => onToggleGable(e.footprintEdge!)}
                >
                  <title>
                    {e.kind === "rake" ? "Make this end a hip" : "Make this end a gable"}
                  </title>
                </line>
              )}
            </g>
          );
        })}
        {labelEdges &&
          model.edges
            .filter((e) => e.lengthFt * scale > 26)
            .map((e, i) => (
              <text
                key={`l${i}`}
                x={(tx(e.a[0]) + tx(e.b[0])) / 2}
                y={(ty(e.a[1]) + ty(e.b[1])) / 2 - 3}
                textAnchor="middle"
                className="pointer-events-none fill-foreground/80 font-mono text-[9px]"
                style={{ paintOrder: "stroke", stroke: "var(--color-raised)", strokeWidth: 3 }}
              >
                {Math.round(e.lengthFt)}′
              </text>
            ))}
        {model.facets.map((f) => {
          const [cx, cy] = centroid2(f.points);
          if (f.planSqft * scale * scale < 900) return null;
          return (
            <text
              key={`c${f.id}`}
              x={tx(cx)}
              y={ty(cy) + 3}
              textAnchor="middle"
              className="pointer-events-none fill-muted-foreground font-mono text-[9px]"
            >
              {f.label.split(" ")[0]}
            </text>
          );
        })}
        <g transform={`translate(${W - 20} 22)`} className="fill-muted-foreground">
          <path d="M0 -12 L5 4 L0 0 L-5 4 Z" />
          <text y={16} textAnchor="middle" className="font-mono text-[9px]">
            N
          </text>
        </g>
        <g transform={`translate(12 ${H - 12})`} className="text-muted-foreground">
          <line x1={0} x2={barFt * scale} y1={0} y2={0} stroke="currentColor" strokeWidth={1.5} />
          <text x={barFt * scale + 5} y={3} className="fill-current font-mono text-[9px]">
            {barFt} ft
          </text>
        </g>
      </svg>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Facet</p>
          <p className="truncate text-sm">
            {active
              ? `${active.label} · ${Math.round(active.azimuth)}° ${compass(active.azimuth)}`
              : `${model.totals.facets} facets`}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Area</p>
          <p className="font-mono text-sm tabular-nums">
            {Math.round(active ? active.sqft : model.totals.areaSqft).toLocaleString()} sf
            {active ? ` · ${active.pitchRise}/12` : ""}
          </p>
        </div>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {EDGE_ORDER.map((k) => (
          <li key={k} className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded-full" style={{ background: EDGE_COLORS[k] }} />
            {EDGE_LABELS[k]}
          </li>
        ))}
      </ul>
    </div>
  );
}

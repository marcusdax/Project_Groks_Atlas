"use client";

import { useState } from "react";
import type { RoofPlane } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

export function RoofSketch({
  planes,
  totalSqft,
}: {
  planes: RoofPlane[];
  totalSqft: number;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const active = planes.find((p) => p.id === hover);

  return (
    <div className="relative overflow-hidden rounded-lg bg-raised p-3">
      <svg viewBox="0 0 380 240" className="h-56 w-full" role="img" aria-label="Roof sketch">
        {planes.map((plane) => (
          <path
            key={plane.id}
            d={plane.path}
            className={cn(
              "stroke-foreground/40 transition-colors duration-150",
              hover === plane.id ? "fill-primary/25 stroke-primary" : "fill-foreground/10",
            )}
            strokeWidth="1.2"
            onMouseEnter={() => setHover(plane.id)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Plane</p>
          <p className="text-sm">{active ? active.label : "All planes"}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Area</p>
          <p className="font-mono text-sm tabular-nums">
            {(active ? active.sqft : totalSqft).toLocaleString()} sf
            {active ? ` · ${active.pitch}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

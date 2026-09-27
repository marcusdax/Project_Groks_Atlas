"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function BeforeAfter({
  before,
  after,
  alt,
  className,
}: {
  before: string;
  after: string;
  alt: string;
  className?: string;
}) {
  const [split, setSplit] = useState(52);

  return (
    <div className={cn("relative overflow-hidden rounded-lg bg-raised", className)}>
      <img src={after} alt={`${alt} after`} className="block h-64 w-full object-cover" />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
      >
        <img src={before} alt={`${alt} before`} className="h-full w-full object-cover" />
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-primary"
        style={{ left: `${split}%` }}
      />
      <input
        type="range"
        min={8}
        max={92}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Before and after comparison"
      />
      <span className="pointer-events-none absolute left-3 top-3 rounded-sm bg-background/80 px-2 py-0.5 font-mono text-xs uppercase tracking-wider">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-sm bg-background/80 px-2 py-0.5 font-mono text-xs uppercase tracking-wider">
        After
      </span>
    </div>
  );
}

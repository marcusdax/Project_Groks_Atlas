"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ESTIMATES, propertyById, estimateTotals } from "@/lib/atlas/data";
import { usd } from "@/lib/atlas/format";
import { useAtlas } from "@/lib/atlas/store";

export const Route = createFileRoute("/_app/estimates/")({
  component: EstimatesPage,
});

const STATUS_VARIANT = {
  draft: "quiet",
  review: "warn",
  sent: "ok",
  approved: "ok",
} as const;

function EstimatesPage() {
  const live = useAtlas((s) => s.estimates);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-faint">Estimation</p>
        <h1 className="font-display text-4xl tracking-tight">Carrier-ready scopes</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Line items, regional pricing, waste, and Xactimate export — built on the measured roof,
          not a clipboard.
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {ESTIMATES.map((seed) => {
          const est = live[seed.id] ?? seed;
          const property = propertyById(est.propertyId);
          if (!property) return null;
          const { total } = estimateTotals(est);
          return (
            <Link
              key={est.id}
              to="/estimates/$estimateId"
              params={{ estimateId: est.id }}
              className="block"
            >
              <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{property.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {property.city} · {est.lineItems.length} lines · waste {Math.round(est.wastePct * 100)}%
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={STATUS_VARIANT[est.status]}>{est.status}</Badge>
                  <p className="font-mono text-lg tabular-nums">{usd(total)}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

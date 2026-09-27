"use client";

import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { OpsMap } from "@/components/atlas/ops-map";
import { RoofSketch } from "@/components/atlas/roof-sketch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROPERTIES } from "@/lib/atlas/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/measure")({
  component: MeasurePage,
});

function MeasurePage() {
  const [id, setId] = useState(PROPERTIES[0].id);
  const property = PROPERTIES.find((p) => p.id === id) ?? PROPERTIES[0];
  const squares = Number(((property.sqft * 1.1) / 100).toFixed(1));
  const perimeter = Math.round(Math.sqrt(property.sqft) * 4.2);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-faint">Measurement</p>
        <h1 className="font-display text-4xl tracking-tight">From report to sketch.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Instant AI sketch, then a certified editable file. Planes, pitch, and waste already in
          the estimate.
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {PROPERTIES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setId(p.id)}
            className={cn(
              "min-h-11 shrink-0 rounded-md px-3 text-sm",
              p.id === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
            )}
          >
            {p.address.split(" ")[0]} {p.city}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{property.address}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {property.pitch} · {property.stories} story · {property.roofKind}
            </p>
          </CardHeader>
          <CardContent>
            <RoofSketch planes={property.planes} totalSqft={property.sqft} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Satellite takeoff</CardTitle>
            <p className="text-sm text-muted-foreground">World Imagery under the roof sketch</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <OpsMap
              className="h-56"
              storms={[]}
              properties={[property]}
              focusId={property.id}
              basemap="sat"
              showChrome={false}
              showRadar={false}
              showAlerts={false}
              showReports={false}
              center={[property.lng, property.lat]}
              zoom={18}
            />
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-faint">Squares + 10% waste</dt>
                <dd className="font-mono text-lg tabular-nums">{squares}</dd>
              </div>
              <div>
                <dt className="text-faint">Perimeter</dt>
                <dd className="font-mono text-lg tabular-nums">{perimeter} lf</dd>
              </div>
              <div>
                <dt className="text-faint">Felt rolls (10 sq)</dt>
                <dd className="font-mono text-lg tabular-nums">{Math.ceil(squares / 10)}</dd>
              </div>
              <div>
                <dt className="text-faint">Ridge</dt>
                <dd className="font-mono text-lg tabular-nums">
                  {Math.round(Math.sqrt(property.sqft) * 0.55)} lf
                </dd>
              </div>
            </dl>
            <Button asChild className="w-full">
              <Link to="/estimates/$estimateId" params={{ estimateId: `est-${property.id}` }}>
                Drop into estimate
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

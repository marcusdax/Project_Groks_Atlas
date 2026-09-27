"use client";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { BeforeAfter } from "@/components/atlas/before-after";
import { OpsMap } from "@/components/atlas/ops-map";
import { RoofPlan } from "@/components/atlas/roof-plan";
import { ScoreRing } from "@/components/atlas/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { propertyById, stormById } from "@/lib/atlas/data";
import { dpsTone, usd } from "@/lib/atlas/format";
import { useAtlas } from "@/lib/atlas/store";
import { useRoofModel } from "@/lib/atlas/use-roof-model";

export const Route = createFileRoute("/_app/properties/$propertyId")({
  component: DossierPage,
});

function DossierPage() {
  const { propertyId } = Route.useParams();
  const navigate = useNavigate();
  const property = propertyById(propertyId);
  const setStage = useAtlas((s) => s.setStage);
  const stage = useAtlas((s) => s.stages[propertyId]);
  const measurement = useAtlas((s) => s.measurements[propertyId]);
  const roof = useRoofModel(measurement);
  const totals = roof.model?.totals;

  if (!property) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="font-display text-3xl">Parcel not in this market.</h1>
        <Button asChild className="mt-6">
          <Link to="/properties">Back to dossiers</Link>
        </Button>
      </div>
    );
  }

  const storm = stormById(property.stormId);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            {property.city} · {property.zip}
          </p>
          <h1 className="font-display text-4xl tracking-tight">{property.address}</h1>
          <p className="mt-1 text-muted-foreground">
            {property.owner} · {property.insurance} · {storm?.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={dpsTone(property.dps)}>{stage ?? property.stage}</Badge>
          <Button
            variant="secondary"
            onClick={() => {
              setStage(property.id, "qualified");
              toast("Marked qualified");
            }}
          >
            Qualify
          </Button>
          <Button
            onClick={() =>
              navigate({
                to: "/estimates/$estimateId",
                params: { estimateId: `est-${property.id}` },
              })
            }
          >
            Open estimate
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-3">
            <BeforeAfter
              before={property.photo}
              after={property.afterPhoto}
              alt={property.address}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <ScoreRing score={property.dps} size={140} />
            <dl className="grid w-full grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-faint">Home value</dt>
                <dd className="tabular-nums">{usd(property.homeValue)}</dd>
              </div>
              <div>
                <dt className="text-faint">Est. repair</dt>
                <dd className="tabular-nums">{usd(property.estRepair)}</dd>
              </div>
              <div>
                <dt className="text-faint">Affected</dt>
                <dd>{property.affectedPct}%</dd>
              </div>
              <div>
                <dt className="text-faint">Damage</dt>
                <dd>{property.damageKind}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Parcel on the mosaic</CardTitle>
            <p className="text-sm text-muted-foreground">Esri imagery · NEXRAD still on</p>
          </CardHeader>
          <CardContent>
            <OpsMap
              className="h-64"
              storms={storm ? [storm] : []}
              properties={[property]}
              focusId={property.id}
              basemap="sat"
              showChrome={false}
              showAlerts={false}
              showReports={false}
              center={[property.lng, property.lat]}
              zoom={16}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Measurements</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-faint">Roof area</p>
              <p className="font-mono text-lg tabular-nums">
                {Math.round(totals?.areaSqft ?? property.sqft).toLocaleString()} sf
              </p>
            </div>
            <div>
              <p className="text-faint">Pitch</p>
              <p className="font-mono text-lg">
                {measurement?.pitchRise ?? property.pitch.split(":")[0]}/12
                {totals ? ` · ${totals.facets} facets` : ""}
              </p>
            </div>
            <div>
              <p className="text-faint">Ridge + hip</p>
              <p className="font-mono text-lg tabular-nums">
                {totals ? `${Math.round(totals.ridgeFt + totals.hipFt)} ft` : "—"}
              </p>
            </div>
            <div>
              <p className="text-faint">Valleys</p>
              <p className="font-mono text-lg tabular-nums">
                {totals ? `${Math.round(totals.valleyFt)} ft` : "—"}
              </p>
            </div>
            <div>
              <p className="text-faint">Stories</p>
              <p className="font-mono text-lg">{measurement?.stories ?? property.stories}</p>
            </div>
            <div>
              <p className="text-faint">Roof year</p>
              <p className="font-mono text-lg">{property.roofYear}</p>
            </div>
            <p className="col-span-2 text-muted-foreground">{property.notes}</p>
            <Button asChild variant="secondary">
              <Link to="/measure" search={{ property: property.id }}>
                Open measure studio
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Roof plan</CardTitle>
            {measurement?.source === "seed" && (
              <p className="text-sm text-muted-foreground">Estimated outline — trace it in Measure.</p>
            )}
          </CardHeader>
          <CardContent>
            {roof.model ? (
              <RoofPlan model={roof.model} />
            ) : (
              <p className="grid h-56 place-items-center rounded-lg bg-raised text-sm text-muted-foreground">
                {roof.status === "error" ? roof.error : "Solving roof…"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <img
        src={property.aerial}
        alt={`Aerial of ${property.address}`}
        className="h-64 w-full rounded-xl object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
      />
    </div>
  );
}

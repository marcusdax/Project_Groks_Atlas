"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { OpsMap } from "@/components/atlas/ops-map";
import { LiveStrip } from "@/components/atlas/live-strip";
import { ScoreRing } from "@/components/atlas/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROPERTIES, STORMS, propertiesForStorm, stormById } from "@/lib/atlas/data";
import { dpsTone, stormWhen, usd } from "@/lib/atlas/format";
import { useAtlas } from "@/lib/atlas/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/recon")({
  component: ReconPage,
});

function ReconPage() {
  const stormId = useAtlas((s) => s.selectedStormId);
  const selectStorm = useAtlas((s) => s.selectStorm);
  const selectedPropertyId = useAtlas((s) => s.selectedPropertyId);
  const selectProperty = useAtlas((s) => s.selectProperty);
  const storm = stormById(stormId) ?? STORMS[0];
  const list = propertiesForStorm(storm.id);
  const focus = PROPERTIES.find((p) => p.id === selectedPropertyId) ?? list[0];
  const high = list.filter((p) => p.dps >= 80).length;
  const avg = Math.round(list.reduce((s, p) => s + p.dps, 0) / Math.max(1, list.length));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-faint">Recon engine</p>
        <h1 className="font-display text-4xl tracking-tight">Strike zones, not ZIP dumps.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Hail size, wind, roof age, and dwell fused into a Damage Probability Score. Sort the
          neighborhood before a single ladder goes up.
        </p>
      </header>

      <LiveStrip />

      <div className="grid gap-3 sm:grid-cols-3">
        {STORMS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => selectStorm(s.id)}
            className={cn(
              "rounded-xl p-4 text-left shadow-[var(--shadow-border)] transition-colors duration-150",
              s.id === storm.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
            )}
          >
            <p className="font-mono text-xs uppercase tracking-wider opacity-70">{s.severity}</p>
            <p className="mt-1 font-display text-xl">{s.name}</p>
            <p className="mt-1 text-sm opacity-80">
              {s.hailIn}" hail · {s.windMph} mph · {stormWhen(s.occurredAt)}
            </p>
          </button>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{storm.region}</CardTitle>
          </CardHeader>
          <CardContent>
            <OpsMap
              className="h-96"
              storms={[storm]}
              properties={list}
              focusId={focus?.id}
              onSelect={selectProperty}
              followFocus
            />
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-faint">High priority</p>
                <p className="font-display text-3xl tabular-nums">{high}</p>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-faint">Avg DPS</p>
                <p className="font-display text-3xl tabular-nums">{avg}</p>
              </div>
            </CardContent>
          </Card>
          {focus && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{focus.address}</CardTitle>
                <p className="text-sm text-muted-foreground">{focus.owner}</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <ScoreRing score={focus.dps} />
                <dl className="grid w-full grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-faint">Roof</dt>
                    <dd>
                      {focus.roofAge} yr {focus.roofKind}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-faint">Repair</dt>
                    <dd className="tabular-nums">{usd(focus.estRepair)}</dd>
                  </div>
                </dl>
                <Button asChild className="w-full">
                  <Link to="/properties/$propertyId" params={{ propertyId: focus.id }}>
                    Open dossier
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Scored parcels</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul>
            {list.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => selectProperty(p.id)}
                  className={cn(
                    "flex min-h-14 w-full items-center gap-4 border-t border-border px-5 py-3 text-left first:border-t-0 hover:bg-accent",
                    focus?.id === p.id && "bg-accent",
                  )}
                >
                  <span className="w-10 font-mono tabular-nums">{p.dps}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{p.address}</span>
                    <span className="block text-xs text-muted-foreground">{p.notes}</span>
                  </span>
                  <Badge variant={dpsTone(p.dps)}>{p.damageKind}</Badge>
                  <span className="hidden tabular-nums sm:inline">{usd(p.estRepair)}</span>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

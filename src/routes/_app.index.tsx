"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { OpsMap } from "@/components/atlas/ops-map";
import { LiveStrip } from "@/components/atlas/live-strip";
import { ScoreRing } from "@/components/atlas/score-ring";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROPERTIES, STORMS } from "@/lib/atlas/data";
import { dpsTone, stormWhen, usd } from "@/lib/atlas/format";
import { useAtlas } from "@/lib/atlas/store";

export const Route = createFileRoute("/_app/")({
  component: CommandCenter,
});

const WEEK = [
  { d: "Mon", v: 120 },
  { d: "Tue", v: 186 },
  { d: "Wed", v: 240 },
  { d: "Thu", v: 410 },
  { d: "Fri", v: 380 },
  { d: "Sat", v: 520 },
  { d: "Sun", v: 310 },
];

function CommandCenter() {
  const stages = useAtlas((s) => s.stages);
  const selectProperty = useAtlas((s) => s.selectProperty);
  const selected = useAtlas((s) => s.selectedPropertyId);
  const ranked = [...PROPERTIES].sort((a, b) => b.dps - a.dps);
  const pipeline = usd(PROPERTIES.reduce((s, p) => s + p.estRepair, 0));
  const high = PROPERTIES.filter((p) => p.dps >= 80).length;
  const latest = STORMS[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Command</p>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
            Preston Hollow is still open.
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {latest.hailIn}" hail, {latest.windMph} mph gusts · {stormWhen(latest.occurredAt)}.{" "}
            {PROPERTIES.length} scored roofs. Send crews at the top of the stack.
          </p>
        </div>
        <Button asChild>
          <Link to="/radar">Open radar</Link>
        </Button>
      </header>

      <LiveStrip />

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { k: "Active cells", v: String(STORMS.length), s: "Last 36 hours" },
          { k: "Flagged roofs", v: String(PROPERTIES.length), s: "+12 since dawn" },
          { k: "High DPS", v: String(high), s: "Score 80+" },
          { k: "Pipeline", v: pipeline, s: "If top 10 close" },
        ].map((m) => (
          <Card key={m.k} className="rounded-xl p-4">
            <p className="font-mono text-xs uppercase tracking-wider text-faint">{m.k}</p>
            <p className="mt-2 font-display text-3xl tabular-nums leading-none">{m.v}</p>
            <p className="mt-2 text-xs text-muted-foreground">{m.s}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Strike field</CardTitle>
              <p className="text-sm text-muted-foreground">Live NEXRAD · hail cells · scored parcels</p>
            </div>
            <Badge variant="outline">Live</Badge>
          </CardHeader>
          <CardContent>
            <OpsMap
              className="h-96"
              focusId={selected}
              onSelect={selectProperty}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Priority lead</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ScoreRing score={ranked[0].dps} size={128} />
            <div className="w-full text-center">
              <p className="text-sm">{ranked[0].address}</p>
              <p className="text-xs text-muted-foreground">
                {ranked[0].city} · {usd(ranked[0].estRepair)}
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/properties/$propertyId" params={{ propertyId: ranked[0].id }}>
                Open dossier
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Ranked properties</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul>
              {ranked.slice(0, 7).map((p) => (
                <li key={p.id} className="border-t border-border first:border-t-0">
                  <Link
                    to="/properties/$propertyId"
                    params={{ propertyId: p.id }}
                    className="flex min-h-14 items-center gap-4 px-5 py-3 hover:bg-accent"
                  >
                    <span className="w-10 font-mono text-sm tabular-nums">{p.dps}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{p.address}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.city} · {p.roofAge} yr {p.roofKind}
                      </span>
                    </span>
                    <Badge variant={dpsTone(p.dps)}>{stages[p.id] ?? p.stage}</Badge>
                    <span className="hidden font-mono text-sm tabular-nums sm:inline">
                      {usd(p.estRepair)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estimate velocity</CardTitle>
            <p className="text-sm text-muted-foreground">Thousands, this week</p>
          </CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEK}>
                <XAxis dataKey="d" tickLine={false} axisLine={false} tick={{ fill: "var(--color-faint)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.12}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

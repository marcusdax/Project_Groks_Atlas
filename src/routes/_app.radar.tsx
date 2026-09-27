"use client";

import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { OpsMap } from "@/components/atlas/ops-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROPERTIES, STORMS, propertiesForStorm } from "@/lib/atlas/data";
import { useNwsAlerts, useStationWx, useStormReports } from "@/lib/atlas/live";
import { PRODUCTS, type RadarProduct } from "@/lib/atlas/radar";
import { isHailish } from "@/lib/atlas/weather";
import { useAtlas } from "@/lib/atlas/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/radar")({
  component: RadarPage,
});

function RadarPage() {
  const [product, setProduct] = useState<RadarProduct>("n0q");
  const [basemap, setBasemap] = useState<"ops" | "sat">("ops");
  const [showRadar, setShowRadar] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const stormId = useAtlas((s) => s.selectedStormId);
  const selectStorm = useAtlas((s) => s.selectStorm);
  const selectProperty = useAtlas((s) => s.selectProperty);
  const selectedPropertyId = useAtlas((s) => s.selectedPropertyId);
  const storm = STORMS.find((s) => s.id === stormId) ?? STORMS[0];
  const wx = useStationWx();
  const alerts = useNwsAlerts();
  const reports = useStormReports();
  const localReports = useMemo(
    () =>
      reports.data.filter(
        (r) => r.lat > 32.35 && r.lat < 33.15 && r.lng > -97.55 && r.lng < -96.55,
      ),
    [reports.data],
  );

  return (
    <div className="atlas-map-stage -mx-4 -my-6 flex flex-col lg:flex-row sm:-mx-6 lg:-mx-8">
      <div className="relative min-h-80 flex-1 lg:min-h-0">
        <OpsMap
          className="absolute inset-0 h-full min-h-80 rounded-none"
          storms={STORMS}
          properties={PROPERTIES}
          focusId={selectedPropertyId}
          onSelect={selectProperty}
          product={product}
          basemap={basemap}
          showRadar={showRadar}
          showAlerts={showAlerts}
          showReports={showReports}
          followFocus
        />
      </div>

      <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-border bg-background p-4 lg:w-80 lg:border-l lg:border-t-0">
        <header>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Live radar</p>
          <h1 className="font-display text-3xl tracking-tight">OpenRadar over Atlas.</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            NEXRAD from IEM, composite from RainViewer, alerts from NWS, reports from IEM LSR.
          </p>
        </header>

        {wx.data && (
          <div className="rounded-lg bg-card p-4 shadow-[var(--shadow-border)]">
            <p className="font-mono text-xs uppercase tracking-wider text-faint">
              {wx.data.station} · Fort Worth
            </p>
            <p className="mt-1 font-display text-2xl">
              {wx.data.tempF ?? "—"}° · {wx.data.text}
            </p>
            <p className="text-sm text-muted-foreground">
              Wind {wx.data.windMph ?? "—"} mph
              {wx.data.gustMph ? ` gust ${wx.data.gustMph}` : ""}
              {wx.data.humidity != null ? ` · ${wx.data.humidity}% rh` : ""}
            </p>
          </div>
        )}

        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-faint">Product</p>
          <div className="grid grid-cols-3 gap-1">
            {PRODUCTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProduct(p.id)}
                className={cn(
                  "min-h-11 rounded-md px-2 text-xs",
                  product === p.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Toggle pressed={basemap === "sat"} onPressed={() => setBasemap(basemap === "sat" ? "ops" : "sat")}>
            {basemap === "sat" ? "Satellite" : "Ops dark"}
          </Toggle>
          <Toggle pressed={showRadar} onPressed={() => setShowRadar((v) => !v)}>
            Radar
          </Toggle>
          <Toggle pressed={showAlerts} onPressed={() => setShowAlerts((v) => !v)}>
            Alerts
          </Toggle>
          <Toggle pressed={showReports} onPressed={() => setShowReports((v) => !v)}>
            LSR
          </Toggle>
        </div>

        <div className="flex flex-col gap-2">
          {STORMS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => selectStorm(s.id)}
              className={cn(
                "rounded-lg p-3 text-left shadow-[var(--shadow-border)]",
                s.id === storm.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
              )}
            >
              <p className="font-medium">{s.name}</p>
              <p className="text-xs opacity-80">
                {s.hailIn}" hail · {s.windMph} mph
              </p>
            </button>
          ))}
        </div>

        <section>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-faint">
            NWS Texas · {alerts.data.length}
          </p>
          <ul className="flex flex-col gap-2">
            {alerts.data.slice(0, 5).map((a) => (
              <li key={a.id} className="rounded-md bg-card p-3 text-sm shadow-[var(--shadow-border)]">
                <p className="font-medium">{a.event}</p>
                <p className="text-xs text-muted-foreground">{a.area.split(";")[0]}</p>
              </li>
            ))}
            {alerts.status === "error" && (
              <li className="text-sm text-muted-foreground">Alerts feed quiet.</li>
            )}
          </ul>
        </section>

        <section>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-faint">
            DFW reports · {localReports.length}
          </p>
          <ul className="flex flex-col gap-2">
            {localReports.slice(0, 6).map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-2 text-sm">
                <span>
                  <span className="block">{r.city || r.type}</span>
                  <span className="block text-xs text-muted-foreground">{r.type}</span>
                </span>
                <Badge variant={isHailish(r.type) ? "bad" : "warn"}>{r.magnitude || "—"}</Badge>
              </li>
            ))}
            {localReports.length === 0 && (
              <li className="text-sm text-muted-foreground">No hail/wind LSR in the metro this hour.</li>
            )}
          </ul>
        </section>

        <Button asChild variant="secondary">
          <Link to="/recon">
            Score {propertiesForStorm(storm.id).length} roofs in {storm.region}
          </Link>
        </Button>
      </aside>
    </div>
  );
}

function Toggle({
  pressed,
  onPressed,
  children,
}: {
  pressed: boolean;
  onPressed: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onPressed}
      className={cn(
        "min-h-11 rounded-md px-3 text-sm",
        pressed ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

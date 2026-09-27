"use client";

import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PROPERTIES } from "@/lib/atlas/data";
import { dpsTone, usd } from "@/lib/atlas/format";
import { useAtlas } from "@/lib/atlas/store";

export const Route = createFileRoute("/_app/properties/")({
  component: PropertiesPage,
});

function PropertiesPage() {
  const [q, setQ] = useState("");
  const stages = useAtlas((s) => s.stages);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PROPERTIES.filter((p) =>
      !needle
        ? true
        : `${p.address} ${p.city} ${p.owner} ${p.zip}`.toLowerCase().includes(needle),
    ).sort((a, b) => b.dps - a.dps);
  }, [q]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Property intelligence</p>
          <h1 className="font-display text-4xl tracking-tight">Dossiers</h1>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter address or owner"
          className="max-w-sm"
        />
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((p) => (
          <Link
            key={p.id}
            to="/properties/$propertyId"
            params={{ propertyId: p.id }}
            className="overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] transition-transform duration-150 hover:-translate-y-0.5"
          >
            <img
              src={p.photo}
              alt={p.address}
              className="h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
            />
            <div className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{p.address}</p>
                <p className="text-sm text-muted-foreground">
                  {p.city}, {p.state} {p.zip}
                </p>
                <p className="mt-2 text-xs text-faint">
                  {p.owner} · {p.roofAge} yr {p.roofKind}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg tabular-nums">{p.dps}</p>
                <Badge variant={dpsTone(p.dps)}>{stages[p.id] ?? p.stage}</Badge>
                <p className="mt-2 font-mono text-xs tabular-nums text-muted-foreground">
                  {usd(p.estRepair)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

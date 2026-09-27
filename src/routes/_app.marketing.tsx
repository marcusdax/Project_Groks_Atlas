"use client";

import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { BeforeAfter } from "@/components/atlas/before-after";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CAMPAIGNS, propertyById } from "@/lib/atlas/data";
import { usd } from "@/lib/atlas/format";

export const Route = createFileRoute("/_app/marketing")({
  component: MarketingPage,
});

function MarketingPage() {
  const [activeId, setActiveId] = useState(CAMPAIGNS[0].id);
  const campaign = CAMPAIGNS.find((c) => c.id === activeId) ?? CAMPAIGNS[0];
  const property = propertyById(campaign.propertyId);
  if (!property) return null;

  const lift = Math.round(property.estRepair * 0.12);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-faint">Outreach</p>
        <h1 className="font-display text-4xl tracking-tight">Show the roof they already have.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Personalized one-pagers with before/after rendering and a neighborhood-specific value
          case. No generic mailers.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-2">
          {CAMPAIGNS.map((c) => {
            const p = propertyById(c.propertyId);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`rounded-xl p-4 text-left shadow-[var(--shadow-border)] ${
                  c.id === activeId ? "bg-primary text-primary-foreground" : "bg-card"
                }`}
              >
                <p className="text-sm font-medium">{c.headline}</p>
                <p className="mt-1 text-xs opacity-80">
                  {p?.address} · {c.channel}
                </p>
              </button>
            );
          })}
        </div>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between">
            <div>
              <CardTitle>One-pager</CardTitle>
              <p className="text-sm text-muted-foreground">{property.address}</p>
            </div>
            <Badge variant="outline">{campaign.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <BeforeAfter
              before={property.photo}
              after={property.afterPhoto}
              alt={property.address}
            />
            <div className="space-y-3">
              <h2 className="font-display text-2xl">{campaign.headline}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {property.owner.split(" ")[0]}, the {property.roofAge}-year {property.roofKind} roof
                at {property.address} sat under {property.hailIn}" hail. Homes on this block
                trade near {usd(property.homeValue)}. A documented reroof typically recovers about{" "}
                {usd(lift)} at resale in this ZIP — before counting the insurance path.
              </p>
              <p className="text-sm text-muted-foreground">
                Helios can inspect this week with carrier-ready photos already attached to the
                measured sketch.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => toast(`Queued ${campaign.channel} to ${property.owner}`)}>
                Send {campaign.channel}
              </Button>
              <Button variant="secondary" onClick={() => toast("Copied share link")}>
                Copy link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

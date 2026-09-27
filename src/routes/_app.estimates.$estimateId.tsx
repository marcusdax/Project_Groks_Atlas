"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { estimateTotals, lineTotal, propertyById } from "@/lib/atlas/data";
import { usd } from "@/lib/atlas/format";
import { useAtlas } from "@/lib/atlas/store";

export const Route = createFileRoute("/_app/estimates/$estimateId")({
  component: EstimateBuilder,
});

function EstimateBuilder() {
  const { estimateId } = Route.useParams();
  const est = useAtlas((s) => s.estimates[estimateId]);
  const patchLine = useAtlas((s) => s.patchLine);
  const addLine = useAtlas((s) => s.addLine);
  const removeLine = useAtlas((s) => s.removeLine);
  const setEstimateStatus = useAtlas((s) => s.setEstimateStatus);

  if (!est) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center">
        <h1 className="font-display text-3xl">Estimate missing.</h1>
        <Button asChild className="mt-6">
          <Link to="/estimates">All estimates</Link>
        </Button>
      </div>
    );
  }

  const property = propertyById(est.propertyId);
  const { subtotal, tax, total } = estimateTotals(est);

  function exportXml() {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<XACTDOC>
  <ADDR>${property?.address ?? ""}</ADDR>
  <TOTAL>${total.toFixed(2)}</TOTAL>
  ${est.lineItems
    .map(
      (li) =>
        `<ITEM CODE="${li.code}" QTY="${li.quantity}" UNIT="${li.unit}" COST="${li.unitCost}">${li.description}</ITEM>`,
    )
    .join("\n  ")}
</XACTDOC>`;
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${est.id}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Xactimate XML exported");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">{est.id}</p>
          <h1 className="font-display text-4xl tracking-tight">{property?.address}</h1>
          <p className="text-muted-foreground">
            {property?.sqft.toLocaleString()} sf · {property?.pitch} · tax 8.25%
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => addLine(est.id)}>
            <Plus className="size-4" />
            Line
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setEstimateStatus(est.id, "sent");
              toast("Marked sent to carrier");
            }}
          >
            Send
          </Button>
          <Button onClick={exportXml}>Export XML</Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-x-auto">
          <CardHeader>
            <CardTitle>Line items</CardTitle>
          </CardHeader>
          <CardContent className="min-w-[40rem] space-y-3">
            {est.lineItems.map((li) => (
              <div key={li.id} className="grid grid-cols-12 items-center gap-2">
                <Input
                  className="col-span-2"
                  value={li.code}
                  onChange={(e) => patchLine(est.id, li.id, { code: e.target.value })}
                  aria-label="Code"
                />
                <Input
                  className="col-span-4"
                  value={li.description}
                  onChange={(e) => patchLine(est.id, li.id, { description: e.target.value })}
                  aria-label="Description"
                />
                <Input
                  className="col-span-2"
                  type="number"
                  value={li.quantity}
                  onChange={(e) =>
                    patchLine(est.id, li.id, { quantity: Number(e.target.value) })
                  }
                  aria-label="Quantity"
                />
                <Input
                  className="col-span-1"
                  value={li.unit}
                  onChange={(e) => patchLine(est.id, li.id, { unit: e.target.value })}
                  aria-label="Unit"
                />
                <Input
                  className="col-span-2"
                  type="number"
                  value={li.unitCost}
                  onChange={(e) =>
                    patchLine(est.id, li.id, { unitCost: Number(e.target.value) })
                  }
                  aria-label="Unit cost"
                />
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <span className="hidden font-mono text-xs tabular-nums text-muted-foreground xl:inline">
                    {usd(lineTotal(li), true)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Remove line"
                    onClick={() => removeLine(est.id, li.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 font-mono text-sm tabular-nums">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{usd(subtotal, true)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax 8.25%</span>
              <span>{usd(tax, true)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-lg">
              <span>Total</span>
              <span>{usd(total, true)}</span>
            </div>
            <p className="font-sans text-xs text-muted-foreground">
              Compliance price for the carrier. True cost uses local labor multipliers in Helios
              ops, not shown to the adjuster.
            </p>
            {property && (
              <Button asChild variant="outline" className="w-full">
                <Link to="/properties/$propertyId" params={{ propertyId: property.id }}>
                  Back to dossier
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Printer, Ruler, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { propertyById } from "@/lib/atlas/data";
import { downloadFile } from "@/lib/atlas/download";
import {
  buildMeasuredLineItems,
  estimateToCsv,
  estimateToXml,
  estimateTotals,
  lineTotal,
  mergeMeasuredLines,
  suggestedDepreciation,
} from "@/lib/atlas/estimate-engine";
import { usd } from "@/lib/atlas/format";
import { suggestedWastePct } from "@/lib/atlas/roof-geometry";
import { useAtlas } from "@/lib/atlas/store";
import { useRoofModel } from "@/lib/atlas/use-roof-model";
import type { EstimateRecord } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

type EstimateSettings = Pick<
  EstimateRecord,
  "taxRate" | "overheadPct" | "profitPct" | "depreciationPct" | "deductible"
>;

export const Route = createFileRoute("/_app/estimates/$estimateId")({
  component: EstimateBuilder,
});

/** Code · description · qty · unit · unit $ · tax · total */
const COLS = "grid grid-cols-[6.5rem_minmax(11rem,1fr)_5.5rem_3.5rem_5.5rem_2.5rem_8.5rem] gap-2";

const pct = (fraction: number | undefined) => Math.round((fraction ?? 0) * 10000) / 100;

function EstimateBuilder() {
  const { estimateId } = Route.useParams();
  const est = useAtlas((s) => s.estimates[estimateId]);
  const measurement = useAtlas((s) => (est ? s.measurements[est.propertyId] : undefined));
  const patchLine = useAtlas((s) => s.patchLine);
  const addLine = useAtlas((s) => s.addLine);
  const removeLine = useAtlas((s) => s.removeLine);
  const setEstimateStatus = useAtlas((s) => s.setEstimateStatus);
  const patchEstimate = useAtlas((s) => s.patchEstimate);
  const replaceLines = useAtlas((s) => s.replaceLines);
  const roof = useRoofModel(measurement);

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
  const t = estimateTotals(est);
  const fileBase = est.id;

  function rebuild() {
    if (!roof.model || !measurement || !property || !est) return;
    const waste =
      est.basis === "measured"
        ? Math.round(est.wastePct * 100)
        : suggestedWastePct(roof.model.totals);
    const lines = buildMeasuredLineItems({
      totals: roof.model.totals,
      roofKind: property.roofKind,
      wastePct: waste,
      layers: measurement.layers,
      stories: measurement.stories,
    });
    replaceLines(est.id, mergeMeasuredLines(est.lineItems, lines), waste);
    toast("Rebuilt from measurement", { description: `${lines.length} lines · ${waste}% waste` });
  }

  const setting = (key: keyof EstimateSettings, label: string, value: number, fraction = true) => (
    <label className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1">
        <NumberInput
          className="h-8 w-24 text-right font-mono"
          value={value}
          onValue={(n) => patchEstimate(est.id, { [key]: Math.max(0, fraction ? n / 100 : n) })}
          aria-label={label}
        />
        <span className="w-3 text-faint">{fraction ? "%" : ""}</span>
      </span>
    </label>
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            {est.id} · {est.status}
          </p>
          <h1 className="font-display text-4xl tracking-tight">{property?.address}</h1>
          <p className="text-muted-foreground">
            {roof.model
              ? `${Math.round(roof.model.totals.areaSqft).toLocaleString()} sf measured · ${roof.model.totals.predominantPitch}/12`
              : `${property?.sqft.toLocaleString()} sf on record · ${property?.pitch}`}
            {" · "}waste {Math.round(est.wastePct * 100)}%
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
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
            Mark sent
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              downloadFile(`${fileBase}.csv`, estimateToCsv(est), "text/csv;charset=utf-8");
              toast("CSV exported");
            }}
          >
            CSV
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button
            onClick={() => {
              downloadFile(
                `${fileBase}.xml`,
                estimateToXml(est, property?.address ?? ""),
                "application/xml",
              );
              toast("Xactimate-style XML exported");
            }}
          >
            Export XML
          </Button>
        </div>
      </header>

      {est.basis !== "measured" && (
        <Card className="no-print flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Ruler className="mt-0.5 size-4 text-warn" />
            <p className="text-sm">
              These quantities are rough placeholders.{" "}
              <span className="text-muted-foreground">
                Rebuild them from the roof measurement for real squares, ridge, hip, valley and
                drip-edge lengths.
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/measure" search={{ property: est.propertyId }}>
                Review measurement
              </Link>
            </Button>
            <Button size="sm" onClick={rebuild} disabled={!roof.model}>
              Rebuild from measurement
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="print-plain overflow-x-auto lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line items</CardTitle>
            {est.basis === "measured" && (
              <Button
                size="sm"
                variant="ghost"
                className="no-print"
                onClick={rebuild}
                disabled={!roof.model}
              >
                <Ruler className="size-4" />
                Re-measure
              </Button>
            )}
          </CardHeader>
          <CardContent className="min-w-[48rem] space-y-2">
            <div className={cn(COLS, "px-1 font-mono text-xs uppercase tracking-wider text-faint")}>
              <span>Code</span>
              <span>Description</span>
              <span className="text-right">Qty</span>
              <span>Unit</span>
              <span className="text-right">Unit $</span>
              <span className="text-center">Tax</span>
              <span className="text-right">Total</span>
            </div>
            {est.lineItems.map((li) => (
              <div key={li.id} className={cn(COLS, "items-center")}>
                <Input
                  className="font-mono text-xs"
                  value={li.code}
                  onChange={(e) => patchLine(est.id, li.id, { code: e.target.value })}
                  aria-label="Code"
                />
                <Input
                  value={li.description}
                  onChange={(e) => patchLine(est.id, li.id, { description: e.target.value })}
                  aria-label="Description"
                />
                <NumberInput
                  className="px-2 text-right font-mono"
                  value={li.quantity}
                  onValue={(n) => patchLine(est.id, li.id, { quantity: n })}
                  aria-label="Quantity"
                />
                <Input
                  className="px-2"
                  value={li.unit}
                  onChange={(e) => patchLine(est.id, li.id, { unit: e.target.value })}
                  aria-label="Unit"
                />
                <NumberInput
                  className="px-2 text-right font-mono"
                  value={li.unitCost}
                  onValue={(n) => patchLine(est.id, li.id, { unitCost: n })}
                  aria-label="Unit cost"
                />
                <label className="flex justify-center">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={li.taxable !== false}
                    onChange={(e) => patchLine(est.id, li.id, { taxable: e.target.checked })}
                    aria-label={`Taxable: ${li.description}`}
                  />
                </label>
                <div className="flex items-center justify-end gap-1">
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {usd(lineTotal(li), true)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="no-print"
                    aria-label={`Remove ${li.description}`}
                    onClick={() => removeLine(est.id, li.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            {est.lineItems.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No lines yet.</p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="print-plain">
            <CardHeader>
              <CardTitle>Totals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 font-mono text-sm tabular-nums">
              <Row label="Line items" value={t.subtotal} />
              <Row label={`Tax ${pct(est.taxRate)}% on ${usd(t.taxableBase)}`} value={t.tax} />
              <Row label={`Overhead ${pct(est.overheadPct)}%`} value={t.overhead} />
              <Row label={`Profit ${pct(est.profitPct)}%`} value={t.profit} />
              <Row label="Replacement cost (RCV)" value={t.rcv} strong />
              <Row label={`Depreciation ${pct(est.depreciationPct)}%`} value={-t.depreciation} />
              <Row label="Actual cash value (ACV)" value={t.acv} />
              <Row label="Deductible" value={-t.deductible} />
              <Row label="Net claim (first check)" value={t.netClaim} strong />
              <div className="flex items-center gap-2 pt-1">
                <Badge variant={est.status === "draft" ? "quiet" : "ok"}>{est.status}</Badge>
                {est.basis === "measured" && <Badge variant="ok">measured</Badge>}
              </div>
            </CardContent>
          </Card>

          <Card className="no-print">
            <CardHeader>
              <CardTitle>Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {setting("taxRate", "Sales tax", pct(est.taxRate))}
              {setting("overheadPct", "Overhead", pct(est.overheadPct))}
              {setting("profitPct", "Profit", pct(est.profitPct))}
              {setting("depreciationPct", "Depreciation", pct(est.depreciationPct))}
              {setting("deductible", "Deductible $", est.deductible ?? 0, false)}
              {property && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                  onClick={() =>
                    patchEstimate(est.id, {
                      depreciationPct: suggestedDepreciation(property.roofKind, property.roofAge),
                    })
                  }
                >
                  Use straight-line depreciation for a {property.roofAge}-yr {property.roofKind}{" "}
                  roof ({pct(suggestedDepreciation(property.roofKind, property.roofAge))}%)
                </button>
              )}
              <p className="pt-2 text-xs text-muted-foreground">
                Unit prices are editable defaults — replace them with your regional price list. Tax
                applies to checked lines only.
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
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div
      className={cn(
        "flex justify-between gap-3",
        strong && "border-t border-border pt-2 text-base text-foreground",
      )}
    >
      <span className={cn("font-sans", !strong && "text-muted-foreground")}>{label}</span>
      {/* `|| 0` folds -0 so zero rows read $0.00, not -$0.00. */}
      <span>{usd(value || 0, true)}</span>
    </div>
  );
}

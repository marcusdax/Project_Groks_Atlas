import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildMeasuredLineItems,
  escapeXml,
  estimateToCsv,
  estimateToXml,
  estimateTotals,
  lineTotal,
  mergeMeasuredLines,
  suggestedDepreciation,
} from "./estimate-engine.ts";
import type { RoofTotals } from "./roof-geometry.ts";
import type { EstimateRecord } from "./types.ts";

const est = (over: Partial<EstimateRecord> = {}): EstimateRecord => ({
  id: "e1",
  propertyId: "p1",
  status: "draft",
  taxRate: 0.0825,
  wastePct: 0.1,
  updatedAt: "2026-01-01T00:00:00Z",
  lineItems: [
    {
      id: "a",
      code: "A",
      description: "shingles",
      quantity: 3,
      unit: "SQ",
      unitCost: 0.1,
      taxable: true,
    },
    {
      id: "b",
      code: "B",
      description: "labor",
      quantity: 1,
      unit: "EA",
      unitCost: 100,
      taxable: false,
    },
  ],
  ...over,
});

describe("estimateTotals", () => {
  it("sums in cents (no 0.30000000000000004)", () => {
    assert.equal(lineTotal({ quantity: 3, unitCost: 0.1 }), 0.3);
    const t = estimateTotals(est());
    assert.equal(t.subtotal, 100.3);
  });

  it("taxes only taxable lines", () => {
    const t = estimateTotals(est({ taxRate: 0.1 }));
    assert.equal(t.taxableBase, 0.3);
    assert.equal(t.tax, 0.03);
  });

  it("applies O&P, depreciation and deductible in order", () => {
    const e = est({
      taxRate: 0,
      lineItems: [{ id: "a", code: "A", description: "", quantity: 1, unit: "EA", unitCost: 1000 }],
      overheadPct: 0.1,
      profitPct: 0.1,
      depreciationPct: 0.25,
      deductible: 500,
    });
    const t = estimateTotals(e);
    assert.equal(t.overhead, 100);
    assert.equal(t.profit, 100);
    assert.equal(t.rcv, 1200);
    assert.equal(t.depreciation, 300);
    assert.equal(t.acv, 900);
    assert.equal(t.netClaim, 400);
  });

  it("never pays out a negative claim and tolerates junk input", () => {
    const e = est({ deductible: 1e9 });
    e.lineItems[0].quantity = Number.NaN;
    const t = estimateTotals(e);
    assert.equal(t.netClaim, 0);
    assert.ok(Number.isFinite(t.rcv));
  });
});

const totals: RoofTotals = {
  areaSqft: 2400,
  planSqft: 2000,
  squares: 24,
  facets: 6,
  eaveFt: 180,
  rakeFt: 40,
  ridgeFt: 30,
  hipFt: 90,
  valleyFt: 20,
  perimeterFt: 220,
  ridgeHeightFt: 10,
  predominantPitch: 8,
};

describe("buildMeasuredLineItems", () => {
  const items = buildMeasuredLineItems({
    totals,
    roofKind: "architectural",
    wastePct: 12,
    layers: 2,
    stories: 2,
  });
  const by = (id: string) => items.find((i) => i.id === `m-${id}`);

  it("derives quantities from the measurement", () => {
    assert.equal(by("tear")?.quantity, 48);
    assert.equal(by("felt")?.quantity, 24);
    assert.equal(by("iws")?.quantity, 60);
    assert.equal(by("shingle")?.quantity, 27);
    assert.equal(by("starter")?.quantity, 220);
    assert.equal(by("drip")?.quantity, 220);
    assert.equal(by("ridgecap")?.quantity, 120);
    assert.equal(by("ridgevent")?.quantity, 30);
    assert.equal(by("steep")?.code, "RFG STEEP");
    assert.equal(by("high")?.quantity, 24);
    assert.equal(by("dump")?.quantity, 2);
    assert.ok(items.every((i) => i.measured));
  });

  it("skips lines with no quantity", () => {
    const flat = buildMeasuredLineItems({
      totals: { ...totals, valleyFt: 0, ridgeFt: 0, predominantPitch: 4 },
      roofKind: "composition",
      wastePct: 10,
      layers: 1,
      stories: 1,
    });
    for (const id of ["iws", "ridgevent", "steep", "high"]) {
      assert.equal(
        flat.find((i) => i.id === `m-${id}`),
        undefined,
        id,
      );
    }
  });

  it("keeps hand-added lines on rebuild", () => {
    const merged = mergeMeasuredLines(
      [
        { id: "li-tear", code: "", description: "", quantity: 1, unit: "", unitCost: 1 },
        { id: "custom-1", code: "PERMIT", description: "", quantity: 1, unit: "EA", unitCost: 150 },
      ],
      items,
    );
    assert.equal(merged.length, items.length + 1);
    assert.equal(merged.at(-1)?.id, "custom-1");
  });
});

describe("exports", () => {
  it("escapes XML", () => {
    assert.equal(escapeXml(`<a & "b">`), "&lt;a &amp; &quot;b&quot;&gt;");
    const xml = estimateToXml(
      est({
        lineItems: [
          { id: "x", code: "R&R", description: "Tear <off>", quantity: 1, unit: "EA", unitCost: 1 },
        ],
      }),
      "12 Oak & Elm",
    );
    assert.ok(xml.includes("12 Oak &amp; Elm"));
    assert.ok(xml.includes('CODE="R&amp;R"'));
    assert.ok(!xml.includes("<off>"));
  });

  it("guards CSV against formula injection but leaves numbers alone", () => {
    const csv = estimateToCsv(
      est({
        lineItems: [
          {
            id: "x",
            code: "=HYPERLINK(1)",
            description: 'a"b',
            quantity: 1,
            unit: "EA",
            unitCost: 1,
          },
        ],
      }),
    );
    assert.ok(csv.includes(`"'=HYPERLINK(1)"`));
    assert.ok(csv.includes(`"a""b"`));
    const withDep = estimateToCsv(est({ depreciationPct: 0.5 }));
    assert.ok(/"-\d+\.\d\d"/.test(withDep), "negative money stays numeric");
    assert.ok(!withDep.includes(`"'-`));
  });

  it("suggests straight-line depreciation, capped", () => {
    assert.equal(suggestedDepreciation("architectural", 15), 0.5);
    assert.equal(suggestedDepreciation("composition", 40), 0.8);
  });
});

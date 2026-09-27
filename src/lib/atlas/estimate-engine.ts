/**
 * Estimate math. Money is summed in integer cents so totals match what a
 * carrier's system reproduces line by line; every rounding step is explicit.
 */
import { squaresWithWaste, type RoofTotals } from "./roof-geometry.ts";
import type { EstimateRecord, LineItem, RoofKind } from "./types.ts";

const cents = (dollars: number) => Math.round(dollars * 100);

export function lineTotal(item: Pick<LineItem, "quantity" | "unitCost">) {
  return cents(item.quantity * item.unitCost) / 100;
}

export interface EstimateTotals {
  subtotal: number;
  taxableBase: number;
  tax: number;
  overhead: number;
  profit: number;
  /** Replacement cost value — what the scope costs today. */
  rcv: number;
  depreciation: number;
  /** Actual cash value — RCV less depreciation. */
  acv: number;
  deductible: number;
  /** First check from the carrier: ACV less deductible. */
  netClaim: number;
  /** Alias of RCV for list views. */
  total: number;
}

export function estimateTotals(est: EstimateRecord): EstimateTotals {
  let sub = 0;
  let taxable = 0;
  for (const li of est.lineItems) {
    const c = cents((Number(li.quantity) || 0) * (Number(li.unitCost) || 0));
    sub += c;
    if (li.taxable !== false) taxable += c;
  }
  const tax = Math.round(taxable * (est.taxRate || 0));
  const base = sub + tax;
  const overhead = Math.round(base * (est.overheadPct ?? 0));
  const profit = Math.round(base * (est.profitPct ?? 0));
  const rcv = base + overhead + profit;
  const depreciation = Math.round(rcv * clamp01(est.depreciationPct ?? 0));
  const acv = rcv - depreciation;
  const deductible = cents(Math.max(0, est.deductible ?? 0));
  return {
    subtotal: sub / 100,
    taxableBase: taxable / 100,
    tax: tax / 100,
    overhead: overhead / 100,
    profit: profit / 100,
    rcv: rcv / 100,
    depreciation: depreciation / 100,
    acv: acv / 100,
    deductible: deductible / 100,
    netClaim: Math.max(0, acv - deductible) / 100,
    total: rcv / 100,
  };
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/** Typical service life, for a straight-line depreciation suggestion. */
export const ROOF_LIFE_YEARS: Record<RoofKind, number> = {
  composition: 20,
  architectural: 30,
  metal: 50,
  tile: 50,
};

export function suggestedDepreciation(kind: RoofKind, ageYears: number) {
  return Math.min(0.8, Math.max(0, ageYears / ROOF_LIFE_YEARS[kind]));
}

type PriceLine = Pick<LineItem, "code" | "description" | "unit" | "unitCost" | "taxable">;

/**
 * Default unit prices (installed, DFW, 2026). Placeholders to be replaced with
 * the contractor's own price list; every line stays editable in the builder.
 */
export const PRICE_BOOK = {
  tearOff: {
    code: "RFG ARMV",
    description: "Remove roofing, per layer",
    unit: "SQ",
    unitCost: 85,
    taxable: false,
  },
  underlayment: {
    code: "RFG SYNF",
    description: "Synthetic underlayment",
    unit: "SQ",
    unitCost: 48,
    taxable: true,
  },
  iceWater: {
    code: "RFG IWS",
    description: "Ice & water shield — valleys",
    unit: "SF",
    unitCost: 1.95,
    taxable: true,
  },
  starter: {
    code: "RFG ASTR",
    description: "Starter strip — eaves & rakes",
    unit: "LF",
    unitCost: 2.1,
    taxable: true,
  },
  drip: {
    code: "RFG DRIP",
    description: "Drip edge, aluminum",
    unit: "LF",
    unitCost: 3.4,
    taxable: true,
  },
  ridgeCap: {
    code: "RFG RIDGC",
    description: "Hip / ridge cap shingles",
    unit: "LF",
    unitCost: 6.8,
    taxable: true,
  },
  ridgeVent: {
    code: "RFG RVNT",
    description: "Ridge vent, shingle-over",
    unit: "LF",
    unitCost: 9.2,
    taxable: true,
  },
  steep7: {
    code: "RFG STEEP",
    description: "Steep roof charge, 7/12–9/12",
    unit: "SQ",
    unitCost: 38,
    taxable: false,
  },
  steep10: {
    code: "RFG STEEP+",
    description: "Steep roof charge, 10/12–12/12",
    unit: "SQ",
    unitCost: 58,
    taxable: false,
  },
  steep13: {
    code: "RFG STEEP++",
    description: "Steep roof charge, over 12/12",
    unit: "SQ",
    unitCost: 78,
    taxable: false,
  },
  high: {
    code: "RFG HIGH",
    description: "High roof charge, 2+ stories",
    unit: "SQ",
    unitCost: 22,
    taxable: false,
  },
  dumpster: {
    code: "DMO DUMP",
    description: "Dumpster load, ~30 yd",
    unit: "EA",
    unitCost: 580,
    taxable: false,
  },
} satisfies Record<string, PriceLine>;

export const ROOFING: Record<RoofKind, PriceLine> = {
  composition: {
    code: "RFG 240",
    description: "3-tab composition shingles, 25-yr",
    unit: "SQ",
    unitCost: 360,
    taxable: true,
  },
  architectural: {
    code: "RFG 300S",
    description: "Laminated architectural shingles, 30-yr",
    unit: "SQ",
    unitCost: 425,
    taxable: true,
  },
  metal: {
    code: "RFG MTLS",
    description: "Standing seam metal roofing",
    unit: "SQ",
    unitCost: 980,
    taxable: true,
  },
  tile: {
    code: "RFG TILE",
    description: "Concrete tile roofing",
    unit: "SQ",
    unitCost: 1150,
    taxable: true,
  },
};

export interface MeasuredScopeInput {
  totals: RoofTotals;
  roofKind: RoofKind;
  wastePct: number;
  layers: number;
  stories: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Line items that follow directly from a roof measurement. */
export function buildMeasuredLineItems(input: MeasuredScopeInput): LineItem[] {
  const { totals: t, roofKind, wastePct, layers, stories } = input;
  const areaSq = round2(t.areaSqft / 100);
  const lines: LineItem[] = [];
  const add = (key: string, price: PriceLine, quantity: number, note?: string) => {
    if (!(quantity > 0)) return;
    lines.push({
      id: `m-${key}`,
      ...price,
      description: note ? `${price.description} ${note}` : price.description,
      quantity: round2(quantity),
      measured: true,
    });
  };

  const layerCount = Math.max(1, Math.round(layers));
  add(
    "tear",
    PRICE_BOOK.tearOff,
    areaSq * layerCount,
    layerCount > 1 ? `(${layerCount} layers)` : "",
  );
  add("felt", PRICE_BOOK.underlayment, areaSq);
  add("iws", PRICE_BOOK.iceWater, t.valleyFt * 3);
  add(
    "shingle",
    ROOFING[roofKind],
    squaresWithWaste(t.areaSqft, wastePct),
    `(+${wastePct}% waste)`,
  );
  add("starter", PRICE_BOOK.starter, t.eaveFt + t.rakeFt);
  add("drip", PRICE_BOOK.drip, t.eaveFt + t.rakeFt);
  add("ridgecap", PRICE_BOOK.ridgeCap, t.ridgeFt + t.hipFt);
  add("ridgevent", PRICE_BOOK.ridgeVent, t.ridgeFt);

  const pitch = t.predominantPitch;
  if (pitch >= 13) add("steep", PRICE_BOOK.steep13, areaSq);
  else if (pitch >= 10) add("steep", PRICE_BOOK.steep10, areaSq);
  else if (pitch >= 7) add("steep", PRICE_BOOK.steep7, areaSq);
  if (stories >= 2) add("high", PRICE_BOOK.high, areaSq);

  add("dump", PRICE_BOOK.dumpster, Math.max(1, Math.ceil((areaSq * layerCount) / 30)));
  return lines;
}

/** Swap measured lines for fresh ones; keep anything the estimator added by hand. */
export function mergeMeasuredLines(existing: LineItem[], measured: LineItem[]) {
  const manual = existing.filter((li) => li.id.startsWith("custom-"));
  return [...measured, ...manual];
}

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

export function escapeXml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => XML_ESCAPES[c]);
}

export function estimateToXml(est: EstimateRecord, address: string) {
  const t = estimateTotals(est);
  const items = est.lineItems
    .map(
      (li) =>
        `    <ITEM CODE="${escapeXml(li.code)}" QTY="${escapeXml(li.quantity)}" UNIT="${escapeXml(li.unit)}" COST="${escapeXml(li.unitCost)}" TAXABLE="${li.taxable === false ? "N" : "Y"}" TOTAL="${lineTotal(li).toFixed(2)}">${escapeXml(li.description)}</ITEM>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<XACTDOC ID="${escapeXml(est.id)}" STATUS="${escapeXml(est.status)}">
  <ADDR>${escapeXml(address)}</ADDR>
  <ITEMS>
${items}
  </ITEMS>
  <TOTALS SUBTOTAL="${t.subtotal.toFixed(2)}" TAX="${t.tax.toFixed(2)}" TAXRATE="${est.taxRate}" OVERHEAD="${t.overhead.toFixed(2)}" PROFIT="${t.profit.toFixed(2)}" RCV="${t.rcv.toFixed(2)}" DEPRECIATION="${t.depreciation.toFixed(2)}" ACV="${t.acv.toFixed(2)}" DEDUCTIBLE="${t.deductible.toFixed(2)}" NET="${t.netClaim.toFixed(2)}"/>
</XACTDOC>
`;
}

function csvCell(value: unknown) {
  const s = String(value ?? "");
  // Neutralise spreadsheet formula injection, then quote.
  const formula = /^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s);
  const safe = formula ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function estimateToCsv(est: EstimateRecord) {
  const t = estimateTotals(est);
  const rows: unknown[][] = [
    ["Code", "Description", "Quantity", "Unit", "Unit cost", "Taxable", "Total"],
    ...est.lineItems.map((li) => [
      li.code,
      li.description,
      li.quantity,
      li.unit,
      li.unitCost.toFixed(2),
      li.taxable === false ? "N" : "Y",
      lineTotal(li).toFixed(2),
    ]),
    [],
    ["", "Subtotal", "", "", "", "", t.subtotal.toFixed(2)],
    ["", `Tax ${(est.taxRate * 100).toFixed(3)}%`, "", "", "", "", t.tax.toFixed(2)],
    ["", "Overhead", "", "", "", "", t.overhead.toFixed(2)],
    ["", "Profit", "", "", "", "", t.profit.toFixed(2)],
    ["", "RCV", "", "", "", "", t.rcv.toFixed(2)],
    ["", "Depreciation", "", "", "", "", (-t.depreciation).toFixed(2)],
    ["", "ACV", "", "", "", "", t.acv.toFixed(2)],
    ["", "Deductible", "", "", "", "", (-t.deductible).toFixed(2)],
    ["", "Net claim", "", "", "", "", t.netClaim.toFixed(2)],
  ];
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

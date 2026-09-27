import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
  buildRoofModel,
  makeProjection,
  pitchFactor,
  squaresWithWaste,
  suggestedWastePct,
  type SkeletonBuilder,
} from "./roof-geometry.ts";
import type { LngLat } from "./types.ts";

let build: SkeletonBuilder;

before(async () => {
  // The Wasm build is web-targeted; give it the globals it probes for.
  const g = globalThis as Record<string, unknown>;
  g.self ??= globalThis;
  g.window ??= globalThis;
  const { SkeletonBuilder } = createRequire(import.meta.url)("straight-skeleton");
  await SkeletonBuilder.init();
  build = (rings) => SkeletonBuilder.buildFromPolygon(rings);
});

const ORIGIN: LngLat = [-96.8, 32.9];
const proj = makeProjection(ORIGIN);
/** Footprint from local-feet coordinates. */
const fp = (pts: [number, number][]) => pts.map((p) => proj.toLngLat(p));
const near = (a: number, b: number, tol: number, msg?: string) =>
  assert.ok(Math.abs(a - b) <= tol, `${msg ?? ""} expected ${b} ± ${tol}, got ${a}`);

describe("buildRoofModel", () => {
  const rect = fp([
    [0, 0],
    [40, 0],
    [40, 30],
    [0, 30],
  ]);

  it("hip roof on a 40×30 rectangle", () => {
    const m = buildRoofModel({ footprint: rect, pitchRise: 6 }, build);
    near(m.totals.planSqft, 1200, 0.5, "plan");
    near(m.totals.areaSqft, 1200 * pitchFactor(6), 1, "sloped area");
    assert.equal(m.totals.facets, 4);
    near(m.totals.eaveFt, 140, 0.1, "eaves");
    near(m.totals.ridgeFt, 10, 0.05, "ridge");
    // Hip run: corner to (15,15) in plan, rise 15*0.5.
    const hip = Math.hypot(15, 15, 7.5);
    near(m.totals.hipFt, 4 * hip, 0.1, "hips");
    assert.equal(m.totals.valleyFt, 0);
    assert.equal(m.totals.rakeFt, 0);
    near(m.totals.ridgeHeightFt, 7.5, 0.01, "ridge height");
    assert.equal(m.totals.predominantPitch, 6);
  });

  it("gable roof when both short ends are gables", () => {
    // Short edges are 1 (40,0)->(40,30) and 3 (0,30)->(0,0).
    const m = buildRoofModel({ footprint: rect, pitchRise: 6, gableEdges: [1, 3] }, build);
    assert.equal(m.totals.facets, 2);
    near(m.totals.planSqft, 1200, 0.5, "plan");
    near(m.totals.areaSqft, 1200 * pitchFactor(6), 1, "area");
    near(m.totals.ridgeFt, 40, 0.05, "ridge");
    near(m.totals.eaveFt, 80, 0.05, "eaves");
    near(m.totals.rakeFt, 4 * Math.hypot(15, 7.5), 0.1, "rakes");
    assert.equal(m.totals.hipFt, 0);
    assert.equal(m.gables.length, 2);
    for (const e of m.edges.filter((x) => x.kind === "rake")) {
      assert.ok(e.footprintEdge === 1 || e.footprintEdge === 3);
    }
  });

  it("winding does not matter, gable indices follow the caller's order", () => {
    // Reversed: (0,30) (40,30) (40,0) (0,0) — short ends are edges 1 and 3.
    const cw = rect.slice().reverse();
    const m = buildRoofModel({ footprint: cw, pitchRise: 6, gableEdges: [1, 3] }, build);
    near(m.totals.ridgeFt, 40, 0.05, "ridge");
    near(m.totals.rakeFt, 4 * Math.hypot(15, 7.5), 0.1, "rakes");
    const rakeEdges = new Set(m.edges.filter((e) => e.kind === "rake").map((e) => e.footprintEdge));
    assert.deepEqual([...rakeEdges].sort(), [1, 3]);
    const eaveEdges = new Set(m.edges.filter((e) => e.kind === "eave").map((e) => e.footprintEdge));
    assert.deepEqual([...eaveEdges].sort(), [0, 2]);
  });

  it("L-shape yields a valley", () => {
    const L = fp([
      [0, 0],
      [40, 0],
      [40, 20],
      [20, 20],
      [20, 40],
      [0, 40],
    ]);
    const m = buildRoofModel({ footprint: L, pitchRise: 8 }, build);
    near(m.totals.planSqft, 1200, 0.5, "plan");
    near(m.totals.areaSqft, 1200 * pitchFactor(8), 1.5, "area");
    // One valley from the reflex corner (20,20) up to (10,10).
    near(m.totals.valleyFt, Math.hypot(10, 10, 10 * (8 / 12)), 0.1, "valley");
    assert.ok(m.totals.hipFt > 0);
    near(m.totals.eaveFt, 160, 0.1, "eaves");
  });

  it("drops duplicate closing and collinear points", () => {
    const withJunk = fp([
      [0, 0],
      [20, 0],
      [40, 0],
      [40, 30],
      [0, 30],
      [0, 0],
    ]);
    const m = buildRoofModel({ footprint: withJunk, pitchRise: 6 }, build);
    near(m.totals.planSqft, 1200, 0.5, "plan");
    assert.ok(m.warnings.some((w) => w.includes("Dropped")));
  });

  it("rejects degenerate footprints", () => {
    assert.throws(() => buildRoofModel({ footprint: rect.slice(0, 2), pitchRise: 6 }, build));
  });
});

describe("waste", () => {
  it("rounds squares up to the bundle", () => {
    assert.equal(squaresWithWaste(1000, 0), 10);
    near(squaresWithWaste(1010, 0), 10 + 1 / 3, 1e-9);
    near(squaresWithWaste(2000, 10), 22, 1e-9);
  });

  it("suggests more waste for cut-up roofs", () => {
    const base = {
      areaSqft: 2000,
      planSqft: 1800,
      squares: 20,
      eaveFt: 0,
      rakeFt: 0,
      ridgeFt: 0,
      perimeterFt: 0,
      ridgeHeightFt: 0,
      predominantPitch: 6,
    };
    const gable = suggestedWastePct({ ...base, facets: 2, hipFt: 0, valleyFt: 0 });
    const hip = suggestedWastePct({ ...base, facets: 4, hipFt: 80, valleyFt: 0 });
    const complex = suggestedWastePct({ ...base, facets: 12, hipFt: 150, valleyFt: 60 });
    assert.ok(gable < hip && hip < complex, `${gable} ${hip} ${complex}`);
    assert.ok(gable >= 5 && complex <= 25);
  });
});

describe("seedMeasurement", () => {
  it("reproduces every record's roof area", async () => {
    const { PROPERTIES } = await import("./data.ts");
    const { seedMeasurement } = await import("./measure-seed.ts");
    for (const p of PROPERTIES) {
      const m = buildRoofModel(seedMeasurement(p), build);
      near(m.totals.areaSqft, p.sqft, p.sqft * 0.01, p.id);
      assert.deepEqual(m.warnings, [], p.id);
    }
  });
});

describe("pickBuilding", () => {
  it("prefers the outline under the pin, then the nearest", async () => {
    const { pickBuilding } = await import("./footprint.ts");
    const sq = (x: number, id: number) => ({
      type: "way",
      id,
      geometry: [
        [x, 0],
        [x + 1, 0],
        [x + 1, 1],
        [x, 1],
        [x, 0],
      ].map(([lon, lat]) => ({ lon: lon * 1e-4, lat: lat * 1e-4 })),
    });
    const hit = pickBuilding([sq(5, 1), sq(0, 2), { type: "node" }], [0.5e-4, 0.5e-4]);
    assert.equal(hit?.osmId, 2);
    assert.equal(hit?.containsPoint, true);
    assert.equal(hit?.footprint.length, 4);
    const near = pickBuilding([sq(5, 1), sq(2, 3)], [0, 0.5e-4]);
    assert.equal(near?.osmId, 3);
    assert.equal(pickBuilding([], [0, 0]), null);
  });
});

describe("suggestedWastePct ranges", () => {
  const t = (facets: number, cuts: number, squares = 25) => ({
    areaSqft: squares * 100,
    planSqft: 0,
    squares,
    facets,
    eaveFt: 0,
    rakeFt: 0,
    ridgeFt: 0,
    hipFt: cuts,
    valleyFt: 0,
    perimeterFt: 0,
    ridgeHeightFt: 0,
    predominantPitch: 6,
  });
  it("lands in the usual table bands", () => {
    const gable = suggestedWastePct(t(2, 0));
    const hip = suggestedWastePct(t(4, 85));
    const big = suggestedWastePct(t(20, 447, 55.6));
    assert.ok(gable >= 5 && gable <= 8, `gable ${gable}`);
    assert.ok(hip >= 9 && hip <= 13, `hip ${hip}`);
    assert.ok(big >= 16 && big <= 22, `complex ${big}`);
  });
});

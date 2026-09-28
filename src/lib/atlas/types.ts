export type DamageKind = "hail" | "wind" | "hail+wind";
export type RoofKind = "composition" | "architectural" | "metal" | "tile";
export type LeadStage =
  | "flagged"
  | "qualified"
  | "inspected"
  | "estimated"
  | "sent"
  | "won"
  | "lost";
export type EstimateStatus = "draft" | "review" | "sent" | "approved";
export type StormSeverity = "watch" | "moderate" | "severe" | "extreme";

export interface StormEvent {
  id: string;
  name: string;
  region: string;
  occurredAt: string;
  hailIn: number;
  windMph: number;
  durationMin: number;
  severity: StormSeverity;
  lat: number;
  lng: number;
  radiusKm: number;
  propertyIds: string[];
}

export interface PropertyRecord {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  owner: string;
  stories: number;
  roofKind: RoofKind;
  roofAge: number;
  roofYear: number;
  sqft: number;
  pitch: string;
  pitchDeg: number;
  hailIn: number;
  windMph: number;
  dps: number;
  stormId: string;
  homeValue: number;
  estRepair: number;
  stage: LeadStage;
  damageKind: DamageKind;
  affectedPct: number;
  insurance: string;
  photo: string;
  aerial: string;
  afterPhoto: string;
  notes: string;
}

export interface LineItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  /** Sales tax applies to this line (materials). Defaults to true. */
  taxable?: boolean;
  /** Generated from the roof measurement; replaced on rebuild. */
  measured?: boolean;
}

export interface EstimateRecord {
  id: string;
  propertyId: string;
  status: EstimateStatus;
  taxRate: number;
  wastePct: number;
  lineItems: LineItem[];
  updatedAt: string;
  /** Overhead and profit, each a fraction of (subtotal + tax). */
  overheadPct?: number;
  profitPct?: number;
  /** Fraction of RCV withheld as depreciation (ACV = RCV − depreciation). */
  depreciationPct?: number;
  deductible?: number;
  /** "measured" once built from a roof measurement. */
  basis?: "seed" | "measured";
}

export interface Campaign {
  id: string;
  propertyId: string;
  channel: "direct-mail" | "sms" | "email";
  headline: string;
  status: "ready" | "queued" | "sent";
}

export type LngLat = [number, number];

export type FootprintSource = "osm" | "drawn" | "seed";

/** What the estimator measured. The roof model is derived from this. */
export interface MeasurementInput {
  footprint: LngLat[];
  pitchRise: number;
  gableEdges: number[];
  stories: number;
  layers: number;
  source: FootprintSource;
  updatedAt: string;
}

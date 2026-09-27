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

export interface RoofPlane {
  id: string;
  label: string;
  sqft: number;
  pitch: string;
  path: string;
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
  planes: RoofPlane[];
  notes: string;
}

export interface LineItem {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface EstimateRecord {
  id: string;
  propertyId: string;
  status: EstimateStatus;
  taxRate: number;
  wastePct: number;
  lineItems: LineItem[];
  updatedAt: string;
}

export interface Campaign {
  id: string;
  propertyId: string;
  channel: "direct-mail" | "sms" | "email";
  headline: string;
  status: "ready" | "queued" | "sent";
}

import { create } from "zustand";
import { ESTIMATES, PROPERTIES } from "./data";
import type { EstimateRecord, LeadStage, LineItem } from "./types";

type AtlasState = {
  stages: Record<string, LeadStage>;
  estimates: Record<string, EstimateRecord>;
  selectedStormId: string;
  selectedPropertyId: string | null;
  setStage: (propertyId: string, stage: LeadStage) => void;
  selectStorm: (id: string) => void;
  selectProperty: (id: string | null) => void;
  patchLine: (estimateId: string, itemId: string, patch: Partial<LineItem>) => void;
  addLine: (estimateId: string) => void;
  removeLine: (estimateId: string, itemId: string) => void;
  setEstimateStatus: (estimateId: string, status: EstimateRecord["status"]) => void;
};

const stageSeed = Object.fromEntries(PROPERTIES.map((p) => [p.id, p.stage]));
const estimateSeed = Object.fromEntries(ESTIMATES.map((e) => [e.id, structuredClone(e)]));

export const useAtlas = create<AtlasState>()((set) => ({
  stages: stageSeed,
  estimates: estimateSeed,
  selectedStormId: "stx-preston",
  selectedPropertyId: "p-meadow",
  setStage: (propertyId, stage) =>
    set((s) => ({ stages: { ...s.stages, [propertyId]: stage } })),
  selectStorm: (id) => set({ selectedStormId: id, selectedPropertyId: null }),
  selectProperty: (id) => set({ selectedPropertyId: id }),
  patchLine: (estimateId, itemId, patch) =>
    set((s) => {
      const est = s.estimates[estimateId];
      if (!est) return s;
      return {
        estimates: {
          ...s.estimates,
          [estimateId]: {
            ...est,
            updatedAt: new Date().toISOString(),
            lineItems: est.lineItems.map((li) =>
              li.id === itemId ? { ...li, ...patch } : li,
            ),
          },
        },
      };
    }),
  addLine: (estimateId) =>
    set((s) => {
      const est = s.estimates[estimateId];
      if (!est) return s;
      const item: LineItem = {
        id: `li-${Date.now()}`,
        code: "MISC",
        description: "Additional line",
        quantity: 1,
        unit: "EA",
        unitCost: 0,
      };
      return {
        estimates: {
          ...s.estimates,
          [estimateId]: { ...est, lineItems: [...est.lineItems, item] },
        },
      };
    }),
  removeLine: (estimateId, itemId) =>
    set((s) => {
      const est = s.estimates[estimateId];
      if (!est) return s;
      return {
        estimates: {
          ...s.estimates,
          [estimateId]: {
            ...est,
            lineItems: est.lineItems.filter((li) => li.id !== itemId),
          },
        },
      };
    }),
  setEstimateStatus: (estimateId, status) =>
    set((s) => {
      const est = s.estimates[estimateId];
      if (!est) return s;
      return {
        estimates: {
          ...s.estimates,
          [estimateId]: { ...est, status, updatedAt: new Date().toISOString() },
        },
      };
    }),
}));

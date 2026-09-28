import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ESTIMATES, PROPERTIES } from "./data";
import { seedMeasurement } from "./measure-seed";
import type { EstimateRecord, LeadStage, LineItem, MeasurementInput } from "./types";

type EstimateSettings = Pick<
  EstimateRecord,
  "taxRate" | "wastePct" | "overheadPct" | "profitPct" | "depreciationPct" | "deductible"
>;

type AtlasState = {
  stages: Record<string, LeadStage>;
  estimates: Record<string, EstimateRecord>;
  measurements: Record<string, MeasurementInput>;
  selectedStormId: string;
  selectedPropertyId: string | null;
  setStage: (propertyId: string, stage: LeadStage) => void;
  selectStorm: (id: string) => void;
  selectProperty: (id: string | null) => void;
  patchLine: (estimateId: string, itemId: string, patch: Partial<LineItem>) => void;
  addLine: (estimateId: string) => void;
  removeLine: (estimateId: string, itemId: string) => void;
  setEstimateStatus: (estimateId: string, status: EstimateRecord["status"]) => void;
  patchEstimate: (estimateId: string, patch: Partial<EstimateSettings>) => void;
  replaceLines: (estimateId: string, lines: LineItem[], wastePct: number) => void;
  setMeasurement: (propertyId: string, patch: Partial<MeasurementInput>) => void;
  resetMeasurement: (propertyId: string) => void;
};

const stageSeed = Object.fromEntries(PROPERTIES.map((p) => [p.id, p.stage]));
const estimateSeed = Object.fromEntries(ESTIMATES.map((e) => [e.id, structuredClone(e)]));
const measurementSeed = Object.fromEntries(PROPERTIES.map((p) => [p.id, seedMeasurement(p)]));

const now = () => new Date().toISOString();

export const useAtlas = create<AtlasState>()(
  persist(
    (set) => {
      const editEstimate = (
        estimateId: string,
        fn: (est: EstimateRecord) => Partial<EstimateRecord>,
      ) =>
        set((s) => {
          const est = s.estimates[estimateId];
          if (!est) return s;
          return {
            estimates: {
              ...s.estimates,
              [estimateId]: { ...est, ...fn(est), updatedAt: now() },
            },
          };
        });

      return {
        stages: stageSeed,
        estimates: estimateSeed,
        measurements: measurementSeed,
        selectedStormId: "stx-preston",
        selectedPropertyId: "p-meadow",
        setStage: (propertyId, stage) =>
          set((s) => ({ stages: { ...s.stages, [propertyId]: stage } })),
        selectStorm: (id) => set({ selectedStormId: id, selectedPropertyId: null }),
        selectProperty: (id) => set({ selectedPropertyId: id }),
        patchLine: (estimateId, itemId, patch) =>
          editEstimate(estimateId, (est) => ({
            lineItems: est.lineItems.map((li) => (li.id === itemId ? { ...li, ...patch } : li)),
          })),
        addLine: (estimateId) =>
          editEstimate(estimateId, (est) => ({
            lineItems: [
              ...est.lineItems,
              {
                id: `custom-${Date.now().toString(36)}`,
                code: "MISC",
                description: "Additional line",
                quantity: 1,
                unit: "EA",
                unitCost: 0,
                taxable: true,
              },
            ],
          })),
        removeLine: (estimateId, itemId) =>
          editEstimate(estimateId, (est) => ({
            lineItems: est.lineItems.filter((li) => li.id !== itemId),
          })),
        setEstimateStatus: (estimateId, status) => editEstimate(estimateId, () => ({ status })),
        patchEstimate: (estimateId, patch) => editEstimate(estimateId, () => patch),
        replaceLines: (estimateId, lines, wastePct) =>
          editEstimate(estimateId, () => ({
            lineItems: lines,
            wastePct: wastePct / 100,
            basis: "measured",
          })),
        setMeasurement: (propertyId, patch) =>
          set((s) => {
            const base = s.measurements[propertyId];
            if (!base) return s;
            return {
              measurements: {
                ...s.measurements,
                [propertyId]: { ...base, ...patch, updatedAt: now() },
              },
            };
          }),
        resetMeasurement: (propertyId) =>
          set((s) => {
            const p = PROPERTIES.find((x) => x.id === propertyId);
            if (!p) return s;
            return { measurements: { ...s.measurements, [propertyId]: seedMeasurement(p) } };
          }),
      };
    },
    {
      name: "atlas-workspace",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated from the app shell after mount so SSR markup matches.
      skipHydration: true,
      partialize: (s) => ({
        stages: s.stages,
        estimates: s.estimates,
        measurements: s.measurements,
        selectedStormId: s.selectedStormId,
      }),
      // Seeds added after a save still appear; saved records win.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AtlasState>;
        return {
          ...current,
          ...p,
          stages: { ...current.stages, ...p.stages },
          estimates: { ...current.estimates, ...p.estimates },
          measurements: { ...current.measurements, ...p.measurements },
        };
      },
    },
  ),
);

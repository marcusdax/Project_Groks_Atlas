import { n as ESTIMATES, r as PROPERTIES } from "./data-DyH99hDQ.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-DGcjGeGr.js
var stageSeed = Object.fromEntries(PROPERTIES.map((p) => [p.id, p.stage]));
var estimateSeed = Object.fromEntries(ESTIMATES.map((e) => [e.id, structuredClone(e)]));
var useAtlas = create()((set) => ({
	stages: stageSeed,
	estimates: estimateSeed,
	selectedStormId: "stx-preston",
	selectedPropertyId: "p-meadow",
	setStage: (propertyId, stage) => set((s) => ({ stages: {
		...s.stages,
		[propertyId]: stage
	} })),
	selectStorm: (id) => set({
		selectedStormId: id,
		selectedPropertyId: null
	}),
	selectProperty: (id) => set({ selectedPropertyId: id }),
	patchLine: (estimateId, itemId, patch) => set((s) => {
		const est = s.estimates[estimateId];
		if (!est) return s;
		return { estimates: {
			...s.estimates,
			[estimateId]: {
				...est,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
				lineItems: est.lineItems.map((li) => li.id === itemId ? {
					...li,
					...patch
				} : li)
			}
		} };
	}),
	addLine: (estimateId) => set((s) => {
		const est = s.estimates[estimateId];
		if (!est) return s;
		const item = {
			id: `li-${Date.now()}`,
			code: "MISC",
			description: "Additional line",
			quantity: 1,
			unit: "EA",
			unitCost: 0
		};
		return { estimates: {
			...s.estimates,
			[estimateId]: {
				...est,
				lineItems: [...est.lineItems, item]
			}
		} };
	}),
	removeLine: (estimateId, itemId) => set((s) => {
		const est = s.estimates[estimateId];
		if (!est) return s;
		return { estimates: {
			...s.estimates,
			[estimateId]: {
				...est,
				lineItems: est.lineItems.filter((li) => li.id !== itemId)
			}
		} };
	}),
	setEstimateStatus: (estimateId, status) => set((s) => {
		const est = s.estimates[estimateId];
		if (!est) return s;
		return { estimates: {
			...s.estimates,
			[estimateId]: {
				...est,
				status,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		} };
	})
}));
//#endregion
export { useAtlas as t };

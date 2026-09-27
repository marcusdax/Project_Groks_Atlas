import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { r as PROPERTIES } from "./_ssr/data-DyH99hDQ.mjs";
import { r as usd } from "./_ssr/format-CLSTmkq8.mjs";
import { t as useAtlas } from "./_ssr/store-DGcjGeGr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.leads-ChjEp4lF.js
var import_jsx_runtime = require_jsx_runtime();
var COLUMNS = [
	{
		id: "flagged",
		label: "Flagged"
	},
	{
		id: "qualified",
		label: "Qualified"
	},
	{
		id: "inspected",
		label: "Inspected"
	},
	{
		id: "estimated",
		label: "Estimated"
	},
	{
		id: "sent",
		label: "Sent"
	},
	{
		id: "won",
		label: "Won"
	},
	{
		id: "lost",
		label: "Lost"
	}
];
function LeadsPage() {
	const stages = useAtlas((s) => s.stages);
	const setStage = useAtlas((s) => s.setStage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-wider text-faint",
				children: "Pipeline"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "From cell to close"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-muted-foreground",
				children: "Advance a card to move the job. Atlas keeps the storm, score, and estimate attached."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-3 overflow-x-auto pb-4",
			children: COLUMNS.map((col, index) => {
				const cards = PROPERTIES.filter((p) => (stages[p.id] ?? p.stage) === col.id);
				const next = COLUMNS[index + 1];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "w-56 shrink-0 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-mono text-xs uppercase tracking-wider text-faint",
							children: col.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs tabular-nums",
							children: cards.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-2",
						children: cards.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-md bg-raised p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/properties/$propertyId",
									params: { propertyId: p.id },
									className: "block text-sm font-medium hover:underline",
									children: p.address
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 font-mono text-xs tabular-nums text-muted-foreground",
									children: [
										"DPS ",
										p.dps,
										" · ",
										usd(p.estRepair)
									]
								}),
								next && col.id !== "won" && col.id !== "lost" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setStage(p.id, next.id),
									className: "mt-2 min-h-10 w-full rounded-sm bg-secondary px-2 text-xs text-muted-foreground hover:text-foreground",
									children: ["Advance to ", next.label]
								}) : null
							]
						}, p.id))
					})]
				}, col.id);
			})
		})]
	});
}
//#endregion
export { LeadsPage as component };

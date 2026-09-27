import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { l as propertyById, n as ESTIMATES, o as estimateTotals } from "./_ssr/data-DyH99hDQ.mjs";
import { t as Card } from "./_ssr/card-CoDTZOnH.mjs";
import { r as usd } from "./_ssr/format-CLSTmkq8.mjs";
import { t as useAtlas } from "./_ssr/store-DGcjGeGr.mjs";
import { t as Badge } from "./_ssr/badge-B5azdV7H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.estimates.index-DmYfs5LE.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	draft: "quiet",
	review: "warn",
	sent: "ok",
	approved: "ok"
};
function EstimatesPage() {
	const live = useAtlas((s) => s.estimates);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-wider text-faint",
				children: "Estimation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Carrier-ready scopes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-muted-foreground",
				children: "Line items, regional pricing, waste, and Xactimate export — built on the measured roof, not a clipboard."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: ESTIMATES.map((seed) => {
				const est = live[seed.id] ?? seed;
				const property = propertyById(est.propertyId);
				if (!property) return null;
				const { total } = estimateTotals(est);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/estimates/$estimateId",
					params: { estimateId: est.id },
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: property.address
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								property.city,
								" · ",
								est.lineItems.length,
								" lines · waste ",
								Math.round(est.wastePct * 100),
								"%"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: STATUS_VARIANT[est.status],
								children: est.status
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg tabular-nums",
								children: usd(total)
							})]
						})]
					})
				}, est.id);
			})
		})]
	});
}
//#endregion
export { EstimatesPage as component };

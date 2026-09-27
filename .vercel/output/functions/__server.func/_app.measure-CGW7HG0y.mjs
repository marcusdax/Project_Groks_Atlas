import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./_ssr/router-CPUwhoN_.mjs";
import { t as Button } from "./_ssr/button-CUZ6L0Oj.mjs";
import { r as PROPERTIES } from "./_ssr/data-DyH99hDQ.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-CoDTZOnH.mjs";
import { t as OpsMap } from "./_ssr/ops-map-DDju3wVc.mjs";
import { t as RoofSketch } from "./_ssr/roof-sketch-Xiw50lFL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.measure-CGW7HG0y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MeasurePage() {
	const [id, setId] = (0, import_react.useState)(PROPERTIES[0].id);
	const property = PROPERTIES.find((p) => p.id === id) ?? PROPERTIES[0];
	const squares = Number((property.sqft * 1.1 / 100).toFixed(1));
	const perimeter = Math.round(Math.sqrt(property.sqft) * 4.2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-faint",
					children: "Measurement"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "From report to sketch."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-muted-foreground",
					children: "Instant AI sketch, then a certified editable file. Planes, pitch, and waste already in the estimate."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: PROPERTIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setId(p.id),
					className: cn("min-h-11 shrink-0 rounded-md px-3 text-sm", p.id === id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
					children: [
						p.address.split(" ")[0],
						" ",
						p.city
					]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: property.address }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						property.pitch,
						" · ",
						property.stories,
						" story · ",
						property.roofKind
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoofSketch, {
					planes: property.planes,
					totalSqft: property.sqft
				}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Satellite takeoff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "World Imagery under the roof sketch"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsMap, {
							className: "h-56",
							storms: [],
							properties: [property],
							focusId: property.id,
							basemap: "sat",
							showChrome: false,
							showRadar: false,
							showAlerts: false,
							showReports: false,
							center: [property.lng, property.lat],
							zoom: 18
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-2 gap-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-faint",
									children: "Squares + 10% waste"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-lg tabular-nums",
									children: squares
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-faint",
									children: "Perimeter"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-mono text-lg tabular-nums",
									children: [perimeter, " lf"]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-faint",
									children: "Felt rolls (10 sq)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono text-lg tabular-nums",
									children: Math.ceil(squares / 10)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-faint",
									children: "Ridge"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-mono text-lg tabular-nums",
									children: [Math.round(Math.sqrt(property.sqft) * .55), " lf"]
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/estimates/$estimateId",
								params: { estimateId: `est-${property.id}` },
								children: "Drop into estimate"
							})
						})
					]
				})] })]
			})
		]
	});
}
//#endregion
export { MeasurePage as component };

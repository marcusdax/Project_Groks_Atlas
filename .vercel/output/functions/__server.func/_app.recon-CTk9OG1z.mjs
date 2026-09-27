import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./_ssr/router-CPUwhoN_.mjs";
import { t as Button } from "./_ssr/button-CUZ6L0Oj.mjs";
import { c as propertiesForStorm, i as STORMS, r as PROPERTIES, u as stormById } from "./_ssr/data-DyH99hDQ.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-CoDTZOnH.mjs";
import { n as stormWhen, r as usd, t as dpsTone } from "./_ssr/format-CLSTmkq8.mjs";
import { t as useAtlas } from "./_ssr/store-DGcjGeGr.mjs";
import { t as Badge } from "./_ssr/badge-B5azdV7H.mjs";
import { t as OpsMap } from "./_ssr/ops-map-DDju3wVc.mjs";
import { t as LiveStrip } from "./_ssr/live-strip-C7aIcwQ4.mjs";
import { t as ScoreRing } from "./_ssr/score-ring-DW5eqaYX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.recon-CTk9OG1z.js
var import_jsx_runtime = require_jsx_runtime();
function ReconPage() {
	const stormId = useAtlas((s) => s.selectedStormId);
	const selectStorm = useAtlas((s) => s.selectStorm);
	const selectedPropertyId = useAtlas((s) => s.selectedPropertyId);
	const selectProperty = useAtlas((s) => s.selectProperty);
	const storm = stormById(stormId) ?? STORMS[0];
	const list = propertiesForStorm(storm.id);
	const focus = PROPERTIES.find((p) => p.id === selectedPropertyId) ?? list[0];
	const high = list.filter((p) => p.dps >= 80).length;
	const avg = Math.round(list.reduce((s, p) => s + p.dps, 0) / Math.max(1, list.length));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-faint",
					children: "Recon engine"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: "Strike zones, not ZIP dumps."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-muted-foreground",
					children: "Hail size, wind, roof age, and dwell fused into a Damage Probability Score. Sort the neighborhood before a single ladder goes up."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStrip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: STORMS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => selectStorm(s.id),
					className: cn("rounded-xl p-4 text-left shadow-[var(--shadow-border)] transition-colors duration-150", s.id === storm.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider opacity-70",
							children: s.severity
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-xl",
							children: s.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm opacity-80",
							children: [
								s.hailIn,
								"\" hail · ",
								s.windMph,
								" mph · ",
								stormWhen(s.occurredAt)
							]
						})
					]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: storm.region }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsMap, {
						className: "h-96",
						storms: [storm],
						properties: list,
						focusId: focus?.id,
						onSelect: selectProperty,
						followFocus: true
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid grid-cols-2 gap-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-faint",
							children: "High priority"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl tabular-nums",
							children: high
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-faint",
							children: "Avg DPS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl tabular-nums",
							children: avg
						})] })]
					}) }), focus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-lg",
						children: focus.address
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: focus.owner
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, { score: focus.dps }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid w-full grid-cols-2 gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-faint",
									children: "Roof"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
									focus.roofAge,
									" yr ",
									focus.roofKind
								] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-faint",
									children: "Repair"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular-nums",
									children: usd(focus.estRepair)
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/properties/$propertyId",
									params: { propertyId: focus.id },
									children: "Open dossier"
								})
							})
						]
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Scored parcels" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => selectProperty(p.id),
					className: cn("flex min-h-14 w-full items-center gap-4 border-t border-border px-5 py-3 text-left first:border-t-0 hover:bg-accent", focus?.id === p.id && "bg-accent"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-10 font-mono tabular-nums",
							children: p.dps
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate",
								children: p.address
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: p.notes
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: dpsTone(p.dps),
							children: p.damageKind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden tabular-nums sm:inline",
							children: usd(p.estRepair)
						})
					]
				}) }, p.id)) })
			})] })
		]
	});
}
//#endregion
export { ReconPage as component };

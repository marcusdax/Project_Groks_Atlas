import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./_ssr/button-CUZ6L0Oj.mjs";
import { i as STORMS, r as PROPERTIES } from "./_ssr/data-DyH99hDQ.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-CoDTZOnH.mjs";
import { n as stormWhen, r as usd, t as dpsTone } from "./_ssr/format-CLSTmkq8.mjs";
import { t as useAtlas } from "./_ssr/store-DGcjGeGr.mjs";
import { t as Badge } from "./_ssr/badge-B5azdV7H.mjs";
import { t as OpsMap } from "./_ssr/ops-map-DDju3wVc.mjs";
import { t as LiveStrip } from "./_ssr/live-strip-C7aIcwQ4.mjs";
import { t as ScoreRing } from "./_ssr/score-ring-DW5eqaYX.mjs";
import { a as Tooltip, i as ResponsiveContainer, n as XAxis, r as Area, t as AreaChart } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.index-QENFCf88.js
var import_jsx_runtime = require_jsx_runtime();
var WEEK = [
	{
		d: "Mon",
		v: 120
	},
	{
		d: "Tue",
		v: 186
	},
	{
		d: "Wed",
		v: 240
	},
	{
		d: "Thu",
		v: 410
	},
	{
		d: "Fri",
		v: 380
	},
	{
		d: "Sat",
		v: 520
	},
	{
		d: "Sun",
		v: 310
	}
];
function CommandCenter() {
	const stages = useAtlas((s) => s.stages);
	const selectProperty = useAtlas((s) => s.selectProperty);
	const selected = useAtlas((s) => s.selectedPropertyId);
	const ranked = [...PROPERTIES].sort((a, b) => b.dps - a.dps);
	const pipeline = usd(PROPERTIES.reduce((s, p) => s + p.estRepair, 0));
	const high = PROPERTIES.filter((p) => p.dps >= 80).length;
	const latest = STORMS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-faint",
						children: "Command"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-tight sm:text-5xl",
						children: "Preston Hollow is still open."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-xl text-muted-foreground",
						children: [
							latest.hailIn,
							"\" hail, ",
							latest.windMph,
							" mph gusts · ",
							stormWhen(latest.occurredAt),
							".",
							" ",
							PROPERTIES.length,
							" scored roofs. Send crews at the top of the stack."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/radar",
						children: "Open radar"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveStrip, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					{
						k: "Active cells",
						v: String(STORMS.length),
						s: "Last 36 hours"
					},
					{
						k: "Flagged roofs",
						v: String(PROPERTIES.length),
						s: "+12 since dawn"
					},
					{
						k: "High DPS",
						v: String(high),
						s: "Score 80+"
					},
					{
						k: "Pipeline",
						v: pipeline,
						s: "If top 10 close"
					}
				].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-faint",
							children: m.k
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-3xl tabular-nums leading-none",
							children: m.v
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: m.s
						})
					]
				}, m.k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Strike field" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Live NEXRAD · hail cells · scored parcels"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: "Live"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsMap, {
						className: "h-96",
						focusId: selected,
						onSelect: selectProperty
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Priority lead" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
								score: ranked[0].dps,
								size: 128
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: ranked[0].address
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										ranked[0].city,
										" · ",
										usd(ranked[0].estRepair)
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/properties/$propertyId",
									params: { propertyId: ranked[0].id },
									children: "Open dossier"
								})
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ranked properties" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: ranked.slice(0, 7).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-t border-border first:border-t-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/properties/$propertyId",
								params: { propertyId: p.id },
								className: "flex min-h-14 items-center gap-4 px-5 py-3 hover:bg-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-10 font-mono text-sm tabular-nums",
										children: p.dps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm",
											children: p.address
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-xs text-muted-foreground",
											children: [
												p.city,
												" · ",
												p.roofAge,
												" yr ",
												p.roofKind
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: dpsTone(p.dps),
										children: stages[p.id] ?? p.stage
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden font-mono text-sm tabular-nums sm:inline",
										children: usd(p.estRepair)
									})
								]
							})
						}, p.id)) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estimate velocity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Thousands, this week"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "h-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: WEEK,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "d",
										tickLine: false,
										axisLine: false,
										tick: {
											fill: "var(--color-faint)",
											fontSize: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 8
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "v",
										stroke: "var(--color-primary)",
										fill: "var(--color-primary)",
										fillOpacity: .12
									})
								]
							})
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { CommandCenter as component };

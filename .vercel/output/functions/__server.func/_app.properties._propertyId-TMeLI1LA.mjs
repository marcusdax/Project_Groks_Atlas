import { v as Link, y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as Route } from "./_ssr/router-CPUwhoN_.mjs";
import { t as Button } from "./_ssr/button-CUZ6L0Oj.mjs";
import { l as propertyById, u as stormById } from "./_ssr/data-DyH99hDQ.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-CoDTZOnH.mjs";
import { r as usd, t as dpsTone } from "./_ssr/format-CLSTmkq8.mjs";
import { t as useAtlas } from "./_ssr/store-DGcjGeGr.mjs";
import { t as Badge } from "./_ssr/badge-B5azdV7H.mjs";
import { t as OpsMap } from "./_ssr/ops-map-DDju3wVc.mjs";
import { t as ScoreRing } from "./_ssr/score-ring-DW5eqaYX.mjs";
import { t as BeforeAfter } from "./_ssr/before-after-DRlyPq6u.mjs";
import { t as RoofSketch } from "./_ssr/roof-sketch-Xiw50lFL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.properties._propertyId-TMeLI1LA.js
var import_jsx_runtime = require_jsx_runtime();
function DossierPage() {
	const { propertyId } = Route.useParams();
	const navigate = useNavigate();
	const property = propertyById(propertyId);
	const setStage = useAtlas((s) => s.setStage);
	const stage = useAtlas((s) => s.stages[propertyId]);
	if (!property) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Parcel not in this market."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/properties",
				children: "Back to dossiers"
			})
		})]
	});
	const storm = stormById(property.stormId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-faint",
						children: [
							property.city,
							" · ",
							property.zip
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl tracking-tight",
						children: property.address
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-muted-foreground",
						children: [
							property.owner,
							" · ",
							property.insurance,
							" · ",
							storm?.name
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: dpsTone(property.dps),
							children: stage ?? property.stage
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								setStage(property.id, "qualified");
								toast("Marked qualified");
							},
							children: "Qualify"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => navigate({
								to: "/estimates/$estimateId",
								params: { estimateId: `est-${property.id}` }
							}),
							children: "Open estimate"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeforeAfter, {
							before: property.photo,
							after: property.afterPhoto,
							alt: property.address
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col items-center gap-4 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
						score: property.dps,
						size: 140
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid w-full grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-faint",
								children: "Home value"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: usd(property.homeValue)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-faint",
								children: "Est. repair"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "tabular-nums",
								children: usd(property.estRepair)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-faint",
								children: "Affected"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [property.affectedPct, "%"] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-faint",
								children: "Damage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: property.damageKind })] })
						]
					})]
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Parcel on the mosaic" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Esri imagery · NEXRAD still on"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsMap, {
						className: "h-64",
						storms: storm ? [storm] : [],
						properties: [property],
						focusId: property.id,
						basemap: "sat",
						showChrome: false,
						showAlerts: false,
						showReports: false,
						center: [property.lng, property.lat],
						zoom: 16
					}) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Measurements" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid grid-cols-2 gap-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-faint",
								children: "Total area"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-lg tabular-nums",
								children: [property.sqft.toLocaleString(), " sf"]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-faint",
								children: "Pitch"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-lg",
								children: [
									property.pitch,
									" · ",
									property.pitchDeg,
									"°"
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-faint",
								children: "Stories"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg",
								children: property.stories
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-faint",
								children: "Roof year"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg",
								children: property.roofYear
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "col-span-2 text-muted-foreground",
								children: property.notes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/measure",
									children: "Open measure studio"
								})
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Roof sketch" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoofSketch, {
						planes: property.planes,
						totalSqft: property.sqft
					}) })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: property.aerial,
				alt: `Aerial of ${property.address}`,
				className: "h-64 w-full rounded-xl object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
			})
		]
	});
}
//#endregion
export { DossierPage as component };

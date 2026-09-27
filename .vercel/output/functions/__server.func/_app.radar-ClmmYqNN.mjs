import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./_ssr/router-CPUwhoN_.mjs";
import { t as Button } from "./_ssr/button-CUZ6L0Oj.mjs";
import { c as propertiesForStorm, i as STORMS, r as PROPERTIES } from "./_ssr/data-DyH99hDQ.mjs";
import { t as useAtlas } from "./_ssr/store-DGcjGeGr.mjs";
import { t as Badge } from "./_ssr/badge-B5azdV7H.mjs";
import { a as useStationWx, i as useNwsAlerts, n as PRODUCTS, o as useStormReports, r as isHailish, t as OpsMap } from "./_ssr/ops-map-DDju3wVc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.radar-ClmmYqNN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RadarPage() {
	const [product, setProduct] = (0, import_react.useState)("n0q");
	const [basemap, setBasemap] = (0, import_react.useState)("ops");
	const [showRadar, setShowRadar] = (0, import_react.useState)(true);
	const [showAlerts, setShowAlerts] = (0, import_react.useState)(true);
	const [showReports, setShowReports] = (0, import_react.useState)(true);
	const stormId = useAtlas((s) => s.selectedStormId);
	const selectStorm = useAtlas((s) => s.selectStorm);
	const selectProperty = useAtlas((s) => s.selectProperty);
	const selectedPropertyId = useAtlas((s) => s.selectedPropertyId);
	const storm = STORMS.find((s) => s.id === stormId) ?? STORMS[0];
	const wx = useStationWx();
	const alerts = useNwsAlerts();
	const reports = useStormReports();
	const localReports = (0, import_react.useMemo)(() => reports.data.filter((r) => r.lat > 32.35 && r.lat < 33.15 && r.lng > -97.55 && r.lng < -96.55), [reports.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "atlas-map-stage -mx-4 -my-6 flex flex-col lg:flex-row sm:-mx-6 lg:-mx-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative min-h-80 flex-1 lg:min-h-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpsMap, {
				className: "absolute inset-0 h-full min-h-80 rounded-none",
				storms: STORMS,
				properties: PROPERTIES,
				focusId: selectedPropertyId,
				onSelect: selectProperty,
				product,
				basemap,
				showRadar,
				showAlerts,
				showReports,
				followFocus: true
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-t border-border bg-background p-4 lg:w-80 lg:border-l lg:border-t-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-faint",
						children: "Live radar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: "OpenRadar over Atlas."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "NEXRAD from IEM, composite from RainViewer, alerts from NWS, reports from IEM LSR."
					})
				] }),
				wx.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-faint",
							children: [wx.data.station, " · Fort Worth"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-2xl",
							children: [
								wx.data.tempF ?? "—",
								"° · ",
								wx.data.text
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								"Wind ",
								wx.data.windMph ?? "—",
								" mph",
								wx.data.gustMph ? ` gust ${wx.data.gustMph}` : "",
								wx.data.humidity != null ? ` · ${wx.data.humidity}% rh` : ""
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-mono text-xs uppercase tracking-wider text-faint",
					children: "Product"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1",
					children: PRODUCTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setProduct(p.id),
						className: cn("min-h-11 rounded-md px-2 text-xs", product === p.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
						children: p.label
					}, p.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: basemap === "sat",
							onPressed: () => setBasemap(basemap === "sat" ? "ops" : "sat"),
							children: basemap === "sat" ? "Satellite" : "Ops dark"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: showRadar,
							onPressed: () => setShowRadar((v) => !v),
							children: "Radar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: showAlerts,
							onPressed: () => setShowAlerts((v) => !v),
							children: "Alerts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							pressed: showReports,
							onPressed: () => setShowReports((v) => !v),
							children: "LSR"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: STORMS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => selectStorm(s.id),
						className: cn("rounded-lg p-3 text-left shadow-[var(--shadow-border)]", s.id === storm.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-accent"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: s.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs opacity-80",
							children: [
								s.hailIn,
								"\" hail · ",
								s.windMph,
								" mph"
							]
						})]
					}, s.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 font-mono text-xs uppercase tracking-wider text-faint",
					children: ["NWS Texas · ", alerts.data.length]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex flex-col gap-2",
					children: [alerts.data.slice(0, 5).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-card p-3 text-sm shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: a.event
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: a.area.split(";")[0]
						})]
					}, a.id)), alerts.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted-foreground",
						children: "Alerts feed quiet."
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 font-mono text-xs uppercase tracking-wider text-faint",
					children: ["DFW reports · ", localReports.length]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "flex flex-col gap-2",
					children: [localReports.slice(0, 6).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start justify-between gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: r.city || r.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted-foreground",
							children: r.type
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: isHailish(r.type) ? "bad" : "warn",
							children: r.magnitude || "—"
						})]
					}, r.id)), localReports.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted-foreground",
						children: "No hail/wind LSR in the metro this hour."
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/recon",
						children: [
							"Score ",
							propertiesForStorm(storm.id).length,
							" roofs in ",
							storm.region
						]
					})
				})
			]
		})]
	});
}
function Toggle({ pressed, onPressed, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": pressed,
		onClick: onPressed,
		className: cn("min-h-11 rounded-md px-3 text-sm", pressed ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
		children
	});
}
//#endregion
export { RadarPage as component };

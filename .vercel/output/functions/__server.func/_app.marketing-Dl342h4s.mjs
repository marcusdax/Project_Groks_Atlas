import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as Button } from "./_ssr/button-CUZ6L0Oj.mjs";
import { l as propertyById, t as CAMPAIGNS } from "./_ssr/data-DyH99hDQ.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-CoDTZOnH.mjs";
import { r as usd } from "./_ssr/format-CLSTmkq8.mjs";
import { t as Badge } from "./_ssr/badge-B5azdV7H.mjs";
import { t as BeforeAfter } from "./_ssr/before-after-DRlyPq6u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.marketing-Dl342h4s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarketingPage() {
	const [activeId, setActiveId] = (0, import_react.useState)(CAMPAIGNS[0].id);
	const campaign = CAMPAIGNS.find((c) => c.id === activeId) ?? CAMPAIGNS[0];
	const property = propertyById(campaign.propertyId);
	if (!property) return null;
	const lift = Math.round(property.estRepair * .12);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-wider text-faint",
				children: "Outreach"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Show the roof they already have."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-muted-foreground",
				children: "Personalized one-pagers with before/after rendering and a neighborhood-specific value case. No generic mailers."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: CAMPAIGNS.map((c) => {
					const p = propertyById(c.propertyId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveId(c.id),
						className: `rounded-xl p-4 text-left shadow-[var(--shadow-border)] ${c.id === activeId ? "bg-primary text-primary-foreground" : "bg-card"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: c.headline
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs opacity-80",
							children: [
								p?.address,
								" · ",
								c.channel
							]
						})]
					}, c.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "One-pager" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: property.address
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: campaign.status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BeforeAfter, {
							before: property.photo,
							after: property.afterPhoto,
							alt: property.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl",
									children: campaign.headline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm leading-relaxed text-muted-foreground",
									children: [
										property.owner.split(" ")[0],
										", the ",
										property.roofAge,
										"-year ",
										property.roofKind,
										" roof at ",
										property.address,
										" sat under ",
										property.hailIn,
										"\" hail. Homes on this block trade near ",
										usd(property.homeValue),
										". A documented reroof typically recovers about",
										" ",
										usd(lift),
										" at resale in this ZIP — before counting the insurance path."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Helios can inspect this week with carrier-ready photos already attached to the measured sketch."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => toast(`Queued ${campaign.channel} to ${property.owner}`),
								children: ["Send ", campaign.channel]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => toast("Copied share link"),
								children: "Copy link"
							})]
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { MarketingPage as component };

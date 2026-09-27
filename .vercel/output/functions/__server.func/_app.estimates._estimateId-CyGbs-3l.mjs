import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { c as Plus, r as Trash2 } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$2 } from "./_ssr/router-CPUwhoN_.mjs";
import { t as Button } from "./_ssr/button-CUZ6L0Oj.mjs";
import { t as Input } from "./_ssr/input-DDRiYoj6.mjs";
import { l as propertyById, o as estimateTotals, s as lineTotal } from "./_ssr/data-DyH99hDQ.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./_ssr/card-CoDTZOnH.mjs";
import { r as usd } from "./_ssr/format-CLSTmkq8.mjs";
import { t as useAtlas } from "./_ssr/store-DGcjGeGr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.estimates._estimateId-CyGbs-3l.js
var import_jsx_runtime = require_jsx_runtime();
function EstimateBuilder() {
	const { estimateId } = Route$2.useParams();
	const est = useAtlas((s) => s.estimates[estimateId]);
	const patchLine = useAtlas((s) => s.patchLine);
	const addLine = useAtlas((s) => s.addLine);
	const removeLine = useAtlas((s) => s.removeLine);
	const setEstimateStatus = useAtlas((s) => s.setEstimateStatus);
	if (!est) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Estimate missing."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/estimates",
				children: "All estimates"
			})
		})]
	});
	const property = propertyById(est.propertyId);
	const { subtotal, tax, total } = estimateTotals(est);
	function exportXml() {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<XACTDOC>
  <ADDR>${property?.address ?? ""}</ADDR>
  <TOTAL>${total.toFixed(2)}</TOTAL>
  ${est.lineItems.map((li) => `<ITEM CODE="${li.code}" QTY="${li.quantity}" UNIT="${li.unit}" COST="${li.unitCost}">${li.description}</ITEM>`).join("\n  ")}
</XACTDOC>`;
		const blob = new Blob([xml], { type: "application/xml" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${est.id}.xml`;
		a.click();
		URL.revokeObjectURL(url);
		toast("Xactimate XML exported");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-faint",
					children: est.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-tight",
					children: property?.address
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground",
					children: [
						property?.sqft.toLocaleString(),
						" sf · ",
						property?.pitch,
						" · tax 8.25%"
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => addLine(est.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Line"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => {
							setEstimateStatus(est.id, "sent");
							toast("Marked sent to carrier");
						},
						children: "Send"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: exportXml,
						children: "Export XML"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2 overflow-x-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Line items" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "min-w-[40rem] space-y-3",
					children: est.lineItems.map((li) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-12 items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "col-span-2",
								value: li.code,
								onChange: (e) => patchLine(est.id, li.id, { code: e.target.value }),
								"aria-label": "Code"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "col-span-4",
								value: li.description,
								onChange: (e) => patchLine(est.id, li.id, { description: e.target.value }),
								"aria-label": "Description"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "col-span-2",
								type: "number",
								value: li.quantity,
								onChange: (e) => patchLine(est.id, li.id, { quantity: Number(e.target.value) }),
								"aria-label": "Quantity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "col-span-1",
								value: li.unit,
								onChange: (e) => patchLine(est.id, li.id, { unit: e.target.value }),
								"aria-label": "Unit"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "col-span-2",
								type: "number",
								value: li.unitCost,
								onChange: (e) => patchLine(est.id, li.id, { unitCost: Number(e.target.value) }),
								"aria-label": "Unit cost"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-1 flex items-center justify-end gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden font-mono text-xs tabular-nums text-muted-foreground xl:inline",
									children: usd(lineTotal(li), true)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Remove line",
									onClick: () => removeLine(est.id, li.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							})
						]
					}, li.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Totals" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3 font-mono text-sm tabular-nums",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Subtotal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: usd(subtotal, true) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Tax 8.25%"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: usd(tax, true) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-t border-border pt-3 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: usd(total, true) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-sans text-xs text-muted-foreground",
						children: "Compliance price for the carrier. True cost uses local labor multipliers in Helios ops, not shown to the adjuster."
					}),
					property && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/properties/$propertyId",
							params: { propertyId: property.id },
							children: "Back to dossier"
						})
					})
				]
			})] })]
		})]
	});
}
//#endregion
export { EstimateBuilder as component };

import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { t as Input } from "./_ssr/input-DDRiYoj6.mjs";
import { r as PROPERTIES } from "./_ssr/data-DyH99hDQ.mjs";
import { r as usd, t as dpsTone } from "./_ssr/format-CLSTmkq8.mjs";
import { t as useAtlas } from "./_ssr/store-DGcjGeGr.mjs";
import { t as Badge } from "./_ssr/badge-B5azdV7H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app.properties.index-bL65ld05.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PropertiesPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const stages = useAtlas((s) => s.stages);
	const rows = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return PROPERTIES.filter((p) => !needle ? true : `${p.address} ${p.city} ${p.owner} ${p.zip}`.toLowerCase().includes(needle)).sort((a, b) => b.dps - a.dps);
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-6xl flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-wider text-faint",
				children: "Property intelligence"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight",
				children: "Dossiers"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Filter address or owner",
				className: "max-w-sm"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: rows.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/properties/$propertyId",
				params: { propertyId: p.id },
				className: "overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] transition-transform duration-150 hover:-translate-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.photo,
					alt: p.address,
					className: "h-40 w-full object-cover outline outline-1 -outline-offset-1 outline-foreground/10"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: p.address
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									p.city,
									", ",
									p.state,
									" ",
									p.zip
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-faint",
								children: [
									p.owner,
									" · ",
									p.roofAge,
									" yr ",
									p.roofKind
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-lg tabular-nums",
								children: p.dps
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: dpsTone(p.dps),
								children: stages[p.id] ?? p.stage
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-xs tabular-nums text-muted-foreground",
								children: usd(p.estRepair)
							})
						]
					})]
				})]
			}, p.id))
		})]
	});
}
//#endregion
export { PropertiesPage as component };

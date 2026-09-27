import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./router-CPUwhoN_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roof-sketch-Xiw50lFL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoofSketch({ planes, totalSqft }) {
	const [hover, setHover] = (0, import_react.useState)(null);
	const active = planes.find((p) => p.id === hover);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-lg bg-raised p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 380 240",
			className: "h-56 w-full",
			role: "img",
			"aria-label": "Roof sketch",
			children: planes.map((plane) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: plane.path,
				className: cn("stroke-foreground/40 transition-colors duration-150", hover === plane.id ? "fill-primary/25 stroke-primary" : "fill-foreground/10"),
				strokeWidth: "1.2",
				onMouseEnter: () => setHover(plane.id),
				onMouseLeave: () => setHover(null)
			}, plane.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-wider text-faint",
				children: "Plane"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: active ? active.label : "All planes"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-faint",
					children: "Area"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-sm tabular-nums",
					children: [
						(active ? active.sqft : totalSqft).toLocaleString(),
						" sf",
						active ? ` · ${active.pitch}` : ""
					]
				})]
			})]
		})]
	});
}
//#endregion
export { RoofSketch as t };

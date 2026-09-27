import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./router-CPUwhoN_.mjs";
import { t as dpsTone } from "./format-CLSTmkq8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/score-ring-DW5eqaYX.js
var import_jsx_runtime = require_jsx_runtime();
function ScoreRing({ score, size = 112, label = "DPS" }) {
	const r = 40;
	const c = 2 * Math.PI * r;
	const tone = dpsTone(score);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative inline-grid place-items-center",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 100 100",
			className: "size-full -rotate-90",
			"aria-hidden": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r,
				fill: "none",
				stroke: "var(--color-border)",
				strokeWidth: "6"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "50",
				cy: "50",
				r,
				fill: "none",
				stroke: tone === "bad" ? "var(--color-destructive)" : tone === "warn" ? "var(--color-warn)" : tone === "ok" ? "var(--color-ok)" : "var(--color-faint)",
				strokeWidth: "6",
				strokeDasharray: c,
				strokeDashoffset: c - Math.min(100, score) / 100 * c,
				strokeLinecap: "round"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 grid place-items-center text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("font-mono text-2xl font-medium tabular-nums leading-none"),
				children: Math.round(score)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 font-mono text-xs uppercase tracking-wider text-faint",
				children: label
			})] })
		})]
	});
}
//#endregion
export { ScoreRing as t };

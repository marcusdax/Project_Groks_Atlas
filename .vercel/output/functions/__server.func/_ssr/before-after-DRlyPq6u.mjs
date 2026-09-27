import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as cn } from "./router-CPUwhoN_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/before-after-DRlyPq6u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BeforeAfter({ before, after, alt, className }) {
	const [split, setSplit] = (0, import_react.useState)(52);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-lg bg-raised", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: after,
				alt: `${alt} after`,
				className: "block h-64 w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 overflow-hidden",
				style: { clipPath: `inset(0 ${100 - split}% 0 0)` },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: before,
					alt: `${alt} before`,
					className: "h-full w-full object-cover"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-y-0 w-px bg-primary",
				style: { left: `${split}%` }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "range",
				min: 8,
				max: 92,
				value: split,
				onChange: (e) => setSplit(Number(e.target.value)),
				className: "absolute inset-0 h-full w-full cursor-ew-resize opacity-0",
				"aria-label": "Before and after comparison"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute left-3 top-3 rounded-sm bg-background/80 px-2 py-0.5 font-mono text-xs uppercase tracking-wider",
				children: "Before"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none absolute right-3 top-3 rounded-sm bg-background/80 px-2 py-0.5 font-mono text-xs uppercase tracking-wider",
				children: "After"
			})
		]
	});
}
//#endregion
export { BeforeAfter as t };

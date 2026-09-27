import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as useStationWx } from "./ops-map-DDju3wVc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-strip-C7aIcwQ4.js
var import_jsx_runtime = require_jsx_runtime();
function LiveStrip() {
	const wx = useStationWx();
	const d = wx.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-mono text-xs uppercase tracking-wider text-faint",
			children: "KFWS live"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm",
			children: d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				d.tempF ?? "—",
				"°F · ",
				d.text,
				" · wind ",
				d.windMph ?? "—",
				" mph"
			] }) : wx.status === "error" ? "Station feed paused" : "Reading Fort Worth radar site…"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/radar",
			className: "min-h-11 text-sm text-muted-foreground hover:text-foreground",
			children: "Open live radar"
		})]
	});
}
//#endregion
export { LiveStrip as t };

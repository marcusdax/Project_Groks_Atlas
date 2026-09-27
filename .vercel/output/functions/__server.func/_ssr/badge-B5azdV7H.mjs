import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn } from "./router-CPUwhoN_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-B5azdV7H.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-xs font-medium uppercase tracking-wider", {
	variants: { variant: {
		default: "bg-secondary text-foreground",
		outline: "shadow-[var(--shadow-border)] text-muted-foreground",
		ok: "bg-ok/15 text-ok",
		warn: "bg-warn/15 text-warn",
		bad: "bg-destructive/15 text-destructive",
		quiet: "bg-muted text-faint"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };

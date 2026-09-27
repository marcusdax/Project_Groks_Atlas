import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, m as Outlet, v as Link, y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { a as Ruler, f as Menu, g as CloudLightning, h as House, i as Search, m as LayoutDashboard, o as Radio, p as Map, s as Radar, t as X, u as PenLine } from "./_libs/lucide-react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, s as DialogTrigger, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { i as cn } from "./_ssr/router-CPUwhoN_.mjs";
import { t as Button } from "./_ssr/button-CUZ6L0Oj.mjs";
import { t as Input } from "./_ssr/input-DDRiYoj6.mjs";
import { a as TENANT, r as PROPERTIES } from "./_ssr/data-DyH99hDQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-DZ8c4gGR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/70", className),
	...props
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var SheetContent = import_react.forwardRef(({ className, children, side = "left", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn("fixed z-50 flex h-full w-80 max-w-[92vw] flex-col bg-card p-4 shadow-[var(--shadow-border)]", side === "left" ? "left-0 top-0" : "right-0 top-0", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
			className: "sr-only",
			children: "Navigation"
		}),
		children,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute right-3 top-3 rounded-sm opacity-70 hover:opacity-100",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})
	]
})] }));
SheetContent.displayName = "SheetContent";
var NAV = [
	{
		to: "/",
		label: "Command",
		hint: "Operations",
		icon: LayoutDashboard
	},
	{
		to: "/radar",
		label: "Radar",
		hint: "Live mosaic",
		icon: Radar
	},
	{
		to: "/recon",
		label: "Recon",
		hint: "Strike zones",
		icon: Radio
	},
	{
		to: "/properties",
		label: "Properties",
		hint: "Dossiers",
		icon: House
	},
	{
		to: "/measure",
		label: "Measure",
		hint: "Roof geometry",
		icon: Ruler
	},
	{
		to: "/estimates",
		label: "Estimates",
		hint: "Line items",
		icon: PenLine
	},
	{
		to: "/leads",
		label: "Leads",
		hint: "Pipeline",
		icon: Map
	},
	{
		to: "/marketing",
		label: "Outreach",
		hint: "One-pagers",
		icon: CloudLightning
	}
];
function NavLinks({ onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1",
		children: NAV.map((item, i) => {
			const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-5 font-mono text-xs tabular-nums opacity-70",
						children: String(i + 1).padStart(2, "0")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex flex-col leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: item.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-xs", active ? "opacity-70" : "text-faint"),
							children: item.hint
						})]
					})
				]
			}, item.to);
		})
	});
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-3 px-2 py-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-9 place-items-center rounded-md bg-primary text-primary-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-lg leading-none",
				children: "A"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-display text-xl leading-none",
			children: "Atlas"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block font-mono text-xs uppercase tracking-wider text-faint",
			children: "Storm OS"
		})] })]
	});
}
function AppShell({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const hits = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		if (needle.length < 2) return [];
		return PROPERTIES.filter((p) => `${p.address} ${p.city} ${p.owner} ${p.zip}`.toLowerCase().includes(needle)).slice(0, 6);
	}, [query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-background p-4 md:flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex-1 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-card p-3 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-faint",
							children: "Circuit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-lg tabular-nums text-ok",
							children: "99.98%"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Helios · DFW live"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:pl-60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "md:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, { onNavigate: () => setOpen(false) })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative hidden max-w-sm flex-1 sm:block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search address, owner, storm",
								className: "pl-9",
								"aria-label": "Search properties"
							}),
							hits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "absolute top-11 z-30 w-full overflow-hidden rounded-md bg-popover p-1 shadow-[var(--shadow-border)]",
								children: hits.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "flex min-h-11 w-full items-center justify-between rounded-sm px-3 text-left text-sm hover:bg-accent",
									onClick: () => {
										setQuery("");
										navigate({
											to: "/properties/$propertyId",
											params: { propertyId: p.id }
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.address }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-faint",
										children: p.dps
									})]
								}) }, p.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden items-center gap-2 font-mono text-xs uppercase tracking-wider text-ok sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-ok" }), "Live recon"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-tight",
								children: TENANT.operator
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: TENANT.role
							})]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4 py-6 sm:px-6 lg:px-8",
				children
			})]
		})]
	});
}
function Layout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
}
//#endregion
export { Layout as component };

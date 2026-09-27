"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  CloudLightning,
  Home,
  LayoutDashboard,
  Map,
  Menu,
  PenLine,
  Radar,
  Radio,
  Ruler,
  Search,
} from "lucide-react";
import { PROPERTIES, TENANT } from "@/lib/atlas/data";
import { useAtlas } from "@/lib/atlas/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Command", hint: "Operations", icon: LayoutDashboard },
  { to: "/radar", label: "Radar", hint: "Live mosaic", icon: Radar },
  { to: "/recon", label: "Recon", hint: "Strike zones", icon: Radio },
  { to: "/properties", label: "Properties", hint: "Dossiers", icon: Home },
  { to: "/measure", label: "Measure", hint: "Roof geometry", icon: Ruler },
  { to: "/estimates", label: "Estimates", hint: "Line items", icon: PenLine },
  { to: "/leads", label: "Leads", hint: "Pipeline", icon: Map },
  { to: "/marketing", label: "Outreach", hint: "One-pagers", icon: CloudLightning },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item, i) => {
        const active =
          item.to === "/"
            ? pathname === "/"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <span className="w-5 font-mono text-xs tabular-nums opacity-70">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Icon className="size-4" />
            <span className="flex flex-col leading-tight">
              <span className="font-medium">{item.label}</span>
              <span className={cn("text-xs", active ? "opacity-70" : "text-faint")}>
                {item.hint}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-2 py-1">
      <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
        <span className="font-display text-lg leading-none">A</span>
      </span>
      <span>
        <span className="block font-display text-xl leading-none">Atlas</span>
        <span className="block font-mono text-xs uppercase tracking-wider text-faint">
          Storm OS
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // Saved workspace (measurements, estimates, pipeline) loads after hydration.
    void useAtlas.persist.rehydrate();
  }, []);
  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    return PROPERTIES.filter((p) =>
      `${p.address} ${p.city} ${p.owner} ${p.zip}`.toLowerCase().includes(needle),
    ).slice(0, 6);
  }, [query]);

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-background p-4 md:flex">
        <Brand />
        <div className="mt-8 flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="rounded-lg bg-card p-3 shadow-[var(--shadow-border)]">
          <p className="font-mono text-xs uppercase tracking-wider text-faint">Circuit</p>
          <p className="mt-1 font-mono text-lg tabular-nums text-ok">99.98%</p>
          <p className="text-xs text-muted-foreground">Helios · DFW live</p>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Brand />
              <div className="mt-8">
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="relative hidden max-w-sm flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search address, owner, storm"
              className="pl-9"
              aria-label="Search properties"
            />
            {hits.length > 0 && (
              <ul className="absolute top-11 z-30 w-full overflow-hidden rounded-md bg-popover p-1 shadow-[var(--shadow-border)]">
                {hits.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="flex min-h-11 w-full items-center justify-between rounded-sm px-3 text-left text-sm hover:bg-accent"
                      onClick={() => {
                        setQuery("");
                        void navigate({
                          to: "/properties/$propertyId",
                          params: { propertyId: p.id },
                        });
                      }}
                    >
                      <span>{p.address}</span>
                      <span className="font-mono text-xs text-faint">{p.dps}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-2 font-mono text-xs uppercase tracking-wider text-ok sm:flex">
              <span className="size-1.5 rounded-full bg-ok" />
              Live recon
            </span>
            <div className="text-right">
              <p className="text-sm leading-tight">{TENANT.operator}</p>
              <p className="text-xs text-muted-foreground">{TENANT.role}</p>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

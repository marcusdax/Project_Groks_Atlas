"use client";

import { Link } from "@tanstack/react-router";
import { useStationWx } from "@/lib/atlas/live";

export function LiveStrip() {
  const wx = useStationWx();
  const d = wx.data;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-faint">KFWS live</p>
        <p className="text-sm">
          {d ? (
            <>
              {d.tempF ?? "—"}°F · {d.text} · wind {d.windMph ?? "—"} mph
            </>
          ) : wx.status === "error" ? (
            "Station feed paused"
          ) : (
            "Reading Fort Worth radar site…"
          )}
        </p>
      </div>
      <Link to="/radar" className="min-h-11 text-sm text-muted-foreground hover:text-foreground">
        Open live radar
      </Link>
    </div>
  );
}

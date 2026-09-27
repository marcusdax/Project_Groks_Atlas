"use client";

import { createFileRoute, Link } from "@tanstack/react-router";
import { PROPERTIES } from "@/lib/atlas/data";
import { usd } from "@/lib/atlas/format";
import { useAtlas } from "@/lib/atlas/store";
import type { LeadStage } from "@/lib/atlas/types";

export const Route = createFileRoute("/_app/leads")({
  component: LeadsPage,
});

const COLUMNS: { id: LeadStage; label: string }[] = [
  { id: "flagged", label: "Flagged" },
  { id: "qualified", label: "Qualified" },
  { id: "inspected", label: "Inspected" },
  { id: "estimated", label: "Estimated" },
  { id: "sent", label: "Sent" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

function LeadsPage() {
  const stages = useAtlas((s) => s.stages);
  const setStage = useAtlas((s) => s.setStage);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header>
        <p className="font-mono text-xs uppercase tracking-wider text-faint">Pipeline</p>
        <h1 className="font-display text-4xl tracking-tight">From cell to close</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Advance a card to move the job. Atlas keeps the storm, score, and estimate attached.
        </p>
      </header>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col, index) => {
          const cards = PROPERTIES.filter((p) => (stages[p.id] ?? p.stage) === col.id);
          const next = COLUMNS[index + 1];
          return (
            <section
              key={col.id}
              className="w-56 shrink-0 rounded-xl bg-card p-3 shadow-[var(--shadow-border)]"
            >
              <header className="mb-3 flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-wider text-faint">
                  {col.label}
                </h2>
                <span className="font-mono text-xs tabular-nums">{cards.length}</span>
              </header>
              <div className="flex flex-col gap-2">
                {cards.map((p) => (
                  <article key={p.id} className="rounded-md bg-raised p-3">
                    <Link
                      to="/properties/$propertyId"
                      params={{ propertyId: p.id }}
                      className="block text-sm font-medium hover:underline"
                    >
                      {p.address}
                    </Link>
                    <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                      DPS {p.dps} · {usd(p.estRepair)}
                    </p>
                    {next && col.id !== "won" && col.id !== "lost" ? (
                      <button
                        type="button"
                        onClick={() => setStage(p.id, next.id)}
                        className="mt-2 min-h-10 w-full rounded-sm bg-secondary px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Advance to {next.label}
                      </button>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

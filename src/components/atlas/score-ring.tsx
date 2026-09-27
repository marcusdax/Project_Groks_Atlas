import { dpsTone } from "@/lib/atlas/format";
import { cn } from "@/lib/utils";

export function ScoreRing({
  score,
  size = 112,
  label = "DPS",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const tone = dpsTone(score);
  const color =
    tone === "bad"
      ? "var(--color-destructive)"
      : tone === "warn"
        ? "var(--color-warn)"
        : tone === "ok"
          ? "var(--color-ok)"
          : "var(--color-faint)";

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={c - (Math.min(100, score) / 100) * c}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className={cn("font-mono text-2xl font-medium tabular-nums leading-none")}>
            {Math.round(score)}
          </div>
          <div className="mt-1 font-mono text-xs uppercase tracking-wider text-faint">{label}</div>
        </div>
      </div>
    </div>
  );
}

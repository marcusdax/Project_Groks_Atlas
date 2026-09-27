const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const moneyExact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function usd(n: number, exact = false) {
  return (exact ? moneyExact : money).format(n);
}

/** Market time zone. Pinned so server (UTC on Vercel) and browser render the same text. */
export const MARKET_TZ = "America/Chicago";

export function stormWhen(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: MARKET_TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function dpsTone(score: number): "bad" | "warn" | "ok" | "quiet" {
  if (score >= 80) return "bad";
  if (score >= 60) return "warn";
  if (score >= 40) return "ok";
  return "quiet";
}

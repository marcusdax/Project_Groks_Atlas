export type RadarProduct = "n0q" | "eet" | "composite";

export type RadarFrame = {
  time: number;
  tiles: string[];
  maxzoom: number;
  tileSize: number;
  provider: "iem" | "rainviewer";
  label: string;
};

const IEM = "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0";
const RAINVIEWER_DISCOVERY = "https://api.rainviewer.com/public/weather-maps.json";
const IEM_STEPS = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0] as const;

export const PRODUCTS: { id: RadarProduct; label: string; hint: string }[] = [
  { id: "n0q", label: "NEXRAD", hint: "Base reflectivity · IEM" },
  { id: "eet", label: "Echo tops", hint: "Storm height · IEM" },
  { id: "composite", label: "Composite", hint: "RainViewer mosaic" },
];

function iemLayer(product: "n0q" | "eet", minutesAgo: number) {
  const base = product === "n0q" ? "nexrad-n0q-900913" : "nexrad-eet-900913";
  if (minutesAgo === 0) return base;
  return `${base}-m${String(minutesAgo).padStart(2, "0")}m`;
}

function iemFrames(product: "n0q" | "eet"): RadarFrame[] {
  const now = Math.floor(Date.now() / 1000);
  return IEM_STEPS.map((minutesAgo) => ({
    time: now - minutesAgo * 60,
    tiles: [`${IEM}/${iemLayer(product, minutesAgo)}/{z}/{x}/{y}.png`],
    maxzoom: 12,
    tileSize: 256,
    provider: "iem" as const,
    label: minutesAgo === 0 ? "Live" : `−${minutesAgo}m`,
  }));
}

function trustedHost(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:") return null;
    if (host !== "rainviewer.com" && !host.endsWith(".rainviewer.com")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function seedFrames(product: RadarProduct): RadarFrame[] {
  if (product === "n0q" || product === "eet") return iemFrames(product);
  return [];
}

export async function fetchRadarFrames(
  product: RadarProduct,
  signal?: AbortSignal,
): Promise<RadarFrame[]> {
  if (product === "n0q" || product === "eet") return iemFrames(product);

  const res = await fetch(RAINVIEWER_DISCOVERY, {
    signal,
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RainViewer ${res.status}`);
  const payload = (await res.json()) as {
    host?: unknown;
    radar?: { past?: Array<{ time?: unknown; path?: unknown }> };
  };
  const host = trustedHost(payload.host);
  const past = payload.radar?.past;
  if (!host || !Array.isArray(past)) return [];

  return past
    .flatMap((item) => {
      if (typeof item.time !== "number" || typeof item.path !== "string") return [];
      if (!/^\/v2\/radar\/[A-Za-z0-9_-]+$/.test(item.path)) return [];
      return [
        {
          time: item.time,
          tiles: [`${host}${item.path}/256/{z}/{x}/{y}/6/1_1.png`],
          maxzoom: 7,
          tileSize: 256,
          provider: "rainviewer" as const,
          label: new Date(item.time * 1000).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ];
    })
    .sort((a, b) => a.time - b.time);
}

export function formatFrameClock(time: number) {
  return new Date(time * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function frameAge(time: number) {
  const min = Math.max(0, Math.round((Date.now() / 1000 - time) / 60));
  if (min < 1) return "just now";
  if (min === 1) return "1 min ago";
  return `${min} min ago`;
}

type Geometry = {
  type: string;
  coordinates: unknown;
};

export type StationWx = {
  text: string;
  tempF: number | null;
  windMph: number | null;
  gustMph: number | null;
  humidity: number | null;
  timestamp: string | null;
  station: string;
};

export type NwsAlert = {
  id: string;
  event: string;
  headline: string;
  severity: string;
  area: string;
  ends: string | null;
  geometry: Geometry | null;
};

export type StormReport = {
  id: string;
  type: string;
  city: string;
  magnitude: string;
  remark: string;
  valid: string;
  lng: number;
  lat: number;
};

function cToF(v: number | null | undefined) {
  return v == null ? null : Math.round((v * 9) / 5 + 32);
}

function toMph(value: number | null | undefined, unit?: string | null) {
  if (value == null) return null;
  if (unit?.includes("m_s")) return Math.round(value * 2.23694);
  if (unit?.includes("km_h")) return Math.round(value * 0.621371);
  return Math.round(value);
}

export async function fetchStationWx(signal?: AbortSignal): Promise<StationWx> {
  const res = await fetch("https://api.weather.gov/stations/KFWS/observations/latest", {
    signal,
    headers: { Accept: "application/geo+json", "User-Agent": "Atlas Storm OS" },
  });
  if (!res.ok) throw new Error(`NWS obs ${res.status}`);
  const json = (await res.json()) as {
    properties?: {
      textDescription?: string;
      timestamp?: string;
      temperature?: { value?: number | null };
      windSpeed?: { value?: number | null; unitCode?: string };
      windGust?: { value?: number | null; unitCode?: string };
      relativeHumidity?: { value?: number | null };
    };
  };
  const p = json.properties ?? {};
  return {
    text: p.textDescription || "Observation",
    tempF: cToF(p.temperature?.value),
    windMph: toMph(p.windSpeed?.value, p.windSpeed?.unitCode),
    gustMph: toMph(p.windGust?.value, p.windGust?.unitCode),
    humidity: p.relativeHumidity?.value == null ? null : Math.round(p.relativeHumidity.value),
    timestamp: p.timestamp ?? null,
    station: "KFWS",
  };
}

export async function fetchNwsAlerts(signal?: AbortSignal): Promise<NwsAlert[]> {
  const res = await fetch("https://api.weather.gov/alerts/active?area=TX", {
    signal,
    headers: { Accept: "application/geo+json", "User-Agent": "Atlas Storm OS" },
  });
  if (!res.ok) throw new Error(`NWS alerts ${res.status}`);
  const json = (await res.json()) as {
    features?: Array<{
      id?: string;
      geometry?: Geometry | null;
      properties?: {
        event?: string;
        headline?: string;
        severity?: string;
        areaDesc?: string;
        ends?: string | null;
        id?: string;
      };
    }>;
  };
  return (json.features ?? []).map((f, i) => ({
    id: String(f.properties?.id ?? f.id ?? i),
    event: f.properties?.event ?? "Alert",
    headline: f.properties?.headline ?? "",
    severity: f.properties?.severity ?? "Unknown",
    area: f.properties?.areaDesc ?? "",
    ends: f.properties?.ends ?? null,
    geometry: f.geometry ?? null,
  }));
}

export async function fetchStormReports(signal?: AbortSignal): Promise<StormReport[]> {
  const res = await fetch("https://mesonet.agron.iastate.edu/geojson/lsr.geojson?hours=24", {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`IEM LSR ${res.status}`);
  const json = (await res.json()) as {
    features?: Array<{
      id?: string | number;
      geometry?: { coordinates?: number[] };
      properties?: {
        typetext?: string;
        city?: string;
        magnitude?: string | number;
        remark?: string;
        valid?: string;
      };
    }>;
  };

  const wanted = /HAIL|TSTM|TORN|WIND DMG|WIND GST/;
  return (json.features ?? [])
    .map((f, i) => {
      const coords = f.geometry?.coordinates;
      const lng = coords?.[0];
      const lat = coords?.[1];
      return {
        id: String(f.id ?? i),
        type: f.properties?.typetext ?? "REPORT",
        city: f.properties?.city ?? "",
        magnitude: String(f.properties?.magnitude ?? ""),
        remark: f.properties?.remark ?? "",
        valid: f.properties?.valid ?? "",
        lng: typeof lng === "number" ? lng : 0,
        lat: typeof lat === "number" ? lat : 0,
      };
    })
    .filter((r) => wanted.test(r.type) && r.lng && r.lat);
}

export function alertsToGeoJSON(alerts: NwsAlert[]) {
  return {
    type: "FeatureCollection" as const,
    features: alerts
      .filter((a) => a.geometry)
      .map((a) => ({
        type: "Feature" as const,
        id: a.id,
        properties: {
          id: a.id,
          event: a.event,
          severity: a.severity,
        },
        geometry: a.geometry as Geometry,
      })),
  };
}

export function reportsToGeoJSON(reports: StormReport[]) {
  return {
    type: "FeatureCollection" as const,
    features: reports.map((r) => ({
      type: "Feature" as const,
      id: r.id,
      properties: {
        id: r.id,
        type: r.type,
        city: r.city,
        magnitude: r.magnitude,
      },
      geometry: { type: "Point" as const, coordinates: [r.lng, r.lat] as [number, number] },
    })),
  };
}

export function isHailish(type: string) {
  return /HAIL/.test(type);
}

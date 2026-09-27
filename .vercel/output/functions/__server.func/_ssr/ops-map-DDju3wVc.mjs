import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Pause, l as Play } from "../_libs/lucide-react.mjs";
import { i as cn } from "./router-CPUwhoN_.mjs";
import { i as STORMS, r as PROPERTIES } from "./data-DyH99hDQ.mjs";
import { t as dpsTone } from "./format-CLSTmkq8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-map-DDju3wVc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NEXRAD_SITES = [{
	id: "KFWS",
	name: "Fort Worth",
	lng: -97.303,
	lat: 32.573
}];
function circleRing(lng, lat, radiusKm, steps = 72) {
	const latDelta = radiusKm / 110.574;
	const lngDelta = radiusKm / (111.32 * Math.cos(lat * Math.PI / 180));
	const ring = [];
	for (let i = 0; i <= steps; i += 1) {
		const t = i / steps * Math.PI * 2;
		ring.push([lng + lngDelta * Math.cos(t), lat + latDelta * Math.sin(t)]);
	}
	return ring;
}
function stormsToGeoJSON(storms) {
	return {
		type: "FeatureCollection",
		features: storms.map((s) => ({
			type: "Feature",
			id: s.id,
			properties: {
				id: s.id,
				name: s.name,
				hailIn: s.hailIn,
				windMph: s.windMph,
				severity: s.severity
			},
			geometry: {
				type: "Polygon",
				coordinates: [circleRing(s.lng, s.lat, s.radiusKm)]
			}
		}))
	};
}
function stormCoresToGeoJSON(storms) {
	return {
		type: "FeatureCollection",
		features: storms.map((s) => ({
			type: "Feature",
			id: `${s.id}-core`,
			properties: {
				id: s.id,
				name: s.name
			},
			geometry: {
				type: "Point",
				coordinates: [s.lng, s.lat]
			}
		}))
	};
}
function propertiesToGeoJSON(properties, focusId) {
	return {
		type: "FeatureCollection",
		features: properties.map((p) => ({
			type: "Feature",
			id: p.id,
			properties: {
				id: p.id,
				address: p.address,
				city: p.city,
				dps: p.dps,
				tone: dpsTone(p.dps),
				focused: p.id === focusId,
				estRepair: p.estRepair,
				owner: p.owner
			},
			geometry: {
				type: "Point",
				coordinates: [p.lng, p.lat]
			}
		}))
	};
}
function sitesToGeoJSON() {
	return {
		type: "FeatureCollection",
		features: NEXRAD_SITES.map((s) => ({
			type: "Feature",
			id: s.id,
			properties: {
				id: s.id,
				name: s.name
			},
			geometry: {
				type: "Point",
				coordinates: [s.lng, s.lat]
			}
		}))
	};
}
var IEM = "https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0";
var RAINVIEWER_DISCOVERY = "https://api.rainviewer.com/public/weather-maps.json";
var IEM_STEPS = [
	50,
	45,
	40,
	35,
	30,
	25,
	20,
	15,
	10,
	5,
	0
];
var PRODUCTS = [
	{
		id: "n0q",
		label: "NEXRAD",
		hint: "Base reflectivity · IEM"
	},
	{
		id: "eet",
		label: "Echo tops",
		hint: "Storm height · IEM"
	},
	{
		id: "composite",
		label: "Composite",
		hint: "RainViewer mosaic"
	}
];
function iemLayer(product, minutesAgo) {
	const base = product === "n0q" ? "nexrad-n0q-900913" : "nexrad-eet-900913";
	if (minutesAgo === 0) return base;
	return `${base}-m${String(minutesAgo).padStart(2, "0")}m`;
}
function iemFrames(product) {
	const now = Math.floor(Date.now() / 1e3);
	return IEM_STEPS.map((minutesAgo) => ({
		time: now - minutesAgo * 60,
		tiles: [`${IEM}/${iemLayer(product, minutesAgo)}/{z}/{x}/{y}.png`],
		maxzoom: 12,
		tileSize: 256,
		provider: "iem",
		label: minutesAgo === 0 ? "Live" : `−${minutesAgo}m`
	}));
}
function trustedHost(value) {
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
async function fetchRadarFrames(product, signal) {
	if (product === "n0q" || product === "eet") return iemFrames(product);
	const res = await fetch(RAINVIEWER_DISCOVERY, {
		signal,
		headers: { Accept: "application/json" },
		cache: "no-store"
	});
	if (!res.ok) throw new Error(`RainViewer ${res.status}`);
	const payload = await res.json();
	const host = trustedHost(payload.host);
	const past = payload.radar?.past;
	if (!host || !Array.isArray(past)) return [];
	return past.flatMap((item) => {
		if (typeof item.time !== "number" || typeof item.path !== "string") return [];
		if (!/^\/v2\/radar\/[A-Za-z0-9_-]+$/.test(item.path)) return [];
		return [{
			time: item.time,
			tiles: [`${host}${item.path}/256/{z}/{x}/{y}/6/1_1.png`],
			maxzoom: 7,
			tileSize: 256,
			provider: "rainviewer",
			label: (/* @__PURE__ */ new Date(item.time * 1e3)).toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit"
			})
		}];
	}).sort((a, b) => a.time - b.time);
}
function formatFrameClock(time) {
	return (/* @__PURE__ */ new Date(time * 1e3)).toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short"
	});
}
function cToF(v) {
	return v == null ? null : Math.round(v * 9 / 5 + 32);
}
function toMph(value, unit) {
	if (value == null) return null;
	if (unit?.includes("m_s")) return Math.round(value * 2.23694);
	if (unit?.includes("km_h")) return Math.round(value * .621371);
	return Math.round(value);
}
async function fetchStationWx(signal) {
	const res = await fetch("https://api.weather.gov/stations/KFWS/observations/latest", {
		signal,
		headers: {
			Accept: "application/geo+json",
			"User-Agent": "Atlas Storm OS"
		}
	});
	if (!res.ok) throw new Error(`NWS obs ${res.status}`);
	const p = (await res.json()).properties ?? {};
	return {
		text: p.textDescription || "Observation",
		tempF: cToF(p.temperature?.value),
		windMph: toMph(p.windSpeed?.value, p.windSpeed?.unitCode),
		gustMph: toMph(p.windGust?.value, p.windGust?.unitCode),
		humidity: p.relativeHumidity?.value == null ? null : Math.round(p.relativeHumidity.value),
		timestamp: p.timestamp ?? null,
		station: "KFWS"
	};
}
async function fetchNwsAlerts(signal) {
	const res = await fetch("https://api.weather.gov/alerts/active?area=TX", {
		signal,
		headers: {
			Accept: "application/geo+json",
			"User-Agent": "Atlas Storm OS"
		}
	});
	if (!res.ok) throw new Error(`NWS alerts ${res.status}`);
	return ((await res.json()).features ?? []).map((f, i) => ({
		id: String(f.properties?.id ?? f.id ?? i),
		event: f.properties?.event ?? "Alert",
		headline: f.properties?.headline ?? "",
		severity: f.properties?.severity ?? "Unknown",
		area: f.properties?.areaDesc ?? "",
		ends: f.properties?.ends ?? null,
		geometry: f.geometry ?? null
	}));
}
async function fetchStormReports(signal) {
	const res = await fetch("https://mesonet.agron.iastate.edu/geojson/lsr.geojson?hours=24", {
		signal,
		headers: { Accept: "application/json" }
	});
	if (!res.ok) throw new Error(`IEM LSR ${res.status}`);
	const json = await res.json();
	const wanted = /HAIL|TSTM|TORN|WIND DMG|WIND GST/;
	return (json.features ?? []).map((f, i) => {
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
			lat: typeof lat === "number" ? lat : 0
		};
	}).filter((r) => wanted.test(r.type) && r.lng && r.lat);
}
function alertsToGeoJSON(alerts) {
	return {
		type: "FeatureCollection",
		features: alerts.filter((a) => a.geometry).map((a) => ({
			type: "Feature",
			id: a.id,
			properties: {
				id: a.id,
				event: a.event,
				severity: a.severity
			},
			geometry: a.geometry
		}))
	};
}
function reportsToGeoJSON(reports) {
	return {
		type: "FeatureCollection",
		features: reports.map((r) => ({
			type: "Feature",
			id: r.id,
			properties: {
				id: r.id,
				type: r.type,
				city: r.city,
				magnitude: r.magnitude
			},
			geometry: {
				type: "Point",
				coordinates: [r.lng, r.lat]
			}
		}))
	};
}
function isHailish(type) {
	return /HAIL/.test(type);
}
function usePolled(loader, ms, initial) {
	const [data, setData] = (0, import_react.useState)(initial);
	const [error, setError] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("idle");
	(0, import_react.useEffect)(() => {
		let alive = true;
		const run = async (signal) => {
			setStatus((s) => s === "ready" ? s : "loading");
			try {
				const next = await loader(signal);
				if (!alive) return;
				setData(next);
				setError(null);
				setStatus("ready");
			} catch (err) {
				if (!alive || err instanceof DOMException && err.name === "AbortError") return;
				setError(err instanceof Error ? err.message : "Unavailable");
				setStatus("error");
			}
		};
		const ctrl = new AbortController();
		run(ctrl.signal);
		const id = window.setInterval(() => {
			const tick = new AbortController();
			run(tick.signal);
		}, ms);
		return () => {
			alive = false;
			ctrl.abort();
			window.clearInterval(id);
		};
	}, [loader, ms]);
	return {
		data,
		error,
		status
	};
}
function useRadarLoop(product) {
	const [frames, setFrames] = (0, import_react.useState)([]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(true);
	const [status, setStatus] = (0, import_react.useState)("loading");
	(0, import_react.useEffect)(() => {
		const ctrl = new AbortController();
		setStatus("loading");
		fetchRadarFrames(product, ctrl.signal).then((next) => {
			setFrames(next);
			setIndex(Math.max(0, next.length - 1));
			setStatus(next.length ? "ready" : "error");
		}).catch(() => setStatus("error"));
		return () => ctrl.abort();
	}, [product]);
	(0, import_react.useEffect)(() => {
		if (!playing || frames.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = window.setInterval(() => {
			setIndex((i) => (i + 1) % frames.length);
		}, 700);
		return () => window.clearInterval(id);
	}, [playing, frames.length]);
	return {
		frames,
		index,
		setIndex,
		playing,
		setPlaying,
		frame: frames[index] ?? null,
		status
	};
}
function useStationWx() {
	return usePolled(fetchStationWx, 18e4, null);
}
function useNwsAlerts() {
	return usePolled(fetchNwsAlerts, 12e4, []);
}
function useStormReports() {
	return usePolled(fetchStormReports, 18e4, []);
}
var CARTO = [
	"https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
	"https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
	"https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
];
var CARTO_LABELS = ["https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png", "https://b.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}@2x.png"];
var SAT = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
function atlasMapStyle() {
	return {
		version: 8,
		name: "atlas-ops",
		glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
		sources: {
			ops: {
				type: "raster",
				tiles: CARTO,
				tileSize: 256,
				maxzoom: 20,
				attribution: "© OpenStreetMap © CARTO"
			},
			sat: {
				type: "raster",
				tiles: [SAT],
				tileSize: 256,
				maxzoom: 19,
				attribution: "Esri · Maxar · Earthstar"
			},
			labels: {
				type: "raster",
				tiles: CARTO_LABELS,
				tileSize: 256,
				maxzoom: 20,
				attribution: "© CARTO"
			}
		},
		layers: [
			{
				id: "ops",
				type: "raster",
				source: "ops"
			},
			{
				id: "sat",
				type: "raster",
				source: "sat",
				layout: { visibility: "none" }
			},
			{
				id: "labels",
				type: "raster",
				source: "labels",
				layout: { visibility: "none" }
			}
		]
	};
}
var EMPTY = {
	type: "FeatureCollection",
	features: []
};
function OpsMap({ storms = STORMS, properties = PROPERTIES, focusId, onSelect, className, basemap = "ops", product = "n0q", showRadar = true, showAlerts = true, showReports = true, showChrome = true, followFocus = false, center, zoom, interactive = true }) {
	const rootRef = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const onSelectRef = (0, import_react.useRef)(onSelect);
	onSelectRef.current = onSelect;
	const [ready, setReady] = (0, import_react.useState)(false);
	const { frames, index, setIndex, playing, setPlaying, frame, status } = useRadarLoop(product);
	const alerts = useNwsAlerts();
	const reports = useStormReports();
	(0, import_react.useEffect)(() => {
		if (!rootRef.current) return;
		let cancelled = false;
		let map;
		let ro;
		import("../_libs/maplibre-gl.mjs").then((n) => n.t).then((mod) => {
			if (cancelled || !rootRef.current) return;
			const gl = mod.default ?? mod;
			map = new gl.Map({
				container: rootRef.current,
				style: atlasMapStyle(),
				center: center ?? [-96.897, 32.776],
				zoom: zoom ?? 9,
				attributionControl: false,
				interactive,
				fadeDuration: 0
			});
			map.addControl(new gl.NavigationControl({
				showCompass: false,
				visualizePitch: false
			}), "bottom-right");
			map.addControl(new gl.AttributionControl({ compact: true }), "bottom-left");
			map.on("load", () => {
				if (!map) return;
				map.addSource("radar", {
					type: "raster",
					tiles: ["https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png"],
					tileSize: 256,
					maxzoom: 12,
					attribution: "IEM · NWS NEXRAD · RainViewer"
				});
				map.addLayer({
					id: "radar",
					type: "raster",
					source: "radar",
					paint: {
						"raster-opacity": .7,
						"raster-fade-duration": 0
					}
				});
				map.addSource("alerts", {
					type: "geojson",
					data: EMPTY
				});
				map.addLayer({
					id: "alerts-fill",
					type: "fill",
					source: "alerts",
					paint: {
						"fill-color": [
							"match",
							["get", "severity"],
							"Extreme",
							"rgba(193,122,110,0.28)",
							"Severe",
							"rgba(196,181,154,0.22)",
							"rgba(142,140,134,0.14)"
						],
						"fill-outline-color": "rgba(236,234,228,0.28)"
					}
				});
				map.addSource("storms", {
					type: "geojson",
					data: stormsToGeoJSON(storms)
				});
				map.addLayer({
					id: "storms-fill",
					type: "fill",
					source: "storms",
					paint: {
						"fill-color": "rgba(236,234,228,0.06)",
						"fill-outline-color": "rgba(236,234,228,0.22)"
					}
				});
				map.addSource("storm-cores", {
					type: "geojson",
					data: stormCoresToGeoJSON(storms)
				});
				map.addLayer({
					id: "storm-cores",
					type: "circle",
					source: "storm-cores",
					paint: {
						"circle-radius": 3,
						"circle-color": "#eceae4",
						"circle-stroke-width": 1,
						"circle-stroke-color": "#0b0c0e"
					}
				});
				map.addSource("reports", {
					type: "geojson",
					data: EMPTY
				});
				map.addLayer({
					id: "reports",
					type: "circle",
					source: "reports",
					paint: {
						"circle-radius": 4,
						"circle-color": [
							"case",
							[
								"in",
								"HAIL",
								["get", "type"]
							],
							"#c17a6e",
							"#c4b59a"
						],
						"circle-stroke-width": 1,
						"circle-stroke-color": "#0b0c0e"
					}
				});
				map.addSource("properties", {
					type: "geojson",
					data: propertiesToGeoJSON(properties, focusId)
				});
				map.addLayer({
					id: "properties",
					type: "circle",
					source: "properties",
					paint: {
						"circle-radius": [
							"case",
							[
								"boolean",
								["get", "focused"],
								false
							],
							8,
							5
						],
						"circle-color": [
							"match",
							["get", "tone"],
							"bad",
							"#c17a6e",
							"warn",
							"#c4b59a",
							"ok",
							"#8aa58a",
							"#5c5b57"
						],
						"circle-stroke-width": [
							"case",
							[
								"boolean",
								["get", "focused"],
								false
							],
							2,
							1
						],
						"circle-stroke-color": "#eceae4"
					}
				});
				map.addSource("sites", {
					type: "geojson",
					data: sitesToGeoJSON()
				});
				map.addLayer({
					id: "sites",
					type: "circle",
					source: "sites",
					paint: {
						"circle-radius": 4,
						"circle-color": "transparent",
						"circle-stroke-width": 1.5,
						"circle-stroke-color": "#d8d4cc"
					}
				});
				map.on("click", "properties", (e) => {
					const id = e.features?.[0]?.properties?.id;
					if (typeof id === "string") onSelectRef.current?.(id);
				});
				map.on("mouseenter", "properties", () => {
					map.getCanvas().style.cursor = "pointer";
				});
				map.on("mouseleave", "properties", () => {
					map.getCanvas().style.cursor = "";
				});
				if (!cancelled) setReady(true);
			});
			mapRef.current = map;
			ro = new ResizeObserver(() => map?.resize());
			ro.observe(rootRef.current);
		});
		return () => {
			cancelled = true;
			setReady(false);
			ro?.disconnect();
			map?.remove();
			mapRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!ready || !map) return;
		setVis(map, "ops", basemap === "ops");
		setVis(map, "sat", basemap === "sat");
		setVis(map, "labels", basemap === "sat");
	}, [basemap, ready]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!ready || !map || !frame) return;
		map.getSource("radar")?.setTiles(frame.tiles);
		map.setPaintProperty("radar", "raster-opacity", showRadar ? .7 : 0);
		setVis(map, "radar", showRadar);
	}, [
		frame,
		showRadar,
		ready
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!ready || !map) return;
		map.getSource("storms")?.setData(stormsToGeoJSON(storms));
		map.getSource("storm-cores")?.setData(stormCoresToGeoJSON(storms));
	}, [storms, ready]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!ready || !map) return;
		map.getSource("properties")?.setData(propertiesToGeoJSON(properties, focusId));
	}, [
		properties,
		focusId,
		ready
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!ready || !map) return;
		map.getSource("alerts")?.setData(alertsToGeoJSON(alerts.data));
		setVis(map, "alerts-fill", showAlerts);
	}, [
		alerts.data,
		showAlerts,
		ready
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!ready || !map) return;
		map.getSource("reports")?.setData(reportsToGeoJSON(reports.data));
		setVis(map, "reports", showReports);
	}, [
		reports.data,
		showReports,
		ready
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!ready || !map || !center) return;
		map.easeTo({
			center,
			zoom: zoom ?? map.getZoom(),
			duration: 500
		});
	}, [
		center?.[0],
		center?.[1],
		zoom,
		ready
	]);
	(0, import_react.useEffect)(() => {
		const map = mapRef.current;
		if (!ready || !map || !followFocus || !focusId) return;
		const hit = properties.find((p) => p.id === focusId);
		if (!hit) return;
		map.easeTo({
			center: [hit.lng, hit.lat],
			zoom: Math.max(map.getZoom(), 11),
			duration: 450
		});
	}, [
		focusId,
		properties,
		followFocus,
		ready
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("atlas-map relative overflow-hidden rounded-lg bg-raised", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: rootRef,
				className: "absolute inset-0"
			}),
			showChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto rounded-md bg-background/80 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-faint",
						children: [
							product === "composite" ? "RainViewer" : "IEM NEXRAD",
							" ·",
							" ",
							status === "ready" ? "live" : status
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm tabular-nums",
						children: frame ? formatFrameClock(frame.time) : "Waiting on tiles"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto flex items-center gap-2 rounded-md bg-background/80 px-2 py-1 shadow-[var(--shadow-border)] backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-10 place-items-center rounded-sm hover:bg-accent",
						onClick: () => setPlaying((v) => !v),
						"aria-label": playing ? "Pause radar" : "Play radar",
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-px size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: Math.max(0, frames.length - 1),
						value: index,
						onChange: (e) => {
							setPlaying(false);
							setIndex(Number(e.target.value));
						},
						className: "w-28 accent-primary",
						"aria-label": "Radar time"
					})]
				})]
			}),
			showChrome && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute bottom-8 left-3 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-background/80 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-faint",
							children: "Reflectivity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "radar-scale mt-1 h-1.5 w-40 rounded-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex justify-between font-mono text-xs text-faint",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "hail" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "70 dBZ" })
							]
						})
					]
				})
			})
		]
	});
}
function setVis(map, layer, on) {
	if (!map.getLayer(layer)) return;
	map.setLayoutProperty(layer, "visibility", on ? "visible" : "none");
}
//#endregion
export { useStationWx as a, useNwsAlerts as i, PRODUCTS as n, useStormReports as o, isHailish as r, OpsMap as t };

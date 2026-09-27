//#region node_modules/.nitro/vite/services/ssr/assets/data-DyH99hDQ.js
var hip = (prefix) => [
	{
		id: `${prefix}-a`,
		label: "Front hip",
		sqft: 720,
		pitch: "8:12",
		path: "M 40 92 L 160 36 L 280 92 L 160 148 Z"
	},
	{
		id: `${prefix}-b`,
		label: "Rear hip",
		sqft: 680,
		pitch: "8:12",
		path: "M 40 92 L 160 148 L 280 92 L 160 210 Z"
	},
	{
		id: `${prefix}-c`,
		label: "Left hip",
		sqft: 410,
		pitch: "8:12",
		path: "M 40 92 L 160 36 L 160 148 Z"
	},
	{
		id: `${prefix}-d`,
		label: "Right hip",
		sqft: 410,
		pitch: "8:12",
		path: "M 280 92 L 160 36 L 160 148 Z"
	},
	{
		id: `${prefix}-g`,
		label: "Garage",
		sqft: 240,
		pitch: "6:12",
		path: "M 280 92 L 340 118 L 300 162 L 240 136 Z"
	}
];
var STORMS = [
	{
		id: "stx-preston",
		name: "Preston Hollow cell",
		region: "Dallas · 75205",
		occurredAt: "2026-09-22T18:40:00-05:00",
		hailIn: 2.5,
		windMph: 71,
		durationMin: 18,
		severity: "extreme",
		lat: 32.894,
		lng: -96.804,
		radiusKm: 6.2,
		propertyIds: [
			"p-meadow",
			"p-preston",
			"p-strait",
			"p-inwood"
		]
	},
	{
		id: "stx-arlington",
		name: "Arlington supercell",
		region: "Arlington · 76013",
		occurredAt: "2026-09-22T19:12:00-05:00",
		hailIn: 1.75,
		windMph: 64,
		durationMin: 14,
		severity: "severe",
		lat: 32.735,
		lng: -97.108,
		radiusKm: 8.4,
		propertyIds: [
			"p-oakridge",
			"p-cooper",
			"p-randol"
		]
	},
	{
		id: "stx-burleson",
		name: "Burleson wind line",
		region: "Burleson · 76028",
		occurredAt: "2026-09-21T16:05:00-05:00",
		hailIn: 1.25,
		windMph: 82,
		durationMin: 22,
		severity: "severe",
		lat: 32.543,
		lng: -97.321,
		radiusKm: 11,
		propertyIds: [
			"p-main",
			"p-elm",
			"p-maple"
		]
	}
];
var PROPERTIES = [
	{
		id: "p-meadow",
		address: "1242 Meadow Lane",
		city: "Dallas",
		state: "TX",
		zip: "75230",
		lat: 32.901,
		lng: -96.798,
		owner: "Elena Voss",
		stories: 2,
		roofKind: "architectural",
		roofAge: 18,
		roofYear: 2008,
		sqft: 2460,
		pitch: "8:12",
		pitchDeg: 33.7,
		hailIn: 2.5,
		windMph: 71,
		dps: 94,
		stormId: "stx-preston",
		homeValue: 842e3,
		estRepair: 23870,
		stage: "qualified",
		damageKind: "hail",
		affectedPct: 68,
		insurance: "State Farm",
		photo: "/atlas/house-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/house-after.jpg",
		planes: hip("meadow"),
		notes: "Granule loss on south planes. Soft decking suspected at valley."
	},
	{
		id: "p-preston",
		address: "3908 Beverly Drive",
		city: "Dallas",
		state: "TX",
		zip: "75205",
		lat: 32.887,
		lng: -96.806,
		owner: "Marcus Hale",
		stories: 2,
		roofKind: "composition",
		roofAge: 21,
		roofYear: 2005,
		sqft: 3120,
		pitch: "9:12",
		pitchDeg: 36.9,
		hailIn: 2.5,
		windMph: 68,
		dps: 91,
		stormId: "stx-preston",
		homeValue: 1284e3,
		estRepair: 31240,
		stage: "inspected",
		damageKind: "hail+wind",
		affectedPct: 74,
		insurance: "Allstate",
		photo: "/atlas/craftsman-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/house-after.jpg",
		planes: hip("preston"),
		notes: "Lifted ridge cap. Prior claim 2019 — not a full replacement."
	},
	{
		id: "p-strait",
		address: "6115 Strait Lane",
		city: "Dallas",
		state: "TX",
		zip: "75225",
		lat: 32.872,
		lng: -96.812,
		owner: "The Calder Trust",
		stories: 2,
		roofKind: "tile",
		roofAge: 14,
		roofYear: 2012,
		sqft: 4280,
		pitch: "6:12",
		pitchDeg: 26.6,
		hailIn: 2.5,
		windMph: 71,
		dps: 61,
		stormId: "stx-preston",
		homeValue: 241e4,
		estRepair: 18600,
		stage: "flagged",
		damageKind: "hail",
		affectedPct: 22,
		insurance: "Chubb",
		photo: "/atlas/house-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/roof-new.jpg",
		planes: hip("strait"),
		notes: "Tile more resistant. Isolated cracked pans on west hip."
	},
	{
		id: "p-inwood",
		address: "9808 Inwood Road",
		city: "Dallas",
		state: "TX",
		zip: "75220",
		lat: 32.868,
		lng: -96.822,
		owner: "Priya Raman",
		stories: 1,
		roofKind: "architectural",
		roofAge: 16,
		roofYear: 2010,
		sqft: 1980,
		pitch: "7:12",
		pitchDeg: 30.3,
		hailIn: 2.25,
		windMph: 66,
		dps: 86,
		stormId: "stx-preston",
		homeValue: 615e3,
		estRepair: 19420,
		stage: "estimated",
		damageKind: "hail",
		affectedPct: 58,
		insurance: "Farmers",
		photo: "/atlas/ranch-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/house-after.jpg",
		planes: hip("inwood"),
		notes: "Single-story — fast tear-off. Homeowner on-site Thursday."
	},
	{
		id: "p-oakridge",
		address: "3504 Oak Ridge",
		city: "Irving",
		state: "TX",
		zip: "75062",
		lat: 32.834,
		lng: -96.962,
		owner: "James Okonkwo",
		stories: 2,
		roofKind: "composition",
		roofAge: 19,
		roofYear: 2007,
		sqft: 2210,
		pitch: "8:12",
		pitchDeg: 33.7,
		hailIn: 1.75,
		windMph: 64,
		dps: 79,
		stormId: "stx-arlington",
		homeValue: 412e3,
		estRepair: 16840,
		stage: "sent",
		damageKind: "hail",
		affectedPct: 51,
		insurance: "GEICO",
		photo: "/atlas/house-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/house-after.jpg",
		planes: hip("oakridge"),
		notes: "Proposal sent. Adjuster walk scheduled Friday 10:00."
	},
	{
		id: "p-cooper",
		address: "1819 S Cooper Street",
		city: "Arlington",
		state: "TX",
		zip: "76013",
		lat: 32.721,
		lng: -97.114,
		owner: "Dana Ruiz",
		stories: 1,
		roofKind: "composition",
		roofAge: 22,
		roofYear: 2004,
		sqft: 1640,
		pitch: "6:12",
		pitchDeg: 26.6,
		hailIn: 1.75,
		windMph: 61,
		dps: 88,
		stormId: "stx-arlington",
		homeValue: 278e3,
		estRepair: 14290,
		stage: "qualified",
		damageKind: "hail+wind",
		affectedPct: 63,
		insurance: "State Farm",
		photo: "/atlas/ranch-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/house-after.jpg",
		planes: hip("cooper"),
		notes: "End-of-life shingles. High probability of full replacement."
	},
	{
		id: "p-randol",
		address: "2208 Randol Mill Road",
		city: "Arlington",
		state: "TX",
		zip: "76011",
		lat: 32.747,
		lng: -97.092,
		owner: "Northstar Holdings",
		stories: 2,
		roofKind: "metal",
		roofAge: 8,
		roofYear: 2018,
		sqft: 2680,
		pitch: "4:12",
		pitchDeg: 18.4,
		hailIn: 1.75,
		windMph: 64,
		dps: 34,
		stormId: "stx-arlington",
		homeValue: 54e4,
		estRepair: 4200,
		stage: "lost",
		damageKind: "wind",
		affectedPct: 8,
		insurance: "Travelers",
		photo: "/atlas/craftsman-before.jpg",
		aerial: "/atlas/roof-new.jpg",
		afterPhoto: "/atlas/roof-new.jpg",
		planes: hip("randol"),
		notes: "Standing-seam metal. Cosmetic only — deprioritize."
	},
	{
		id: "p-main",
		address: "123 Main Street",
		city: "Burleson",
		state: "TX",
		zip: "76028",
		lat: 32.545,
		lng: -97.32,
		owner: "Heather Lang",
		stories: 1,
		roofKind: "architectural",
		roofAge: 17,
		roofYear: 2009,
		sqft: 1840,
		pitch: "7:12",
		pitchDeg: 30.3,
		hailIn: 1.25,
		windMph: 82,
		dps: 83,
		stormId: "stx-burleson",
		homeValue: 326e3,
		estRepair: 15760,
		stage: "won",
		damageKind: "wind",
		affectedPct: 44,
		insurance: "Allstate",
		photo: "/atlas/ranch-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/house-after.jpg",
		planes: hip("main"),
		notes: "Signed. Material drop Monday. Crew: Team B."
	},
	{
		id: "p-elm",
		address: "789 Elm Road",
		city: "Burleson",
		state: "TX",
		zip: "76028",
		lat: 32.542,
		lng: -97.325,
		owner: "Chris Nguyen",
		stories: 2,
		roofKind: "composition",
		roofAge: 15,
		roofYear: 2011,
		sqft: 2050,
		pitch: "8:12",
		pitchDeg: 33.7,
		hailIn: 1.25,
		windMph: 80,
		dps: 77,
		stormId: "stx-burleson",
		homeValue: 298e3,
		estRepair: 14910,
		stage: "inspected",
		damageKind: "wind",
		affectedPct: 39,
		insurance: "USAA",
		photo: "/atlas/house-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/house-after.jpg",
		planes: hip("elm"),
		notes: "Shingle lift on windward plane. Photos pinned to valley."
	},
	{
		id: "p-maple",
		address: "321 Maple Drive",
		city: "Burleson",
		state: "TX",
		zip: "76028",
		lat: 32.548,
		lng: -97.33,
		owner: "Lila Bennett",
		stories: 1,
		roofKind: "composition",
		roofAge: 12,
		roofYear: 2014,
		sqft: 1520,
		pitch: "6:12",
		pitchDeg: 26.6,
		hailIn: 1.1,
		windMph: 78,
		dps: 58,
		stormId: "stx-burleson",
		homeValue: 241e3,
		estRepair: 9800,
		stage: "flagged",
		damageKind: "wind",
		affectedPct: 27,
		insurance: "State Farm",
		photo: "/atlas/ranch-before.jpg",
		aerial: "/atlas/roof-damage.jpg",
		afterPhoto: "/atlas/house-after.jpg",
		planes: hip("maple"),
		notes: "Younger roof. Repair vs replace — wait for field confirmation."
	}
];
var defaultItems = (sqft, waste) => {
	const squares = Number((sqft * (1 + waste) / 100).toFixed(1));
	return [
		{
			id: "li-tear",
			code: "RFG TEAR",
			description: "Roof tear-off, composition",
			quantity: sqft,
			unit: "SF",
			unitCost: .85
		},
		{
			id: "li-felt",
			code: "RFG FELT",
			description: "Synthetic underlayment",
			quantity: squares,
			unit: "SQ",
			unitCost: 48
		},
		{
			id: "li-shin",
			code: "RFG SHGL",
			description: "Architectural shingles, 30-yr",
			quantity: squares,
			unit: "SQ",
			unitCost: 425
		},
		{
			id: "li-drip",
			code: "RFG DRIP",
			description: "Drip edge, aluminum",
			quantity: Math.round(Math.sqrt(sqft) * 4.2),
			unit: "LF",
			unitCost: 3.4
		},
		{
			id: "li-vent",
			code: "RFG VENT",
			description: "Ridge vent, shingle-over",
			quantity: Math.round(Math.sqrt(sqft) * .55),
			unit: "LF",
			unitCost: 9.2
		},
		{
			id: "li-lab",
			code: "LAB RFG",
			description: "Labor, complete reroof",
			quantity: 2,
			unit: "DAY",
			unitCost: 1850
		}
	];
};
var ESTIMATES = PROPERTIES.map((p, i) => ({
	id: `est-${p.id}`,
	propertyId: p.id,
	status: [
		"draft",
		"review",
		"sent",
		"approved"
	][Math.min(3, Math.floor(i / 3))],
	taxRate: .0825,
	wastePct: .1,
	lineItems: defaultItems(p.sqft, .1),
	updatedAt: "2026-09-25T09:14:00-05:00"
}));
var CAMPAIGNS = [
	{
		id: "c1",
		propertyId: "p-meadow",
		channel: "direct-mail",
		headline: "Your roof after 2.5-inch hail",
		status: "ready"
	},
	{
		id: "c2",
		propertyId: "p-cooper",
		channel: "email",
		headline: "A 22-year roof after Arlington hail",
		status: "queued"
	},
	{
		id: "c3",
		propertyId: "p-inwood",
		channel: "sms",
		headline: "Inspection window this week",
		status: "sent"
	},
	{
		id: "c4",
		propertyId: "p-oakridge",
		channel: "email",
		headline: "Adjuster-ready documentation",
		status: "sent"
	}
];
var TENANT = {
	name: "Helios Restoration",
	market: "DFW metro",
	operator: "M. Hale",
	role: "Lead estimator"
};
function stormById(id) {
	return STORMS.find((s) => s.id === id);
}
function propertyById(id) {
	return PROPERTIES.find((p) => p.id === id);
}
function propertiesForStorm(id) {
	return PROPERTIES.filter((p) => p.stormId === id).sort((a, b) => b.dps - a.dps);
}
function lineTotal(item) {
	return item.quantity * item.unitCost;
}
function estimateTotals(est) {
	const subtotal = est.lineItems.reduce((s, i) => s + lineTotal(i), 0);
	const tax = subtotal * est.taxRate;
	return {
		subtotal,
		tax,
		total: subtotal + tax
	};
}
//#endregion
export { TENANT as a, propertiesForStorm as c, STORMS as i, propertyById as l, ESTIMATES as n, estimateTotals as o, PROPERTIES as r, lineTotal as s, CAMPAIGNS as t, stormById as u };

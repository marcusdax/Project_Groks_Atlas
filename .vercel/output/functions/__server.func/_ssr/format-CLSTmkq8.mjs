//#region node_modules/.nitro/vite/services/ssr/assets/format-CLSTmkq8.js
var money = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0
});
var moneyExact = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2
});
function usd(n, exact = false) {
	return (exact ? moneyExact : money).format(n);
}
function stormWhen(iso) {
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}).format(new Date(iso));
}
function dpsTone(score) {
	if (score >= 80) return "bad";
	if (score >= 60) return "warn";
	if (score >= 40) return "ok";
	return "quiet";
}
//#endregion
export { stormWhen as n, usd as r, dpsTone as t };

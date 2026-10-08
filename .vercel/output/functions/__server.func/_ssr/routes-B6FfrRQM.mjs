import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$2 } from "./router-gNuc6P-Y.mjs";
import { i as useUploads, n as CATEGORIES, t as CATALOG } from "./uploads-DqZpRa_S.mjs";
import { t as VideoCard } from "./video-card-CgSCp_9F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B6FfrRQM.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { q, cat } = Route$2.useSearch();
	const all = [...useUploads((s) => s.mine), ...CATALOG];
	const query = (q ?? "").toLowerCase();
	const filtered = all.filter((v) => {
		const catOk = !cat || cat === "All" || v.category === cat;
		const textOk = !query || v.title.toLowerCase().includes(query) || v.creator.toLowerCase().includes(query) || v.category.toLowerCase().includes(query);
		return catOk && textOk;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mb-8 max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.2em] text-[var(--color-copper)] uppercase",
						children: "Public library"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl",
						children: "Host films you own. Watch them anywhere."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[var(--color-mute)]",
						children: "A general video library. Sample films stream from public test files. Uploads stay in this browser until you wire storage."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mb-6 flex gap-2 overflow-x-auto pb-1",
				children: CATEGORIES.map((name) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						search: {
							q,
							cat: name === "All" ? void 0 : name
						},
						className: "shrink-0 rounded-full border px-3 py-1.5 text-sm " + ((cat ?? "All") === name ? "border-[var(--color-copper)] bg-[var(--color-copper)] text-[#1a1008]" : "border-[var(--color-line)] text-[var(--color-mute)]"),
						children: name
					}, name);
				})
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[var(--color-mute)]",
				children: "Nothing matches that search."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((video) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { video }, video.id))
			})
		]
	});
}
//#endregion
export { Home as component };

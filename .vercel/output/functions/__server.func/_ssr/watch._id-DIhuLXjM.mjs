import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route } from "./router-gNuc6P-Y.mjs";
import { i as useUploads, r as findVideo, t as CATALOG } from "./uploads-DqZpRa_S.mjs";
import { t as VideoCard } from "./video-card-CgSCp_9F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch._id-DIhuLXjM.js
var import_jsx_runtime = require_jsx_runtime();
function Watch() {
	const { id } = Route.useParams();
	const mine = useUploads((s) => s.mine);
	const video = findVideo(id, mine);
	if (!video) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl",
			children: "Video not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-block text-[var(--color-copper)]",
			children: "Back to library"
		})]
	});
	const related = [...mine, ...CATALOG].filter((v) => v.id !== video.id).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_280px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				controls: true,
				playsInline: true,
				poster: video.poster || void 0,
				className: "aspect-video w-full rounded-xl bg-black",
				src: video.src
			}, video.src),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs tracking-[0.16em] text-[var(--color-copper)] uppercase",
				children: video.category
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-[family-name:var(--font-display)] text-3xl",
				children: video.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-[var(--color-mute)]",
				children: [
					video.creator,
					" · ",
					video.views,
					" views · ",
					video.duration
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-[15px] leading-relaxed",
				children: video.description
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm text-[var(--color-mute)]",
				children: "Up next"
			}), related.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { video: item }, item.id))]
		})]
	});
}
//#endregion
export { Watch as component };

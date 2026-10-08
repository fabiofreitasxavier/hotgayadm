import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/video-card-CgSCp_9F.js
var import_jsx_runtime = require_jsx_runtime();
function VideoCard({ video }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/watch/$id",
		params: { id: video.id },
		className: "group block overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video bg-black",
			children: [video.poster ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: video.poster,
				alt: "",
				className: "h-full w-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full items-center justify-center text-sm text-[var(--color-mute)]",
				children: "Local file"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-0.5 text-xs",
				children: video.duration
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "line-clamp-2 text-sm font-medium group-hover:text-[var(--color-copper)]",
				children: video.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-[var(--color-mute)]",
				children: [
					video.creator,
					" · ",
					video.views,
					" views"
				]
			})]
		})]
	});
}
//#endregion
export { VideoCard as t };

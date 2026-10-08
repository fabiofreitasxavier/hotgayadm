import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useUploads, n as CATEGORIES } from "./uploads-DqZpRa_S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/upload-KOw3pL0G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UploadPage() {
	const add = useUploads((s) => s.add);
	const navigate = useNavigate();
	const [title, setTitle] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Shorts");
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [src, setSrc] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-[family-name:var(--font-display)] text-4xl",
				children: "Add a video"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[var(--color-mute)]",
				children: "Files stay on this device for the demo. A production host would send the file to object storage, transcode it, then save the playback URL."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 space-y-4",
				onSubmit: (e) => {
					e.preventDefault();
					if (!title.trim() || !src) {
						setError("Add a title and a video file.");
						return;
					}
					const id = `local-${Date.now()}`;
					add({
						id,
						title: title.trim(),
						description: `Uploaded locally as ${fileName || "a file"}.`,
						category,
						duration: "Local",
						views: "Just you",
						creator: "You",
						src,
						poster: "",
						local: true
					});
					navigate({
						to: "/watch/$id",
						params: { id }
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							className: "mt-1 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2 outline-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Category", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							className: "mt-1 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2 outline-none",
							children: CATEGORIES.filter((c) => c !== "All").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-sm",
						children: ["Video file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "video/*",
							className: "mt-1 block w-full text-sm",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								setFileName(file.name);
								setSrc(URL.createObjectURL(file));
								if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
							}
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-red-400",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "rounded-full bg-[var(--color-copper)] px-4 py-2 text-sm font-medium text-[#1a1008]",
						children: "Publish locally"
					})
				]
			})
		]
	});
}
//#endregion
export { UploadPage as component };

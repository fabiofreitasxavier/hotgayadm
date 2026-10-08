//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-DIK3danT.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/upload",
			"/watch/$id"
		],
		preloads: [
			"/assets/index-BTSboJQN.js",
			"/assets/rolldown-runtime-CbXtAM7H.js",
			"/assets/useNavigate-BcJ5QqhB.js",
			"/assets/preload-helper-RKSY5cRU.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-BTSboJQN.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-Bi5DYFrI.js",
			"/assets/uploads-D1ViukjU.js",
			"/assets/video-card-CdMJ33HA.js"
		]
	},
	"/upload": {
		filePath: "/workspace/src/routes/upload.tsx",
		children: void 0,
		preloads: ["/assets/upload-B777Xofy.js", "/assets/uploads-D1ViukjU.js"]
	},
	"/watch/$id": {
		filePath: "/workspace/src/routes/watch.$id.tsx",
		children: void 0,
		preloads: [
			"/assets/watch._id-CUofFUVE.js",
			"/assets/uploads-D1ViukjU.js",
			"/assets/video-card-CdMJ33HA.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };

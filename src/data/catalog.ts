import videos from "./videos.json";

export type Video = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  views: string;
  creator: string;
  src: string;
  poster: string;
  local?: boolean;
};

export const CATEGORIES = ["All", "Prévias"] as const;

// Preview clips and thumbnails are NOT stored in this repo or deployed with the site.
// `node scripts/make-previews.mjs` builds them (and updates videos.json); upload that
// folder to the video host and set VITE_MEDIA_BASE_URL to its public URL at build
// time. Locally, /videos is served from public/videos, which is git-ignored.
const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE_URL as string | undefined)?.replace(/\/$/, "") || "/videos";

type Entry = { id: string; title: string; duration: string; previewDuration: string; addedAt: string };

export const CATALOG: Video[] = (videos as Entry[]).map((v, i, all) => ({
  id: v.id,
  // Untitled entries are numbered oldest-first, so a new upload never renumbers the rest.
  title: v.title || `Prévia exclusiva #${all.length - i}`,
  description: `Prévia gratuita de ${v.previewDuration}. O vídeo completo (${v.duration}) e mais de 800 outros estão na nossa comunidade no Telegram.`,
  category: "Prévias",
  duration: v.duration,
  views: "",
  creator: "HotGay",
  src: `${MEDIA_BASE}/${v.id}.mp4`,
  poster: `${MEDIA_BASE}/${v.id}.jpg`,
}));

export function findVideo(id: string, extras: Video[] = []): Video | undefined {
  return [...extras, ...CATALOG].find((v) => v.id === id);
}

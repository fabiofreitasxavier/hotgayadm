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
  /** Third-party player URL (e.g. xvideos embedframe); played in an iframe instead of <video>. */
  embedUrl?: string;
  /** Display name of the site an embed comes from. */
  source?: string;
};

// Preview clips and thumbnails are NOT stored in this repo or deployed with the site.
// `node scripts/make-previews.mjs` builds them (and updates videos.json); upload that
// folder's files to the root of the Bunny CDN. VITE_MEDIA_BASE_URL overrides the host at
// build time. In dev, /videos is served from public/videos, which is git-ignored.
export const MEDIA_HOST = "https://hotgay.b-cdn.net";
const MEDIA_BASE =
  (import.meta.env.VITE_MEDIA_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "/videos" : MEDIA_HOST);

const PREVIEWS = "Prévias";

type PreviewEntry = { id: string; title: string; duration: string; previewDuration: string; addedAt: string };
// Added by `npm run add-embed`; the video stays on the source site and plays in its own player.
type EmbedEntry = { id: string; title: string; embedUrl: string; source: string; addedAt: string };
type Entry = PreviewEntry | EmbedEntry;

const isEmbed = (v: Entry): v is EmbedEntry => "embedUrl" in v;

export const CATALOG: Video[] = (videos as Entry[]).map((v, i, all) =>
  isEmbed(v)
    ? {
        id: v.id,
        title: v.title,
        description: `Vídeo incorporado do ${v.source}. Os direitos pertencem aos seus donos.`,
        category: `Via ${v.source}`,
        duration: "",
        views: "",
        creator: v.source,
        src: "",
        poster: "",
        embedUrl: v.embedUrl,
        source: v.source,
      }
    : {
        id: v.id,
        // Untitled entries are numbered oldest-first, so a new upload never renumbers the rest.
        title: v.title || `Prévia exclusiva #${all.length - i}`,
        description: `Prévia gratuita de ${v.previewDuration}. O vídeo completo (${v.duration}) e mais de 800 outros estão na nossa comunidade no Telegram.`,
        category: PREVIEWS,
        duration: v.duration,
        views: "",
        creator: "HotGay",
        src: `${MEDIA_BASE}/${v.id}.mp4`,
        poster: `${MEDIA_BASE}/${v.id}.jpg`,
      },
);

// Category chips follow the catalog, so "Via xvideos" appears once an embed is added.
export const CATEGORIES = ["All", ...new Set([PREVIEWS, ...CATALOG.map((v) => v.category)])];

export function findVideo(id: string, extras: Video[] = []): Video | undefined {
  return [...extras, ...CATALOG].find((v) => v.id === id);
}

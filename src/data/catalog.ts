import videos from "./videos.json";
import tagList from "./tags.json";
import site from "./site.json";

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
  /** YYYY-MM-DD the video was added to the catalog. */
  addedAt?: string;
  /** Third-party player URL (e.g. xvideos embedframe); played in an iframe instead of <video>. */
  embedUrl?: string;
  /** Display name of the site an embed comes from. */
  source?: string;
  /** Category slugs from src/data/tags.json. Each one links to /categoria/<slug>. */
  tags?: string[];
};

export type Tag = { slug: string; name: string; title: string; intro: string };

// Preview clips and thumbnails are NOT stored in this repo or deployed with the site.
// `node scripts/make-previews.mjs` builds them (and updates videos.json); upload that
// folder's files to the root of the Bunny CDN. In dev, /videos is served from
// public/videos, which is git-ignored.
//
// The host is a constant on purpose (src/data/site.json): VITE_* env values are inlined
// into the public JS bundle, so a wrong value pasted in Vercel (a token, a connection
// string) would leak.
export const MEDIA_HOST = site.mediaHost;
const MEDIA_BASE = import.meta.env.DEV ? "/videos" : MEDIA_HOST;

const PREVIEWS = "Prévias";
/** Every one of our own previews belongs to this category automatically. */
export const PREVIEWS_TAG = "previas-exclusivas";
/** A category gets a menu link and a sitemap entry once it has this many videos. */
export const MIN_CATEGORY_SIZE = 3;

export const TAGS: Tag[] = tagList;
const TAG_BY_SLUG = new Map(TAGS.map((t) => [t.slug, t]));
export const findTag = (slug: string): Tag | undefined => TAG_BY_SLUG.get(slug);

// Optional per-video fields in videos.json:
//   "tags": ["amigos"]     category slugs from tags.json
//   "description": "..."   your own text; replaces the generated one (best for SEO)
type PreviewEntry = {
  id: string;
  title: string;
  duration: string;
  previewDuration: string;
  addedAt: string;
  tags?: string[];
  description?: string;
};
// Added by `npm run add-embed`; the video stays on the source site and plays in its own player.
// `thumb` is a file name on the media host (e.g. "xv-abc123.jpg", set by `npm run embed-thumbs`)
// or a full https URL.
type EmbedEntry = {
  id: string;
  title: string;
  embedUrl: string;
  source: string;
  addedAt: string;
  thumb?: string;
  tags?: string[];
  description?: string;
};

function thumbUrl(thumb: string | undefined): string {
  if (!thumb) return "";
  return /^https:\/\//.test(thumb) ? thumb : `${MEDIA_BASE}/${thumb}`;
}
type Entry = PreviewEntry | EmbedEntry;

const isEmbed = (v: Entry): v is EmbedEntry => "embedUrl" in v;

/** Unknown slugs are dropped so a typo in videos.json never produces a dead link. */
const knownTags = (tags: string[] | undefined) => (tags ?? []).filter((t) => TAG_BY_SLUG.has(t));

/** Generated description for our own previews when videos.json has none. */
function previewDescription(title: string, v: PreviewEntry, tags: string[]): string {
  const names = tags.filter((t) => t !== PREVIEWS_TAG).map((t) => TAG_BY_SLUG.get(t)!.name.toLowerCase());
  const topic = names.length ? ` Categoria: ${names.join(", ")}.` : "";
  // Short clips are published whole; only promise a longer version when there is one.
  if (v.duration && v.duration !== v.previewDuration) {
    return `${title}: assista grátis à prévia de ${v.previewDuration} deste vídeo gay exclusivo do HotGay. O vídeo completo tem ${v.duration} e está na comunidade privada no Telegram, junto com mais de 800 outros.${topic}`;
  }
  return `${title}: vídeo gay exclusivo do HotGay, ${v.previewDuration} para assistir grátis agora. Mais de 800 vídeos completos esperam por você na comunidade privada no Telegram.${topic}`;
}

export const CATALOG: Video[] = (videos as Entry[]).map((v, i, all) => {
  if (isEmbed(v)) {
    return {
      id: v.id,
      title: v.title,
      description: v.description || `${v.title}: vídeo incorporado do ${v.source}. Os direitos pertencem aos seus donos.`,
      category: `Via ${v.source}`,
      duration: "",
      views: "",
      creator: v.source,
      src: "",
      poster: thumbUrl(v.thumb),
      embedUrl: v.embedUrl,
      addedAt: v.addedAt,
      source: v.source,
      tags: knownTags(v.tags),
    };
  }
  // Untitled entries are numbered oldest-first, so a new upload never renumbers the rest.
  const title = v.title || `Prévia exclusiva #${all.length - i}`;
  const tags = [PREVIEWS_TAG, ...knownTags(v.tags).filter((t) => t !== PREVIEWS_TAG)];
  return {
    id: v.id,
    title,
    description: v.description || previewDescription(title, v, tags),
    category: PREVIEWS,
    duration: v.duration,
    views: "",
    creator: "HotGay",
    src: `${MEDIA_BASE}/${v.id}.mp4`,
    poster: `${MEDIA_BASE}/${v.id}.jpg`,
    addedAt: v.addedAt,
    tags,
  };
});

/** Our own previews first (they are the pages that can rank), embeds after; order otherwise kept. */
export function ownFirst(list: Video[]): Video[] {
  return [...list.filter((v) => !v.embedUrl), ...list.filter((v) => v.embedUrl)];
}

export function videosInTag(slug: string, list: Video[] = CATALOG): Video[] {
  return ownFirst(list.filter((v) => v.tags?.includes(slug)));
}

/** Categories big enough for a menu link and a sitemap entry, largest first. */
export const CATEGORY_PAGES: { tag: Tag; count: number }[] = TAGS.map((tag) => ({
  tag,
  count: videosInTag(tag.slug).length,
}))
  .filter((c) => c.count >= MIN_CATEGORY_SIZE)
  .sort((a, b) => b.count - a.count);

// Values for the old ?cat= filter links, kept so links already shared still work.
export const CATEGORIES = ["All", ...new Set([PREVIEWS, ...CATALOG.map((v) => v.category)])];

export function findVideo(id: string, extras: Video[] = []): Video | undefined {
  return [...extras, ...CATALOG].find((v) => v.id === id);
}

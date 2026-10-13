#!/usr/bin/env node
/**
 * Writes public/robots.txt and public/sitemap.xml from src/data/videos.json, src/data/tags.json
 * and src/data/guides.json.
 * Runs before every build (npm "prebuild"), so new videos and categories are listed automatically.
 *
 * The site address comes from src/data/site.json (shared with the app's canonical URLs);
 * SITE_URL / MEDIA_HOST env vars override it for a one-off run.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = (path) => JSON.parse(readFileSync(resolve(ROOT, path), "utf8"));

const site = readJson("src/data/site.json");
const MEDIA = (process.env.MEDIA_HOST || site.mediaHost).replace(/\/$/, "");
const SITE = (process.env.SITE_URL || site.siteUrl).replace(/\/$/, "");

const videos = readJson("src/data/videos.json");
const tags = readJson("src/data/tags.json");
const guides = readJson("src/data/guides.json");
const today = new Date().toISOString().slice(0, 10);

// Keep in step with src/data/catalog.ts: our own previews are always in this category,
// and a category is listed once it has MIN_CATEGORY_SIZE videos.
const PREVIEWS_TAG = "previas-exclusivas";
const MIN_CATEGORY_SIZE = 3;
const HOME_PAGE_SIZE = 60;
// Date in src/components/legal-page.tsx (LAST_UPDATED); bump both when the legal text changes.
const LEGAL_UPDATED = "2026-10-10";

const known = new Set(tags.map((t) => t.slug));
const tagsOf = (v) => {
  const own = (v.tags ?? []).filter((t) => known.has(t));
  return v.embedUrl ? own : [PREVIEWS_TAG, ...own.filter((t) => t !== PREVIEWS_TAG)];
};
const newest = (list) =>
  list
    .map((v) => v.addedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || today;

const categories = tags
  .map((t) => ({ tag: t, members: videos.filter((v) => tagsOf(v).includes(t.slug)) }))
  .filter((c) => c.members.length >= MIN_CATEGORY_SIZE);

const knownTag = new Set(tags.map((t) => t.slug));
const guideSlugs = new Set();
for (const g of guides) {
  if (!g.slug || guideSlugs.has(g.slug)) throw new Error(`[sitemap] duplicate or empty guide slug: ${g.slug}`);
  guideSlugs.add(g.slug);
  if (g.description.length < 120 || g.description.length > 170) {
    throw new Error(`[sitemap] guide description length ${g.slug}: ${g.description.length}`);
  }
  for (const slug of g.categories ?? []) {
    if (!knownTag.has(slug)) throw new Error(`[sitemap] guide ${g.slug} names unknown category ${slug}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(g.updated || "")) {
    throw new Error(`[sitemap] guide ${g.slug} needs a YYYY-MM-DD updated date`);
  }
}
const guideUpdated = guides.map((g) => g.updated).sort().at(-1) || LEGAL_UPDATED;

const pages = [
  { path: "/", lastmod: newest(videos), priority: "1.0" },
  // Home pages 2..N (PAGE_SIZE in src/routes/index.tsx).
  ...Array.from({ length: Math.max(0, Math.ceil(videos.length / HOME_PAGE_SIZE) - 1) }, (_, i) => ({
    path: `/?page=${i + 2}`,
    lastmod: newest(videos),
    priority: "0.5",
  })),
  ...categories.map((c) => ({
    path: `/categoria/${c.tag.slug}`,
    lastmod: newest(c.members),
    priority: "0.8",
  })),
  { path: "/guia", lastmod: guideUpdated, priority: "0.6" },
  ...guides.map((g) => ({
    path: `/guia/${g.slug}`,
    lastmod: g.updated,
    priority: "0.6",
  })),
  // Embed pages are noindex (duplicates of the source site), so only our own previews are listed.
  ...videos
    .filter((v) => !v.embedUrl)
    .map((v) => ({
      path: `/watch/${v.id}`,
      lastmod: v.addedAt || today,
      priority: "0.7",
      video: v,
    })),
  { path: "/termos", lastmod: LEGAL_UPDATED, priority: "0.2" },
  { path: "/privacidade", lastmod: LEGAL_UPDATED, priority: "0.2" },
  { path: "/denuncia", lastmod: LEGAL_UPDATED, priority: "0.2" },
];

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const seconds = (clock) =>
  clock
    .split(":")
    .map(Number)
    .reduce((a, n) => a * 60 + n, 0);

/** Google video + image sitemap entries for one of our own previews (siblings inside <url>). */
function mediaTags(v) {
  if (!v) return "";
  const title = v.title || "Prévia exclusiva";
  const description =
    v.description || `${title}: prévia gratuita de vídeo gay exclusivo, para maiores de 18 anos.`;
  return (
    "<video:video>" +
    `<video:thumbnail_loc>${MEDIA}/${v.id}.jpg</video:thumbnail_loc>` +
    `<video:title>${esc(title)}</video:title>` +
    `<video:description>${esc(description)}</video:description>` +
    `<video:content_loc>${MEDIA}/${v.id}.mp4</video:content_loc>` +
    `<video:duration>${seconds(v.previewDuration)}</video:duration>` +
    `<video:publication_date>${v.addedAt || today}</video:publication_date>` +
    "<video:family_friendly>no</video:family_friendly>" +
    "</video:video>" +
    `<image:image><image:loc>${MEDIA}/${v.id}.jpg</image:loc></image:image>`
  );
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  pages
    .map(
      (p) =>
        `  <url><loc>${SITE}${p.path}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.priority}</priority>${mediaTags(p.video)}</url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

// /upload only stores files in the visitor's own browser; keep it out of search results.
const robots = `User-agent: *\nAllow: /\nDisallow: /upload\n\nSitemap: ${SITE}/sitemap.xml\n`;

writeFileSync(resolve(ROOT, "public/sitemap.xml"), xml);
writeFileSync(resolve(ROOT, "public/robots.txt"), robots);
console.log(`[sitemap] ${pages.length} URLs (${categories.length} categories) for ${SITE}`);

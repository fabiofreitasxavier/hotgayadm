#!/usr/bin/env node
/**
 * Writes public/robots.txt and public/sitemap.xml from src/data/videos.json.
 * Runs before every build (npm "prebuild"), so new videos are listed automatically.
 *
 *   SITE_URL=https://hotgay.com.br node scripts/sitemap.mjs
 *
 * SITE_URL defaults to the Vercel address; set it once a custom domain is live.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA = (process.env.MEDIA_HOST || "https://hotgay.b-cdn.net").replace(/\/$/, "");
const SITE = (process.env.SITE_URL || "https://hotgayadm.vercel.app").replace(/\/$/, "");

const videos = JSON.parse(readFileSync(resolve(ROOT, "src/data/videos.json"), "utf8"));
const today = new Date().toISOString().slice(0, 10);

const pages = [
  { path: "/", lastmod: today, priority: "1.0" },
  // Embed pages are noindex (duplicates of the source site), so only our own previews are listed.
  ...videos.filter((v) => !v.embedUrl).map((v) => ({ path: `/watch/${v.id}`, lastmod: v.addedAt || today, priority: "0.7", video: v })),
  { path: "/termos", lastmod: today, priority: "0.2" },
  { path: "/privacidade", lastmod: today, priority: "0.2" },
  { path: "/denuncia", lastmod: today, priority: "0.2" },
];

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const seconds = (clock) => clock.split(":").map(Number).reduce((a, n) => a * 60 + n, 0);

/** Google video-sitemap entry for one of our own previews. */
function videoTag(v) {
  if (!v) return "";
  const title = v.title || "Prévia exclusiva";
  return (
    "<video:video>" +
    `<video:thumbnail_loc>${MEDIA}/${v.id}.jpg</video:thumbnail_loc>` +
    `<video:title>${esc(title)}</video:title>` +
    `<video:description>${esc(`${title}: prévia gratuita, conteúdo para maiores de 18 anos.`)}</video:description>` +
    `<video:content_loc>${MEDIA}/${v.id}.mp4</video:content_loc>` +
    `<video:duration>${seconds(v.previewDuration)}</video:duration>` +
    "<video:family_friendly>no</video:family_friendly>" +
    "</video:video>"
  );
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n` +
  pages
    .map(
      (p) =>
        `  <url><loc>${SITE}${p.path}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.priority}</priority>${videoTag(p.video)}</url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;

// /upload only stores files in the visitor's own browser; keep it out of search results.
const robots = `User-agent: *\nAllow: /\nDisallow: /upload\n\nSitemap: ${SITE}/sitemap.xml\n`;

writeFileSync(resolve(ROOT, "public/sitemap.xml"), xml);
writeFileSync(resolve(ROOT, "public/robots.txt"), robots);
console.log(`[sitemap] ${pages.length} URLs for ${SITE}`);

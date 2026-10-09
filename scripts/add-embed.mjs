#!/usr/bin/env node
/**
 * Adds a video embedded from xvideos to src/data/videos.json.
 *
 *   npm run add-embed -- "<embed code or video link>" "Título do vídeo"
 *
 * Accepts the <iframe> code from the video's "Embed" button, its embedframe URL, or the
 * normal page link (https://www.xvideos.com/video12345678/... or /video.abc123/...).
 * The video is never downloaded: it keeps playing from xvideos' own player, so a
 * takedown there removes it here too. Only embed videos whose owners allow embedding.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const CATALOG = resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/videos.json");
const HOSTS = new Set(["xvideos.com", "www.xvideos.com"]);

/** Returns the xvideos embedframe URL for any accepted input, or throws. */
export function toEmbedUrl(input) {
  const raw = String(input ?? "").trim();
  const fromIframe = raw.match(/<iframe[^>]*\ssrc=["']([^"']+)["']/i)?.[1];
  let url;
  try {
    url = new URL((fromIframe ?? raw).replace(/^\/\//, "https://"));
  } catch {
    throw new Error("Not a link or embed code.");
  }
  if (!HOSTS.has(url.hostname)) throw new Error(`Only xvideos.com links are supported (got ${url.hostname}).`);

  const embed = url.pathname.match(/^\/embedframe\/([A-Za-z0-9]+)\/?$/);
  if (embed) return `https://www.xvideos.com/embedframe/${embed[1]}`;
  const page = url.pathname.match(/^\/video\.?([A-Za-z0-9]+)(?:\/|$)/);
  if (page) return `https://www.xvideos.com/embedframe/${page[1]}`;
  throw new Error("Couldn't find a video id in that link. Paste the code from the video's Embed button.");
}

function main() {
  const [input, ...titleParts] = process.argv.slice(2);
  const title = titleParts.join(" ").trim();
  if (!input || !title) {
    console.error('usage: npm run add-embed -- "<embed code or xvideos link>" "Título do vídeo"');
    process.exit(2);
  }
  const embedUrl = toEmbedUrl(input);
  const videoId = embedUrl.split("/").pop();
  const id = `xv-${videoId.toLowerCase()}`;

  const catalog = JSON.parse(readFileSync(CATALOG, "utf8"));
  if (catalog.some((v) => v.id === id)) {
    console.log(`already in the catalog: ${id}`);
    return;
  }
  catalog.unshift({ id, title, embedUrl, source: "xvideos", addedAt: new Date().toISOString().slice(0, 10) });
  writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + "\n");
  console.log(`added ${id} → /watch/${id}`);
}

// Run only when invoked directly, so tests can import toEmbedUrl.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(String(err.message ?? err));
    process.exit(1);
  }
}

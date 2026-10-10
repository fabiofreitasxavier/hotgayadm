#!/usr/bin/env node
/**
 * Links thumbnails you uploaded to the media host to the embedded videos in
 * src/data/videos.json.
 *
 *   npm run embed-thumbs
 *
 * For every embed, checks whether "<id>.jpg" (e.g. "xv-omlaiko232a.jpg") exists at the
 * root of the media host, and sets or clears its `thumb` accordingly. Embeds whose
 * `thumb` is a full https URL are left alone. Prints the file names still missing.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HOST = (process.env.MEDIA_HOST || "https://hotgay.b-cdn.net").replace(/\/$/, "");
const CATALOG = resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/videos.json");

async function exists(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

const videos = JSON.parse(readFileSync(CATALOG, "utf8"));
const embeds = videos.filter((v) => v.embedUrl && !/^https:\/\//.test(v.thumb ?? ""));

const found = [];
const missing = [];
await Promise.all(
  embeds.map(async (v) => {
    const file = `${v.id}.jpg`;
    if (await exists(`${HOST}/${file}`)) {
      v.thumb = file;
      found.push(file);
    } else {
      delete v.thumb;
      missing.push(file);
    }
  }),
);

writeFileSync(CATALOG, JSON.stringify(videos, null, 2) + "\n");
console.log(`${found.length} of ${embeds.length} embeds have a thumbnail on ${HOST}`);
if (missing.length) {
  console.log("\nStill missing (upload these names to the root of the storage zone):");
  for (const file of missing.sort()) console.log(`  ${file}`);
}

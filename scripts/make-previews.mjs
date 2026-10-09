#!/usr/bin/env node
/**
 * Builds the short preview clips + thumbnails the site streams, and keeps
 * src/data/videos.json (the catalog) in sync.
 *
 *   node scripts/make-previews.mjs --out <previews folder> <video files or folders…>
 *
 * For each source video it writes, into --out:
 *   <id>.mp4  a ~30s 720p teaser (three 10s moments from the video, or the whole
 *             thing if it is short), H.264/AAC with faststart for instant playback
 *   <id>.jpg  a 640px-wide thumbnail
 *
 * Re-running is incremental: videos already in the catalog are skipped (use
 * --force to rebuild), new ones are added to the top, and titles you edited in
 * videos.json are kept. Upload the --out folder to the video host afterwards.
 *
 * Needs ffmpeg/ffprobe on PATH (or FFMPEG / FFPROBE env vars).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FFMPEG = process.env.FFMPEG || "ffmpeg";
const FFPROBE = process.env.FFPROBE || "ffprobe";
const CATALOG = resolve(dirname(fileURLToPath(import.meta.url)), "../src/data/videos.json");

const SEGMENTS = 3; // teaser moments
const SEGMENT_SECONDS = 10;
const WHOLE_IF_UNDER = 40; // seconds: shorter videos are kept whole

function parseArgs(argv) {
  const opts = { out: "", force: false, inputs: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") opts.out = argv[++i];
    else if (argv[i] === "--force") opts.force = true;
    else opts.inputs.push(argv[i]);
  }
  if (!opts.out || opts.inputs.length === 0) {
    console.error("usage: node scripts/make-previews.mjs --out <folder> [--force] <videos or folders…>");
    process.exit(2);
  }
  return opts;
}

function listVideos(inputs) {
  const files = [];
  for (const input of inputs) {
    if (statSync(input).isDirectory()) {
      for (const name of readdirSync(input).sort()) {
        if (/\.(mp4|mov|m4v|webm|mkv)$/i.test(name)) files.push(join(input, name));
      }
    } else files.push(input);
  }
  return files;
}

/** URL-safe, stable id from the file name. */
function idFor(file) {
  return basename(file, extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function run(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`${cmd} failed:\n${res.stderr.split("\n").slice(-15).join("\n")}`);
  return res.stdout;
}

function probe(file) {
  const info = JSON.parse(
    run(FFPROBE, ["-v", "error", "-show_entries", "format=duration:stream=codec_type", "-of", "json", file]),
  );
  return {
    duration: Number(info.format?.duration) || 0,
    hasAudio: (info.streams ?? []).some((s) => s.codec_type === "audio"),
  };
}

function formatDuration(seconds) {
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

// Fit within 1280x720 (or 720x720 for square/vertical), even dimensions for H.264.
const SCALE =
  "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(720,ih))',scale=trunc(iw/2)*2:trunc(ih/2)*2,setsar=1";

const ENCODE = [
  "-c:v", "libx264", "-preset", "veryfast", "-crf", "27", "-maxrate", "1800k", "-bufsize", "3600k",
  "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-ac", "2", "-movflags", "+faststart",
];

function makePreview(src, dest, { duration, hasAudio }) {
  if (duration <= WHOLE_IF_UNDER) {
    run(FFMPEG, ["-y", "-v", "error", "-i", src, "-vf", SCALE, ...(hasAudio ? [] : ["-an"]), ...ENCODE, dest]);
    return duration;
  }
  // Three evenly spaced moments (at 20%, 50%, 80%), joined into one teaser.
  const starts = Array.from({ length: SEGMENTS }, (_, i) =>
    Math.max(0, duration * (0.2 + (0.6 * i) / (SEGMENTS - 1)) - SEGMENT_SECONDS / 2),
  );
  const parts = [];
  const labels = [];
  starts.forEach((start, i) => {
    const end = start + SEGMENT_SECONDS;
    parts.push(`[0:v]trim=${start.toFixed(2)}:${end.toFixed(2)},setpts=PTS-STARTPTS,${SCALE}[v${i}]`);
    if (hasAudio) parts.push(`[0:a]atrim=${start.toFixed(2)}:${end.toFixed(2)},asetpts=PTS-STARTPTS[a${i}]`);
    labels.push(hasAudio ? `[v${i}][a${i}]` : `[v${i}]`);
  });
  parts.push(`${labels.join("")}concat=n=${SEGMENTS}:v=1:a=${hasAudio ? 1 : 0}${hasAudio ? "[v][a]" : "[v]"}`);
  run(FFMPEG, [
    "-y", "-v", "error", "-i", src,
    "-filter_complex", parts.join(";"),
    "-map", "[v]", ...(hasAudio ? ["-map", "[a]"] : []),
    ...ENCODE, dest,
  ]);
  return SEGMENTS * SEGMENT_SECONDS;
}

function makeThumbnail(src, dest, duration) {
  const at = duration > 10 ? duration * 0.2 : Math.min(1, duration / 2);
  run(FFMPEG, [
    "-y", "-v", "error", "-ss", at.toFixed(2), "-i", src,
    "-frames:v", "1", "-vf", "scale='min(640,iw)':-2", "-q:v", "4", dest,
  ]);
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  mkdirSync(opts.out, { recursive: true });
  const catalog = existsSync(CATALOG) ? JSON.parse(readFileSync(CATALOG, "utf8")) : [];
  const known = new Map(catalog.map((v) => [v.id, v]));
  const added = [];

  for (const src of listVideos(opts.inputs)) {
    const id = idFor(src);
    const existing = known.get(id);
    const outVideo = join(opts.out, `${id}.mp4`);
    const outThumb = join(opts.out, `${id}.jpg`);
    if (existing && !opts.force && existsSync(outVideo) && existsSync(outThumb)) {
      console.log(`skip  ${id} (already in catalog)`);
      continue;
    }
    process.stdout.write(`make  ${id} … `);
    try {
      const info = probe(src);
      const previewSeconds = makePreview(src, outVideo, info);
      makeThumbnail(src, outThumb, info.duration);
      const entry = {
        id,
        title: existing?.title ?? (id === "welcome" ? "Boas-vindas ao HotGay" : ""),
        duration: formatDuration(info.duration),
        previewDuration: formatDuration(previewSeconds),
        addedAt: existing?.addedAt ?? new Date().toISOString().slice(0, 10),
      };
      if (existing) Object.assign(existing, entry);
      else added.push(entry);
      const mb = (statSync(outVideo).size / 1048576).toFixed(1);
      console.log(`ok (${entry.duration} → ${entry.previewDuration} teaser, ${mb} MB)`);
    } catch (err) {
      console.log("FAILED");
      console.error(String(err.message ?? err));
    }
  }

  // New videos go first so the latest uploads lead the page.
  const next = [...added, ...catalog];
  writeFileSync(CATALOG, JSON.stringify(next, null, 2) + "\n");
  console.log(`\n${added.length} added, ${next.length} in catalog → ${CATALOG}`);
}

main();

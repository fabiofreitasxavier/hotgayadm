import { Link } from "@tanstack/react-router";
import type { Video } from "@/data/catalog";
import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { formatDuration, posterKey, useStoredMedia } from "@/lib/video-store";

export function VideoCard({ video }: { video: Video }) {
  const storedPoster = useStoredMedia(video.local && !video.poster ? posterKey(video.id) : null);
  const poster = video.poster || storedPoster;
  const [failed, setFailed] = useState<string | null>(null);
  const [probedDuration, setProbedDuration] = useState("");
  // Hosted videos without a thumbnail image: let the browser show a frame from the file itself.
  const frameFromFile = !poster && !video.local && video.src;
  const duration = video.duration || probedDuration;

  return (
    <Link
      to="/watch/$id"
      params={{ id: video.id }}
      className="group block overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)] transition hover:border-[var(--color-accent)]/60 hover:shadow-[var(--glow)]"
    >
      <div className="relative aspect-video bg-black">
        {poster && failed !== poster ? (
          <img
            src={poster}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setFailed(poster)}
            className="h-full w-full object-cover"
          />
        ) : frameFromFile && failed !== video.src ? (
          <video
            src={`${video.src}#t=2`}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => setProbedDuration(formatDuration(e.currentTarget.duration))}
            onError={() => setFailed(video.src)}
            className="pointer-events-none h-full w-full object-cover"
          />
        ) : (
          // Missing or broken thumbnail: show the brand mark instead of a broken-image icon.
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle,rgba(147,51,234,0.25),transparent_70%)]">
            <img src={BRAND.logo} alt="" className="size-16 rounded-full opacity-80" />
          </div>
        )}
        {video.source ? (
          <span className="absolute top-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] text-[var(--color-mute)]">
            via {video.source}
          </span>
        ) : null}
        {duration ? (
          <span className="absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-0.5 text-xs">{duration}</span>
        ) : null}
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium group-hover:text-[var(--color-accent)]">
          {video.title}
        </h3>
        <p className="text-xs text-[var(--color-mute)]">
          {video.creator}
          {video.views ? ` · ${video.views} visualizações` : ""}
        </p>
      </div>
    </Link>
  );
}

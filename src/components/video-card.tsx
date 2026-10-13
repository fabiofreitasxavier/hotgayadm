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
    <Link to="/watch/$id" params={{ id: video.id }} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-md bg-black ring-[var(--color-accent)] transition group-hover:ring-2">
        {poster && failed !== poster ? (
          <img
            src={poster}
            alt={video.title}
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
            <img src={BRAND.logo} alt={BRAND.name} className="size-16 rounded-full opacity-80" />
          </div>
        )}
        {video.source ? (
          <span className="absolute top-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-[var(--color-mute)]">
            via {video.source}
          </span>
        ) : !video.local ? (
          // Our own previews: the full version is the Telegram offer.
          <span className="absolute top-1.5 left-1.5 rounded bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
            Exclusivo
          </span>
        ) : null}
        {duration ? (
          <span className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold">
            {duration}
          </span>
        ) : null}
      </div>
      <div className="pt-1.5">
        <h3 className="line-clamp-2 text-sm leading-snug font-medium group-hover:text-[var(--color-accent-hi)]">
          {video.title}
        </h3>
        <p className="mt-0.5 text-xs text-[var(--color-mute)]">
          {video.creator}
          {video.views ? ` · ${video.views} visualizações` : ""}
        </p>
      </div>
    </Link>
  );
}

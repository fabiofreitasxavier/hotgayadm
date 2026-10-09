import { Link } from "@tanstack/react-router";
import type { Video } from "@/data/catalog";
import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { posterKey, useStoredMedia } from "@/lib/video-store";

export function VideoCard({ video }: { video: Video }) {
  const storedPoster = useStoredMedia(video.local && !video.poster ? posterKey(video.id) : null);
  const poster = video.poster || storedPoster;
  const [failed, setFailed] = useState<string | null>(null);

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
            onError={() => setFailed(poster)}
            className="h-full w-full object-cover"
          />
        ) : (
          // Missing or broken thumbnail: show the brand mark instead of a broken-image icon.
          <div className="flex h-full items-center justify-center bg-[radial-gradient(circle,rgba(147,51,234,0.25),transparent_70%)]">
            <img src={BRAND.logo} alt="" className="size-16 rounded-full opacity-80" />
          </div>
        )}
        <span className="absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-0.5 text-xs">
          {video.duration}
        </span>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium group-hover:text-[var(--color-accent)]">
          {video.title}
        </h3>
        <p className="text-xs text-[var(--color-mute)]">
          {video.creator} · {video.views} visualizações
        </p>
      </div>
    </Link>
  );
}

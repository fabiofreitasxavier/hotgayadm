import { Link } from "@tanstack/react-router";
import type { Video } from "@/data/catalog";

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      to="/watch/$id"
      params={{ id: video.id }}
      className="group block overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-panel)]"
    >
      <div className="relative aspect-video bg-black">
        {video.poster ? (
          <img src={video.poster} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[var(--color-mute)]">
            Local file
          </div>
        )}
        <span className="absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-0.5 text-xs">
          {video.duration}
        </span>
      </div>
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium group-hover:text-[var(--color-copper)]">
          {video.title}
        </h3>
        <p className="text-xs text-[var(--color-mute)]">
          {video.creator} · {video.views} views
        </p>
      </div>
    </Link>
  );
}

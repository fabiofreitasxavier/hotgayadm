import { createFileRoute, Link } from "@tanstack/react-router";
import { CATALOG, findVideo } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { VideoCard } from "@/components/video-card";

export const Route = createFileRoute("/watch/$id")({
  component: Watch,
});

function Watch() {
  const { id } = Route.useParams();
  const mine = useUploads((s) => s.mine);
  const video = findVideo(id, mine);

  if (!video) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl">Video not found</h1>
        <Link to="/" className="mt-4 inline-block text-[var(--color-copper)]">
          Back to library
        </Link>
      </main>
    );
  }

  const related = [...mine, ...CATALOG].filter((v) => v.id !== video.id).slice(0, 3);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <section>
        <video
          key={video.src}
          controls
          playsInline
          poster={video.poster || undefined}
          className="aspect-video w-full rounded-xl bg-black"
          src={video.src}
        />
        <p className="mt-4 text-xs tracking-[0.16em] text-[var(--color-copper)] uppercase">
          {video.category}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl">{video.title}</h1>
        <p className="mt-2 text-sm text-[var(--color-mute)]">
          {video.creator} · {video.views} views · {video.duration}
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed">{video.description}</p>
      </section>
      <aside className="space-y-3">
        <h2 className="text-sm text-[var(--color-mute)]">Up next</h2>
        {related.map((item) => (
          <VideoCard key={item.id} video={item} />
        ))}
      </aside>
    </main>
  );
}

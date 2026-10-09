import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { CATALOG, findVideo } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { posterKey, useStoredMedia, videoKey } from "@/lib/video-store";
import { VideoCard } from "@/components/video-card";
import { TelegramCard } from "@/components/telegram-cta";

export const Route = createFileRoute("/watch/$id")({
  component: Watch,
});

function Watch() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const mine = useUploads((s) => s.mine);
  const remove = useUploads((s) => s.remove);
  const video = findVideo(id, mine);
  const storedSrc = useStoredMedia(video?.local ? videoKey(video.id) : null);
  const storedPoster = useStoredMedia(video?.local ? posterKey(video.id) : null);

  if (!video) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl">Vídeo não encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-[var(--color-accent)]">
          Voltar para o início
        </Link>
      </main>
    );
  }

  const src = video.local ? storedSrc : video.src;
  const poster = video.poster || storedPoster || undefined;

  // Same category first, then everything else, so "Up next" stays on topic.
  const others = [...mine, ...CATALOG].filter((v) => v.id !== video.id);
  const related = [
    ...others.filter((v) => v.category === video.category),
    ...others.filter((v) => v.category !== video.category),
  ].slice(0, 4);

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <section>
        {video.embedUrl ? (
          // Played by the source site's own player; the file never touches our host.
          <iframe
            key={video.embedUrl}
            src={video.embedUrl}
            title={video.title}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="aspect-video w-full rounded-xl border-0 bg-black"
          />
        ) : src ? (
          <video
            key={src}
            controls
            playsInline
            poster={poster}
            className="aspect-video w-full rounded-xl bg-black"
            src={src}
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-black text-sm text-[var(--color-mute)]">
            {src === undefined ? "Carregando…" : "Este arquivo não está mais salvo neste navegador."}
          </div>
        )}
        <p className="mt-4 text-xs tracking-[0.16em] text-[var(--color-accent)] uppercase">
          {video.category}
        </p>
        <div className="mt-1 flex items-start justify-between gap-4">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">{video.title}</h1>
          {video.local ? (
            <button
              type="button"
              onClick={() => {
                if (!window.confirm(`Excluir "${video.title}" deste navegador?`)) return;
                remove(video.id);
                navigate({ to: "/" });
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-sm text-[var(--color-mute)] hover:border-red-400 hover:text-red-400"
            >
              <Trash2 className="size-4" />
              Excluir
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-sm text-[var(--color-mute)]">
          {[video.creator, video.views && `${video.views} visualizações`, video.duration].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed">{video.description}</p>
      </section>
      <aside className="space-y-3">
        <TelegramCard />
        <h2 className="pt-2 text-sm text-[var(--color-mute)]">A seguir</h2>
        {related.map((item) => (
          <VideoCard key={item.id} video={item} />
        ))}
      </aside>
    </main>
  );
}

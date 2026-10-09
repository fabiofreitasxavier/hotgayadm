import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Link as LinkIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { CATALOG, findVideo } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { posterKey, useStoredMedia, videoKey } from "@/lib/video-store";
import { VideoCard } from "@/components/video-card";
import { NotFound } from "@/components/not-found";
import { TelegramCard } from "@/components/telegram-cta";

export const Route = createFileRoute("/watch/$id")({
  // Catalog videos get their own tab title and description; local uploads fall back to the site default.
  head: ({ params }) => {
    const video = findVideo(params.id);
    if (!video) return {};
    return {
      meta: [
        { title: `${video.title} — HotGay` },
        { name: "description", content: video.description },
      ],
    };
  },
  component: Watch,
});

/** Clipboard API first; the legacy execCommand path covers browsers that block it. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function CopyLinkButton() {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copied = state === "copied";
  return (
    <button
      type="button"
      onClick={async () => {
        setState((await copyText(window.location.href)) ? "copied" : "failed");
        setTimeout(() => setState("idle"), 2500);
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-sm text-[var(--color-mute)] hover:border-[var(--color-accent)] hover:text-[var(--color-bone)]"
    >
      {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
      {copied ? "Link copiado" : state === "failed" ? "Copie da barra de endereço" : "Copiar link"}
    </button>
  );
}

function Watch() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const mine = useUploads((s) => s.mine);
  const remove = useUploads((s) => s.remove);
  const video = findVideo(id, mine);
  const storedSrc = useStoredMedia(video?.local ? videoKey(video.id) : null);
  const storedPoster = useStoredMedia(video?.local ? posterKey(video.id) : null);
  // The src that failed to load; keyed so moving to another video resets it.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!video) {
    return <NotFound />;
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
        ) : src && failedSrc === src ? (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-[var(--color-line)] bg-black px-6 text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold uppercase">Prévia indisponível</p>
            <p className="max-w-sm text-sm text-[var(--color-mute)]">
              Não conseguimos carregar este vídeo agora. Tente novamente em alguns minutos ou escolha outra prévia.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFailedSrc(null)}
                className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm hover:border-[var(--color-accent)]"
              >
                Tentar de novo
              </button>
              <Link to="/" className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white">
                Ver outras prévias
              </Link>
            </div>
          </div>
        ) : src ? (
          <video
            key={src}
            controls
            playsInline
            // Only fetch the file's header until the viewer presses play; saves CDN bandwidth.
            preload="metadata"
            poster={poster}
            onError={() => setFailedSrc(src)}
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
          <div className="flex shrink-0 gap-2">
            <CopyLinkButton />
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

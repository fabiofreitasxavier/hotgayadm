import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Link as LinkIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { CATALOG, PREVIEWS_TAG, findTag, findVideo, type Tag, type Video } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { posterKey, useStoredMedia, videoKey } from "@/lib/video-store";
import { VideoCard } from "@/components/video-card";
import { NotFound } from "@/components/not-found";
import { TelegramCard } from "@/components/telegram-cta";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/watch/$id")({
  // Catalog videos get their own title, description, canonical URL and (for our own
  // previews) VideoObject structured data. Embeds are noindex: the same video is already
  // indexed on its source site, and many duplicate pages hurt the whole domain.
  head: ({ params }) => {
    const video = findVideo(params.id);
    // Unknown ids (or uploads that only exist in one visitor's browser) must never be indexed.
    if (!video) return { meta: [{ name: "robots", content: "noindex" }] };
    const url = `${BRAND.siteUrl}/watch/${video.id}`;
    const tags = (video.tags ?? []).map(findTag).filter((t): t is Tag => Boolean(t));
    // Breadcrumb goes through the most specific category: a real topic beats "Prévias exclusivas".
    const crumbTag = tags.find((t) => t.slug !== PREVIEWS_TAG) ?? tags[0];
    const hasPoster = /^https:\/\//.test(video.poster);
    const ownPreview = !video.embedUrl && !video.local;
    const title = `${video.title} — Vídeo gay | ${BRAND.name}`;
    const description = video.description;
    const meta = [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: [video.title, ...tags.map((t) => t.name), "vídeo gay", BRAND.name].join(", ") },
      ...(video.embedUrl ? [{ name: "robots", content: "noindex, follow" }] : []),
      // Per-page share card; the platform head injector keeps these over its site-wide card.
      { property: "og:title", content: video.title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: "video.other" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: BRAND.name },
      ...(/^https:\/\//.test(video.poster) ? [{ property: "og:image", content: video.poster }] : []),
      ...(ownPreview
        ? [
            { property: "og:video", content: video.src },
            { property: "og:video:type", content: "video/mp4" },
            { property: "og:video:width", content: "1280" },
            { property: "og:video:height", content: "720" },
          ]
        : []),
    ];
    const links = [{ rel: "canonical", href: url }];
    const scripts: { type: string; children: string }[] = [];
    const duration = isoDuration(video.duration);
    if (ownPreview) {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: video.title,
        description,
        thumbnailUrl: hasPoster ? [video.poster] : undefined,
        contentUrl: video.src,
        uploadDate: video.addedAt,
        duration,
        isFamilyFriendly: false,
        inLanguage: "pt-BR",
        url,
        creator: { "@type": "Organization", name: BRAND.name },
        publisher: { "@type": "Organization", name: BRAND.name, logo: { "@type": "ImageObject", url: `${BRAND.siteUrl}/logo.jpg` } },
        keywords: tags.map((t) => t.name).join(", ") || video.category,
      };
      const breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: `${BRAND.siteUrl}/` },
          ...(crumbTag
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: crumbTag.name,
                  item: `${BRAND.siteUrl}/categoria/${crumbTag.slug}`,
                },
              ]
            : []),
          { "@type": "ListItem", position: crumbTag ? 3 : 2, name: video.title, item: url },
        ],
      };
      scripts.push({ type: "application/ld+json", children: JSON.stringify(jsonLd) });
      scripts.push({ type: "application/ld+json", children: JSON.stringify(breadcrumb) });
    }
    if (scripts.length === 0) return { meta, links };
    return { meta, links, scripts };
  },
  component: Watch,
});

/** "8:20" / "1:02:03" → ISO 8601 "PT8M20S", as schema.org expects. */
function isoDuration(clock: string): string | undefined {
  const parts = clock.split(":").map(Number);
  if (parts.length < 2 || parts.some((n) => !Number.isFinite(n))) return undefined;
  const [h, m, s] = parts.length === 3 ? parts : [0, ...parts];
  return `PT${h ? `${h}H` : ""}${m}M${s}S`;
}

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

  // Most shared categories first, then the same category, then everything else, so "Up next"
  // stays on topic. Our own previews win ties because they are the pages that can rank.
  const mineTags = new Set(video.tags ?? []);
  const score = (v: Video) =>
    (v.tags ?? []).filter((t) => mineTags.has(t) && t !== PREVIEWS_TAG).length * 4 +
    (v.category === video.category ? 2 : 0) +
    (v.embedUrl ? 0 : 1);
  const related = [...mine, ...CATALOG]
    .filter((v) => v.id !== video.id)
    .map((v, i) => ({ v, s: score(v), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, 6)
    .map(({ v }) => v);
  const videoTags = (video.tags ?? []).map(findTag).filter((t): t is Tag => Boolean(t));

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
        {videoTags.length ? (
          <ul aria-label="Categorias" className="mt-4 flex flex-wrap gap-2">
            {videoTags.map((t) => (
              <li key={t.slug}>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: t.slug }}
                  className="inline-block rounded-full border border-[var(--color-line)] px-3 py-1 text-sm text-[var(--color-mute)] hover:border-[var(--color-accent)] hover:text-[var(--color-bone)]"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
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

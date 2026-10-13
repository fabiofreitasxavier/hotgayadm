import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { CATALOG, CATEGORIES } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { VideoCard } from "@/components/video-card";
import { BRAND } from "@/lib/brand";
import { PromoHero, TelegramCard } from "@/components/telegram-cta";

type Search = { q?: string; cat?: string };

const PAGE_SIZE = 24;

export const Route = createFileRoute("/")({
  head: () => {
    const title = "HotGay — Prévia de vídeos gays exclusivos e comunidade privada";
    const description =
      "Prévias gratuitas de vídeos gays exclusivos, atualizadas todos os dias. Veja os vídeos e entre na comunidade privada no Telegram com mais de 800 vídeos por R$ 9,99.";
    const meta = [
      { title },
      { name: "description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${BRAND.siteUrl}/` },
      { property: "og:image", content: `${BRAND.siteUrl}/logo.jpg` },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: BRAND.name },
    ];
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: BRAND.name,
          url: `${BRAND.siteUrl}/`,
          inLanguage: "pt-BR",
          potentialAction: {
            "@type": "SearchAction",
            target: `${BRAND.siteUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
        {
          "@type": "Organization",
          name: BRAND.name,
          url: `${BRAND.siteUrl}/`,
          logo: `${BRAND.siteUrl}/logo.jpg`,
        },
        {
          "@type": "ItemList",
          itemListElement: CATALOG.slice(0, 24).map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${BRAND.siteUrl}/watch/${v.id}`,
            name: v.title,
          })),
        },
      ],
    };
    return {
      meta,
      links: [{ rel: "canonical", href: `${BRAND.siteUrl}/` }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
    cat: typeof search.cat === "string" ? search.cat : undefined,
  }),
  component: Home,
});

function Home() {
  const { q, cat } = Route.useSearch();
  const mine = useUploads((s) => s.mine);
  const all = [...mine, ...CATALOG];
  const query = (q ?? "").toLowerCase();
  const filtered = all.filter((v) => {
    const catOk = !cat || cat === "All" || v.category === cat;
    const textOk =
      !query ||
      v.title.toLowerCase().includes(query) ||
      v.creator.toLowerCase().includes(query) ||
      v.category.toLowerCase().includes(query);
    return catOk && textOk;
  });

  // Keep the hero for the landing view; searches and category filters go straight to results.
  const showHero = !q && !cat;

  // Render the full (filtered) list so every video is present in the initial HTML for crawlers and users alike.
  const visible = filtered;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {showHero ? (
        <div className="mb-10">
          <PromoHero />
        </div>
      ) : null}

      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-wide uppercase">
          {q ? `Resultados para “${q}”` : "Vídeos"}
        </h2>
        <p className="shrink-0 text-sm text-[var(--color-mute)]">
          {filtered.length} {filtered.length === 1 ? "vídeo" : "vídeos"}
        </p>
      </div>

      {/* Only worth showing once there is more than one real category. */}
      <nav className={CATEGORIES.length > 2 ? "mb-6 flex gap-2 overflow-x-auto pb-1" : "hidden"}>
        {CATEGORIES.map((name) => {
          const active = (cat ?? "All") === name;
          return (
            <Link
              key={name}
              to="/"
              search={{ q, cat: name === "All" ? undefined : name }}
              className={
                "shrink-0 rounded-full border px-3 py-1.5 text-sm " +
                (active
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[var(--glow)]"
                  : "border-[var(--color-line)] text-[var(--color-mute)]")
              }
            >
              {name === "All" ? "Todos" : name}
            </Link>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] px-6 py-12 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl font-bold uppercase">Nada encontrado</p>
          <p className="mt-1 text-sm text-[var(--color-mute)]">Tente outra palavra ou veja todos os vídeos.</p>
          <Link to="/" className="mt-4 inline-block text-sm text-[var(--color-accent-hi)] underline">
            Ver todos os vídeos
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((video, i) => (
              <VideoSlot key={video.id} index={i}>
                <VideoCard video={video} />
              </VideoSlot>
            ))}
          </div>
          null
        </>
      )}
    </main>
  );
}

// Drops the Telegram card into the grid after the first row of videos.
function VideoSlot({ index, children }: { index: number; children: ReactNode }) {
  if (index !== 3) return <>{children}</>;
  return (
    <>
      <TelegramCard />
      {children}
    </>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { CATALOG, CATEGORY_PAGES, findTag, ownFirst } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { VideoCard } from "@/components/video-card";
import { CategoryNav } from "@/components/category-nav";
import { BRAND } from "@/lib/brand";
import { PromoHero, TelegramCard } from "@/components/telegram-cta";

type Search = { q?: string; cat?: string };

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const title = "HotGay — Prévia de vídeos gays exclusivos e comunidade privada";
    const description =
      "Prévias gratuitas de vídeos gays exclusivos, atualizadas todos os dias. Veja os vídeos e entre na comunidade privada no Telegram com mais de 800 vídeos por R$ 9,99.";
    // Search results and old ?cat= filters are thin duplicates of the home page: crawl them, don't index them.
    const filteredView = Boolean(match.search.q || match.search.cat);
    const meta = [
      { title },
      { name: "description", content: description },
      ...(filteredView ? [{ name: "robots", content: "noindex, follow" }] : []),
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
          itemListElement: ownFirst(CATALOG)
            .slice(0, 24)
            .map((v, i) => ({
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
  // Uploads from this browser first, then our own previews (the pages that can rank), then embeds.
  const all = ownFirst([...mine, ...CATALOG]);
  const query = (q ?? "").toLowerCase();
  const filtered = all.filter((v) => {
    const catOk = !cat || cat === "All" || v.category === cat;
    const textOk =
      !query ||
      v.title.toLowerCase().includes(query) ||
      v.creator.toLowerCase().includes(query) ||
      v.category.toLowerCase().includes(query) ||
      (v.tags ?? []).some((t) => findTag(t)?.name.toLowerCase().includes(query));
    return catOk && textOk;
  });

  // Keep the hero for the landing view; searches and category filters go straight to results.
  const showHero = !q && !cat;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {showHero ? (
        <div className="mb-10">
          <PromoHero />
        </div>
      ) : null}

      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-wide uppercase">
          {q ? `Resultados para “${q}”` : "Vídeos gays exclusivos"}
        </h2>
        <p className="shrink-0 text-sm text-[var(--color-mute)]">
          {filtered.length} {filtered.length === 1 ? "vídeo" : "vídeos"}
        </p>
      </div>

      <CategoryNav />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-panel)] px-6 py-12 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl font-bold uppercase">Nada encontrado</p>
          <p className="mt-1 text-sm text-[var(--color-mute)]">Tente outra palavra ou veja todos os vídeos.</p>
          <Link to="/" className="mt-4 inline-block text-sm text-[var(--color-accent-hi)] underline">
            Ver todos os vídeos
          </Link>
        </div>
      ) : (
        // The full (filtered) list is rendered so every video link is in the initial HTML for crawlers.
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video, i) => (
            <VideoSlot key={video.id} index={i}>
              <VideoCard video={video} />
            </VideoSlot>
          ))}
        </div>
      )}

      {showHero ? <AboutSite /> : null}
    </main>
  );
}

/** A short, unique text block about the site, with links into every category page. */
function AboutSite() {
  return (
    <section className="mt-14 max-w-3xl text-[15px] leading-relaxed text-[var(--color-mute)]">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-bone)] uppercase">
        Sobre o {BRAND.name}
      </h2>
      <p className="mt-3">
        O {BRAND.name} publica prévias gratuitas de vídeos gays exclusivos, com conteúdo novo todos os dias. Assista aos
        trechos aqui no site e, se gostar, entre na nossa comunidade privada no Telegram: são mais de{" "}
        {BRAND.videoCount} vídeos completos por apenas R$ {BRAND.price}, sem cadastro e com acesso imediato.
      </p>
      {CATEGORY_PAGES.length ? (
        <p className="mt-3">
          Navegue por categoria:{" "}
          {CATEGORY_PAGES.map(({ tag }, i) => (
            <span key={tag.slug}>
              {i > 0 ? ", " : ""}
              <Link
                to="/categoria/$slug"
                params={{ slug: tag.slug }}
                className="text-[var(--color-accent-hi)] hover:underline"
              >
                {tag.title.toLowerCase()}
              </Link>
            </span>
          ))}
          .
        </p>
      ) : null}
      <p className="mt-3">
        Todo o conteúdo é para maiores de 18 anos, e todas as pessoas retratadas tinham 18 anos ou mais no momento da
        gravação.
      </p>
    </section>
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

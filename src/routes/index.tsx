import { createFileRoute, Link } from "@tanstack/react-router";
import { CATALOG, CATEGORY_PAGES, findTag, ownFirst } from "@/data/catalog";
import { GUIDES } from "@/data/guides";
import { useUploads } from "@/lib/uploads";
import { VideoGrid } from "@/components/video-grid";
import { PromoBanner } from "@/components/promo";
import { BRAND } from "@/lib/brand";

type Search = { q?: string; cat?: string; page?: number };

/** Videos per page; page links are real <a href="/?page=2"> so crawlers can follow them. */
const PAGE_SIZE = 60;

export const Route = createFileRoute("/")({
  head: ({ match }) => {
    const page = match.search.page ?? 1;
    const base = "HotGay — Vídeos gays exclusivos, prévias grátis e comunidade no Telegram";
    const title = page > 1 ? `Vídeos gays exclusivos — página ${page} | ${BRAND.name}` : base;
    const description =
      "Prévias gratuitas de vídeos gays exclusivos, atualizadas todos os dias. Veja os vídeos e entre na comunidade privada no Telegram com mais de 800 vídeos por R$ 9,99.";
    const url = page > 1 ? `${BRAND.siteUrl}/?page=${page}` : `${BRAND.siteUrl}/`;
    // Search results and old ?cat= filters are thin duplicates of the home page: crawl them, don't index them.
    const filteredView = Boolean(match.search.q || match.search.cat);
    const meta = [
      { title },
      { name: "description", content: description },
      ...(filteredView ? [{ name: "robots", content: "noindex, follow" }] : []),
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
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
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
            .slice(0, 30)
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
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  validateSearch: (search: Record<string, unknown>): Search => {
    const page = Number(search.page);
    return {
      q: typeof search.q === "string" ? search.q : undefined,
      cat: typeof search.cat === "string" ? search.cat : undefined,
      page: Number.isInteger(page) && page > 1 ? page : undefined,
    };
  },
  component: Home,
});

function Home() {
  const { q, cat, page = 1 } = Route.useSearch();
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
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const landing = !q && !cat && current === 1;

  return (
    <main className="mx-auto max-w-7xl px-3 py-4">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-wide uppercase sm:text-2xl">
          {q
            ? `Resultados para “${q}”`
            : current > 1
              ? `Vídeos gays exclusivos — página ${current}`
              : "Vídeos gays exclusivos"}
        </h1>
        <p className="shrink-0 text-xs text-[var(--color-mute)] sm:text-sm">
          {filtered.length} {filtered.length === 1 ? "vídeo" : "vídeos"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-6 py-12 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl font-bold uppercase">
            Nada encontrado
          </p>
          <p className="mt-1 text-sm text-[var(--color-mute)]">
            Tente outra palavra ou veja todos os vídeos.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm text-[var(--color-accent-hi)] underline"
          >
            Ver todos os vídeos
          </Link>
        </div>
      ) : (
        // Every video link of the page is in the server HTML, so crawlers see the whole list.
        <VideoGrid videos={visible} />
      )}

      <PromoBanner variant={0} className="mt-8" />

      {pages > 1 ? <Pager current={current} pages={pages} q={q} cat={cat} /> : null}

      {landing ? <AboutSite /> : null}
    </main>
  );
}

/** Numbered page links, tube-site style. */
function Pager({
  current,
  pages,
  q,
  cat,
}: {
  current: number;
  pages: number;
  q?: string;
  cat?: string;
}) {
  const item = "grid h-9 min-w-9 place-items-center rounded-md border px-3 text-sm ";
  const to = (n: number) => ({ q, cat, page: n > 1 ? n : undefined });
  return (
    <nav aria-label="Páginas" className="mt-6 flex flex-wrap justify-center gap-2">
      {current > 1 ? (
        <Link
          to="/"
          search={to(current - 1)}
          rel="prev"
          className={item + "border-[var(--color-line)]"}
        >
          ← Anterior
        </Link>
      ) : null}
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          to="/"
          search={to(n)}
          aria-current={n === current ? "page" : undefined}
          className={
            item +
            (n === current
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] font-semibold text-white"
              : "border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-accent)]")
          }
        >
          {n}
        </Link>
      ))}
      {current < pages ? (
        <Link
          to="/"
          search={to(current + 1)}
          rel="next"
          className={item + "border-[var(--color-line)]"}
        >
          Próxima →
        </Link>
      ) : null}
    </nav>
  );
}

/** A short, unique text block about the site, with links into every category page. */
function AboutSite() {
  return (
    <section className="mt-12 max-w-3xl text-sm leading-relaxed text-[var(--color-mute)]">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-bone)] uppercase">
        Sobre o {BRAND.name}
      </h2>
      <p className="mt-2">
        O {BRAND.name} publica prévias gratuitas de vídeos gays exclusivos, com conteúdo novo todos
        os dias. Assista aos trechos aqui no site e, se gostar, entre na nossa comunidade privada no
        Telegram: são mais de {BRAND.videoCount} vídeos completos por apenas R$ {BRAND.price}, sem
        cadastro e com acesso imediato.
      </p>
      {CATEGORY_PAGES.length ? (
        <p className="mt-2">
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
      <p className="mt-2">
        Leia antes de assistir:{" "}
        {GUIDES.map((g, i) => (
          <span key={g.slug}>
            {i > 0 ? ", " : ""}
            <Link to="/guia/$slug" params={{ slug: g.slug }} className="text-[var(--color-accent-hi)] hover:underline">
              {g.title.toLowerCase()}
            </Link>
          </span>
        ))}
        . Todos os textos estão na{" "}
        <Link to="/guia" className="text-[var(--color-accent-hi)] hover:underline">
          página de guias
        </Link>
        .
      </p>
      <p className="mt-2">
        Todo o conteúdo é para maiores de 18 anos, e todas as pessoas retratadas tinham 18 anos ou
        mais no momento da gravação.
      </p>
    </section>
  );
}

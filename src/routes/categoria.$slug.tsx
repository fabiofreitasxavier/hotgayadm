import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CATEGORY_PAGES, MIN_CATEGORY_SIZE, findTag, videosInTag } from "@/data/catalog";
import { VideoGrid } from "@/components/video-grid";
import { PromoBanner } from "@/components/promo";
import { BRAND } from "@/lib/brand";

/** Meta descriptions are cut around 155 characters; end on a word instead of mid-word. */
function clip(text: string, max = 155): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max - 1)).replace(/[,.;:]$/, "") + "…";
}

export const Route = createFileRoute("/categoria/$slug")({
  // Unknown slugs get a real 404 status, not a soft 404 page.
  loader: ({ params }) => {
    if (!findTag(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const tag = findTag(params.slug);
    if (!tag) return { meta: [{ name: "robots", content: "noindex" }] };
    const videos = videosInTag(tag.slug);
    const url = `${BRAND.siteUrl}/categoria/${tag.slug}`;
    const title = `${tag.title} — ${BRAND.name}`;
    const description = clip(tag.intro);
    const meta = [
      { title },
      { name: "description", content: description },
      // Too-small categories stay reachable but out of the index until they fill up.
      ...(videos.length < MIN_CATEGORY_SIZE
        ? [{ name: "robots", content: "noindex, follow" }]
        : []),
      { property: "og:type", content: "website" },
      { property: "og:title", content: tag.title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: BRAND.name },
      ...(/^https:\/\//.test(videos[0]?.poster ?? "")
        ? [{ property: "og:image", content: videos[0].poster }]
        : []),
    ];
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: tag.title,
          description,
          url,
          inLanguage: "pt-BR",
          isFamilyFriendly: false,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: videos.length,
            itemListElement: videos.slice(0, 30).map((v, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${BRAND.siteUrl}/watch/${v.id}`,
              name: v.title,
            })),
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: `${BRAND.siteUrl}/` },
            { "@type": "ListItem", position: 2, name: tag.name, item: url },
          ],
        },
      ],
    };
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: Category,
});

function Category() {
  const { slug } = Route.useParams();
  const tag = findTag(slug)!;
  const videos = videosInTag(slug);
  const others = CATEGORY_PAGES.filter((c) => c.tag.slug !== slug);

  return (
    <main className="mx-auto max-w-7xl px-3 py-4">
      <nav aria-label="Navegação estrutural" className="text-xs text-[var(--color-mute)]">
        <Link to="/" className="hover:text-[var(--color-bone)]">
          Início
        </Link>
        <span className="px-2">/</span>
        <span>{tag.name}</span>
      </nav>

      <header className="mt-2 mb-4">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-wide uppercase sm:text-2xl">
            {tag.title}
          </h1>
          <p className="shrink-0 text-xs text-[var(--color-mute)] sm:text-sm">
            {videos.length} {videos.length === 1 ? "vídeo" : "vídeos"}
          </p>
        </div>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[var(--color-mute)]">
          {tag.intro}
        </p>
      </header>

      <VideoGrid videos={videos} />

      <PromoBanner variant={2} className="mt-8" />

      {others.length ? (
        <section className="mt-10">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase">
            Outras categorias
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {others.map(({ tag: t, count }) => (
              <li key={t.slug}>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: t.slug }}
                  className="text-[var(--color-accent-hi)] hover:underline"
                >
                  {t.title}
                </Link>{" "}
                <span className="text-[var(--color-mute)]">({count})</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}

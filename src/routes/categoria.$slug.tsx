import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Fragment } from "react";
import { CATEGORY_PAGES, MIN_CATEGORY_SIZE, findTag, videosInTag } from "@/data/catalog";
import { VideoCard } from "@/components/video-card";
import { CategoryNav } from "@/components/category-nav";
import { TelegramCard } from "@/components/telegram-cta";
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
      ...(videos.length < MIN_CATEGORY_SIZE ? [{ name: "robots", content: "noindex, follow" }] : []),
      { property: "og:type", content: "website" },
      { property: "og:title", content: tag.title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: BRAND.name },
      ...(/^https:\/\//.test(videos[0]?.poster ?? "") ? [{ property: "og:image", content: videos[0].poster }] : []),
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
    <main className="mx-auto max-w-6xl px-4 py-6">
      <nav aria-label="Navegação estrutural" className="text-sm text-[var(--color-mute)]">
        <Link to="/" className="hover:text-[var(--color-bone)]">
          Início
        </Link>
        <span className="px-2">/</span>
        <span>{tag.name}</span>
      </nav>

      <header className="mt-3 mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-wide uppercase sm:text-4xl">
          {tag.title}
        </h1>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[var(--color-mute)]">{tag.intro}</p>
        <p className="mt-2 text-sm text-[var(--color-mute)]">
          {videos.length} {videos.length === 1 ? "vídeo" : "vídeos"}
        </p>
      </header>

      <CategoryNav active={slug} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, i) => (
          <Fragment key={video.id}>
            {i === 3 ? <TelegramCard /> : null}
            <VideoCard video={video} />
          </Fragment>
        ))}
      </div>
      {videos.length <= 3 ? (
        <div className="mt-4">
          <TelegramCard />
        </div>
      ) : null}

      {others.length ? (
        <section className="mt-12">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold uppercase">Outras categorias</h2>
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

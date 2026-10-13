import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CATEGORY_PAGES, findTag } from "@/data/catalog";
import { GUIDES, findGuide } from "@/data/guides";
import { BRAND } from "@/lib/brand";
import { TelegramButton } from "@/components/telegram-cta";

export const Route = createFileRoute("/guia/$slug")({
  loader: ({ params }) => {
    if (!findGuide(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const guide = findGuide(params.slug);
    if (!guide) return { meta: [{ name: "robots", content: "noindex" }] };
    const url = `${BRAND.siteUrl}/guia/${guide.slug}`;
    const title = `${guide.title} — ${BRAND.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: guide.description },
        { property: "og:type", content: "article" },
        { property: "og:title", content: guide.title },
        { property: "og:description", content: guide.description },
        { property: "og:url", content: url },
        { property: "og:image", content: `${BRAND.siteUrl}/logo.jpg` },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:site_name", content: BRAND.name },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: guide.title,
                description: guide.description,
                inLanguage: "pt-BR",
                isFamilyFriendly: false,
                dateModified: guide.updated,
                mainEntityOfPage: url,
                author: { "@type": "Organization", name: BRAND.name },
                publisher: {
                  "@type": "Organization",
                  name: BRAND.name,
                  logo: { "@type": "ImageObject", url: `${BRAND.siteUrl}/logo.jpg` },
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Início", item: `${BRAND.siteUrl}/` },
                  { "@type": "ListItem", position: 2, name: "Guias", item: `${BRAND.siteUrl}/guia` },
                  { "@type": "ListItem", position: 3, name: guide.title, item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { slug } = Route.useParams();
  const guide = findGuide(slug)!;
  const others = GUIDES.filter((g) => g.slug !== guide.slug);
  const categories = guide.categories.map(findTag).filter((t) => t != null);
  const liveCategories = slug === "como-escolher-categoria" ? CATEGORY_PAGES : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Navegação estrutural" className="text-xs text-[var(--color-mute)]">
        <Link to="/" className="hover:text-[var(--color-bone)]">
          Início
        </Link>
        <span className="px-2">/</span>
        <Link to="/guia" className="hover:text-[var(--color-bone)]">
          Guias
        </Link>
        <span className="px-2">/</span>
        <span>{guide.title}</span>
      </nav>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-1 text-xs text-[var(--color-mute)]">Atualizado em {guide.updated}</p>
      <p className="mt-4 text-[15px] leading-relaxed">{guide.intro}</p>
      {guide.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold uppercase">
            {section.heading}
          </h2>
          {section.paragraphs.map((p) => (
            <p key={p} className="mt-2 text-[15px] leading-relaxed text-[var(--color-mute)]">
              {p}
            </p>
          ))}
        </section>
      ))}
      {liveCategories.length ? (
        <section className="mt-8">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold uppercase">
            Categorias no menu
          </h2>
          <ul className="mt-3 space-y-3">
            {liveCategories.map(({ tag }) => (
              <li key={tag.slug}>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: tag.slug }}
                  className="text-[var(--color-accent-hi)] hover:underline"
                >
                  {tag.title}
                </Link>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-mute)]">{tag.intro}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {slug === "comunidade-telegram" ? (
        <div className="mt-8">
          <TelegramButton label={`Entrar no Telegram · R$ ${BRAND.price}`} />
        </div>
      ) : null}
      <section className="mt-10 border-t border-[var(--color-line)] pt-6 text-sm leading-relaxed">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase">Veja também</h2>
        <ul className="mt-3 space-y-2">
          {categories.map((tag) => (
            <li key={tag.slug}>
              <Link
                to="/categoria/$slug"
                params={{ slug: tag.slug }}
                className="text-[var(--color-accent-hi)] hover:underline"
              >
                {tag.title}
              </Link>
            </li>
          ))}
          {others.map((g) => (
            <li key={g.slug}>
              <Link
                to="/guia/$slug"
                params={{ slug: g.slug }}
                className="text-[var(--color-accent-hi)] hover:underline"
              >
                {g.title}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/termos" className="text-[var(--color-accent-hi)] hover:underline">
              Termos de Uso
            </Link>
          </li>
          <li>
            <Link to="/denuncia" className="text-[var(--color-accent-hi)] hover:underline">
              Denúncia e Remoção
            </Link>
          </li>
        </ul>
        <p className="mt-4 text-[var(--color-mute)]">
          Para indicar esta página, use o endereço {BRAND.siteUrl}/guia/{guide.slug}.
        </p>
      </section>
    </main>
  );
}

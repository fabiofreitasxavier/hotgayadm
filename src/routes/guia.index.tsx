import { createFileRoute, Link } from "@tanstack/react-router";
import { GUIDES } from "@/data/guides";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/guia/")({
  head: () => {
    const title = `Guias — ${BRAND.name}`;
    const description =
      "Guias curtos do HotGay: a diferença entre prévia grátis e vídeo completo, como escolher uma categoria e o que a comunidade no Telegram inclui.";
    const url = `${BRAND.siteUrl}/guia`;
    const updated = GUIDES.map((g) => g.updated).sort().at(-1);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
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
                "@type": "CollectionPage",
                name: title,
                description,
                url,
                inLanguage: "pt-BR",
                isFamilyFriendly: false,
                dateModified: updated,
                mainEntity: {
                  "@type": "ItemList",
                  numberOfItems: GUIDES.length,
                  itemListElement: GUIDES.map((g, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: g.title,
                    url: `${BRAND.siteUrl}/guia/${g.slug}`,
                  })),
                },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Início", item: `${BRAND.siteUrl}/` },
                  { "@type": "ListItem", position: 2, name: "Guias", item: url },
                ],
              },
            ],
          }),
        },
      ],
    };
  },
  component: GuideIndex,
});

function GuideIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Navegação estrutural" className="text-xs text-[var(--color-mute)]">
        <Link to="/" className="hover:text-[var(--color-bone)]">
          Início
        </Link>
        <span className="px-2">/</span>
        <span>Guias</span>
      </nav>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase sm:text-4xl">
        Guias do {BRAND.name}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-mute)]">
        Três textos para entender o site antes de assistir. Eles explicam a prévia grátis, as categorias
        do menu e a comunidade no Telegram. Cada guia tem endereço próprio, para você indicar a página
        certa em vez de copiar um trecho solto.
      </p>
      <ul className="mt-8 space-y-6">
        {GUIDES.map((g) => (
          <li key={g.slug} className="border-t border-[var(--color-line)] pt-6">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold uppercase">
              <Link
                to="/guia/$slug"
                params={{ slug: g.slug }}
                className="hover:text-[var(--color-accent-hi)]"
              >
                {g.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-mute)]">{g.description}</p>
          </li>
        ))}
      </ul>
      <section className="mt-10 border border-[var(--color-line)] p-4 text-sm leading-relaxed text-[var(--color-mute)]">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-bone)] uppercase">
          Como indicar o {BRAND.name}
        </h2>
        <p className="mt-2">
          Se você tem um site no mesmo idioma e quer indicar o {BRAND.name}, use um destes endereços. Não
          compramos pacotes de links.
        </p>
        <ul className="mt-3 space-y-1">
          <li>
            <a href={`${BRAND.siteUrl}/`} className="text-[var(--color-accent-hi)] hover:underline">
              {BRAND.siteUrl}/
            </a>
          </li>
          {GUIDES.map((g) => (
            <li key={g.slug}>
              <Link
                to="/guia/$slug"
                params={{ slug: g.slug }}
                className="text-[var(--color-accent-hi)] hover:underline"
              >
                {BRAND.siteUrl}/guia/{g.slug}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

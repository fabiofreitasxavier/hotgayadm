import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { CATEGORY_PAGES } from "@/data/catalog";
import { TelegramButton } from "@/components/telegram-cta";

const tab = "shrink-0 border-b-2 px-1 py-2 text-sm whitespace-nowrap transition ";
const tabOn = "border-[var(--color-accent-hi)] text-[var(--color-bone)] font-semibold";
const tabOff = "border-transparent text-[var(--color-mute)] hover:text-[var(--color-bone)]";

/** Tube-style header: logo, search, Telegram button, and a row of category tabs. */
export function SiteHeader() {
  const navigate = useNavigate();
  const { urlQ, pathname } = useRouterState({
    select: (s) => ({
      urlQ: typeof s.location.search.q === "string" ? s.location.search.q : "",
      pathname: s.location.pathname,
    }),
  });
  const [q, setQ] = useState(urlQ);

  // Keep the box in step with the URL (back button, category links, clearing).
  useEffect(() => setQ(urlQ), [urlQ]);

  const activeSlug = pathname.startsWith("/categoria/") ? pathname.split("/")[2] : undefined;
  const onHome = pathname === "/";

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[var(--color-ink)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={BRAND.logo} alt={BRAND.name} className="size-8 rounded-full" />
          <span className="hidden font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-wide uppercase sm:inline">
            {BRAND.name}
          </span>
        </Link>
        <form
          role="search"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/", search: { q: q.trim() || undefined } });
          }}
        >
          <Search className="size-4 shrink-0 text-[var(--color-mute)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar vídeos"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-mute)]"
            aria-label="Buscar vídeos"
          />
        </form>
        {/* Phones get the fixed bottom bar instead, so the search box keeps its width. */}
        <div className="hidden shrink-0 sm:block">
          <TelegramButton label="Entrar no Telegram" />
        </div>
      </div>
      <nav aria-label="Categorias" className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-3">
        <Link to="/" className={tab + (onHome ? tabOn : tabOff)}>
          Todos os vídeos
        </Link>
        <Link to="/guia" className={tab + (pathname.startsWith("/guia") ? tabOn : tabOff)}>
          Guias
        </Link>
        {CATEGORY_PAGES.map(({ tag }) => (
          <Link
            key={tag.slug}
            to="/categoria/$slug"
            params={{ slug: tag.slug }}
            className={tab + (activeSlug === tag.slug ? tabOn : tabOff)}
          >
            {tag.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}

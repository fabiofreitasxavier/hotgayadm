import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";
import { TelegramButton } from "@/components/telegram-cta";

export function SiteHeader() {
  const navigate = useNavigate();
  const urlQ = useRouterState({
    select: (s) => (typeof s.location.search.q === "string" ? s.location.search.q : ""),
  });
  const [q, setQ] = useState(urlQ);

  // Keep the box in step with the URL (back button, category links, clearing).
  useEffect(() => setQ(urlQ), [urlQ]);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[var(--color-ink)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={BRAND.logo} alt="" className="size-9 rounded-full shadow-[var(--glow)]" />
          <span className="hidden font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-wide uppercase md:inline">
            {BRAND.name}
          </span>
        </Link>
        <form
          className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/", search: { q: q.trim() || undefined, cat: undefined } });
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
        <Link
          to="/upload"
          aria-label="Enviar vídeo"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] p-2 text-sm text-[var(--color-mute)] hover:text-[var(--color-bone)] lg:px-3"
        >
          <Upload className="size-4" />
          <span className="hidden lg:inline">Enviar</span>
        </Link>
        {/* Phones get the fixed bottom bar instead, so the search box keeps its width. */}
        <div className="hidden shrink-0 sm:block">
          <TelegramButton label="Entrar no Telegram" />
        </div>
      </div>
    </header>
  );
}

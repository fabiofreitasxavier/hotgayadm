import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CATALOG, CATEGORIES } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { VideoCard } from "@/components/video-card";
import { PromoHero, TelegramCard } from "@/components/telegram-cta";

type Search = { q?: string; cat?: string };

export const Route = createFileRoute("/")({
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

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      {showHero ? (
        <div className="mb-10">
          <PromoHero />
        </div>
      ) : null}

      <h2 className="mb-3 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-wide uppercase">
        {q ? `Resultados para “${q}”` : "Prévias gratuitas"}
      </h2>

      <nav className="mb-6 flex gap-2 overflow-x-auto pb-1">
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
        <p className="text-[var(--color-mute)]">Nada encontrado para essa busca.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video, i) => (
            <VideoSlot key={video.id} index={i}>
              <VideoCard video={video} />
            </VideoSlot>
          ))}
        </div>
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

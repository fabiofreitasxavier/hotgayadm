import { createFileRoute, Link } from "@tanstack/react-router";
import { CATALOG, CATEGORIES } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { VideoCard } from "@/components/video-card";

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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 max-w-2xl">
        <p className="text-xs tracking-[0.2em] text-[var(--color-copper)] uppercase">Public library</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl leading-tight sm:text-5xl">
          Host films you own. Watch them anywhere.
        </h1>
        <p className="mt-3 text-[var(--color-mute)]">
          A general video library. Sample films stream from public test files. Uploads stay in this browser until you wire storage.
        </p>
      </section>

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
                  ? "border-[var(--color-copper)] bg-[var(--color-copper)] text-[#1a1008]"
                  : "border-[var(--color-line)] text-[var(--color-mute)]")
              }
            >
              {name}
            </Link>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-mute)]">Nothing matches that search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </main>
  );
}

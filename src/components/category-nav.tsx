import { Link } from "@tanstack/react-router";
import { CATEGORY_PAGES } from "@/data/catalog";

const chip = "shrink-0 rounded-full border px-3 py-1.5 text-sm ";
const on = "border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[var(--glow)]";
const off = "border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-accent)]";

/** Crawlable links to every category page; `active` is the current category slug (none = home). */
export function CategoryNav({ active }: { active?: string }) {
  return (
    <nav aria-label="Categorias" className="mb-6 flex gap-2 overflow-x-auto pb-1">
      <Link to="/" className={chip + (active ? off : on)}>
        Todos
      </Link>
      {CATEGORY_PAGES.map(({ tag, count }) => (
        <Link
          key={tag.slug}
          to="/categoria/$slug"
          params={{ slug: tag.slug }}
          className={chip + (active === tag.slug ? on : off)}
        >
          {tag.name} <span className="opacity-70">({count})</span>
        </Link>
      ))}
    </nav>
  );
}

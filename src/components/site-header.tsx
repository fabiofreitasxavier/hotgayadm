import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Upload } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-[var(--color-ink)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
          Lumen
        </Link>
        <form
          className="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/", search: { q: q.trim() || undefined, cat: undefined } });
          }}
        >
          <Search className="size-4 shrink-0 text-[var(--color-mute)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search films and clips"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-mute)]"
            aria-label="Search videos"
          />
        </form>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-copper)] px-3 py-2 text-sm font-medium text-[#1a1008]"
        >
          <Upload className="size-4" />
          <span className="hidden sm:inline">Upload</span>
        </Link>
      </div>
    </header>
  );
}

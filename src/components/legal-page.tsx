import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

export const LAST_UPDATED = "10 de outubro de 2026";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link to="/" className="text-sm text-[var(--color-mute)] hover:text-[var(--color-bone)]">
        ← Voltar para o início
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold uppercase">{title}</h1>
      <p className="mt-1 text-xs text-[var(--color-mute)]">Última atualização: {LAST_UPDATED}</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed [&_h2]:mt-8 [&_h2]:font-[family-name:var(--font-display)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:uppercase [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </main>
  );
}

/** The contact address, or a note that it is coming, so no page shows a blank link. */
export function ContactEmail() {
  if (!BRAND.contactEmail) {
    return <span className="text-[var(--color-mute)]">(endereço de contato em configuração)</span>;
  }
  return (
    <a href={`mailto:${BRAND.contactEmail}`} className="text-[var(--color-accent-hi)] underline">
      {BRAND.contactEmail}
    </a>
  );
}

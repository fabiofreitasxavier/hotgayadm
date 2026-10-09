import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

export function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <img src={BRAND.logo} alt="" className="size-20 rounded-full opacity-90 shadow-[var(--glow)]" />
      <p className="mt-6 text-xs tracking-[0.2em] text-[var(--color-accent-hi)] uppercase">Erro 404</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-extrabold uppercase">
        Página não encontrada
      </h1>
      <p className="mt-3 text-[var(--color-mute)]">
        O endereço pode estar errado ou o vídeo foi removido.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Voltar para o início
      </Link>
    </main>
  );
}

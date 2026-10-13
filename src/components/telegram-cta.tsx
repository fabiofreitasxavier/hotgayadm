import { Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BRAND } from "@/lib/brand";

const external = {
  href: BRAND.telegramUrl,
  target: "_blank",
  rel: "nofollow noopener noreferrer",
} as const;

/** Compact pill button that opens the Telegram bot. */
export function TelegramButton({
  label = "Entrar no Telegram",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <a
      {...external}
      className={
        "inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--glow)] transition hover:bg-[var(--color-accent-hi)] " +
        className
      }
    >
      <Send className="size-4" />
      {label}
    </a>
  );
}

/** Fixed bottom bar on phones so the CTA is always one tap away. */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-[var(--color-ink)]/95 p-3 backdrop-blur sm:hidden">
      <TelegramButton
        label={`Entrar agora · R$ ${BRAND.price}`}
        className="w-full py-3 text-base"
      />
    </div>
  );
}

/** Closing banner + footer. */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--color-line)] pb-24 sm:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center">
        <img
          src={BRAND.logo}
          alt={BRAND.name}
          className="size-20 rounded-full shadow-[var(--glow)]"
        />
        <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
          Pronto para ver tudo?
        </p>
        <p className="max-w-md text-sm text-[var(--color-mute)]">
          Entre na comunidade privada pelo nosso bot do Telegram e libere {BRAND.videoCount} vídeos
          exclusivos.
        </p>
        <TelegramButton label="Acessar o bot do Telegram" className="px-6 py-3 text-base" />
        <nav className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-[var(--color-mute)]">
          <Link to="/guia" className="hover:text-[var(--color-bone)]">
            Guias
          </Link>
          <Link to="/termos" className="hover:text-[var(--color-bone)]">
            Termos de Uso
          </Link>
          <Link to="/privacidade" className="hover:text-[var(--color-bone)]">
            Privacidade
          </Link>
          <Link to="/denuncia" className="hover:text-[var(--color-bone)]">
            Denúncia e Remoção
          </Link>
        </nav>
        <p className="text-xs text-[var(--color-mute)]">
          © {BRAND.name}. Conteúdo adulto, somente para maiores de 18 anos. Todas as pessoas
          retratadas tinham 18 anos ou mais no momento da gravação.
        </p>
      </div>
    </footer>
  );
}

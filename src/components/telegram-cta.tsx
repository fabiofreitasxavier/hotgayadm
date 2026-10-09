import { ArrowRight, BadgeCheck, Gift, Lock, RefreshCw, Send, ShieldCheck, UploadCloud, Users } from "lucide-react";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

const external = { href: BRAND.telegramUrl, target: "_blank", rel: "noopener noreferrer" } as const;

/** Compact pill button that opens the Telegram bot. */
export function TelegramButton({ label = "Entrar no Telegram", className = "" }: { label?: string; className?: string }) {
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

/** Big price + "Entrar agora" block, as on the promo art. */
export function JoinNow() {
  return (
    <a
      {...external}
      className="group grid gap-3 rounded-2xl border border-[var(--color-accent)]/60 bg-[var(--color-panel)] p-3 shadow-[var(--glow)] sm:grid-cols-[auto_1fr] sm:items-center"
    >
      <div className="flex items-center gap-3 px-2">
        <span className="font-[family-name:var(--font-display)] text-sm leading-none tracking-wide uppercase">
          Apenas
          <br />
          <span className="text-[var(--color-accent-hi)]">R$</span>
        </span>
        <span className="font-[family-name:var(--font-display)] text-5xl leading-none font-extrabold">
          {BRAND.price}
        </span>
      </div>
      <div className="flex items-center justify-center gap-3 rounded-xl border border-white/15 bg-black/40 px-4 py-3 transition group-hover:border-[var(--color-accent-hi)]">
        <span className="grid size-9 place-items-center rounded-full bg-white text-black">
          <ArrowRight className="size-5" />
        </span>
        <span className="text-left">
          <span className="block font-[family-name:var(--font-display)] text-3xl leading-none font-extrabold uppercase">
            Entrar agora
          </span>
          <span className="text-xs tracking-[0.2em] text-[var(--color-accent-hi)] uppercase">Acesso imediato</span>
        </span>
      </div>
    </a>
  );
}

const PERKS = ["Sem cadastro", "Sem taxas", "100% garantido", "Acesse pelo Telegram"];

/** Home hero modelled on the HOTGAYBR promo: headline, perks, price, CTA. */
export function PromoHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--color-line)] bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.35),transparent_60%),linear-gradient(180deg,#140b22,#0b0712)] p-5 sm:p-8">
      <div className="flex items-center gap-3">
        <img src={BRAND.logo} alt="" className="size-12 rounded-full shadow-[var(--glow)]" />
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl leading-none font-extrabold tracking-wide uppercase">
            {BRAND.name}
          </p>
          <p className="text-[11px] tracking-[0.3em] text-[var(--color-mute)] uppercase">Comunidade privada</p>
        </div>
      </div>

      <h1 className="mt-6 font-[family-name:var(--font-display)] leading-[0.9] font-extrabold uppercase">
        <span className="block text-3xl sm:text-4xl">Mais de</span>
        <span className="block bg-gradient-to-b from-white to-[var(--color-accent-hi)] bg-clip-text text-7xl text-transparent drop-shadow-[0_0_18px_rgba(192,132,252,0.55)] sm:text-8xl">
          {BRAND.videoCount}
        </span>
        <span className="block text-4xl sm:text-5xl">Vídeos exclusivos</span>
      </h1>
      <p className="mt-3 inline-block -skew-x-6 rounded bg-[var(--color-accent)] px-3 py-1 font-[family-name:var(--font-display)] text-lg font-bold tracking-wide uppercase">
        Atualizados todos os dias
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm text-[var(--color-mute)]">
        <RefreshCw className="size-4 text-[var(--color-accent-hi)]" />
        Conteúdo novo <span className="font-semibold text-[var(--color-accent-hi)] uppercase">diariamente</span>
      </p>

      <p className="mt-8 flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-bold tracking-wide uppercase">
        <Gift className="size-5 text-[var(--color-accent-hi)]" /> Bônus incluído
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Feature icon={<Users />} title="Comunidade" accent="privada" note="Converse, interaja e faça novas amizades." />
        <Feature icon={<ShieldCheck />} title="Ambiente" accent="discreto" note="100% seguro e confidencial. Seu sigilo é nossa prioridade." />
        <Feature icon={<UploadCloud />} title="Atualizações" accent="frequentes" note="Novos vídeos todos os dias, exclusivos e em alta qualidade." />
      </div>

      <div className="mt-6">
        <JoinNow />
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--color-mute)] uppercase">
        {PERKS.map((p) => (
          <li key={p} className="flex items-center gap-1.5">
            <BadgeCheck className="size-4 text-[var(--color-accent-hi)]" />
            {p}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Feature({ icon, title, accent, note }: { icon: ReactNode; title: string; accent: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-black/30 p-4 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full border border-[var(--color-accent)]/60 text-[var(--color-accent-hi)] shadow-[var(--glow)] [&>svg]:size-6">
        {icon}
      </span>
      <p className="mt-3 font-[family-name:var(--font-display)] text-xl leading-none font-extrabold uppercase">
        {title}
        <span className="block text-[var(--color-accent-hi)]">{accent}</span>
      </p>
      <p className="mt-2 text-xs text-[var(--color-mute)]">{note}</p>
    </div>
  );
}

/** Sidebar / inline card nudging viewers to the full library on Telegram. */
export function TelegramCard() {
  return (
    <div className="rounded-2xl border border-[var(--color-accent)]/50 bg-[linear-gradient(160deg,#1d1030,#0d0816)] p-4 shadow-[var(--glow)]">
      <p className="flex items-center gap-2 text-xs tracking-[0.2em] text-[var(--color-accent-hi)] uppercase">
        <Lock className="size-3.5" /> Conteúdo completo
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl leading-tight font-extrabold uppercase">
        Mais de {BRAND.videoCount} vídeos no Telegram
      </p>
      <p className="mt-1 text-sm text-[var(--color-mute)]">
        Novos vídeos todo dia. Apenas R$ {BRAND.price}, acesso imediato.
      </p>
      <TelegramButton label="Entrar agora" className="mt-4 w-full py-2.5" />
    </div>
  );
}

/** Fixed bottom bar on phones so the CTA is always one tap away. */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-[var(--color-ink)]/95 p-3 backdrop-blur sm:hidden">
      <TelegramButton label={`Entrar agora · R$ ${BRAND.price}`} className="w-full py-3 text-base" />
    </div>
  );
}

/** Closing banner + footer. */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--color-line)] pb-24 sm:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center">
        <img src={BRAND.logo} alt={BRAND.name} className="size-20 rounded-full shadow-[var(--glow)]" />
        <p className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">
          Pronto para ver tudo?
        </p>
        <p className="max-w-md text-sm text-[var(--color-mute)]">
          Entre na comunidade privada pelo nosso bot do Telegram e libere {BRAND.videoCount} vídeos exclusivos.
        </p>
        <TelegramButton label="Acessar o bot do Telegram" className="px-6 py-3 text-base" />
        <p className="mt-6 text-xs text-[var(--color-mute)]">
          © {BRAND.name}. Conteúdo adulto, somente para maiores de 18 anos. Todas as pessoas retratadas tinham 18 anos ou
          mais no momento da gravação.
        </p>
      </div>
    </footer>
  );
}

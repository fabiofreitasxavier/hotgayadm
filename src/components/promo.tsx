import { ArrowRight, Flame, Lock, Send } from "lucide-react";
import { BRAND } from "@/lib/brand";

// Every promotion opens the Telegram entry link. "nofollow": it is our own funnel, not a
// page we want search engines to rank.
const external = {
  href: BRAND.telegramUrl,
  target: "_blank",
  rel: "nofollow noopener noreferrer",
} as const;

/** Rotating copy, so repeated promos in a long grid don't all say the same thing. */
const PITCHES = [
  {
    kicker: "Telegram VIP",
    title: `+${BRAND.videoCount.replace("+", "")} vídeos completos`,
    sub: `Acesso imediato por R$ ${BRAND.price}`,
    cta: "Entrar agora",
  },
  {
    kicker: "Novos todo dia",
    title: "Veja as versões completas",
    sub: "Sem cadastro · 100% discreto",
    cta: "Quero ver tudo",
  },
  {
    kicker: "Comunidade privada",
    title: "Converse, interaja e veja tudo",
    sub: `Tudo por apenas R$ ${BRAND.price}`,
    cta: "Abrir o Telegram",
  },
] as const;

const pitch = (variant: number) => PITCHES[Math.abs(variant) % PITCHES.length];

/** Thin bar under the header on every page: the always-visible offer. */
export function PromoStrip() {
  return (
    <a
      {...external}
      className="group block border-b border-[var(--color-line)] bg-[linear-gradient(90deg,#3b0764,#7e22ce_50%,#3b0764)] text-white"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-3 py-1.5 text-center text-xs sm:text-sm">
        <Flame className="size-4 shrink-0 text-amber-300" />
        <span>
          <strong>{BRAND.videoCount} vídeos completos</strong> no Telegram · R$ {BRAND.price} ·
          acesso imediato
        </span>
        <span className="hidden shrink-0 items-center gap-1 rounded-full bg-white px-2.5 py-0.5 font-semibold text-[#3b0764] group-hover:bg-amber-300 sm:inline-flex">
          Entrar <ArrowRight className="size-3.5" />
        </span>
      </div>
    </a>
  );
}

/** A promo the same size as a video card, dropped into video grids. */
export function PromoTile({ variant = 0 }: { variant?: number }) {
  const p = pitch(variant);
  return (
    <a {...external} className="group block">
      <div className="relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-md border border-[var(--color-accent)]/60 bg-[radial-gradient(circle_at_30%_20%,rgba(192,132,252,0.45),transparent_60%),linear-gradient(160deg,#2e1065,#0d0816)] p-3 text-center shadow-[var(--glow)]">
        <span className="flex items-center gap-1 text-[10px] tracking-[0.2em] text-[var(--color-accent-hi)] uppercase">
          <Lock className="size-3" /> {p.kicker}
        </span>
        <span className="mt-1 font-[family-name:var(--font-display)] text-lg leading-tight font-extrabold uppercase sm:text-xl">
          {p.title}
        </span>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white group-hover:bg-[var(--color-accent-hi)]">
          <Send className="size-3" /> {p.cta}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-2 text-sm leading-snug font-medium text-[var(--color-accent-hi)]">
        {p.sub}
      </p>
      <p className="text-xs text-[var(--color-mute)]">Promoção · {BRAND.name}</p>
    </a>
  );
}

/** Under the player: the main conversion point, so it is bigger and more specific than other promos. */
export function FullVideoCta({ preview }: { preview: boolean }) {
  return (
    <a
      {...external}
      className="group mt-3 flex flex-col items-center gap-3 rounded-lg bg-[linear-gradient(90deg,#6b21a8,#9333ea)] px-4 py-3 text-center text-white shadow-[var(--glow)] sm:flex-row sm:justify-between sm:text-left"
    >
      <div>
        <p className="font-[family-name:var(--font-display)] text-xl leading-tight font-extrabold uppercase sm:text-2xl">
          {preview ? "Gostou da prévia? Veja o vídeo completo" : "Quer mais vídeos como este?"}
        </p>
        <p className="text-sm text-white/85">
          Mais de {BRAND.videoCount} vídeos completos na comunidade privada do Telegram · R${" "}
          {BRAND.price} · acesso imediato
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#3b0764] uppercase group-hover:bg-amber-300">
        <Send className="size-4" /> Entrar agora
      </span>
    </a>
  );
}

/** Full-width banner between rows of a grid, and under the player. */
export function PromoBanner({
  variant = 0,
  className = "",
}: {
  variant?: number;
  className?: string;
}) {
  const p = pitch(variant);
  return (
    <a
      {...external}
      className={
        "group flex flex-col items-center gap-3 rounded-lg border border-[var(--color-accent)]/60 bg-[radial-gradient(ellipse_at_right,rgba(168,85,247,0.35),transparent_60%),linear-gradient(90deg,#1d1030,#0d0816)] px-4 py-3 text-center shadow-[var(--glow)] sm:flex-row sm:justify-between sm:text-left " +
        className
      }
    >
      <div className="flex items-center gap-3">
        <img src={BRAND.logo} alt="" className="hidden size-11 shrink-0 rounded-full sm:block" />
        <div>
          <p className="text-[11px] tracking-[0.2em] text-[var(--color-accent-hi)] uppercase">
            {p.kicker}
          </p>
          <p className="font-[family-name:var(--font-display)] text-xl leading-tight font-extrabold uppercase sm:text-2xl">
            {p.title}
          </p>
          <p className="text-sm text-[var(--color-mute)]">{p.sub}</p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-bold text-white uppercase group-hover:bg-[var(--color-accent-hi)]">
        <Send className="size-4" /> {p.cta}
      </span>
    </a>
  );
}

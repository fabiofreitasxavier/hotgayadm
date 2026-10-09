import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

const KEY = "lumen-age-confirmed";

function readConfirmed(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// Rendered on the server and on first client paint so content is never shown
// before the check runs; the effect then lifts it for returning visitors.
export function AgeGate() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (readConfirmed()) setOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/95 px-4 backdrop-blur-xl"
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--color-accent)]/50 bg-[var(--color-panel)] p-6 text-center shadow-[var(--glow)]">
        <img src={BRAND.logo} alt={BRAND.name} className="mx-auto size-24 rounded-full shadow-[var(--glow)]" />
        <p className="mt-4 text-xs tracking-[0.2em] text-[var(--color-accent-hi)] uppercase">Somente adultos</p>
        <h2
          id="age-gate-title"
          className="mt-1 font-[family-name:var(--font-display)] text-4xl font-extrabold uppercase"
        >
          Você tem 18 anos ou mais?
        </h2>
        <p className="mt-3 text-sm text-[var(--color-mute)]">
          Este site contém material sexualmente explícito. Entre apenas se você tiver pelo menos 18 anos (ou a
          maioridade legal onde mora) e se ver conteúdo adulto for permitido para você.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            autoFocus
            onClick={() => {
              try {
                localStorage.setItem(KEY, "1");
              } catch {
                // Private mode: let them in for this visit only.
              }
              setOpen(false);
            }}
            className="flex-1 rounded-full bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[var(--glow)]"
          >
            Tenho 18+ — entrar
          </button>
          <a
            href="https://www.google.com"
            className="flex-1 rounded-full border border-[var(--color-line)] px-4 py-2.5 text-sm text-[var(--color-mute)]"
          >
            Sair
          </a>
        </div>
      </div>
    </div>
  );
}

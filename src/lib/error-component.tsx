import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

const FALLBACK_MESSAGE = "Ocorreu um erro inesperado. Tente recarregar a página.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--color-ink)] px-6 text-center text-[var(--color-bone)]">
      <span className="text-[var(--color-accent-hi)]" aria-hidden="true">
        <TriangleAlert className="size-10" strokeWidth={2} />
      </span>
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold uppercase">Algo deu errado</h1>
      <p className="max-w-md text-sm break-words text-[var(--color-mute)]">{errorMessage(error)}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white"
      >
        Recarregar
      </button>
    </main>
  );
}

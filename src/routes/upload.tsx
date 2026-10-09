import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";
import { posterKey, probeVideo, saveMedia, videoKey } from "@/lib/video-store";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

function UploadPage() {
  const add = useUploads((s) => s.add);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Shorts");
  const [file, setFile] = useState<File | null>(null);
  const [attested, setAttested] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-extrabold uppercase">Enviar vídeo</h1>
      <p className="mt-2 text-sm text-[var(--color-mute)]">
        Por enquanto os arquivos ficam salvos apenas neste navegador.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!title.trim() || !file) {
            setError("Adicione um título e um arquivo de vídeo.");
            return;
          }
          if (!attested) {
            setError("Confirme a declaração de idade e consentimento antes de publicar.");
            return;
          }
          setBusy(true);
          setError("");
          const id = `local-${Date.now()}`;
          try {
            const { playable, duration, poster } = await probeVideo(file);
            if (!playable) {
              setError("Este navegador não consegue reproduzir esse arquivo. Tente um vídeo MP4 (H.264) ou WebM.");
              setBusy(false);
              return;
            }
            await saveMedia(videoKey(id), file);
            if (poster) await saveMedia(posterKey(id), poster);
            add({
              id,
              title: title.trim(),
              description: `Enviado localmente como ${file.name}.`,
              category,
              duration,
              views: "Só você",
              creator: "Você",
              src: "",
              poster: "",
              local: true,
            });
            navigate({ to: "/watch/$id", params: { id } });
          } catch {
            setError("Não foi possível salvar o arquivo no navegador. Ele pode ser grande demais.");
            setBusy(false);
          }
        }}
      >
        <label className="block text-sm">
          Título
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2 outline-none"
          />
        </label>
        <label className="block text-sm">
          Categoria
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2 outline-none"
          >
            {CATEGORIES.filter((c) => c !== "All").map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Arquivo de vídeo
          <input
            type="file"
            accept="video/*"
            className="mt-1 block w-full text-sm"
            onChange={(e) => {
              const picked = e.target.files?.[0];
              if (!picked) return;
              setFile(picked);
              if (!title) setTitle(picked.name.replace(/\.[^.]+$/, ""));
            }}
          />
        </label>
        <label className="flex items-start gap-2 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] p-3 text-sm">
          <input
            type="checkbox"
            checked={attested}
            onChange={(e) => setAttested(e.target.checked)}
            className="mt-0.5 accent-[var(--color-accent)]"
          />
          <span>
            Sou dono deste vídeo, e todas as pessoas que aparecem nele tinham 18 anos ou mais na gravação e consentiram em
            ser filmadas e com a publicação.
          </span>
        </label>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "Salvando…" : "Publicar"}
        </button>
      </form>
    </main>
  );
}

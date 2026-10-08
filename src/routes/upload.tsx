import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES } from "@/data/catalog";
import { useUploads } from "@/lib/uploads";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

function UploadPage() {
  const add = useUploads((s) => s.add);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Shorts");
  const [fileName, setFileName] = useState("");
  const [src, setSrc] = useState("");
  const [error, setError] = useState("");

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Add a video</h1>
      <p className="mt-2 text-sm text-[var(--color-mute)]">
        Files stay on this device for the demo. A production host would send the file to object storage, transcode it, then save the playback URL.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim() || !src) {
            setError("Add a title and a video file.");
            return;
          }
          const id = `local-${Date.now()}`;
          add({
            id,
            title: title.trim(),
            description: `Uploaded locally as ${fileName || "a file"}.`,
            category,
            duration: "Local",
            views: "Just you",
            creator: "You",
            src,
            poster: "",
            local: true,
          });
          navigate({ to: "/watch/$id", params: { id } });
        }}
      >
        <label className="block text-sm">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2 outline-none"
          />
        </label>
        <label className="block text-sm">
          Category
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
          Video file
          <input
            type="file"
            accept="video/*"
            className="mt-1 block w-full text-sm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFileName(file.name);
              setSrc(URL.createObjectURL(file));
              if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
            }}
          />
        </label>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button
          type="submit"
          className="rounded-full bg-[var(--color-copper)] px-4 py-2 text-sm font-medium text-[#1a1008]"
        >
          Publish locally
        </button>
      </form>
    </main>
  );
}

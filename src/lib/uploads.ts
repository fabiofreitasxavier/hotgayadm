import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Video } from "@/data/catalog";
import { deleteMedia, posterKey, videoKey } from "@/lib/video-store";

type UploadState = {
  mine: Video[];
  add: (video: Video) => void;
  remove: (id: string) => void;
};

export const useUploads = create<UploadState>()(
  persist(
    (set) => ({
      mine: [],
      add: (video) => set((s) => ({ mine: [video, ...s.mine.filter((v) => v.id !== video.id)] })),
      remove: (id) => {
        void deleteMedia(videoKey(id)).catch(() => {});
        void deleteMedia(posterKey(id)).catch(() => {});
        set((s) => ({ mine: s.mine.filter((v) => v.id !== id) }));
      },
    }),
    {
      name: "lumen-uploads",
      version: 1,
      // v0 stored blob: URLs that were dead after any reload; drop them.
      migrate: (state) => {
        const s = state as { mine?: Video[] };
        return { mine: (s.mine ?? []).filter((v) => !v.src.startsWith("blob:")) } as UploadState;
      },
    },
  ),
);

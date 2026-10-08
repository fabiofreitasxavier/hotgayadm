import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Video } from "@/data/catalog";

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
      remove: (id) => set((s) => ({ mine: s.mine.filter((v) => v.id !== id) })),
    }),
    { name: "lumen-uploads" },
  ),
);

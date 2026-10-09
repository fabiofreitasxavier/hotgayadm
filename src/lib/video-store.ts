import { useEffect, useState } from "react";

// Uploaded files live in IndexedDB. Object URLs from URL.createObjectURL die
// with the page, so persisting them in localStorage left dead links after a
// reload; we persist the Blob itself and mint a fresh URL on each view.

const DB_NAME = "lumen-media";
const STORE = "files";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = fn(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export const saveMedia = (key: string, blob: Blob) => run("readwrite", (s) => s.put(blob, key));
export const loadMedia = (key: string) => run<Blob | undefined>("readonly", (s) => s.get(key));
export const deleteMedia = (key: string) => run("readwrite", (s) => s.delete(key));

export const videoKey = (id: string) => `${id}:video`;
export const posterKey = (id: string) => `${id}:poster`;

/** Object URL for a stored blob; revoked on unmount. undefined while loading, null if missing. */
export function useStoredMedia(key: string | null): string | null | undefined {
  const [url, setUrl] = useState<string | null | undefined>(key ? undefined : null);

  useEffect(() => {
    if (!key) {
      setUrl(null);
      return;
    }
    let objectUrl: string | null = null;
    let cancelled = false;
    setUrl(undefined);
    loadMedia(key)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = blob ? URL.createObjectURL(blob) : null;
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setUrl(null));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [key]);

  return url;
}

type Probe = { playable: boolean; duration: string; poster: Blob | null };

/** Checks the browser can decode a local video, reads its duration and grabs a poster frame. */
export function probeVideo(file: File): Promise<Probe> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "metadata";
    video.src = url;

    let done = false;
    const finish = (playable: boolean, poster: Blob | null) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      resolve({ playable, duration: formatDuration(video.duration), poster });
    };
    // Some codecs load metadata but never seek; don't hang the form on them.
    setTimeout(() => finish(video.readyState > 0, null), 8000);

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, (video.duration || 0) / 4);
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx || !canvas.width) return finish(true, null);
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => finish(true, blob), "image/jpeg", 0.8);
    };
    video.onerror = () => finish(false, null);
  });
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "Local";
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

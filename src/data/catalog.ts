export type Video = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  views: string;
  creator: string;
  src: string;
  poster: string;
  local?: boolean;
};

export const CATEGORIES = ["All", "Prévias"] as const;

// Video files are NOT stored in this repo or deployed with the site. They live on a
// video host (e.g. Bunny.net Stream / an adult-friendly CDN); set VITE_MEDIA_BASE_URL to
// that host's folder URL at build time. Locally, /videos is served from public/videos,
// which is git-ignored.
const MEDIA_BASE = (import.meta.env.VITE_MEDIA_BASE_URL as string | undefined)?.replace(/\/$/, "") || "/videos";

// File names as exported; titles are generic until real ones are written.
const FILES = [
  "welcome",
  "202609111916",
  "AnQ3uTOgUZdWwqe5",
  "bOZayc0HVy4CNxAx",
  "ccUTmRhQdQZcTZ7a",
  "Cyen6qcXyjnYVjic",
  "e19bXs-mYzBhBP88",
  "FIqud_AsvBwDDojM",
  "HkcyRxewtxp5blY6",
  "iJ57F1lKSBSn4Hkx",
  "j5l0ACIP1LMKIb0e",
  "JD6E-q3PMmRSRldY",
  "jWjUzKcXG-UL5buZ",
  "k4U1ZUUbx9S2pTlX",
  "KyHchn2MSIa0KDcI",
  "Ma8jUHgk9LbwFMv8",
  "PwsGMpqAstVtkeUy",
  "qB-2bJNg8LebSHTA",
  "qEe5w9E9E3EA9w_v",
  "qWXAG1avQkR6TyMk",
  "rlXYWFleThnIN5Iw",
  "rSlViJ7MRjEexUt9",
  "sLPYX5QyzetN8g01",
  "sMznv0Q99wr_5u2Q",
  "Uxu7r7pw-KBVYKFp",
  "WDZU8Ix5qGOFSRxe",
  "wXsLVQb56IHYLyPu",
  "x9JxRqC4MLg-ARaK",
  "XkOWv8ZkJoNYS1bI",
  "XZQ_1fwxpi3vEexg",
];

export const CATALOG: Video[] = FILES.map((file, i) => ({
  id: file.toLowerCase(),
  title: file === "welcome" ? "Boas-vindas ao HotGay" : `Prévia exclusiva #${i}`,
  description: "Prévia gratuita. O vídeo completo e mais de 800 outros estão na nossa comunidade no Telegram.",
  category: "Prévias",
  // Duration and thumbnail are read from the file itself in the browser.
  duration: "",
  views: "",
  creator: "HotGay",
  src: `${MEDIA_BASE}/${file}.mp4`,
  poster: "",
}));

export function findVideo(id: string, extras: Video[] = []): Video | undefined {
  return [...extras, ...CATALOG].find((v) => v.id === id);
}

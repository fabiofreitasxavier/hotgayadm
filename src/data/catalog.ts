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

export const CATEGORIES = [
  "All",
  "Nature",
  "Animation",
  "Shorts",
  "Talks",
  "Travel",
] as const;

const SAMPLE =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";

export const CATALOG: Video[] = [
  {
    id: "bunny",
    title: "Big Buck Bunny",
    description:
      "A short open film about a giant rabbit and a day in the woods. Classic test footage for a video host.",
    category: "Animation",
    duration: "9:56",
    views: "2.1M",
    creator: "Blender Foundation",
    src: `${SAMPLE}/BigBuckBunny.mp4`,
    poster: `${SAMPLE}/images/BigBuckBunny.jpg`,
  },
  {
    id: "elephants",
    title: "Elephant Dream",
    description: "The first open movie from the Blender project. Surreal machines and two dreamers.",
    category: "Animation",
    duration: "10:53",
    views: "890K",
    creator: "Orange Project",
    src: `${SAMPLE}/ElephantsDream.mp4`,
    poster: `${SAMPLE}/images/ElephantsDream.jpg`,
  },
  {
    id: "sintel",
    title: "Sintel",
    description: "A lone warrior searches for her dragon. High-contrast fantasy short.",
    category: "Animation",
    duration: "14:48",
    views: "4.4M",
    creator: "Durian Project",
    src: `${SAMPLE}/Sintel.mp4`,
    poster: `${SAMPLE}/images/Sintel.jpg`,
  },
  {
    id: "tears",
    title: "Tears of Steel",
    description: "Live action mixed with CG. A last stand in a ruined city.",
    category: "Shorts",
    duration: "12:14",
    views: "1.6M",
    creator: "Mango Project",
    src: `${SAMPLE}/TearsOfSteel.mp4`,
    poster: `${SAMPLE}/images/TearsOfSteel.jpg`,
  },
  {
    id: "blazes",
    title: "For Bigger Blazes",
    description: "A compact clip used to check bitrate and motion. Good for player QA.",
    category: "Shorts",
    duration: "0:15",
    views: "320K",
    creator: "Sample Lab",
    src: `${SAMPLE}/ForBiggerBlazes.mp4`,
    poster: `${SAMPLE}/images/ForBiggerBlazes.jpg`,
  },
  {
    id: "escape",
    title: "For Bigger Escape",
    description: "Outdoor motion sample. Use it to test seeking and poster frames.",
    category: "Nature",
    duration: "0:15",
    views: "210K",
    creator: "Sample Lab",
    src: `${SAMPLE}/ForBiggerEscapes.mp4`,
    poster: `${SAMPLE}/images/ForBiggerEscapes.jpg`,
  },
  {
    id: "joy",
    title: "For Bigger Joyrides",
    description: "A short ride through city light. Handy when checking mobile playback.",
    category: "Travel",
    duration: "0:15",
    views: "540K",
    creator: "Sample Lab",
    src: `${SAMPLE}/ForBiggerJoyrides.mp4`,
    poster: `${SAMPLE}/images/ForBiggerJoyrides.jpg`,
  },
  {
    id: "meltdown",
    title: "For Bigger Meltdowns",
    description: "High-contrast action sample for buffering and quality switches.",
    category: "Shorts",
    duration: "0:15",
    views: "180K",
    creator: "Sample Lab",
    src: `${SAMPLE}/ForBiggerMeltdowns.mp4`,
    poster: `${SAMPLE}/images/ForBiggerMeltdowns.jpg`,
  },
  {
    id: "subaru",
    title: "Subaru Outback",
    description: "A clean product-style travel shot. Good reference for title cards.",
    category: "Travel",
    duration: "0:15",
    views: "96K",
    creator: "Sample Lab",
    src: `${SAMPLE}/SubaruOutbackOnStreetAndDirt.mp4`,
    poster: `${SAMPLE}/images/SubaruOutbackOnStreetAndDirt.jpg`,
  },
  {
    id: "what",
    title: "What Car Can You Get",
    description: "Talking-head style sample. Useful for caption and audio checks.",
    category: "Talks",
    duration: "0:15",
    views: "74K",
    creator: "Sample Lab",
    src: `${SAMPLE}/WhatCarCanYouGetForAGrand.mp4`,
    poster: `${SAMPLE}/images/WhatCarCanYouGetForAGrand.jpg`,
  },
];

export function findVideo(id: string, extras: Video[] = []): Video | undefined {
  return [...extras, ...CATALOG].find((v) => v.id === id);
}

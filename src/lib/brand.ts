// Single place for brand copy and the Telegram entry link, so every CTA stays in sync.
import site from "@/data/site.json";

export const BRAND = {
  name: "HotGay",
  logo: "/logo.jpg",
  /** Public origin for canonical URLs, structured data and the sitemap. Edit src/data/site.json when the custom domain is live. */
  siteUrl: site.siteUrl,
  telegramUrl: "https://beacons.ai/admhotgay",
  price: "9,99",
  videoCount: "800+",
  /** Public address for legal requests, reports and takedowns. Set before launch. */
  contactEmail: "",
} as const;

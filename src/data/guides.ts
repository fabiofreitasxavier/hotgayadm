import guideList from "./guides.json";

export type GuideSection = { heading: string; paragraphs: string[] };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  /** YYYY-MM-DD. Sitemap lastmod uses this, not the build date. */
  updated: string;
  intro: string;
  sections: GuideSection[];
  /** Category slugs that should link back to this guide. */
  categories: string[];
};

export const GUIDES: Guide[] = guideList;

const BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));

export function findGuide(slug: string): Guide | undefined {
  return BY_SLUG.get(slug);
}

/** Guides that name this category, in file order. */
export function guidesForCategory(slug: string): Guide[] {
  return GUIDES.filter((g) => g.categories.includes(slug));
}

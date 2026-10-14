export type CategorySlug = "jumping" | "dressage";

export type Category = {
  slug: CategorySlug;
  title: string;
  tagline: string;
};

export const categories: Category[] = [
  {
    slug: "jumping",
    title: "Sprang",
    tagline: "Hopp over hinder med kjepphesten din!",
  },
  {
    slug: "dressage",
    title: "Dressur",
    tagline: "Vis frem de fineste og flotteste bevegelsene!",
  },
];

export function getCategory(slug: CategorySlug): Category {
  return categories.find((c) => c.slug === slug)!;
}

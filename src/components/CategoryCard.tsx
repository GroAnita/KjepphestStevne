import Link from "next/link";
import type { Category } from "@/lib/categories";
import { JumpArt, RosetteArt } from "./CategoryArt";

const looks = {
  jumping: {
    Art: JumpArt,
    card: "bg-mint-soft",
    stitch: "border-mint",
    button: "bg-mint shadow-[0_4px_0_#4fb89c]",
  },
  dressage: {
    Art: RosetteArt,
    card: "bg-lilac-soft",
    stitch: "border-lilac",
    button: "bg-lilac shadow-[0_4px_0_#8d6fe6]",
  },
} as const;

export function CategoryCard({ category }: { category: Category }) {
  const { Art, card, stitch, button } = looks[category.slug];
  return (
    <Link
      href={`/${category.slug}`}
      className={`group block rounded-[2rem] p-2 shadow-[0_12px_32px_-16px_rgba(75,44,85,0.35)] transition hover:-translate-y-1 hover:rotate-[-0.5deg] ${card}`}
    >
      <div
        className={`flex h-full flex-col items-center gap-3 rounded-[1.6rem] border-2 border-dashed px-5 py-6 text-center ${stitch}`}
      >
        <Art className="h-28 w-auto transition group-hover:scale-105 sm:h-32" />
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          {category.title}
        </h2>
        <p className="text-plum-soft">{category.tagline}</p>
        <span
          className={`mt-1 rounded-full px-6 py-2.5 font-display text-lg font-semibold text-white ${button}`}
        >
          Se klassene
        </span>
      </div>
    </Link>
  );
}

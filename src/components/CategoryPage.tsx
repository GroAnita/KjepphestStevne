import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getCategory, type CategorySlug } from "@/lib/categories";
import { AppShell } from "./AppShell";
import { JumpArt, RosetteArt } from "./CategoryArt";

export async function CategoryPage({ slug }: { slug: CategorySlug }) {
  const user = await requireUser();
  const category = getCategory(slug);
  const Art = slug === "jumping" ? JumpArt : RosetteArt;

  return (
    <AppShell user={user}>
      <Link href="/" className="font-bold text-berry underline">
        ← Tilbake
      </Link>
      <section className="mt-6 flex flex-col items-center gap-4 rounded-[2rem] bg-white px-5 py-10 text-center shadow-[0_12px_40px_-12px_rgba(224,69,127,0.35)]">
        <Art className="h-32 w-auto" />
        <h1 className="font-display text-4xl font-semibold text-berry sm:text-5xl">
          {category.title}
        </h1>
        <p className="max-w-md text-lg text-plum-soft">
          Her kommer klassene og påmeldingen til {category.title.toLowerCase()}{" "}
          snart!
        </p>
      </section>
    </AppShell>
  );
}

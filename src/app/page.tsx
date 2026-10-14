import Link from "next/link";
import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { CategoryCard } from "@/components/CategoryCard";
import { FloatingDoodles, Meadow } from "@/components/Doodles";
import { HobbyHorse } from "@/components/HobbyHorse";
import { HorseLoader } from "@/components/HorseLoader";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";
import { categories } from "@/lib/categories";

export default function Home() {
  return (
    <Suspense fallback={<HorseLoader />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const user = await getCurrentUser();
  return user ? <Dashboard user={user} /> : <Welcome />;
}

function Dashboard({ user }: { user: CurrentUser }) {
  const firstName = user.name.split(" ")[0];
  return (
    <AppShell user={user}>
      <div className="text-center sm:text-left">
        <h1 className="font-display text-4xl font-semibold text-berry sm:text-5xl">
          Hei, {firstName}!
        </h1>
        <p className="mt-2 text-lg text-plum-soft">
          {user.role === "admin"
            ? "Du er administrator. Velg en kategori for å styre klassene."
            : "Velg en kategori for å se klassene og melde deg på."}
        </p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </AppShell>
  );
}

const buttonBase =
  "rounded-full px-7 py-3 font-display text-xl font-semibold transition active:translate-y-1";

function Welcome() {
  return (
    <div className="relative isolate flex min-h-dvh flex-1 flex-col">
      <FloatingDoodles />
      <Meadow />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 pb-28 pt-10 text-center sm:pb-40">
        <HobbyHorse className="w-40 motion-safe:animate-gallop sm:w-52" />
        <h1 className="font-display text-5xl font-semibold text-berry sm:text-6xl">
          Kjepphest-stevne
        </h1>
        <p className="max-w-md text-lg text-plum-soft sm:text-xl">
          Sal opp kjepphesten og bli med på årets morsomste stevne!
        </p>
        <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className={`${buttonBase} bg-bubblegum text-white shadow-[0_5px_0_var(--color-berry)] active:shadow-[0_1px_0_var(--color-berry)]`}
          >
            Bli med!
          </Link>
          <Link
            href="/login"
            className={`${buttonBase} bg-white text-berry shadow-[0_5px_0_var(--color-blush)] active:shadow-[0_1px_0_var(--color-blush)]`}
          >
            Logg inn
          </Link>
        </div>
      </main>
    </div>
  );
}

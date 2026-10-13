import Link from "next/link";
import { Suspense } from "react";
import { FloatingDoodles, Meadow } from "@/components/Doodles";
import { HobbyHorse } from "@/components/HobbyHorse";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./(auth)/actions";

export default function Home() {
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
        <Suspense fallback={<div className="h-14" />}>
          <UserArea />
        </Suspense>
      </main>
    </div>
  );
}

const buttonBase =
  "rounded-full px-7 py-3 font-display text-xl font-semibold transition active:translate-y-1";

async function UserArea() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (!claims) {
    return (
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
    );
  }

  const name = claims.user_metadata?.full_name as string | undefined;
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-display text-2xl">Hei, {name ?? "rytter"}!</p>
      <form action={signOut}>
        <button
          type="submit"
          className={`${buttonBase} bg-white text-berry shadow-[0_5px_0_var(--color-blush)] active:shadow-[0_1px_0_var(--color-blush)]`}
        >
          Logg ut
        </button>
      </form>
    </div>
  );
}

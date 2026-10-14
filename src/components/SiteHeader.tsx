import type { CurrentUser } from "@/lib/auth";
import { signOut } from "@/app/(auth)/actions";
import { Logo } from "./Logo";

const flagColors = [
  "var(--color-bubblegum)",
  "var(--color-sunny)",
  "var(--color-mint)",
  "var(--color-lilac)",
];

// A garland of little pennant flags, like at a real horse show.
function Bunting() {
  return (
    <div aria-hidden="true" className="relative h-7 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-plum/30" />
      <div className="flex justify-between gap-1 px-1">
        {Array.from({ length: 40 }, (_, i) => (
          <svg
            key={i}
            viewBox="0 0 20 24"
            className={`h-6 w-5 shrink-0 ${i % 2 ? "rotate-3" : "-rotate-3"}`}
          >
            <path d="M0 0 H20 L10 22 Z" fill={flagColors[i % flagColors.length]} />
          </svg>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader({ user }: { user: CurrentUser }) {
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <header className="bg-white/85 shadow-[0_6px_24px_-14px_rgba(224,69,127,0.45)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          {user.role === "admin" && (
            <span className="rounded-full bg-sunny px-2.5 py-1 font-display text-sm font-semibold">
              Admin
            </span>
          )}
          <span className="hidden font-semibold md:inline">{user.name}</span>
          <span
            aria-hidden="true"
            className="hidden size-10 place-items-center rounded-full bg-lilac font-display text-lg font-semibold text-white sm:grid"
          >
            {initial}
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-berry ring-2 ring-blush transition hover:bg-blush"
            >
              Logg ut
            </button>
          </form>
        </div>
      </div>
      <Bunting />
    </header>
  );
}

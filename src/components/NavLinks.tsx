"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLink = { href: string; label: string };

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Hovedmeny" className="flex justify-center gap-1 sm:gap-2">
      {links.map(({ href, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 font-display text-base font-semibold transition sm:text-lg ${
              active
                ? "bg-bubblegum text-white"
                : "text-plum hover:bg-blush"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

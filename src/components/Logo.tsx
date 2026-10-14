import Link from "next/link";
import { Horseshoe } from "./Doodles";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 font-display text-xl font-semibold sm:text-2xl text-berry"
    >
      <Horseshoe className="size-6 shrink-0 rotate-180 sm:size-7 text-bubblegum" />
      Kjepphest-stevne
    </Link>
  );
}

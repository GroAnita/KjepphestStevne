import Link from "next/link";
import { Horseshoe } from "./Doodles";

export function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 font-display text-2xl font-semibold text-berry"
    >
      <Horseshoe className="size-7 rotate-180 text-bubblegum" />
      Kjepphest-stevne
    </Link>
  );
}

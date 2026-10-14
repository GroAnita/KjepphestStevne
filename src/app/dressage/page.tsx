import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryPage } from "@/components/CategoryPage";
import { HorseLoader } from "@/components/HorseLoader";

export const metadata: Metadata = {
  title: "Dressur – Kjepphest-stevne",
};

export default function Page() {
  return (
    <Suspense fallback={<HorseLoader />}>
      <CategoryPage slug="dressage" />
    </Suspense>
  );
}

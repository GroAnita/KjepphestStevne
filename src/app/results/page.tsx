import type { Metadata } from "next";
import { Suspense } from "react";
import { HorseLoader } from "@/components/HorseLoader";
import { ResultsPage } from "./ResultsPage";

export const metadata: Metadata = {
  title: "Resultater – Kjepphest-stevne",
};

export default function Page() {
  return (
    <Suspense fallback={<HorseLoader />}>
      <ResultsPage />
    </Suspense>
  );
}

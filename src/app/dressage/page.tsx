import type { Metadata } from "next";
import { Suspense } from "react";
import { HorseLoader } from "@/components/HorseLoader";
import { DressagePage } from "./_components/DressagePage";

export const metadata: Metadata = {
  title: "Dressur – Kjepphest-stevne",
};

export default function Page() {
  return (
    <Suspense fallback={<HorseLoader />}>
      <DressagePage />
    </Suspense>
  );
}

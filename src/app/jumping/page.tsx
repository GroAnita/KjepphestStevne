import type { Metadata } from "next";
import { Suspense } from "react";
import { HorseLoader } from "@/components/HorseLoader";
import { JumpingPage } from "./_components/JumpingPage";

export const metadata: Metadata = {
  title: "Sprang – Kjepphest-stevne",
};

export default function Page() {
  return (
    <Suspense fallback={<HorseLoader />}>
      <JumpingPage />
    </Suspense>
  );
}

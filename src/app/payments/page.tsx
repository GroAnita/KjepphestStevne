import type { Metadata } from "next";
import { Suspense } from "react";
import { HorseLoader } from "@/components/HorseLoader";
import { PaymentsPage } from "./PaymentsPage";

export const metadata: Metadata = {
  title: "Betalinger – Kjepphest-stevne",
};

export default function Page() {
  return (
    <Suspense fallback={<HorseLoader />}>
      <PaymentsPage />
    </Suspense>
  );
}

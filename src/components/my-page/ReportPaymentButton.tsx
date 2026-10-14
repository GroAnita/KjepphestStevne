"use client";

import { useTransition } from "react";
import { reportPayment } from "@/app/entry-actions";

export function ReportPaymentButton({
  entryIds,
  total,
}: {
  entryIds: string[];
  total: number;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => reportPayment(entryIds))}
      className="w-full rounded-full bg-bubblegum px-6 py-3.5 font-display text-xl font-semibold text-white shadow-[0_5px_0_var(--color-berry)] transition active:translate-y-1 active:shadow-[0_1px_0_var(--color-berry)] disabled:opacity-70 sm:w-auto"
    >
      {pending ? "Sender …" : `Jeg har vippset ${total} kr`}
    </button>
  );
}

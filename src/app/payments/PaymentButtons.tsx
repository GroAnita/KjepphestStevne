"use client";

import { useActionState, useTransition } from "react";
import type { FormState } from "@/app/entry-actions";
import type { Settings } from "@/lib/settings";
import { confirmPayments, saveSettings, undoPayments } from "./actions";

export function ConfirmButton({
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
      onClick={() => startTransition(() => confirmPayments(entryIds))}
      className="rounded-full bg-mint px-5 py-2.5 font-display text-lg font-semibold text-white shadow-[0_4px_0_#4fb89c] transition active:translate-y-1 active:shadow-[0_1px_0_#4fb89c] disabled:opacity-70"
    >
      {pending ? "Lagrer …" : `Bekreft betalt ${total} kr`}
    </button>
  );
}

export function UndoButton({ entryIds }: { entryIds: string[] }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Vil du markere disse påmeldingene som ikke betalt?")) {
          startTransition(() => undoPayments(entryIds));
        }
      }}
      className="rounded-full px-3 py-1.5 text-sm font-bold text-berry ring-2 ring-blush transition hover:bg-blush"
    >
      Angre betaling
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border-2 border-lilac-soft bg-white px-3 py-2.5 outline-none focus:border-bubblegum focus:ring-4 focus:ring-blush";

export function SettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveSettings,
    {},
  );
  return (
    <form
      action={formAction}
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      <label className="flex flex-col gap-1">
        <span className="font-bold">Pris per klasse (kr)</span>
        <input
          name="entry_fee_nok"
          type="number"
          min={0}
          step={1}
          required
          defaultValue={settings.entry_fee_nok}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-bold">Vipps-nummer</span>
        <input
          name="vipps_number"
          inputMode="numeric"
          placeholder="f.eks. 123456"
          defaultValue={settings.vipps_number ?? ""}
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-full bg-lilac px-6 font-display text-lg font-semibold text-white shadow-[0_4px_0_#8d6fe6] transition active:translate-y-1 active:shadow-[0_1px_0_#8d6fe6] disabled:opacity-70"
      >
        {pending ? "Lagrer …" : "Lagre"}
      </button>
      {state.error && (
        <p role="alert" className="font-semibold text-berry sm:col-span-3">
          {state.error}
        </p>
      )}
      {state.success && !pending && (
        <p role="status" className="font-semibold text-[#2f9c7f] sm:col-span-3">
          {state.success}
        </p>
      )}
    </form>
  );
}

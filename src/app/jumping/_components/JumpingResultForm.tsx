"use client";

import { useActionState, useState } from "react";
import {
  formatTime,
  MAX_OBSTACLES,
  type JumpingResult,
} from "@/lib/jumping-shared";
import { saveJumpingResult, type FormState } from "../actions";

export function JumpingResultForm({
  entryId,
  result,
}: {
  entryId: string;
  result: JumpingResult | null;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveJumpingResult.bind(null, entryId),
    {},
  );
  const [faults, setFaults] = useState(() =>
    Array.from({ length: MAX_OBSTACLES }, (_, i) =>
      result?.faults[i] !== undefined ? String(result.faults[i]) : "",
    ),
  );
  const [time, setTime] = useState(
    result?.time_seconds != null ? formatTime(result.time_seconds) : "",
  );
  const total = faults.reduce((sum, f) => sum + (Number(f) || 0), 0);

  return (
    <form action={formAction} className="flex flex-col gap-4 pt-3">
      <fieldset>
        <legend className="mb-2 font-display font-medium">
          Feilpoeng per hinder
        </legend>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-9">
          {faults.map((value, i) => (
            <label key={i} className="flex flex-col items-center gap-1">
              <span className="text-sm font-bold text-plum-soft">{i + 1}</span>
              <input
                name={`hinder_${i + 1}`}
                type="number"
                inputMode="numeric"
                min={0}
                max={9}
                step={1}
                value={value}
                placeholder="–"
                aria-label={`Hinder ${i + 1}`}
                onChange={(e) =>
                  setFaults((prev) =>
                    prev.map((f, j) => (j === i ? e.target.value : f)),
                  )
                }
                className="h-12 w-full rounded-xl border-2 border-lilac-soft bg-white text-center text-lg font-bold outline-none [appearance:textfield] focus:border-bubblegum focus:ring-4 focus:ring-blush [&::-webkit-inner-spin-button]:appearance-none"
              />
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-plum-soft">
          Skriv 0 for feilfritt hinder, 1 for riving. La feltene stå tomme hvis
          banen har færre enn 9 hinder.
        </p>
      </fieldset>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-display font-medium">Tid (sekunder)</span>
          <input
            name="time"
            inputMode="decimal"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="f.eks. 42,5"
            className="h-12 w-36 rounded-xl border-2 border-lilac-soft bg-white px-3 text-lg font-bold outline-none focus:border-bubblegum focus:ring-4 focus:ring-blush"
          />
        </label>
        <p className="h-12 content-center rounded-xl bg-blush/60 px-4 font-display text-lg font-semibold">
          Totalt: {total} feil
        </p>
        <button
          type="submit"
          disabled={pending}
          className="h-12 rounded-full bg-bubblegum px-6 font-display text-lg font-semibold text-white shadow-[0_4px_0_var(--color-berry)] transition active:translate-y-1 active:shadow-[0_1px_0_var(--color-berry)] disabled:opacity-70"
        >
          {pending ? "Lagrer …" : "Lagre resultat"}
        </button>
      </div>

      {state.error && (
        <p role="alert" className="font-semibold text-berry">
          {state.error}
        </p>
      )}
      {state.success && !pending && (
        <p role="status" className="font-semibold text-[#2f9c7f]">
          {state.success}
        </p>
      )}
    </form>
  );
}

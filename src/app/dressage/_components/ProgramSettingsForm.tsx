"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/entry-actions";
import {
  formatDuration,
  type CompetitionClass,
} from "@/lib/competition-shared";
import { saveProgramSettings } from "../actions";

const inputClass =
  "w-full rounded-xl border-2 border-lilac-soft bg-white px-3 py-2.5 outline-none focus:border-bubblegum focus:ring-4 focus:ring-blush";

export function ProgramSettingsForm({
  dressageClass,
}: {
  dressageClass: CompetitionClass;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveProgramSettings.bind(null, dressageClass.id),
    {},
  );

  return (
    <details className="rounded-2xl bg-lilac-soft/60 open:pb-4">
      <summary className="cursor-pointer px-4 py-3 font-display text-lg font-semibold">
        Programinnstillinger
      </summary>
      <form action={formAction} className="grid gap-3 px-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="font-bold">Program</span>
          <input
            name="program_name"
            defaultValue={dressageClass.program_name ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-bold">Idealtid</span>
          <input
            name="ideal_time"
            placeholder="f.eks. 2:20"
            defaultValue={
              dressageClass.ideal_time_seconds != null
                ? formatDuration(dressageClass.ideal_time_seconds)
                : ""
            }
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-bold">Lenke til programmet</span>
          <input
            name="program_url"
            placeholder="https:// eller /programs/…"
            defaultValue={dressageClass.program_url ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-bold">Lenke til tegning av rideveier</span>
          <input
            name="drawing_url"
            placeholder="https:// eller /programs/…"
            defaultValue={dressageClass.drawing_url ?? ""}
            className={inputClass}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-lilac px-6 py-2.5 font-display text-lg font-semibold text-white shadow-[0_4px_0_#8d6fe6] transition active:translate-y-1 active:shadow-[0_1px_0_#8d6fe6] disabled:opacity-70"
          >
            {pending ? "Lagrer …" : "Lagre program"}
          </button>
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
        </div>
      </form>
    </details>
  );
}

"use client";

import { useActionState, useState } from "react";
import { Notice, SubmitButton } from "@/components/FormBits";
import type { JumpingClass } from "@/lib/jumping-shared";
import { enterRider, type FormState } from "../actions";

const inputClass =
  "w-full rounded-2xl border-2 border-lilac-soft bg-white px-4 py-3 text-base outline-none transition focus:border-bubblegum focus:ring-4 focus:ring-blush";

export function EnterRiderForm({ classes }: { classes: JumpingClass[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    enterRider,
    {},
  );
  const [age, setAge] = useState("");
  // Clear the age (and shown class) after a successful entry, like the rest
  // of the form.
  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    setHandled(state);
    if (state.success) setAge("");
  }
  const ages = Array.from({ length: 13 }, (_, i) => i + 4);
  const riderClass = classes.find(
    (c) => Number(age) >= c.min_age && Number(age) <= c.max_age,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.success && <Notice tone="success">{state.success}</Notice>}

      <label className="flex flex-col gap-1.5">
        <span className="font-display text-lg font-medium">Rytterens navn</span>
        <input name="rider_name" required autoComplete="off" className={inputClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-lg font-medium">Alder</span>
          <select
            name="rider_age"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Velg alder
            </option>
            {ages.map((a) => (
              <option key={a} value={a}>
                {a} år
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-1.5">
          <span className="font-display text-lg font-medium">Klasse</span>
          <p
            aria-live="polite"
            className="rounded-2xl bg-mint-soft px-4 py-3 font-display text-lg font-semibold"
          >
            {riderClass ? riderClass.name : "Velges ut fra alder"}
          </p>
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-display text-lg font-medium">
          Kjepphestens navn
        </span>
        <input name="horse_name" required autoComplete="off" className={inputClass} />
      </label>

      <SubmitButton pending={pending} pendingText="Melder på …">
        Meld på
      </SubmitButton>
    </form>
  );
}

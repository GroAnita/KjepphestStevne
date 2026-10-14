"use client";

import { useActionState, useState } from "react";
import { Notice, SubmitButton } from "@/components/FormBits";
import { enterRider, type FormState } from "@/app/entry-actions";
import type { CompetitionClass, Discipline } from "@/lib/competition-shared";

const inputClass =
  "w-full rounded-2xl border-2 border-lilac-soft bg-white px-4 py-3 text-base outline-none transition focus:border-bubblegum focus:ring-4 focus:ring-blush";

export type DisciplineOption = {
  discipline: Discipline;
  label: string;
  classes: CompetitionClass[];
};

const tint = { jumping: "bg-mint-soft", dressage: "bg-lilac-soft" };

// Enters one rider. With a single discipline the rider goes straight into
// it; with several, the person picks which ones (one entry per discipline).
export function EnterRiderForm({
  options,
  feeNok,
}: {
  options: DisciplineOption[];
  feeNok?: number;
}) {
  const single = options.length === 1;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    enterRider.bind(null, single ? options[0].discipline : null),
    {},
  );
  const [age, setAge] = useState("");
  const [chosen, setChosen] = useState<Discipline[]>(
    single ? [options[0].discipline] : [],
  );
  // Clear the age and choices after a successful entry, like the rest of
  // the form.
  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    setHandled(state);
    if (state.success) {
      setAge("");
      if (!single) setChosen([]);
    }
  }

  const allClasses = options.flatMap((o) => o.classes);
  const minAge = Math.min(...allClasses.map((c) => c.min_age));
  const maxAge = Math.max(...allClasses.map((c) => c.max_age));
  const ages = Array.from(
    { length: maxAge - minAge + 1 },
    (_, i) => i + minAge,
  );
  const classFor = (option: DisciplineOption) =>
    option.classes.find(
      (c) => Number(age) >= c.min_age && Number(age) <= c.max_age,
    );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.success && <Notice tone="success">{state.success}</Notice>}

      <label className="flex flex-col gap-1.5">
        <span className="font-display text-lg font-medium">Rytterens navn</span>
        <input
          name="rider_name"
          required
          autoComplete="off"
          className={inputClass}
        />
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
            <option value="">Velg alder</option>
            {ages.map((a) => (
              <option key={a} value={a}>
                {a} år
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-lg font-medium">
            Kjepphestens navn
          </span>
          <input
            name="horse_name"
            required
            autoComplete="off"
            className={inputClass}
          />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 font-display text-lg font-medium">
          {single ? "Klasse" : "Hva vil rytteren være med på?"}
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const riderClass = classFor(option);
            const isChosen = chosen.includes(option.discipline);
            const content = (
              <span className="flex flex-col">
                <span className="font-display text-lg font-semibold">
                  {option.label}
                </span>
                <span aria-live="polite" className="text-sm text-plum-soft">
                  {age === ""
                    ? "Klassen velges ut fra alder"
                    : riderClass
                      ? `Klasse ${riderClass.name}`
                      : "Ingen klasse for denne alderen"}
                </span>
              </span>
            );
            return single ? (
              <div
                key={option.discipline}
                className={`rounded-2xl px-4 py-3 ${tint[option.discipline]}`}
              >
                {content}
              </div>
            ) : (
              <label
                key={option.discipline}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 transition ${
                  isChosen
                    ? `border-bubblegum ${tint[option.discipline]}`
                    : "border-lilac-soft bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  name="discipline"
                  value={option.discipline}
                  checked={isChosen}
                  onChange={(e) =>
                    setChosen((prev) =>
                      e.target.checked
                        ? [...prev, option.discipline]
                        : prev.filter((d) => d !== option.discipline),
                    )
                  }
                  className="size-6 accent-berry"
                />
                {content}
              </label>
            );
          })}
        </div>
      </fieldset>

      {feeNok !== undefined && feeNok > 0 && (
        <p className="text-plum-soft">
          Påmelding koster {feeNok} kr per klasse
          {chosen.length > 1 && ` – til sammen ${feeNok * chosen.length} kr`}.
        </p>
      )}

      <SubmitButton pending={pending} pendingText="Melder på …">
        Meld på
      </SubmitButton>
    </form>
  );
}

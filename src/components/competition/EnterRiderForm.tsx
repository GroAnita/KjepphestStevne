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
  // Kept in state so the fields survive an error message (React clears
  // uncontrolled fields after every submit).
  const [riderName, setRiderName] = useState("");
  const [horseName, setHorseName] = useState("");
  const [age, setAge] = useState("");
  const [chosen, setChosen] = useState<Discipline[]>(
    single ? [options[0].discipline] : [],
  );
  // Adults can pick several senior classes per discipline.
  const [picked, setPicked] = useState<Partial<Record<Discipline, string[]>>>(
    {},
  );
  // Clear the age and choices after a successful entry, like the rest of
  // the form.
  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    setHandled(state);
    if (state.success) {
      setRiderName("");
      setHorseName("");
      setAge("");
      setPicked({});
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
  // Children fit exactly one class; adults choose between the senior ones.
  const classesFor = (option: DisciplineOption) =>
    option.classes.filter(
      (c) => Number(age) >= c.min_age && Number(age) <= c.max_age,
    );

  // One entry (and one fee) per class the rider is entered in.
  const entryCount = chosen.reduce((count, discipline) => {
    const option = options.find((o) => o.discipline === discipline);
    const matches = option && age !== "" ? classesFor(option) : [];
    return count + (matches.length > 1 ? (picked[discipline]?.length ?? 0) : 1);
  }, 0);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      {state.success && <Notice tone="success">{state.success}</Notice>}

      <label className="flex flex-col gap-1.5">
        <span className="font-display text-lg font-medium">Rytterens navn</span>
        <input
          name="rider_name"
          required
          value={riderName}
          onChange={(e) => setRiderName(e.target.value)}
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
            value={horseName}
            onChange={(e) => setHorseName(e.target.value)}
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
            const matches = age === "" ? [] : classesFor(option);
            const isChosen = chosen.includes(option.discipline);
            const content = (
              <span className="flex flex-col">
                <span className="font-display text-lg font-semibold">
                  {option.label}
                </span>
                <span aria-live="polite" className="text-sm text-plum-soft">
                  {age === ""
                    ? "Klassen velges ut fra alder"
                    : matches.length === 1
                      ? `Klasse ${matches[0].name}`
                      : matches.length > 1
                        ? "Velg én eller flere klasser"
                        : "Ingen klasse for denne alderen"}
                </span>
              </span>
            );
            const pickedHere = picked[option.discipline] ?? [];
            const classPicker = matches.length > 1 && isChosen && (
              <div
                role="group"
                aria-label={`Klasser i ${option.label}`}
                className="flex flex-wrap gap-2"
              >
                {matches.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-lilac-soft bg-white px-3 py-2 font-semibold has-[:checked]:border-bubblegum has-[:checked]:bg-blush"
                  >
                    <input
                      type="checkbox"
                      name={`class_${option.discipline}`}
                      value={c.id}
                      checked={pickedHere.includes(c.id)}
                      onChange={(e) =>
                        setPicked((prev) => ({
                          ...prev,
                          [option.discipline]: e.target.checked
                            ? [...pickedHere, c.id]
                            : pickedHere.filter((id) => id !== c.id),
                        }))
                      }
                      className="size-5 accent-berry"
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            );
            return single ? (
              <div
                key={option.discipline}
                className={`flex flex-col gap-2 rounded-2xl px-4 py-3 ${tint[option.discipline]}`}
              >
                {content}
                {classPicker}
              </div>
            ) : (
              <div key={option.discipline} className="flex flex-col gap-2">
                <label
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
                {classPicker}
              </div>
            );
          })}
        </div>
      </fieldset>

      {feeNok !== undefined && feeNok > 0 && (
        <p className="text-plum-soft">
          Påmelding koster {feeNok} kr per klasse
          {entryCount > 1 && ` – til sammen ${feeNok * entryCount} kr`}.
        </p>
      )}

      <SubmitButton pending={pending} pendingText="Melder på …">
        Meld på
      </SubmitButton>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/app/entry-actions";
import {
  formatDuration,
  type CompetitionClass,
} from "@/lib/competition-shared";
import {
  dressageScore,
  formatPercent,
  maxPoints,
  offCoursePenalty,
  type DressageResult,
} from "@/lib/dressage-shared";
import { saveDressageResult } from "../actions";

const boxClass =
  "h-12 rounded-xl border-2 border-lilac-soft bg-white text-lg font-bold outline-none focus:border-bubblegum focus:ring-4 focus:ring-blush";

const markClass = `${boxClass} w-14 shrink-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`;

function MarkInput({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      name={name}
      type="number"
      inputMode="numeric"
      min={0}
      max={10}
      step={1}
      required
      value={value}
      placeholder="–"
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
      className={markClass}
    />
  );
}

const replaceAt = <T,>(list: T[], index: number, value: T) =>
  list.map((item, i) => (i === index ? value : item));

export function DressageResultForm({
  entryId,
  program,
  result,
}: {
  entryId: string;
  program: CompetitionClass;
  result: DressageResult | null;
}) {
  const { exercises, collective_marks: marks } = program;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    saveDressageResult.bind(null, entryId, exercises.length, marks.length),
    {},
  );
  const [scores, setScores] = useState(() =>
    exercises.map((_, i) => result?.scores[i]?.toString() ?? ""),
  );
  const [errors, setErrors] = useState(() =>
    exercises.map((_, i) => result?.errors[i] ?? false),
  );
  const [collective, setCollective] = useState(() =>
    marks.map((_, i) => result?.collective[i]?.toString() ?? ""),
  );
  const [time, setTime] = useState(
    result?.time_seconds != null ? formatDuration(result.time_seconds) : "",
  );

  const score = dressageScore(
    {
      scores: scores.map((s) => Number(s) || 0),
      errors,
      collective: collective.map((s) => Number(s) || 0),
    },
    program,
  );
  const errorCount = errors.filter(Boolean).length;

  return (
    <form action={formAction} className="flex flex-col gap-5 pt-3">
      <fieldset>
        <legend className="mb-2 font-display font-medium">
          Øvelser (karakter 0–10)
        </legend>
        <ol className="flex flex-col gap-2">
          {exercises.map((exercise, i) => (
            <li
              key={i}
              className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-3 py-2 ${
                errors[i] ? "bg-blush/50" : "bg-cream"
              }`}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white font-display font-semibold">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 basis-48">
                <span className="block text-sm font-bold">
                  {exercise.point}
                </span>
                <span className="block text-sm text-plum-soft">
                  {exercise.text}
                  {exercise.coefficient && exercise.coefficient > 1
                    ? ` (×${exercise.coefficient})`
                    : ""}
                </span>
              </span>
              <span className="ml-auto flex items-center gap-2">
                <MarkInput
                  name={`score_${i + 1}`}
                  label={`Karakter øvelse ${i + 1}`}
                  value={scores[i]}
                  onChange={(v) => setScores((prev) => replaceAt(prev, i, v))}
                />
                <label className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 text-sm font-bold has-[:checked]:bg-berry has-[:checked]:text-white">
                  <input
                    type="checkbox"
                    name={`error_${i + 1}`}
                    checked={errors[i]}
                    onChange={(e) =>
                      setErrors((prev) => replaceAt(prev, i, e.target.checked))
                    }
                    className="size-5 accent-berry"
                  />
                  Feilridning
                </label>
              </span>
            </li>
          ))}
        </ol>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-display font-medium">
          Allment inntrykk (karakter 0–10)
        </legend>
        <ol className="flex flex-col gap-2">
          {marks.map((mark, i) => (
            <li
              key={mark.name}
              className="flex items-center gap-3 rounded-2xl bg-lilac-soft/60 px-3 py-2"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{mark.name}</span>
                <span className="block text-sm text-plum-soft">
                  {mark.text}
                </span>
              </span>
              <span className="shrink-0 text-sm font-bold text-plum-soft">
                ×{mark.coefficient}
              </span>
              <MarkInput
                name={`collective_${i + 1}`}
                label={`Karakter ${mark.name}`}
                value={collective[i]}
                onChange={(v) => setCollective((prev) => replaceAt(prev, i, v))}
              />
            </li>
          ))}
        </ol>
      </fieldset>

      <dl className="grid grid-cols-2 gap-2 rounded-2xl bg-blush/60 p-4 sm:grid-cols-4">
        <div>
          <dt className="text-sm text-plum-soft">Poeng</dt>
          <dd className="font-display text-xl font-semibold">{score.points}</dd>
        </div>
        <div>
          <dt className="text-sm text-plum-soft">
            Fradrag{errorCount > 0 && ` (${errorCount} feilridn.)`}
          </dt>
          <dd className="font-display text-xl font-semibold">
            {score.penalty > 0 ? `−${score.penalty}` : 0}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-plum-soft">Sum</dt>
          <dd className="font-display text-xl font-semibold">
            {score.total} / {maxPoints(program)}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-plum-soft">Omregnet i %</dt>
          <dd className="font-display text-xl font-semibold text-berry">
            {formatPercent(score.percent)}
          </dd>
        </div>
      </dl>
      <p className="-mt-3 text-sm text-plum-soft">
        Feilridning trekker {offCoursePenalty(1)} poeng første gang, 4 andre
        gang, 6 tredje gang og så videre.
      </p>

      <label className="flex flex-col gap-1">
        <span className="font-display font-medium">Kommentar</span>
        <textarea
          name="comment"
          rows={3}
          maxLength={2000}
          defaultValue={result?.comment ?? ""}
          placeholder="Hyggelige ord til rytteren …"
          className="rounded-xl border-2 border-lilac-soft bg-white px-3 py-2 outline-none focus:border-bubblegum focus:ring-4 focus:ring-blush"
        />
      </label>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-display font-medium">Tid (min:sek)</span>
          <input
            name="time"
            inputMode="decimal"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="f.eks. 2:25"
            className={`${boxClass} w-36 px-3`}
          />
        </label>
        {program.ideal_time_seconds != null && (
          <p className="h-12 content-center text-sm text-plum-soft">
            Idealtid: {formatDuration(program.ideal_time_seconds)}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="ml-auto h-12 rounded-full bg-bubblegum px-6 font-display text-lg font-semibold text-white shadow-[0_4px_0_var(--color-berry)] transition active:translate-y-1 active:shadow-[0_1px_0_var(--color-berry)] disabled:opacity-70"
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

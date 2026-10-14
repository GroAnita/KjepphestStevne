import type { ReactNode } from "react";
import { Star } from "@/components/Doodles";
import type { BaseEntry } from "@/lib/competition-shared";
import { EnterRiderForm, type DisciplineOption } from "./EnterRiderForm";
import { WithdrawButton } from "./WithdrawButton";

export function ResultPill({
  done,
  children,
}: {
  done: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold ${
        done ? "bg-mint-soft" : "bg-lilac-soft text-plum-soft"
      }`}
    >
      {children}
    </span>
  );
}

// One entrant in an admin class list. Opens to show the result form.
export function EntryRow({
  entry,
  place,
  result,
  children,
}: {
  entry: BaseEntry;
  place?: number;
  result: ReactNode;
  children: ReactNode;
}) {
  return (
    <li>
      <details className="group rounded-2xl border-2 border-lilac-soft bg-white open:border-bubblegum">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3 sm:px-4 [&::-webkit-details-marker]:hidden">
          {place !== undefined && (
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full font-display text-lg font-semibold ${
                place === 1 ? "bg-sunny" : "bg-lilac-soft"
              }`}
              aria-label={`${place}. plass`}
            >
              {place === 1 ? <Star className="size-5 text-white" /> : place}
            </span>
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-lg font-semibold">
              {entry.rider_name}
            </span>
            <span className="block truncate text-sm text-plum-soft">
              {entry.rider_age} år · {entry.horse_name}
            </span>
          </span>
          {result}
          <span
            aria-hidden="true"
            className="text-berry transition group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="border-t-2 border-dashed border-lilac-soft px-3 pb-4 sm:px-4">
          {children}
          <div className="mt-4 flex justify-end">
            <WithdrawButton entryId={entry.id} riderName={entry.rider_name} />
          </div>
        </div>
      </details>
    </li>
  );
}

export function EmptyClass({ name }: { name: string }) {
  return (
    <p className="py-6 text-center text-plum-soft">
      Ingen påmeldte i {name} ennå.
    </p>
  );
}

export function EnterRiderSection({
  options,
  feeNok,
  description = "Klassen velges automatisk ut fra rytterens alder.",
}: {
  options: DisciplineOption[];
  feeNok?: number;
  description?: string;
}) {
  return (
    <section className="mt-10 rounded-[2rem] bg-white p-2 shadow-[0_12px_40px_-12px_rgba(224,69,127,0.35)]">
      <div className="rounded-[1.6rem] border-2 border-dashed border-blush px-5 py-7 sm:px-8">
        <h2 className="font-display text-3xl font-semibold text-berry">
          Meld på en rytter
        </h2>
        <p className="mb-5 mt-1 text-plum-soft">{description}</p>
        <EnterRiderForm options={options} feeNok={feeNok} />
      </div>
    </section>
  );
}

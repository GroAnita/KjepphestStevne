import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { JumpArt } from "@/components/CategoryArt";
import { Star } from "@/components/Doodles";
import { requireUser } from "@/lib/auth";
import {
  formatTime,
  getJumpingClasses,
  getJumpingEntries,
  rankEntries,
  totalFaults,
  type JumpingClass,
  type JumpingEntry,
} from "@/lib/jumping";
import { ClassTabs } from "./ClassTabs";
import { EnterRiderForm } from "./EnterRiderForm";
import { JumpingResultForm } from "./JumpingResultForm";
import { WithdrawButton } from "./WithdrawButton";

const ageRange = (c: JumpingClass) => `${c.min_age}–${c.max_age} år`;

export async function JumpingPage() {
  const user = await requireUser();
  const classes = await getJumpingClasses();
  const entries = await getJumpingEntries(classes.map((c) => c.id));
  const isAdmin = user.role === "admin";

  return (
    <AppShell user={user}>
      <Link href="/" className="font-bold text-berry underline">
        ← Tilbake
      </Link>

      <div className="mt-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <JumpArt className="h-24 w-auto shrink-0" />
        <div>
          <h1 className="font-display text-4xl font-semibold text-berry sm:text-5xl">
            Sprang
          </h1>
          <p className="mt-1 text-plum-soft">
            Individuell deltagelse · 7–9 hinder · 1 feilpoeng per riving ·
            konkurransen foregår på tid
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        {classes.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl bg-white px-2 py-3 text-center shadow-[0_8px_24px_-14px_rgba(75,44,85,0.4)]"
          >
            <p className="font-display text-xl font-semibold sm:text-2xl">{c.name}</p>
            <p className="text-sm text-plum-soft">{ageRange(c)}</p>
            <p className="mt-1 text-xs font-bold text-berry sm:text-sm">
              {c.ranked ? "Vinner kåres" : "Ingen rangering"}
            </p>
          </li>
        ))}
      </ul>

      {isAdmin ? (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-3xl font-semibold">
            Påmeldte og resultater
          </h2>
          <ClassTabs
            tabs={classes.map((c) => {
              const inClass = entries.filter((e) => e.class_id === c.id);
              return {
                id: c.id,
                label: c.name,
                sublabel: ageRange(c),
                count: inClass.length,
                panel: <AdminClassPanel jumpingClass={c} entries={inClass} />,
              };
            })}
          />
        </section>
      ) : (
        <MyEntries classes={classes} entries={entries} />
      )}

      <section className="mt-10 rounded-[2rem] bg-white p-2 shadow-[0_12px_40px_-12px_rgba(224,69,127,0.35)]">
        <div className="rounded-[1.6rem] border-2 border-dashed border-blush px-5 py-7 sm:px-8">
          <h2 className="font-display text-3xl font-semibold text-berry">
            Meld på en rytter
          </h2>
          <p className="mt-1 mb-5 text-plum-soft">
            Klassen velges automatisk ut fra rytterens alder.
          </p>
          <EnterRiderForm classes={classes} />
        </div>
      </section>
    </AppShell>
  );
}

function ResultChip({ entry }: { entry: JumpingEntry }) {
  const time = entry.result?.time_seconds;
  if (time == null) {
    return (
      <span className="rounded-full bg-lilac-soft px-3 py-1 text-sm font-bold text-plum-soft">
        Ikke ridd ennå
      </span>
    );
  }
  return (
    <span className="rounded-full bg-mint-soft px-3 py-1 text-sm font-bold">
      {totalFaults(entry.result)} feil · {formatTime(time)} s
    </span>
  );
}

function AdminClassPanel({
  jumpingClass,
  entries,
}: {
  jumpingClass: JumpingClass;
  entries: JumpingEntry[];
}) {
  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-plum-soft">
        Ingen påmeldte i {jumpingClass.name} ennå.
      </p>
    );
  }

  const list = jumpingClass.ranked ? rankEntries(entries) : entries;

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-cream px-4 py-2 text-sm text-plum-soft">
        {jumpingClass.ranked
          ? "Rangert: færrest feil vinner, og ved likt antall feil vinner raskeste tid."
          : "I denne klassen rangeres ikke deltagerne. Alle som fullfører er vinnere!"}
      </p>
      <ol className="flex flex-col gap-3">
        {list.map((entry, i) => {
          const placed = jumpingClass.ranked && entry.result?.time_seconds != null;
          return (
            <li key={entry.id}>
              <details className="group rounded-2xl border-2 border-lilac-soft bg-white open:border-bubblegum">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3 sm:px-4 [&::-webkit-details-marker]:hidden">
                  {placed && (
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full font-display text-lg font-semibold ${
                        i === 0 ? "bg-sunny" : "bg-lilac-soft"
                      }`}
                      aria-label={`${i + 1}. plass`}
                    >
                      {i === 0 ? <Star className="size-5 text-white" /> : i + 1}
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
                  <ResultChip entry={entry} />
                  <span
                    aria-hidden="true"
                    className="text-berry transition group-open:rotate-180"
                  >
                    ▾
                  </span>
                </summary>
                <div className="border-t-2 border-dashed border-lilac-soft px-3 pb-4 sm:px-4">
                  <JumpingResultForm entryId={entry.id} result={entry.result} />
                  <div className="mt-4 flex justify-end">
                    <WithdrawButton entryId={entry.id} riderName={entry.rider_name} />
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MyEntries({
  classes,
  entries,
}: {
  classes: JumpingClass[];
  entries: JumpingEntry[];
}) {
  if (entries.length === 0) return null;
  const className = (id: string) => classes.find((c) => c.id === id)?.name;

  return (
    <section className="mt-10">
      <h2 className="mb-4 font-display text-3xl font-semibold">
        Dine påmeldinger
      </h2>
      <ul className="flex flex-col gap-3">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_-14px_rgba(75,44,85,0.4)]"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold">
                {entry.rider_name}
              </span>
              <span className="block text-sm text-plum-soft">
                {className(entry.class_id)} · {entry.rider_age} år ·{" "}
                {entry.horse_name}
              </span>
            </span>
            <ResultChip entry={entry} />
            {!entry.result && (
              <WithdrawButton entryId={entry.id} riderName={entry.rider_name} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { JumpArt } from "@/components/CategoryArt";
import { requireAdmin } from "@/lib/auth";
import {
  formatTime,
  getJumpingClasses,
  getJumpingEntries,
  rankEntries,
  totalFaults,
  type JumpingClass,
  type JumpingEntry,
} from "@/lib/jumping";
import { ClassTabs } from "@/components/competition/ClassTabs";
import {
  EmptyClass,
  EnterRiderSection,
  EntryRow,
  ResultPill,
} from "@/components/competition/EntryList";
import { ageRange } from "@/lib/competition-shared";
import { JumpingResultForm } from "./JumpingResultForm";

export async function JumpingPage() {
  const user = await requireAdmin();
  const classes = await getJumpingClasses();
  const entries = await getJumpingEntries(classes.map((c) => c.id));

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
            <p className="font-display text-xl font-semibold sm:text-2xl">
              {c.name}
            </p>
            <p className="text-sm text-plum-soft">{ageRange(c)}</p>
            <p className="mt-1 text-xs font-bold text-berry sm:text-sm">
              {c.ranked ? "Vinner kåres" : "Ingen rangering"}
            </p>
          </li>
        ))}
      </ul>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-3xl font-semibold">
          Påmeldte og resultater
        </h2>
        <p className="-mt-2 mb-4 text-plum-soft">
          Her vises de som har betalt. Ubetalte påmeldinger finner du under{" "}
          <Link href="/payments" className="font-bold text-berry underline">
            Betalinger
          </Link>
          .
        </p>
        <ClassTabs
          accent="mint"
          tabs={classes.map((c) => {
            // Only paid entries count as entered; the rest wait under Betalinger.
            const inClass = entries.filter(
              (e) => e.class_id === c.id && e.paid_at,
            );
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

      <EnterRiderSection
        options={[{ discipline: "jumping", label: "Sprang", classes }]}
        description="Ryttere du melder på her, regnes som betalt (for eksempel påmelding på selve dagen)."
      />
    </AppShell>
  );
}

function JumpingResultPill({ entry }: { entry: JumpingEntry }) {
  const time = entry.result?.time_seconds;
  return time == null ? (
    <ResultPill done={false}>Ikke ridd ennå</ResultPill>
  ) : (
    <ResultPill done>
      {totalFaults(entry.result)} feil · {formatTime(time)} s
    </ResultPill>
  );
}

function AdminClassPanel({
  jumpingClass,
  entries,
}: {
  jumpingClass: JumpingClass;
  entries: JumpingEntry[];
}) {
  if (entries.length === 0) return <EmptyClass name={jumpingClass.name} />;

  const list = jumpingClass.ranked ? rankEntries(entries) : entries;

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-2xl bg-cream px-4 py-2 text-sm text-plum-soft">
        {jumpingClass.ranked
          ? "Rangert: færrest feil vinner, og ved likt antall feil vinner raskeste tid."
          : "I denne klassen rangeres ikke deltagerne. Alle som fullfører er vinnere!"}
      </p>
      <ol className="flex flex-col gap-3">
        {list.map((entry, i) => (
          <EntryRow
            key={entry.id}
            entry={entry}
            place={
              jumpingClass.ranked && entry.result?.time_seconds != null
                ? i + 1
                : undefined
            }
            result={<JumpingResultPill entry={entry} />}
          >
            <JumpingResultForm entryId={entry.id} result={entry.result} />
          </EntryRow>
        ))}
      </ol>
    </div>
  );
}

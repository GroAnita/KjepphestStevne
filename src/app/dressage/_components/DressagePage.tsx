import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { RosetteArt } from "@/components/CategoryArt";
import { ClassTabs } from "@/components/competition/ClassTabs";
import {
  EmptyClass,
  EnterRiderSection,
  EntryRow,
  MyEntries,
  ResultPill,
} from "@/components/competition/EntryList";
import { requireUser } from "@/lib/auth";
import {
  ageRange,
  formatDuration,
  type CompetitionClass,
} from "@/lib/competition-shared";
import {
  dressageScore,
  formatPercent,
  getDressageClasses,
  maxPoints,
  getDressageEntries,
  rankDressage,
  type DressageEntry,
} from "@/lib/dressage";
import { DressageResultForm } from "./DressageResultForm";
import { ProgramSettingsForm } from "./ProgramSettingsForm";

export async function DressagePage() {
  const user = await requireUser();
  const classes = await getDressageClasses();
  const entries = await getDressageEntries(classes.map((c) => c.id));
  const isAdmin = user.role === "admin";

  return (
    <AppShell user={user}>
      <Link href="/" className="font-bold text-berry underline">
        ← Tilbake
      </Link>

      <div className="mt-4 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
        <RosetteArt className="h-24 w-auto shrink-0" />
        <div>
          <h1 className="font-display text-4xl font-semibold text-berry sm:text-5xl">
            Dressur
          </h1>
          <p className="mt-1 text-plum-soft">
            Individuell deltagelse · karakter 0–10 per øvelse · resultatet
            regnes i prosent · ingen kan bli diskvalifisert
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {classes.map((c) => (
          <li
            key={c.id}
            className="flex flex-col items-center rounded-2xl bg-white px-3 py-4 text-center shadow-[0_8px_24px_-14px_rgba(75,44,85,0.4)]"
          >
            <p className="font-display text-2xl font-semibold">{c.name}</p>
            <p className="text-sm text-plum-soft">
              {ageRange(c)}
              {c.ideal_time_seconds != null &&
                ` · idealtid ${formatDuration(c.ideal_time_seconds)}`}
            </p>
            <p className="mt-1 text-sm font-bold text-berry">
              {c.ranked ? "Vinner kåres" : "Ingen rangering"}
            </p>
            {(c.program_url || c.drawing_url) && (
              <p className="mt-2 flex flex-wrap justify-center gap-2 text-sm font-bold">
                {c.program_url && (
                  <a
                    href={c.program_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-lilac-soft px-3 py-1 hover:bg-lilac hover:text-white"
                  >
                    {c.program_name ?? "Program"}
                  </a>
                )}
                {c.drawing_url && (
                  <a
                    href={c.drawing_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-lilac-soft px-3 py-1 hover:bg-lilac hover:text-white"
                  >
                    Tegning av rideveier
                  </a>
                )}
              </p>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-sm text-plum-soft">
        Det er lov å få lest opp programmet i alle aldersgrupper.
      </p>

      {isAdmin ? (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-3xl font-semibold">
            Påmeldte og resultater
          </h2>
          <ClassTabs
            accent="lilac"
            tabs={classes.map((c) => {
              const inClass = entries.filter((e) => e.class_id === c.id);
              return {
                id: c.id,
                label: c.name,
                sublabel: ageRange(c),
                count: inClass.length,
                panel: <AdminClassPanel dressageClass={c} entries={inClass} />,
              };
            })}
          />
        </section>
      ) : (
        <MyEntries
          classes={classes}
          entries={entries}
          renderResult={(entry) => (
            <DressageResultPill
              entry={entry}
              program={classes.find((c) => c.id === entry.class_id)!}
            />
          )}
        />
      )}

      <EnterRiderSection discipline="dressage" classes={classes} />
    </AppShell>
  );
}

function DressageResultPill({
  entry,
  program,
}: {
  entry: DressageEntry;
  program: CompetitionClass;
}) {
  if (!entry.result) {
    return <ResultPill done={false}>Ikke ridd ennå</ResultPill>;
  }
  const time = entry.result.time_seconds;
  return (
    <ResultPill done>
      {formatPercent(dressageScore(entry.result, program).percent)}
      {program.ranked && time != null && ` · ${formatDuration(time)}`}
    </ResultPill>
  );
}

function AdminClassPanel({
  dressageClass,
  entries,
}: {
  dressageClass: CompetitionClass;
  entries: DressageEntry[];
}) {
  const hasProgram = dressageClass.exercises.length > 0;
  const list = dressageClass.ranked
    ? rankDressage(entries, dressageClass)
    : entries;

  return (
    <div className="flex flex-col gap-3">
      <ProgramSettingsForm dressageClass={dressageClass} />
      {hasProgram ? (
        <p className="px-1 font-display text-lg font-semibold">
          {dressageClass.program_name} · {dressageClass.exercises.length}{" "}
          øvelser · maks {maxPoints(dressageClass)} poeng
        </p>
      ) : (
        <p className="rounded-2xl border-2 border-dashed border-bubblegum px-4 py-3 font-semibold">
          Øvelsene i {dressageClass.program_name ?? dressageClass.name} er ikke
          lagt inn ennå, så resultater kan ikke registreres her enda.
        </p>
      )}
      {entries.length === 0 ? (
        <EmptyClass name={dressageClass.name} />
      ) : (
        <>
          <p className="rounded-2xl bg-cream px-4 py-2 text-sm text-plum-soft">
            {dressageClass.ranked
              ? "Rangert: høyest prosent vinner. Ved lik prosent vinner den som er nærmest idealtiden."
              : "I denne klassen rangeres ikke deltagerne. Alle som fullfører er vinnere!"}
          </p>
          <ol className="flex flex-col gap-3">
            {list.map((entry, i) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                place={dressageClass.ranked && entry.result ? i + 1 : undefined}
                result={
                  <DressageResultPill entry={entry} program={dressageClass} />
                }
              >
                {hasProgram && (
                  <DressageResultForm
                    // Start a fresh form if the program changes.
                    key={`${dressageClass.exercises.length}-${dressageClass.collective_marks.length}`}
                    entryId={entry.id}
                    program={dressageClass}
                    result={entry.result}
                  />
                )}
              </EntryRow>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

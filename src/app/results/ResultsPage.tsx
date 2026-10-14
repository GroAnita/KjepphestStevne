import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { JumpArt, RosetteArt } from "@/components/CategoryArt";
import { ClassTabs } from "@/components/competition/ClassTabs";
import { ResultPill } from "@/components/competition/EntryList";
import { Star } from "@/components/Doodles";
import { requireUser } from "@/lib/auth";
import { getClasses } from "@/lib/competition";
import {
  ageRange,
  formatDuration,
  type CompetitionClass,
} from "@/lib/competition-shared";
import {
  dressageScore,
  formatPercent,
  rankDressage,
} from "@/lib/dressage-shared";
import { formatTime, rankEntries, totalFaults } from "@/lib/jumping-shared";
import { getClassOverview, type PublicEntry } from "@/lib/overview";

export async function ResultsPage() {
  const user = await requireUser();
  const [jumpingClasses, dressageClasses, entries] = await Promise.all([
    getClasses("jumping"),
    getClasses("dressage"),
    getClassOverview(),
  ]);
  const tabsFor = (classes: CompetitionClass[], panel: PanelFn) =>
    classes.map((c) => {
      const inClass = entries.filter((e) => e.class_id === c.id);
      return {
        id: c.id,
        label: c.name,
        sublabel: ageRange(c),
        count: inClass.length,
        panel: panel(c, inClass),
      };
    });

  return (
    <AppShell user={user}>
      <h1 className="text-center font-display text-4xl font-semibold text-berry sm:text-left sm:text-5xl">
        Startlister og resultater
      </h1>
      <p className="mt-2 text-center text-lg text-plum-soft sm:text-left">
        Her ser du alle som er påmeldt i hver klasse, og resultatene etter hvert
        som de kommer.
      </p>

      <Discipline title="Sprang" art={<JumpArt className="h-14 w-auto" />}>
        <ClassTabs accent="mint" tabs={tabsFor(jumpingClasses, JumpingList)} />
      </Discipline>

      <Discipline title="Dressur" art={<RosetteArt className="h-14 w-auto" />}>
        <ClassTabs
          accent="lilac"
          tabs={tabsFor(dressageClasses, DressageList)}
        />
      </Discipline>
    </AppShell>
  );
}

type PanelFn = (c: CompetitionClass, entries: PublicEntry[]) => ReactNode;

function Discipline({
  title,
  art,
  children,
}: {
  title: string;
  art: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 flex items-center gap-3 font-display text-3xl font-semibold">
        {art}
        {title}
      </h2>
      {children}
    </section>
  );
}

function RankNote({ ranked }: { ranked: boolean }) {
  return (
    <p className="mb-3 rounded-2xl bg-cream px-4 py-2 text-sm text-plum-soft">
      {ranked
        ? "I denne klassen kåres en vinner."
        : "I denne klassen rangeres ikke deltagerne. Alle som fullfører er vinnere!"}
    </p>
  );
}

function RiderList({
  rows,
}: {
  rows: { entry: PublicEntry; place?: number; result: ReactNode }[];
}) {
  return (
    <ol className="flex flex-col gap-2">
      {rows.map(({ entry, place, result }) => (
        <li
          key={entry.id}
          className="flex items-center gap-3 rounded-2xl border-2 border-lilac-soft bg-white px-3 py-2.5 sm:px-4"
        >
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
              {entry.horse_name}
            </span>
          </span>
          {result}
        </li>
      ))}
    </ol>
  );
}

function Empty({ name }: { name: string }) {
  return (
    <p className="py-6 text-center text-plum-soft">
      Ingen påmeldte i {name} ennå.
    </p>
  );
}

const notYet = <ResultPill done={false}>Ikke ridd ennå</ResultPill>;
const finished = <ResultPill done>Fullført ✓</ResultPill>;

function JumpingList(c: CompetitionClass, entries: PublicEntry[]) {
  if (entries.length === 0) return <Empty name={c.name} />;
  const withResult = entries.map((e) => ({ ...e, result: e.jumping }));
  const list = c.ranked ? rankEntries(withResult) : withResult;
  return (
    <>
      <RankNote ranked={c.ranked} />
      <RiderList
        rows={list.map((entry, i) => {
          const time = entry.jumping?.time_seconds;
          return {
            entry,
            place: c.ranked && time != null ? i + 1 : undefined,
            result:
              time == null ? (
                notYet
              ) : c.ranked ? (
                <ResultPill done>
                  {totalFaults(entry.jumping)} feil · {formatTime(time)} s
                </ResultPill>
              ) : (
                finished
              ),
          };
        })}
      />
    </>
  );
}

function DressageList(c: CompetitionClass, entries: PublicEntry[]) {
  if (entries.length === 0) return <Empty name={c.name} />;
  const withResult = entries.map((e) => ({ ...e, result: e.dressage }));
  const list = c.ranked ? rankDressage(withResult, c) : withResult;
  return (
    <>
      <RankNote ranked={c.ranked} />
      <RiderList
        rows={list.map((entry, i) => ({
          entry,
          place: c.ranked && entry.dressage ? i + 1 : undefined,
          result: !entry.dressage ? (
            notYet
          ) : c.ranked ? (
            <ResultPill done>
              {formatPercent(dressageScore(entry.dressage, c).percent)}
              {entry.dressage.time_seconds != null &&
                ` · ${formatDuration(entry.dressage.time_seconds)}`}
            </ResultPill>
          ) : (
            finished
          ),
        }))}
      />
    </>
  );
}

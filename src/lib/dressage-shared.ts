// Dressage types and helpers that are safe in both server and browser code.
import type { BaseEntry, CompetitionClass } from "./competition-shared";

export type DressageResult = {
  scores: number[];
  errors: boolean[];
  collective: number[];
  time_seconds: number | null;
  comment: string | null;
};

export type DressageEntry = BaseEntry & { result: DressageResult | null };

export const MAX_MARK = 10;

type Program = Pick<CompetitionClass, "exercises" | "collective_marks">;

export function maxPoints(program: Program): number {
  const exercises = program.exercises.reduce(
    (sum, e) => sum + MAX_MARK * (e.coefficient ?? 1),
    0,
  );
  const collective = program.collective_marks.reduce(
    (sum, m) => sum + MAX_MARK * m.coefficient,
    0,
  );
  return exercises + collective;
}

// Going off course costs 2 points the first time, 4 the second, 6 the
// third and so on: 1 error = 2, 2 errors = 6, 3 errors = 12.
export function offCoursePenalty(errorCount: number): number {
  return errorCount * (errorCount + 1);
}

export type DressageScore = {
  points: number;
  penalty: number;
  total: number;
  percent: number;
};

export function dressageScore(
  result: Pick<DressageResult, "scores" | "errors" | "collective">,
  program: Program,
): DressageScore {
  const exercisePoints = result.scores.reduce(
    (sum, s, i) => sum + s * (program.exercises[i]?.coefficient ?? 1),
    0,
  );
  const collectivePoints = result.collective.reduce(
    (sum, s, i) => sum + s * (program.collective_marks[i]?.coefficient ?? 1),
    0,
  );
  const points = exercisePoints + collectivePoints;
  const penalty = offCoursePenalty(result.errors.filter(Boolean).length);
  const total = points - penalty;
  const max = maxPoints(program);
  return { points, penalty, total, percent: max ? (total / max) * 100 : 0 };
}

export function formatPercent(percent: number): string {
  return `${percent.toLocaleString("nb-NO", { maximumFractionDigits: 2 })} %`;
}

// Highest percentage first. On a tie, the time closest to the ideal time
// wins. Riders without a result go last.
export function rankDressage<E extends { result: DressageResult | null }>(
  entries: E[],
  dressageClass: CompetitionClass,
): E[] {
  const ideal = dressageClass.ideal_time_seconds;
  const distance = (e: E) =>
    ideal != null && e.result?.time_seconds != null
      ? Math.abs(e.result.time_seconds - ideal)
      : Infinity;
  const percent = (e: E) => dressageScore(e.result!, dressageClass).percent;

  return [...entries].sort((a, b) => {
    if (!a.result || !b.result) return a.result ? -1 : b.result ? 1 : 0;
    return percent(b) - percent(a) || distance(a) - distance(b);
  });
}

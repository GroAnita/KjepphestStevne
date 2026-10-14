// Competition types and helpers that are safe in both server and browser code.

export type Discipline = "jumping" | "dressage";

// One numbered exercise on a dressage score sheet.
export type ProgramExercise = {
  point: string;
  text: string;
  coefficient?: number;
};

// A general impression ("Allment inntrykk") mark.
export type CollectiveMark = {
  name: string;
  text: string;
  coefficient: number;
};

export type CompetitionClass = {
  id: string;
  name: string;
  min_age: number;
  max_age: number;
  ranked: boolean;
  program_name: string | null;
  ideal_time_seconds: number | null;
  program_url: string | null;
  drawing_url: string | null;
  exercises: ProgramExercise[];
  collective_marks: CollectiveMark[];
};

export type BaseEntry = {
  id: string;
  class_id: string;
  rider_name: string;
  rider_age: number;
  horse_name: string;
  paid_at: string | null;
};

export const disciplineNames: Record<Discipline, string> = {
  jumping: "Sprang",
  dressage: "Dressur",
};

export const ageRange = (c: CompetitionClass) => `${c.min_age}–${c.max_age} år`;

// Reads "4:30", "4:30,5", "270" or "270.5" as seconds.
// Returns null for empty input and NaN for something unreadable.
export function parseDuration(text: string): number | null {
  const value = text.trim().replace(",", ".");
  if (value === "") return null;
  const match = value.match(/^(?:(\d+):)?(\d+(?:\.\d+)?)$/);
  if (!match) return NaN;
  const minutes = match[1] ? Number(match[1]) : 0;
  const seconds = Number(match[2]);
  if (match[1] && seconds >= 60) return NaN;
  return minutes * 60 + seconds;
}

// 270.5 → "4:30,5", 45 → "0:45"
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  const [whole, decimals] = seconds
    .toFixed(2)
    .replace(/0+$/, "")
    .replace(/\.$/, "")
    .split(".");
  return `${minutes}:${whole.padStart(2, "0")}${decimals ? `,${decimals}` : ""}`;
}

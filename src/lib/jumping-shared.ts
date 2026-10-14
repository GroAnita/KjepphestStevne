// Jumping types and helpers that are safe to use in both server and browser code.

export type JumpingClass = {
  id: string;
  name: string;
  min_age: number;
  max_age: number;
  ranked: boolean;
};

export type JumpingResult = {
  faults: number[];
  time_seconds: number | null;
};

export type JumpingEntry = {
  id: string;
  class_id: string;
  rider_name: string;
  rider_age: number;
  horse_name: string;
  result: JumpingResult | null;
};

export const MAX_OBSTACLES = 9;

export function totalFaults(result: JumpingResult | null): number {
  return result?.faults.reduce((sum, f) => sum + f, 0) ?? 0;
}

// Fewest faults first, then fastest time. Riders without a time go last.
export function rankEntries(entries: JumpingEntry[]): JumpingEntry[] {
  return [...entries].sort((a, b) => {
    const aDone = a.result?.time_seconds != null;
    const bDone = b.result?.time_seconds != null;
    if (aDone !== bDone) return aDone ? -1 : 1;
    if (!aDone) return 0;
    return (
      totalFaults(a.result) - totalFaults(b.result) ||
      a.result!.time_seconds! - b.result!.time_seconds!
    );
  });
}

export function formatTime(seconds: number): string {
  return seconds.toLocaleString("nb-NO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

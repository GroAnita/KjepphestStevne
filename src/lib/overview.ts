import type { DressageResult } from "@/lib/dressage-shared";
import type { JumpingResult } from "@/lib/jumping-shared";
import { createClient } from "@/lib/supabase/server";

// A paid entry as everyone logged in may see it: no age, account or comment.
export type PublicEntry = {
  id: string;
  class_id: string;
  rider_name: string;
  horse_name: string;
  jumping: JumpingResult | null;
  dressage: DressageResult | null;
};

const num = (value: number | string | null) =>
  value === null ? null : Number(value);

export async function getClassOverview(): Promise<PublicEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("class_overview");
  if (error) throw error;

  return (data as Record<string, never>[]).map((row) => ({
    id: row.entry_id,
    class_id: row.class_id,
    rider_name: row.rider_name,
    horse_name: row.horse_name,
    jumping: row.jumping_faults
      ? { faults: row.jumping_faults, time_seconds: num(row.jumping_time) }
      : null,
    dressage: row.dressage_scores
      ? {
          scores: row.dressage_scores,
          errors: row.dressage_errors ?? [],
          collective: row.dressage_collective ?? [],
          time_seconds: num(row.dressage_time),
          comment: null,
        }
      : null,
  }));
}

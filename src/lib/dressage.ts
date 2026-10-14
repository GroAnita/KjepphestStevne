import { getClasses } from "@/lib/competition";
import type { CompetitionClass } from "@/lib/competition-shared";
import { createClient } from "@/lib/supabase/server";
import type { DressageEntry } from "./dressage-shared";

export * from "./dressage-shared";

export function getDressageClasses(): Promise<CompetitionClass[]> {
  return getClasses("dressage");
}

// Entries the current user may see: their own, or all of them for admins.
export async function getDressageEntries(
  classIds: string[],
): Promise<DressageEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(
      "id, class_id, rider_name, rider_age, horse_name, paid_at, dressage_results (scores, errors, collective, time_seconds, comment)",
    )
    .in("class_id", classIds)
    .order("created_at");
  if (error) throw error;

  return data.map(({ dressage_results, ...entry }) => {
    const result = Array.isArray(dressage_results)
      ? dressage_results[0]
      : dressage_results;
    return {
      ...entry,
      result: result
        ? {
            scores: result.scores ?? [],
            errors: result.errors ?? [],
            collective: result.collective ?? [],
            comment: result.comment,
            time_seconds:
              result.time_seconds === null ? null : Number(result.time_seconds),
          }
        : null,
    };
  });
}

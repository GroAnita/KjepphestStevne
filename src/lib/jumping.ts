import { createClient } from "@/lib/supabase/server";
import type { JumpingClass, JumpingEntry } from "./jumping-shared";

export * from "./jumping-shared";

export async function getJumpingClasses(): Promise<JumpingClass[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("id, name, min_age, max_age, ranked")
    .eq("discipline", "jumping")
    .order("sort_order");
  if (error) throw error;
  return data;
}

// Entries the current user may see: their own, or all of them for admins.
export async function getJumpingEntries(
  classIds: string[],
): Promise<JumpingEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(
      "id, class_id, rider_name, rider_age, horse_name, jumping_results (faults, time_seconds)",
    )
    .in("class_id", classIds)
    .order("created_at");
  if (error) throw error;

  return data.map(({ jumping_results, ...entry }) => {
    const result = Array.isArray(jumping_results)
      ? jumping_results[0]
      : jumping_results;
    return {
      ...entry,
      result: result
        ? {
            faults: result.faults ?? [],
            time_seconds:
              result.time_seconds === null ? null : Number(result.time_seconds),
          }
        : null,
    };
  });
}

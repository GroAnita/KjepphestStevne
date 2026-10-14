import { createClient } from "@/lib/supabase/server";
import type { CompetitionClass, Discipline } from "./competition-shared";

export async function getClasses(
  discipline: Discipline,
): Promise<CompetitionClass[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select(
      "id, name, min_age, max_age, ranked, program_name, ideal_time_seconds, program_url, drawing_url, exercises, collective_marks",
    )
    .eq("discipline", discipline)
    .order("sort_order");
  if (error) throw error;
  return data.map((c) => ({
    ...c,
    ideal_time_seconds:
      c.ideal_time_seconds === null ? null : Number(c.ideal_time_seconds),
  }));
}

import type { CompetitionClass, Discipline } from "@/lib/competition-shared";
import type { DressageResult } from "@/lib/dressage-shared";
import type { JumpingResult } from "@/lib/jumping-shared";
import { createClient } from "@/lib/supabase/server";

export type PaymentStatus = "unpaid" | "reported" | "paid";

export type MyEntry = {
  id: string;
  rider_name: string;
  rider_age: number;
  horse_name: string;
  fee_nok: number;
  status: PaymentStatus;
  discipline: Discipline;
  class: CompetitionClass;
  jumping: JumpingResult | null;
  dressage: DressageResult | null;
};

const one = <T>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? (value[0] ?? null) : value;

// The logged-in user's own entries, with class, payment status and results.
export async function getMyEntries(userId: string): Promise<MyEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(
      `id, rider_name, rider_age, horse_name, fee_nok, payment_reported_at, paid_at,
       classes (id, discipline, name, min_age, max_age, ranked, program_name,
         ideal_time_seconds, program_url, drawing_url, exercises, collective_marks),
       jumping_results (faults, time_seconds),
       dressage_results (scores, errors, collective, time_seconds, comment)`,
    )
    .eq("user_id", userId)
    .order("created_at");
  if (error) throw error;

  return data.map((row) => {
    const c = one(row.classes)!;
    const j = one(row.jumping_results);
    const d = one(row.dressage_results);
    return {
      id: row.id,
      rider_name: row.rider_name,
      rider_age: row.rider_age,
      horse_name: row.horse_name,
      fee_nok: row.fee_nok,
      status: row.paid_at
        ? "paid"
        : row.payment_reported_at
          ? "reported"
          : "unpaid",
      discipline: c.discipline as Discipline,
      class: {
        ...c,
        ideal_time_seconds:
          c.ideal_time_seconds === null ? null : Number(c.ideal_time_seconds),
      },
      jumping: j
        ? {
            faults: j.faults ?? [],
            time_seconds:
              j.time_seconds === null ? null : Number(j.time_seconds),
          }
        : null,
      dressage: d
        ? {
            scores: d.scores ?? [],
            errors: d.errors ?? [],
            collective: d.collective ?? [],
            time_seconds:
              d.time_seconds === null ? null : Number(d.time_seconds),
            comment: d.comment,
          }
        : null,
    };
  });
}

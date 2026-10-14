import { disciplineNames, type Discipline } from "@/lib/competition-shared";
import type { PaymentStatus } from "@/lib/my-entries";
import { createClient } from "@/lib/supabase/server";

export type PaymentEntry = {
  id: string;
  rider_name: string;
  horse_name: string;
  class_label: string;
  fee_nok: number;
  status: PaymentStatus;
};

// All entries grouped by the account that registered them (admins only).
export type PaymentGroup = {
  userId: string;
  accountName: string;
  entries: PaymentEntry[];
};

const one = <T>(value: T | T[] | null): T | null =>
  Array.isArray(value) ? (value[0] ?? null) : value;

export async function getPaymentGroups(): Promise<PaymentGroup[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("entries")
    .select(
      "id, user_id, rider_name, horse_name, fee_nok, payment_reported_at, paid_at, classes (discipline, name), profiles (full_name)",
    )
    .order("created_at");
  if (error) throw error;

  const groups = new Map<string, PaymentGroup>();
  for (const row of data) {
    const c = one(row.classes)!;
    const group: PaymentGroup = groups.get(row.user_id) ?? {
      userId: row.user_id,
      accountName: one(row.profiles)?.full_name ?? "Ukjent",
      entries: [],
    };
    group.entries.push({
      id: row.id,
      rider_name: row.rider_name,
      horse_name: row.horse_name,
      class_label: `${disciplineNames[c.discipline as Discipline]} ${c.name}`,
      fee_nok: row.fee_nok,
      status: row.paid_at
        ? "paid"
        : row.payment_reported_at
          ? "reported"
          : "unpaid",
    });
    groups.set(row.user_id, group);
  }
  return [...groups.values()];
}

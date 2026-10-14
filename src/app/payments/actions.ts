"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "../entry-actions";

async function isAdmin() {
  return (await getCurrentUser())?.role === "admin";
}

export async function confirmPayments(entryIds: string[]) {
  if (!(await isAdmin())) return;
  const supabase = await createClient();
  await supabase
    .from("entries")
    .update({ paid_at: new Date().toISOString() })
    .in("id", entryIds)
    .is("paid_at", null);
  refresh();
}

export async function undoPayments(entryIds: string[]) {
  if (!(await isAdmin())) return;
  const supabase = await createClient();
  await supabase.from("entries").update({ paid_at: null }).in("id", entryIds);
  refresh();
}

export async function saveSettings(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!(await isAdmin())) {
    return { error: "Bare administratorer kan gjøre dette." };
  }
  const fee = Number(formData.get("entry_fee_nok"));
  const vipps = String(formData.get("vipps_number") ?? "").trim();
  if (!Number.isInteger(fee) || fee < 0 || fee > 10000) {
    return { error: "Prisen må være et helt antall kroner." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ entry_fee_nok: fee, vipps_number: vipps || null })
    .eq("id", true);
  if (error) return { error: "Kunne ikke lagre. Prøv igjen." };

  refresh();
  return {
    success: "Lagret! Ny pris gjelder for påmeldinger fra nå av.",
  };
}

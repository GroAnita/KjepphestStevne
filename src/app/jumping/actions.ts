"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { MAX_OBSTACLES } from "@/lib/jumping-shared";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "../entry-actions";

function parseFault(value: FormDataEntryValue | null): number | null {
  const text = String(value ?? "").trim();
  if (text === "") return null;
  const n = Number(text);
  return Number.isInteger(n) && n >= 0 && n <= 9 ? n : NaN;
}

export async function saveJumpingResult(
  entryId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return { error: "Bare administratorer kan registrere resultater." };
  }

  const raw = Array.from({ length: MAX_OBSTACLES }, (_, i) =>
    parseFault(formData.get(`hinder_${i + 1}`)),
  );
  if (raw.some((f) => Number.isNaN(f))) {
    return { error: "Feilpoeng må være hele tall fra 0 til 9." };
  }
  // Empty fields at the end are obstacles the course doesn't have.
  while (raw.length && raw[raw.length - 1] === null) raw.pop();
  const faults = raw.map((f) => f ?? 0);

  const timeText = String(formData.get("time") ?? "")
    .trim()
    .replace(",", ".");
  const time = timeText === "" ? null : Number(timeText);
  if (time !== null && (!Number.isFinite(time) || time <= 0 || time >= 10000)) {
    return { error: "Tiden må være et tall i sekunder, for eksempel 42,5." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("jumping_results").upsert({
    entry_id: entryId,
    faults,
    time_seconds: time,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    return { error: "Kunne ikke lagre. Prøv igjen." };
  }

  refresh();
  return { success: "Lagret!" };
}

"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getJumpingClasses, MAX_OBSTACLES } from "@/lib/jumping";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; success?: string };

export async function enterRider(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const riderName = String(formData.get("rider_name") ?? "").trim();
  const horseName = String(formData.get("horse_name") ?? "").trim();
  const age = Number(formData.get("rider_age"));

  if (!riderName || !horseName || !age) {
    return { error: "Fyll inn navn, alder og navnet på kjepphesten." };
  }

  // The class follows from the rider's age.
  const classes = await getJumpingClasses();
  const riderClass = classes.find(
    (c) => age >= c.min_age && age <= c.max_age,
  );
  if (!riderClass) {
    return { error: "Sprang er for ryttere mellom 4 og 16 år." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("entries").insert({
    class_id: riderClass.id,
    rider_name: riderName,
    rider_age: age,
    horse_name: horseName,
  });
  if (error) {
    return { error: "Påmeldingen gikk ikke. Prøv igjen om litt." };
  }

  refresh();
  return {
    success: `${riderName} og ${horseName} er påmeldt i ${riderClass.name}!`,
  };
}

export async function withdrawEntry(entryId: string) {
  const supabase = await createClient();
  await supabase.from("entries").delete().eq("id", entryId);
  refresh();
}

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

"use server";

import { refresh } from "next/cache";
import { getClasses } from "@/lib/competition";
import type { Discipline } from "@/lib/competition-shared";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; success?: string };

export async function enterRider(
  discipline: Discipline,
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
  const classes = await getClasses(discipline);
  const riderClass = classes.find(
    (c) => age >= c.min_age && age <= c.max_age,
  );
  if (!riderClass) {
    return { error: "Det finnes ingen klasse for denne alderen." };
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

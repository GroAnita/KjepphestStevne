"use server";

import { refresh } from "next/cache";
import { getClasses } from "@/lib/competition";
import { disciplineNames, type Discipline } from "@/lib/competition-shared";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; success?: string };

// Enters one rider in one or more disciplines. With fixedDiscipline set
// (the admin pages), only that discipline is used.
export async function enterRider(
  fixedDiscipline: Discipline | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const riderName = String(formData.get("rider_name") ?? "").trim();
  const horseName = String(formData.get("horse_name") ?? "").trim();
  const age = Number(formData.get("rider_age"));
  const disciplines = fixedDiscipline
    ? [fixedDiscipline]
    : formData
        .getAll("discipline")
        .filter((d): d is Discipline => d === "jumping" || d === "dressage");

  if (!riderName || !horseName || !age) {
    return { error: "Fyll inn navn, alder og navnet på kjepphesten." };
  }
  if (disciplines.length === 0) {
    return { error: "Velg Sprang, Dressur eller begge." };
  }

  // The class follows from the rider's age.
  const picked = [];
  for (const discipline of disciplines) {
    const riderClass = (await getClasses(discipline)).find(
      (c) => age >= c.min_age && age <= c.max_age,
    );
    if (!riderClass) {
      return {
        error: `Det finnes ingen klasse i ${disciplineNames[discipline]} for ${age} år.`,
      };
    }
    picked.push({ discipline, riderClass });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("entries").insert(
    picked.map(({ riderClass }) => ({
      class_id: riderClass.id,
      rider_name: riderName,
      rider_age: age,
      horse_name: horseName,
    })),
  );
  if (error) {
    return { error: "Påmeldingen gikk ikke. Prøv igjen om litt." };
  }

  refresh();
  const where = picked
    .map(({ discipline, riderClass }) =>
      fixedDiscipline
        ? riderClass.name
        : `${disciplineNames[discipline]} ${riderClass.name}`,
    )
    .join(" og ");
  return {
    success: `${riderName} og ${horseName} er lagt til i ${where}!`,
  };
}

export async function withdrawEntry(entryId: string) {
  const supabase = await createClient();
  await supabase.from("entries").delete().eq("id", entryId);
  refresh();
}

// "Jeg har betalt": tells the admins the user has paid with Vipps.
export async function reportPayment(entryIds: string[]) {
  const supabase = await createClient();
  await supabase.rpc("report_payment", { entry_ids: entryIds });
  refresh();
}

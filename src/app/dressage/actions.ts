"use server";

import { refresh } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { parseDuration } from "@/lib/competition-shared";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "../entry-actions";

const notAdmin = { error: "Bare administratorer kan gjøre dette." };

function parseMark(value: FormDataEntryValue | null): number {
  const text = String(value ?? "").trim();
  const mark = text === "" ? NaN : Number(text);
  return Number.isInteger(mark) && mark >= 0 && mark <= 10 ? mark : NaN;
}

export async function saveDressageResult(
  entryId: string,
  exerciseCount: number,
  collectiveCount: number,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return notAdmin;

  const scores: number[] = [];
  const errors: boolean[] = [];
  for (let i = 1; i <= exerciseCount; i++) {
    const score = parseMark(formData.get(`score_${i}`));
    if (Number.isNaN(score)) {
      return {
        error: `Gi en karakter fra 0 til 10 (hele tall) på alle øvelsene. Sjekk øvelse ${i}.`,
      };
    }
    scores.push(score);
    errors.push(formData.get(`error_${i}`) === "on");
  }

  const collective: number[] = [];
  for (let i = 1; i <= collectiveCount; i++) {
    const mark = parseMark(formData.get(`collective_${i}`));
    if (Number.isNaN(mark)) {
      return {
        error:
          "Gi en karakter fra 0 til 10 på alle punktene under allment inntrykk.",
      };
    }
    collective.push(mark);
  }

  const time = parseDuration(String(formData.get("time") ?? ""));
  if (Number.isNaN(time) || (time !== null && (time <= 0 || time >= 10000))) {
    return { error: "Skriv tiden som minutter:sekunder, for eksempel 2:25." };
  }

  const comment = String(formData.get("comment") ?? "")
    .trim()
    .slice(0, 2000);

  const supabase = await createClient();
  const { error } = await supabase.from("dressage_results").upsert({
    entry_id: entryId,
    scores,
    errors,
    collective,
    time_seconds: time,
    comment: comment || null,
    updated_at: new Date().toISOString(),
  });
  if (error) return { error: "Kunne ikke lagre. Prøv igjen." };

  refresh();
  return { success: "Lagret!" };
}

// Accepts a full web address or a file in this app, like /programs/lc1.pdf.
function parseUrl(value: FormDataEntryValue | null): string | null | undefined {
  const text = String(value ?? "").trim();
  if (text === "") return null;
  if (/^\/[\w\-./]+$/.test(text) && !text.startsWith("//")) return text;
  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export async function saveProgramSettings(
  classId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (user?.role !== "admin") return notAdmin;

  const programName = String(formData.get("program_name") ?? "").trim();
  const idealTime = parseDuration(String(formData.get("ideal_time") ?? ""));
  const programUrl = parseUrl(formData.get("program_url"));
  const drawingUrl = parseUrl(formData.get("drawing_url"));

  if (Number.isNaN(idealTime) || (idealTime !== null && idealTime <= 0)) {
    return {
      error: "Skriv idealtiden som minutter:sekunder, for eksempel 2:20.",
    };
  }
  if (programUrl === undefined || drawingUrl === undefined) {
    return {
      error:
        "Lenkene må starte med https:// eller være en fil i appen, som /programs/lc1.pdf.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("classes")
    .update({
      program_name: programName || null,
      ideal_time_seconds: idealTime,
      program_url: programUrl,
      drawing_url: drawingUrl,
    })
    .eq("id", classId);
  if (error) return { error: "Kunne ikke lagre. Prøv igjen." };

  refresh();
  return { success: "Programmet er oppdatert!" };
}

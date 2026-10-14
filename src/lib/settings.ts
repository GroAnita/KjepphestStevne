import { createClient } from "@/lib/supabase/server";

export type Settings = {
  entry_fee_nok: number;
  vipps_number: string | null;
};

export async function getSettings(): Promise<Settings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("entry_fee_nok, vipps_number")
    .single();
  if (error) throw error;
  return data;
}

import { redirect } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type Role = "user" | "admin";

export type CurrentUser = {
  id: string;
  name: string;
  role: Role;
};

// The logged-in user with their role, or null when logged out.
// Wrapped in cache() so the header and page share one lookup per request.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: claims.sub,
    name: profile?.full_name ?? claims.user_metadata?.full_name ?? "Rytter",
    role: profile?.role === "admin" ? "admin" : "user",
  };
});

// For pages that need a logged-in user: sends everyone else to the login page.
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

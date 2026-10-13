"use server";

import type { AuthError } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  success?: string;
  name?: string;
  email?: string;
};

function friendlyError(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "Feil e-post eller passord. Prøv igjen!";
    case "email_not_confirmed":
      return "Du må bekrefte e-posten din først. Sjekk innboksen din!";
    case "user_already_exists":
    case "email_exists":
      return "Det finnes allerede en konto med denne e-posten. Prøv å logge inn!";
    case "weak_password":
      return "Passordet er for svakt. Prøv et lengre passord.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Hoppsann, litt for mange forsøk! Vent litt og prøv igjen.";
    default:
      return "Noe gikk galt. Prøv igjen om litt.";
  }
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Fyll inn både e-post og passord.", email };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: friendlyError(error), email };
  }

  redirect("/");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!name || !email || !password) {
    return { error: "Fyll inn alle feltene.", name, email };
  }
  if (password.length < 6) {
    return { error: "Passordet må ha minst 6 tegn.", name, email };
  }
  if (password !== confirm) {
    return { error: "Passordene er ikke like. Prøv igjen!", name, email };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
    },
  });
  if (error) {
    return { error: friendlyError(error), name, email };
  }

  // If email confirmation is turned off in Supabase, the user is logged in right away.
  if (data.session) {
    redirect("/");
  }

  return {
    success: `Hurra, ${name}! Vi har sendt en e-post til ${email}. Trykk på lenken i e-posten for å bekrefte kontoen din.`,
  };
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { error: "Fyll inn e-posten din." };
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin
      ? `${origin}/auth/confirm?next=/reset-password`
      : undefined,
  });
  if (error && error.code?.startsWith("over_")) {
    return { error: friendlyError(error), email };
  }

  // Same answer whether or not the account exists, so nobody can use this
  // form to find out who is registered.
  return {
    success: `Hvis det finnes en konto for ${email}, har vi sendt en e-post med en lenke. Trykk på den for å lage et nytt passord.`,
  };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    return { error: "Passordet må ha minst 6 tegn." };
  }
  if (password !== confirm) {
    return { error: "Passordene er ikke like. Prøv igjen!" };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    return {
      error:
        "Lenken er for gammel, eller den ble åpnet i en annen nettleser. Be om en ny lenke.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "Det nye passordet må være forskjellig fra det gamle."
          : friendlyError(error),
    };
  }

  return { success: "Hurra! Du har fått nytt passord og er logget inn." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

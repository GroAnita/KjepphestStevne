"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Notice, PasswordField, SubmitButton } from "@/components/FormBits";
import { updatePassword, type AuthState } from "../actions";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    {},
  );

  if (state.success) {
    return (
      <div className="flex flex-col gap-4">
        <Notice tone="success">{state.success}</Notice>
        <Link
          href="/"
          className="rounded-full bg-bubblegum px-6 py-3.5 text-center font-display text-xl font-semibold text-white shadow-[0_5px_0_var(--color-berry)] active:translate-y-1 active:shadow-[0_1px_0_var(--color-berry)]"
        >
          Til forsiden
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <PasswordField
        label="Nytt passord"
        name="password"
        autoComplete="new-password"
        hint="Minst 6 tegn"
      />
      <PasswordField
        label="Gjenta nytt passord"
        name="confirm"
        autoComplete="new-password"
      />
      <SubmitButton pending={pending} pendingText="Lagrer …">
        Lagre nytt passord
      </SubmitButton>
    </form>
  );
}

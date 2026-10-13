"use client";

import { useActionState } from "react";
import { Field, Notice, PasswordField, SubmitButton } from "@/components/FormBits";
import { signUp, type AuthState } from "../actions";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signUp,
    {},
  );

  if (state.success) {
    return <Notice tone="success">{state.success}</Notice>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Field
        label="Navn"
        name="name"
        autoComplete="name"
        defaultValue={state.name}
      />
      <Field
        label="E-post"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.email}
      />
      <PasswordField
        label="Passord"
        name="password"
        autoComplete="new-password"
        hint="Minst 6 tegn"
      />
      <PasswordField
        label="Gjenta passord"
        name="confirm"
        autoComplete="new-password"
      />
      <SubmitButton pending={pending} pendingText="Saler opp …">
        Registrer meg
      </SubmitButton>
    </form>
  );
}

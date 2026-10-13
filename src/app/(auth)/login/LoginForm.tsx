"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Field, Notice, PasswordField, SubmitButton } from "@/components/FormBits";
import { signIn, type AuthState } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    {},
  );
  const confirmFailed = useSearchParams().get("error") === "confirm";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error ? (
        <Notice tone="error">{state.error}</Notice>
      ) : (
        confirmFailed && (
          <Notice tone="error">
            Lenken virket ikke, eller den er for gammel. Prøv å logge inn, eller
            registrer deg på nytt.
          </Notice>
        )
      )}
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
        autoComplete="current-password"
      />
      <SubmitButton pending={pending} pendingText="Galopperer inn …">
        Logg inn
      </SubmitButton>
    </form>
  );
}

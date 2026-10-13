"use client";

import { useActionState } from "react";
import { Field, Notice, SubmitButton } from "@/components/FormBits";
import { requestPasswordReset, type AuthState } from "../actions";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    {},
  );

  if (state.success) {
    return <Notice tone="success">{state.success}</Notice>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <Field
        label="E-post"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={state.email}
      />
      <SubmitButton pending={pending} pendingText="Sender …">
        Send meg en lenke
      </SubmitButton>
    </form>
  );
}

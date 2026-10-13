"use client";

import { useId, useState, type ReactNode } from "react";

const inputClass =
  "w-full rounded-2xl border-2 border-lilac-soft bg-white px-4 py-3 text-base text-plum placeholder:text-plum-soft/50 outline-none transition focus:border-bubblegum focus:ring-4 focus:ring-blush";

type FieldProps = {
  label: string;
  name: string;
  type?: "text" | "email";
  autoComplete?: string;
  defaultValue?: string;
  placeholder?: string;
};

export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  defaultValue,
  placeholder,
}: FieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-lg font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

type PasswordFieldProps = {
  label: string;
  name: string;
  autoComplete: "current-password" | "new-password";
  hint?: string;
};

export function PasswordField({
  label,
  name,
  autoComplete,
  hint,
}: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-display text-lg font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={6}
          autoComplete={autoComplete}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={`${inputClass} pr-20`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1.5 text-sm font-bold text-berry hover:bg-blush"
        >
          {visible ? "Skjul" : "Vis"}
        </button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-plum-soft">
          {hint}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  pending,
  children,
  pendingText,
}: {
  pending: boolean;
  children: ReactNode;
  pendingText: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-full bg-bubblegum px-6 py-3.5 font-display text-xl font-semibold text-white shadow-[0_5px_0_var(--color-berry)] transition hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_var(--color-berry)] disabled:cursor-wait disabled:opacity-80"
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function Notice({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  const styles =
    tone === "error"
      ? "border-bubblegum bg-blush/60"
      : "border-mint bg-mint-soft";
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`rounded-2xl border-2 px-4 py-3 font-semibold ${styles}`}
    >
      {children}
    </p>
  );
}

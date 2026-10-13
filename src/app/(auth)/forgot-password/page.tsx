import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Glemt passord – Kjepphest-stevne",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Glemt passordet?"
      subtitle="Ingen fare! Skriv inn e-posten din, så sender vi deg en lenke for å lage et nytt."
      footer={
        <>
          Kom du på det likevel?{" "}
          <Link href="/login" className="font-bold text-berry underline">
            Logg inn
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}

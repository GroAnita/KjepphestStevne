import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Nytt passord – Kjepphest-stevne",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Lag nytt passord"
      subtitle="Velg et nytt passord som du husker godt."
      footer={
        <>
          Trenger du en ny lenke?{" "}
          <Link href="/forgot-password" className="font-bold text-berry underline">
            Prøv igjen
          </Link>
        </>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}

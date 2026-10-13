import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Logg inn – Kjepphest-stevne",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Velkommen tilbake!"
      subtitle="Logg inn for å melde på deg og kjepphesten din."
      footer={
        <>
          Har du ikke konto?{" "}
          <Link href="/register" className="font-bold text-berry underline">
            Registrer deg her
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}

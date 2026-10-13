import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Registrer deg – Kjepphest-stevne",
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Bli med på stevnet!"
      subtitle="Lag en konto, så kan du melde på kjepphesten din."
      footer={
        <>
          Har du allerede konto?{" "}
          <Link href="/login" className="font-bold text-berry underline">
            Logg inn
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}

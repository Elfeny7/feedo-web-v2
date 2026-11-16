import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/auth-shell";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/forms/register-form";

export const metadata: Metadata = {
  title: "Create account — Feedo",
  description: "Create your Feedo account and start collecting feedback.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Feedo to post some interesting stuff."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
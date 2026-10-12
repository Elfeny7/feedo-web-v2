import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Sign in — Feedo",
  description: "Sign in to your Feedo account.",
};

export default async function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your Feedo account to do something."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:text-primary/80">
            Create one
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
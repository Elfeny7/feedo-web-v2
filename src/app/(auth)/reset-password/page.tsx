import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { ResetPasswordForm } from "@/features/auth/forms/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password — Feedo",
  description: "Set a new password for your Feedo account.",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string; otp?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { email = "", otp = "" } = await searchParams;

  return (
    <AuthShell
      title="Set new password"
      subtitle={
        email
          ? `Create a strong new password for ${email}.`
          : "Create a strong new password for your account."
      }
      footer={
        <>
          Need a new verification code?{" "}
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:text-primary/80"
          >
            Request again
          </Link>
        </>
      }
    >
      <ResetPasswordForm email={email} otp={otp} />
    </AuthShell>
  );
}

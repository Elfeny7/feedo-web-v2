import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { OtpForm } from "@/features/auth/forms/otp-form";
import type { OtpType } from "@/features/auth/api/auth-api";

export const metadata: Metadata = {
  title: "Verify OTP — Feedo",
  description: "Verify your email address with the 6-digit OTP code.",
};

interface OtpPageProps {
  searchParams: Promise<{ email?: string; type?: string }>;
}

export default async function OtpPage({ searchParams }: OtpPageProps) {
  const { email = "", type } = await searchParams;
  const otpType: OtpType =
    type === "reset_password" ? "reset_password" : "registration";

  return (
    <AuthShell
      title="Check your email"
      subtitle={
        email
          ? `We've sent a 6-digit verification code to ${email}.`
          : "Enter the 6-digit verification code sent to your email."
      }
      footer={
        <>
          Entered the wrong email?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:text-primary/80"
          >
            Go back to sign up
          </Link>
        </>
      }
    >
      <OtpForm email={email} type={otpType} />
    </AuthShell>
  );
}

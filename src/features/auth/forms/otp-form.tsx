"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SubmitButton } from "@/components/ui/submit-button";
import { authApi, type OtpType } from "@/features/auth/api/auth-api";
import { ApiError } from "@/types/api";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

interface OtpFormProps {
  email: string;
  type?: OtpType;
}

export function OtpForm({ email, type = "registration" }: OtpFormProps) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const otpCode = digits.join("");
  const isComplete = otpCode.length === OTP_LENGTH && /^\d{6}$/.test(otpCode);

  const focusInput = (index: number) => {
    const target = inputRefs.current[index];
    if (target) {
      target.focus();
      target.select();
    }
  };

  const handleDigitChange = (index: number, rawValue: string) => {
    const cleaned = rawValue.replace(/\D/g, "");
    setErrorMessage(null);

    if (!cleaned) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    // Jika user mengetik atau autofill lebih dari 1 digit sekaligus
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, OTP_LENGTH).split("");
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((char, offset) => {
          if (index + offset < OTP_LENGTH) {
            next[index + offset] = char;
          }
        });
        return next;
      });
      const nextFocusIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
      focusInput(nextFocusIndex);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        e.preventDefault();
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedDigits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedDigits) return;

    setErrorMessage(null);
    const nextDigits = Array(OTP_LENGTH).fill("");
    pastedDigits.split("").forEach((char, idx) => {
      nextDigits[idx] = char;
    });
    setDigits(nextDigits);

    const focusIdx = Math.min(pastedDigits.length, OTP_LENGTH) - 1;
    focusInput(Math.max(0, focusIdx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Email address is missing. Please register again.");
      return;
    }
    if (!isComplete || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      await authApi.verifyOtp(email, otpCode, type);
      toast.success("Email verified successfully! Please sign in.");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        const rawResponse =
          err.responseData && typeof err.responseData === "object"
            ? (err.responseData as Record<string, unknown>)
            : null;
        const nestedData =
          rawResponse?.data && typeof rawResponse.data === "object"
            ? (rawResponse.data as Record<string, unknown>)
            : null;
        const serverErrors = (rawResponse?.errors ?? nestedData?.errors) as
          | Record<string, string[]>
          | undefined;

        const fieldMessage =
          serverErrors?.otp?.[0] ??
          serverErrors?.email?.[0] ??
          err.message ??
          "Invalid or expired OTP code.";

        setErrorMessage(fieldMessage);
      } else {
        setErrorMessage("Failed to verify OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address is missing.");
      return;
    }
    if (cooldown > 0 || resending) return;

    setResending(true);
    setErrorMessage(null);

    try {
      await authApi.resendOtp(email, type);
      setDigits(Array(OTP_LENGTH).fill(""));
      setCooldown(RESEND_COOLDOWN_SECONDS);
      focusInput(0);
      toast.success("A new OTP code has been sent to your email.");
    } catch (err: unknown) {
      toast.error(
        err instanceof ApiError
          ? err.message || "Failed to resend OTP code."
          : "Failed to resend OTP code."
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {errorMessage && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive text-center">
          {errorMessage}
        </p>
      )}

      {/* 6 Digit OTP Input Boxes */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground text-center">
          Enter 6-digit verification code
        </label>
        <div className="flex items-center justify-between gap-2 sm:gap-3 mt-1">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1}`}
              className={`h-12 sm:h-14 w-full rounded-xl border bg-card text-center text-lg sm:text-xl font-bold text-foreground shadow-sm outline-none transition-all focus:border-ring focus:ring-2 focus:ring-ring/25 ${
                errorMessage
                  ? "border-destructive focus:border-destructive focus:ring-destructive/25"
                  : digit
                    ? "border-primary/60"
                    : "border-input"
              }`}
            />
          ))}
        </div>
      </div>

      <SubmitButton loading={loading} disabled={!isComplete || !email}>
        {loading ? "Verifying…" : "Verify"}
      </SubmitButton>

      {/* Resend OTP Section */}
      <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
        <span>Didn&apos;t receive the code?</span>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending || !email}
          className="font-semibold text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:text-muted-foreground cursor-pointer"
        >
          {resending
            ? "Sending new code…"
            : cooldown > 0
              ? `Resend code in ${cooldown}s`
              : "Resend code"}
        </button>
      </div>
    </form>
  );
}

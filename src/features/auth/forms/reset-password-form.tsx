"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LockIcon } from "@/components/icons";
import { PasswordField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { authApi } from "@/features/auth/api/auth-api";
import { ApiError } from "@/types/api";

function scorePassword(value: string) {
  let score = 0;
  if (value.length >= 6) score++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score; // 0–4
}

const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = [
  "bg-muted",
  "bg-destructive",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-primary",
];

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  email: string;
  otp: string;
}

export function ResetPasswordForm({ email, otp }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const passwordValue = useWatch({ control, name: "password" }) || "";
  const score = scorePassword(passwordValue);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!email || !otp) {
      setError("root.serverError", {
        type: "server",
        message:
          "Missing email or OTP verification code. Please request a new code.",
      });
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(
        email,
        otp,
        data.password,
        data.password_confirmation
      );
      toast.success("Password has been reset successfully! Please sign in.");
      router.push("/login");
    } catch (e: unknown) {
      if (
        e instanceof ApiError &&
        e.responseData &&
        typeof e.responseData === "object"
      ) {
        const rawResponse = e.responseData as Record<string, unknown>;
        const nestedData =
          rawResponse.data && typeof rawResponse.data === "object"
            ? (rawResponse.data as Record<string, unknown>)
            : null;
        const serverErrors = (rawResponse.errors ?? nestedData?.errors) as
          | Record<string, string[]>
          | undefined;

        if (serverErrors && typeof serverErrors === "object") {
          let hasFieldErrors = false;
          if (serverErrors.password?.[0]) {
            setError("password", {
              type: "server",
              message: serverErrors.password[0],
            });
            hasFieldErrors = true;
          }
          if (serverErrors.password_confirmation?.[0]) {
            setError("password_confirmation", {
              type: "server",
              message: serverErrors.password_confirmation[0],
            });
            hasFieldErrors = true;
          }

          if (!hasFieldErrors && (serverErrors.otp?.[0] || serverErrors.email?.[0])) {
            setError("root.serverError", {
              type: "server",
              message: serverErrors.otp?.[0] ?? serverErrors.email?.[0],
            });
            return;
          }

          if (hasFieldErrors) {
            return;
          }
        }

        setError("root.serverError", {
          type: "server",
          message: e.message || "Failed to reset password.",
        });
      } else {
        setError("root.serverError", {
          type: "server",
          message: "Failed to reset password. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5"
      noValidate
    >
      {errors.root?.serverError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errors.root.serverError.message}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <PasswordField
          label="New Password"
          autoComplete="new-password"
          placeholder="Create a new password"
          icon={<LockIcon className="h-full w-full" />}
          {...register("password")}
          error={errors.password?.message}
        />
        {passwordValue ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < score ? strengthColors[score] : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Password strength:{" "}
              <span className="font-medium text-foreground">
                {strengthLabels[score]}
              </span>
            </p>
          </div>
        ) : null}
      </div>

      <PasswordField
        label="Confirm New Password"
        autoComplete="new-password"
        placeholder="Confirm your new password"
        icon={<LockIcon className="h-full w-full" />}
        {...register("password_confirmation")}
        error={errors.password_confirmation?.message}
      />

      <SubmitButton loading={loading} disabled={!email || !otp}>
        {loading ? "Resetting password…" : "Reset password"}
      </SubmitButton>
    </form>
  );
}

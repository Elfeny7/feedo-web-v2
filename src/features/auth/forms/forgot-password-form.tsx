"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MailIcon } from "@/components/icons";
import { TextField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { authApi } from "@/features/auth/api/auth-api";
import { ApiError } from "@/types/api";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email format."),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      await authApi.forgotPassword(data.email);
      toast.success("Verification code sent to your email.");
      router.push(
        `/otp?email=${encodeURIComponent(data.email)}&type=reset_password`
      );
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

        if (serverErrors?.email?.[0]) {
          setError("email", {
            type: "server",
            message: serverErrors.email[0],
          });
          return;
        }

        setError("root.serverError", {
          type: "server",
          message: e.message || "Failed to send reset code.",
        });
      } else {
        setError("root.serverError", {
          type: "server",
          message: "Failed to send reset code. Please try again.",
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

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="your@email.com"
        icon={<MailIcon className="h-full w-full" />}
        {...register("email")}
        error={errors.email?.message}
      />

      <SubmitButton loading={loading}>
        {loading ? "Sending code…" : "Send verification code"}
      </SubmitButton>
    </form>
  );
}

"use client";

import { useState } from "react";
import { MailIcon, LockIcon, UserIcon, AtSignIcon } from "@/components/icons";
import { TextField, PasswordField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { authApi } from "@/features/auth/api/auth-api";
import { ApiError } from "@/types/api";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

function scorePassword(value: string) {
    let score = 0;
    if (value.length >= 8) score++;
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

const registerSchema = z.object({
    name: z.string().min(1, "Full name is required."),
    email: z.string().min(1, "Email is required.").email("Invalid email format."),
    handle: z.string().min(1, "Handle is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    password_confirmation: z.string(),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must accept the Terms of Service.",
    }),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match.",
    path: ["password_confirmation"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        setError,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            handle: "",
            password: "",
            password_confirmation: "",
            terms: false,
        },
    });

    const passwordValue = useWatch({ control, name: "password" }) || "";
    const score = scorePassword(passwordValue);

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        try {
            await authApi.register(
                data.name,
                data.email,
                data.handle,
                data.password,
                data.password_confirmation
            );
            toast.success("Account created! Please verify the OTP sent to your email.");
            router.push(`/otp?email=${encodeURIComponent(data.email)}`);
        } catch (e: unknown) {
            if (e instanceof ApiError && e.responseData && typeof e.responseData === "object") {
                const rawResponse = e.responseData as Record<string, unknown>;
                const nestedData =
                    rawResponse.data && typeof rawResponse.data === "object"
                        ? (rawResponse.data as Record<string, unknown>)
                        : null;
                const serverErrors = (rawResponse.errors ?? nestedData?.errors) as
                    | Record<string, string[]>
                    | undefined;

                if (serverErrors && typeof serverErrors === "object") {
                    Object.keys(serverErrors).forEach((key) => {
                        const fieldMessages = serverErrors[key];
                        if (Array.isArray(fieldMessages) && fieldMessages.length > 0) {
                            setError(key as keyof RegisterFormValues, {
                                type: "server",
                                message: fieldMessages[0],
                            });
                        }
                    });
                    toast.error("Please fix the errors in the form.");
                    return;
                }

                toast.error(e.message || "Failed to create account.");
            } else {
                toast.error("Failed to create account.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            <TextField
                label="Full name"
                type="text"
                autoComplete="name"
                placeholder="Your Name"
                icon={<UserIcon className="h-full w-full" />}
                {...register("name")}
                error={errors.name?.message}
            />

            <TextField
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                icon={<MailIcon className="h-full w-full" />}
                {...register("email")}
                error={errors.email?.message}
            />

            <TextField
                label="Handle"
                type="text"
                autoComplete="username"
                placeholder="username"
                icon={<AtSignIcon className="h-full w-full" />}
                {...register("handle")}
                error={errors.handle?.message}
            />

            <div className="flex flex-col gap-2">
                <PasswordField
                    label="Password"
                    autoComplete="new-password"
                    placeholder="Create a password"
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
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${i < score ? strengthColors[score] : "bg-muted"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Password strength:{" "}
                            <span className="font-medium text-foreground">{strengthLabels[score]}</span>
                        </p>
                    </div>
                ) : null}
            </div>

            <PasswordField
                label="Confirm Password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                icon={<LockIcon className="h-full w-full" />}
                {...register("password_confirmation")}
                error={errors.password_confirmation?.message}
            />

            <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <input
                    type="checkbox"
                    {...register("terms")}
                    className={`mt-0.5 h-4 w-4 rounded border-input text-primary accent-primary focus:ring-ring ${errors.terms ? "border-destructive focus:ring-destructive/25" : ""
                        }`}
                />
                <div className="flex flex-col gap-1">
                    <span>
                        I agree to the{" "}
                        <a href="#" className="font-medium text-primary hover:text-primary/80">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="font-medium text-primary hover:text-primary/80">
                            Privacy Policy
                        </a>
                        .
                    </span>
                    {errors.terms && <span className="text-xs text-destructive">{errors.terms.message}</span>}
                </div>
            </label>

            <SubmitButton loading={loading}>
                {loading ? "Creating account…" : "Create account"}
            </SubmitButton>
        </form>
    );
}

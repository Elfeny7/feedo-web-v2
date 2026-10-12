"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailIcon, LockIcon } from "@/components/icons";
import { TextField, PasswordField } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "@/lib/fetcher";
import { ApiError } from "@/types/api";
import Link from "next/link";
import * as z from "zod";

const loginSchema = z.object({
    email: z.email().min(1, "Email is required."),
    password: z.string().min(1, "Password is required.")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true);
        try {
            await client.post("/api/auth/login", { email: data.email, password: data.password });
            router.push("/home");
            router.refresh();
        } catch (err) {
            setError("root.serverError", {
                type: "server",
                message: err instanceof ApiError ? err.message : "An error occurred during login.",
            });
        } finally {
            setLoading(false);  
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
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

            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Password</span>
                    <Link
                        href="/reset-password"
                        className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                        Forgot password?
                    </Link>
                </div>
                <PasswordField
                    label=""
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    icon={<LockIcon className="h-full w-full" />}
                    className="[&]:mt-0"
                    {...register("password")}
                    error={errors.password?.message}
                />
            </div>

            <SubmitButton loading={loading}>{loading ? "Signing in…" : "Sign in"}</SubmitButton>
        </form>
    );
}
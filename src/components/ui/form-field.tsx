"use client";

import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  hint?: string;
  error?: string;
};

const baseInput =
  "w-full rounded-md border border-input bg-card py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60";

export const TextField = forwardRef<HTMLInputElement, FieldProps>(function TextField(
  { label, icon, hint, error, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <span className="block h-4.5 w-4.5">{icon}</span>
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`${baseInput} ${icon ? "pl-10" : "pl-3.5"} pr-3.5 ${
            error ? "border-destructive focus:border-destructive focus:ring-destructive/25" : ""
          } ${className ?? ""}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
});

export const PasswordField = forwardRef<HTMLInputElement, FieldProps>(function PasswordField(
  { label, icon, hint, error, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <span className="block h-4.5 w-4.5">{icon}</span>
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type={visible ? "text" : "password"}
          className={`${baseInput} ${icon ? "pl-10" : "pl-3.5"} pr-10 ${
            error ? "border-destructive focus:border-destructive focus:ring-destructive/25" : ""
          } ${className ?? ""}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOffIcon className="h-4.5 w-4.5" />
          ) : (
            <EyeIcon className="h-4.5 w-4.5" />
          )}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
});

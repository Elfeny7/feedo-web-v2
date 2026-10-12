import type { ButtonHTMLAttributes } from "react";
import { SpinnerIcon } from "@/components/icons";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function SubmitButton({ loading, children, className, disabled, ...props }: Props) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ""}`}
      {...props}
    >
      {loading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

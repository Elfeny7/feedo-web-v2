import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ComposeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  children?: ReactNode;
}

export function ComposeButton({
  text,
  children,
  className,
  type = "button",
  ...props
}: ComposeButtonProps) {
  return (
    <button
      type={type}
      className={`bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-full shadow-md shadow-primary/20 transition-all active:scale-95 text-sm cursor-pointer ${className ?? ""}`}
      {...props}
    >
      {text ?? children}
    </button>
  );
}

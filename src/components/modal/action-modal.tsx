"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect } from "react";
import { XIcon } from "@/components/icons";

export interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  buttonLayout?: "vertical" | "horizontal";
  closeLabel?: string;
  children?: ReactNode;
}

export function ActionModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  actions,
  buttonLayout = "vertical",
  closeLabel = "Close modal",
  children,
}: ActionModalProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-label={closeLabel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-modal-title"
        className="relative z-10 flex w-full max-w-md flex-col items-center rounded-3xl border border-border bg-card p-6 text-center shadow-2xl transition-all animate-in zoom-in-95 duration-200 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={closeLabel}
        >
          <XIcon className="h-5 w-5" />
        </button>

        {icon}
        <h2 id="action-modal-title" className="mb-2.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <div className="mb-8 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {description}
          </div>
        ) : null}
        {children}
        {actions ? (
          <div className={`flex w-full gap-3 ${buttonLayout === "horizontal" ? "flex-row" : "flex-col"}`}>
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}

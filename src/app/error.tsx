"use client";

import { useEffect } from "react";
import Link from "next/link";
import { XIcon } from "@/components/icons";

export default function ErrorPage({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRetry = () => {
    if (retry) {
      retry();
    } else {
      reset();
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-background text-foreground flex flex-col items-center justify-center p-6 overflow-y-auto selection:bg-primary/30">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-xl text-center flex flex-col items-center">
        {/* Brand Logo */}
        <Link
          href="/home"
          className="flex items-center gap-2.5 mb-8 transition-opacity hover:opacity-80"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20 text-primary-foreground font-bold text-lg">
            F
          </div>
          <span className="text-xl font-black tracking-tighter">feedo.</span>
        </Link>

        {/* Error Visual Badge */}
        <div className="mb-6 w-20 h-20 rounded-full bg-destructive/10 text-destructive flex items-center justify-center ring-8 ring-destructive/5">
          <XIcon className="w-9 h-9" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5">
          Something went wrong!
        </h1>
        <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed mb-8">
          An unexpected error occurred while loading this page. Please try again
          or return to the home feed.
        </p>

        <div className="flex flex-col sm:flex-row w-full gap-3">
          <Link
            href="/home"
            className="w-full flex items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted"
          >
            Back to Home
          </Link>
          <button
            type="button"
            onClick={handleRetry}
            className="w-full flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

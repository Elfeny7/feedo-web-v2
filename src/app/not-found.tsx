"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, SearchIcon } from "@/components/icons";

export default function NotFound() {
  const router = useRouter();

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

        {/* 404 Visual Badge */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-8 ring-primary/5">
            <SearchIcon className="w-9 h-9" />
          </div>
          <span className="absolute -bottom-2 bg-foreground text-background text-xs font-extrabold px-2.5 py-0.5 rounded-full tracking-wider">
            404
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5">
          Page not found
        </h1>
        <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed mb-8">
          Hmm... this page doesn&apos;t exist. The link you followed may be
          broken, or the account or post may have been removed.
        </p>

        <div className="flex flex-col sm:flex-row w-full gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-muted cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            href="/home"
            className="w-full flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

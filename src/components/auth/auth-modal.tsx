"use client";

import { useEffect, useCallback } from "react";
import Link from "next/link";
import { HeartIcon, LockIcon, UserIcon, XIcon } from "@/components/icons";

export type AuthModalAction = "like" | "follow" | "post" | "custom";

export interface AuthModalProps {
  /** Menentukan apakah modal sedang terbuka */
  isOpen: boolean;
  /** Callback saat modal ditutup */
  onClose: () => void;
  /** Tipe aksi yang memicu modal: like, follow, post, atau custom */
  action?: AuthModalAction;
  /** Nama entitas target (misal nama user yang di-follow / pemilik post) */
  targetName?: string;
  /** Judul kustom (opsional) */
  title?: string;
  /** Deskripsi kustom (opsional) */
  description?: string;
  /** URL redirect setelah login (default: URL halaman aktif) */
  redirectUrl?: string;
}

/**
 * Komponen AuthModal
 * 
 * Dialog pop-up interaktif dinamis yang muncul ketika pengunjung belum login (guest)
 * mencoba melakukan aksi terotentikasi seperti menyukai postingan (Like) atau mengikuti akun (Follow).
 */
export function AuthModal({
  isOpen,
  onClose,
  action = "like",
  targetName,
  title,
  description,
  redirectUrl,
}: AuthModalProps) {
  // Menangani penutupan modal saat menekan tombol ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  // Konfigurasi konten dinamis berdasarkan aksi
  let defaultTitle = "Join Feedo today";
  let defaultDescription = "Log in or sign up to interact with posts and follow your favorite creators.";
  let iconElement = (
    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 ring-8 ring-primary/5">
      <LockIcon className="w-7 h-7" />
    </div>
  );

  if (action === "like") {
    defaultTitle = "Like this post to show love";
    defaultDescription = targetName
      ? `Join Feedo to let ${targetName} know you liked their post, and join the conversation.`
      : "Join Feedo to like posts, reply, and connect with creators you care about.";
    iconElement = (
      <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-5 ring-8 ring-destructive/5">
        <HeartIcon className="w-7 h-7" filled />
      </div>
    );
  } else if (action === "follow") {
    defaultTitle = targetName ? `Follow ${targetName}` : "Follow creators";
    defaultDescription = targetName
      ? `Don't miss any updates from ${targetName}. Log in or create an account to start following.`
      : "Stay updated with your favorite creators by logging in to follow them.";
    iconElement = (
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 ring-8 ring-primary/5">
        <UserIcon className="w-7 h-7" />
      </div>
    );
  }

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;

  // Membuat URL login & register dengan redirect jika disediakan
  const loginHref = redirectUrl
    ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
    : "/login";
  const registerHref = redirectUrl
    ? `/register?redirect=${encodeURIComponent(redirectUrl)}`
    : "/register";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Backdrop dengan efek blur */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 flex flex-col items-center text-center transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Tombol Tutup (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {/* Icon Dinamis */}
        {iconElement}

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2.5">
          {finalTitle}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">
          {finalDescription}
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href={loginHref}
            className="w-full py-3 px-4 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 transition-all text-center cursor-pointer shadow-sm"
          >
            Log In
          </Link>
          <Link
            href={registerHref}
            className="w-full py-3 px-4 rounded-full border border-border text-foreground font-bold text-sm hover:bg-muted transition-all text-center cursor-pointer"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

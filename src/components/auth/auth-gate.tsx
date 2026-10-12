"use client";

import Link from "next/link";
import { LockIcon } from "@/components/icons";

export interface AuthGateProps {
  /** Judul ajakan login */
  title?: string;
  /** Penjelasan tambahan mengapa pengguna harus login */
  description?: string;
  /** URL tujuan login (mendukung parameter redirect jika diperlukan) */
  loginUrl?: string;
  /** URL tujuan pendaftaran akun */
  registerUrl?: string;
  /** Label untuk tombol login */
  loginLabel?: string;
  /** Label untuk tombol register (opsional) */
  registerLabel?: string;
  /** Kelas CSS kustom tambahan */
  className?: string;
}

/**
 * Komponen AuthGate
 * 
 * Menampilkan pesan dan tombol ajakan login bagi pengguna tamu (guest)
 * yang ingin melihat konten lebih lanjut atau berinteraksi lebih jauh.
 */
export function AuthGate({
  title = "Log in to see more posts",
  description = "Join Feedo to view full profiles, like posts, and connect with the community.",
  loginUrl = "/login",
  registerUrl = "/register",
  loginLabel = "Log In",
  registerLabel = "Sign Up",
  className = "",
}: AuthGateProps) {
  return (
    <div
      className={`p-6 sm:p-8 my-6 mx-4 rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-sm text-center flex flex-col items-center justify-center transition-all ${className}`}
    >
      {/* Icon Badge */}
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 ring-8 ring-primary/5">
        <LockIcon className="w-6 h-6" />
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Link
          href={loginUrl}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center text-center cursor-pointer"
        >
          {loginLabel}
        </Link>
        {registerUrl && (
          <Link
            href={registerUrl}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-border text-foreground font-semibold text-sm hover:bg-muted transition-all flex items-center justify-center text-center cursor-pointer"
          >
            {registerLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

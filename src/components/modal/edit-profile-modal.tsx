"use client";

import { useEffect, useCallback, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { XIcon } from "@/components/icons";
import { toast } from "react-hot-toast";
import { api, ApiError } from "@/lib/fetcher";

export interface EditProfileModalProps {
  /** Menentukan apakah modal sedang terbuka */
  isOpen: boolean;
  /** Callback saat modal ditutup */
  onClose: () => void;
  /** Callback setelah profil berhasil disimpan (untuk revalidasi data & update session) */
  onSuccess?: (data: { name: string; bio: string }) => void;
  /** Data awal profil yang akan diedit */
  initialData?: {
    name?: string;
    bio?: string;
    handle?: string;
    avatar?: string;
  };
}

/**
 * Komponen `EditProfileModal`
 * 
 * Dialog pop-up responsif untuk mengedit informasi profil publik (Nama, Bio, Cover, & Avatar).
 * Menggunakan prinsip Controlled Components dengan penghitung karakter dan animasi interaktif.
 */
function EditProfileModalContent({
  onClose,
  onSuccess,
  initialData,
}: {
  onClose: () => void;
  onSuccess?: (data: { name: string; bio: string }) => void;
  initialData?: EditProfileModalProps["initialData"];
}) {
  // State form lokal diinisialisasi langsung dari initialData saat modal dimount
  const [name, setName] = useState(initialData?.name || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [isSaving, setIsSaving] = useState(false);

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
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      await api.put("/users/update-profile", null, { name, bio });
      toast.success("Profile updated successfully!");
      onSuccess?.({ name, bio });
      onClose();
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        toast.error(e.message || "Failed to update profile.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      {/* Backdrop dengan efek blur */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
        className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-xl bg-card border-0 sm:border border-border sm:rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-card/90 border-b border-border px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={onClose}
              className="p-2 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <h2 id="edit-profile-title" className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Edit profile
            </h2>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || isSaving}
            className="px-5 py-1.5 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm min-w-[72px] flex items-center justify-center"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving
              </span>
            ) : (
              "Save"
            )}
          </button>
        </header>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
          {/* Header / Cover Image Area */}
          <div className="h-32 sm:h-44 bg-gradient-to-r from-teal-500 to-emerald-400 w-full relative flex items-center justify-center group">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <button
              type="button"
              className="relative p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all active:scale-95 cursor-pointer shadow-md"
              title="Change header photo"
              aria-label="Change header photo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Profile Photo Area */}
          <div className="px-4 sm:px-6 relative pb-6 border-b border-border/50">
            <div className="relative -mt-12 sm:-mt-16 inline-block">
              <div className="relative group rounded-full">
                <Avatar
                  name={name || initialData?.name || "?"}
                  className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-card text-3xl sm:text-4xl shadow-md bg-muted"
                />
                <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center">
                  <button
                    type="button"
                    className="p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
                    title="Change profile photo"
                    aria-label="Change profile photo"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="p-4 sm:p-6 flex flex-col gap-6">
            {/* Name Input */}
            <div className="flex flex-col gap-1.5">
              <div className="relative rounded-2xl border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-background/50 transition-all p-3">
                <div className="flex justify-between text-xs text-muted-foreground font-medium mb-1">
                  <label htmlFor="edit-name">Name</label>
                  <span>{name.length} / 50</span>
                </div>
                <input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  placeholder="Your display name"
                  className="w-full bg-transparent text-foreground outline-none text-base font-normal placeholder:text-muted-foreground/60"
                  required
                />
              </div>
            </div>

            {/* Bio Textarea */}
            <div className="flex flex-col gap-1.5">
              <div className="relative rounded-2xl border border-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 bg-background/50 transition-all p-3">
                <div className="flex justify-between text-xs text-muted-foreground font-medium mb-1">
                  <label htmlFor="edit-bio">Bio</label>
                  <span>{bio.length} / 160</span>
                </div>
                <textarea
                  id="edit-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={160}
                  rows={3}
                  placeholder="Tell the world about yourself"
                  className="w-full bg-transparent text-foreground outline-none text-base font-normal placeholder:text-muted-foreground/60 resize-none"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditProfileModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <EditProfileModalContent
      key={initialData?.handle || "edit-profile"}
      onClose={onClose}
      onSuccess={onSuccess}
      initialData={initialData}
    />
  );
}


"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { XIcon, CameraIcon, TrashIcon } from "@/components/icons";
import { toast } from "react-hot-toast";
import { ApiError } from "@/types/api";
import { UserData } from "@/types/auth";
import { useUpdateProfile } from "@/features/profile/hooks/use-update-profile";
import {
  ImageCropperModal,
  CropMode,
} from "@/features/profile/components/image-cropper-modal";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_BANNER_BYTES = 4 * 1024 * 1024; // 4 MB

export interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: UserData;
}

function EditProfileModalContent({
  onClose,
  initialData,
}: {
  onClose: () => void;
  initialData: EditProfileModalProps["initialData"];
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [bio, setBio] = useState(initialData?.bio || "");

  // Avatar & Banner file + preview states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar ?? null
  );
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    initialData?.banner ?? null
  );
  const [removeBanner, setRemoveBanner] = useState(false);

  // Cropper Modal State
  const [cropperState, setCropperState] = useState<{
    isOpen: boolean;
    imageSrc: string | null;
    mode: CropMode;
  }>({
    isOpen: false,
    imageSrc: null,
    mode: "avatar",
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  const { mutateAsync: updateProfileAsync, isPending: isSaving } =
    useUpdateProfile(initialData.handle);

  const registerObjectUrl = (url: string) => {
    objectUrlsRef.current.push(url);
    return url;
  };

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !cropperState.isOpen) {
        onClose();
      }
    },
    [onClose, cropperState.isOpen]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: CropMode
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please select a valid JPG, PNG, or WEBP image.");
      return;
    }

    const maxBytes = mode === "avatar" ? MAX_AVATAR_BYTES : MAX_BANNER_BYTES;
    const maxLabel = mode === "avatar" ? "2MB" : "4MB";
    if (file.size > maxBytes * 2.5) {
      // Allow slightly larger raw file before cropping, block extremely huge files
      toast.error(`Selected image is too large (max ${maxLabel}).`);
      return;
    }

    const rawUrl = registerObjectUrl(URL.createObjectURL(file));
    setCropperState({
      isOpen: true,
      imageSrc: rawUrl,
      mode,
    });
  };

  const handleApplyCrop = (croppedFile: File, previewUrl: string) => {
    registerObjectUrl(previewUrl);

    if (cropperState.mode === "avatar") {
      if (croppedFile.size > MAX_AVATAR_BYTES) {
        toast.error("Cropped avatar exceeds the 2MB limit.");
        return;
      }
      setAvatarFile(croppedFile);
      setAvatarPreview(previewUrl);
      setRemoveAvatar(false);
    } else {
      if (croppedFile.size > MAX_BANNER_BYTES) {
        toast.error("Cropped banner exceeds the 4MB limit.");
        return;
      }
      setBannerFile(croppedFile);
      setBannerPreview(previewUrl);
      setRemoveBanner(false);
    }

    setCropperState((prev) => ({ ...prev, isOpen: false, imageSrc: null }));
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  const handleRemoveBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
    setRemoveBanner(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving || !name.trim()) return;

    try {
      await updateProfileAsync({
        name: name.trim(),
        bio,
        avatar: avatarFile,
        banner: bannerFile,
        remove_avatar: removeAvatar,
        remove_banner: removeBanner,
      });
      toast.success("Profile updated successfully!");
      onClose();
    } catch (e: unknown) {
      if (e instanceof ApiError) {
        toast.error(e.message || "Failed to update profile.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
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
              <h2
                id="edit-profile-title"
                className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
              >
                Edit profile
              </h2>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="px-5 py-1.5 rounded-full bg-foreground text-background font-bold text-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm min-w-18 flex items-center justify-center"
            >
              {isSaving ? (
                <span className="flex items-center gap-1.5">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Saving
                </span>
              ) : (
                "Save"
              )}
            </button>
          </header>

          {/* Hidden File Inputs */}
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileSelect(e, "banner")}
            className="hidden"
          />
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => handleFileSelect(e, "avatar")}
            className="hidden"
          />

          {/* Modal Scrollable Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto">
            {/* Header / Cover Image Area */}
            <div className="h-36 sm:h-48 bg-linear-to-r from-teal-500 to-emerald-400 w-full relative flex items-center justify-center group overflow-hidden">
              {bannerPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={bannerPreview}
                  alt="Profile banner preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />

              <div className="relative flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="p-3 rounded-full bg-black/55 hover:bg-black/75 text-white backdrop-blur-sm transition-all active:scale-95 cursor-pointer shadow-md"
                  title="Change header photo"
                  aria-label="Change header photo"
                >
                  <CameraIcon className="w-5 h-5" />
                </button>

                {bannerPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="p-3 rounded-full bg-black/55 hover:bg-destructive text-white backdrop-blur-sm transition-all active:scale-95 cursor-pointer shadow-md"
                    title="Remove header photo"
                    aria-label="Remove header photo"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Profile Photo Area */}
            <div className="px-4 sm:px-6 relative pb-6 border-b border-border/50 flex items-end justify-between">
              <div className="relative -mt-12 sm:-mt-16 inline-block">
                <div className="relative group rounded-full">
                  <Avatar
                    name={name || initialData?.name || "?"}
                    imageUrl={avatarPreview}
                    className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-card text-3xl sm:text-4xl shadow-md bg-muted"
                  />
                  <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="p-2.5 rounded-full bg-black/55 hover:bg-black/75 text-white backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
                      title="Change profile photo"
                      aria-label="Change profile photo"
                    >
                      <CameraIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                  <span>Remove photo</span>
                </button>
              )}
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

      {/* Interactive Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperState.isOpen}
        imageSrc={cropperState.imageSrc}
        mode={cropperState.mode}
        onClose={() =>
          setCropperState((prev) => ({ ...prev, isOpen: false, imageSrc: null }))
        }
        onApply={handleApplyCrop}
      />
    </>
  );
}

export function EditProfileModal({
  isOpen,
  onClose,
  initialData,
}: EditProfileModalProps) {
  if (!isOpen) return null;

  return (
    <EditProfileModalContent
      key={initialData?.handle}
      onClose={onClose}
      initialData={initialData}
    />
  );
}

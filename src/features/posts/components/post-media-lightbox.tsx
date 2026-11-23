"use client";

import { useEffect, useCallback } from "react";
import type { PostMediaData } from "@/types/post";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "@/components/icons";

interface PostMediaLightboxProps {
  media: PostMediaData[];
  activeIndex: number | null;
  onClose: () => void;
  onChangeIndex: (newIndex: number) => void;
}

export function PostMediaLightbox({
  media,
  activeIndex,
  onClose,
  onChangeIndex,
}: PostMediaLightboxProps) {
  const isOpen = activeIndex !== null && media.length > 0;
  const currentIndex = activeIndex ?? 0;

  const handlePrev = useCallback(() => {
    if (media.length <= 1) return;
    onChangeIndex((currentIndex - 1 + media.length) % media.length);
  }, [currentIndex, media.length, onChangeIndex]);

  const handleNext = useCallback(() => {
    if (media.length <= 1) return;
    onChangeIndex((currentIndex + 1) % media.length);
  }, [currentIndex, media.length, onChangeIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen) return null;

  const currentMedia = media[currentIndex];
  if (!currentMedia) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="fixed inset-0 z-100 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150"
    >
      {/* Top Bar: Close Button & Counter */}
      <div className="fixed top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
          aria-label="Close preview"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {media.length > 1 && (
          <span className="pointer-events-auto px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold tracking-wider">
            {currentIndex + 1} / {media.length}
          </span>
        )}
      </div>

      {/* Previous Button */}
      {media.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all active:scale-95 cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {/* Main Image */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl max-h-[88vh] flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentMedia.url}
          alt={`Post media ${currentIndex + 1}`}
          className="max-w-full max-h-[88vh] object-contain rounded-xl shadow-2xl"
        />
      </div>

      {/* Next Button */}
      {media.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all active:scale-95 cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

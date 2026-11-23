"use client";

import { useState } from "react";
import type { PostMediaData } from "@/types/post";
import { PostMediaLightbox } from "./post-media-lightbox";

interface PostMediaGridProps {
  media?: PostMediaData[];
}

export function PostMediaGrid({ media }: PostMediaGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  const sortedMedia = [...media]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .slice(0, 4);

  const count = sortedMedia.length;

  const handleOpen = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveIndex(index);
  };

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`mt-2.5 overflow-hidden rounded-2xl border border-border bg-muted/40 ${
          count === 1
            ? "max-h-96 flex items-center justify-center"
            : count === 2
              ? "grid grid-cols-2 gap-0.5 aspect-16/10"
              : count === 3
                ? "grid grid-cols-2 grid-rows-2 gap-0.5 aspect-16/10"
                : "grid grid-cols-2 grid-rows-2 gap-0.5 aspect-16/10"
        }`}
      >
        {sortedMedia.map((item, idx) => {
          const isThreeFirst = count === 3 && idx === 0;

          return (
            <div
              key={item.id ?? idx}
              onClick={(e) => handleOpen(e, idx)}
              className={`relative overflow-hidden cursor-zoom-in group ${
                count === 1
                  ? "w-full max-h-96"
                  : isThreeFirst
                    ? "row-span-2 w-full h-full"
                    : "w-full h-full"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={`Attachment ${idx + 1}`}
                loading="lazy"
                className={`w-full transition-transform duration-200 group-hover:scale-[1.02] ${
                  count === 1 ? "max-h-96 object-cover" : "h-full object-cover"
                }`}
              />
            </div>
          );
        })}
      </div>

      <PostMediaLightbox
        media={sortedMedia}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onChangeIndex={setActiveIndex}
      />
    </>
  );
}

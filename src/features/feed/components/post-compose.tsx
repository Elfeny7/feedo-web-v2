"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar } from "@/components/ui/avatar";
import { ComposeButton } from "@/components/ui/compose-button";
import { ImageIcon, ProgressRingIcon, XIcon } from "@/components/icons";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useCreatePost } from "@/features/posts/hooks/use-create-post";
import { ApiError } from "@/types/api";

const MAX_POST_LENGTH = 100;
const MAX_MEDIA_FILES = 4;
const MAX_MEDIA_BYTES = 3 * 1024 * 1024; // 3 MB (3072 KB)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type SelectedMediaItem = {
  id: string;
  file: File;
  previewUrl: string;
};

export function PostCompose() {
  const { data: user } = useCurrentUser();
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost();

  const [postContent, setPostContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<SelectedMediaItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const remainingSlots = MAX_MEDIA_FILES - selectedMedia.length;
    if (remainingSlots <= 0) {
      toast.error(`You can attach up to ${MAX_MEDIA_FILES} images per post.`);
      return;
    }

    if (files.length > remainingSlots) {
      toast.error(`You can only add ${remainingSlots} more image(s) (max ${MAX_MEDIA_FILES}).`);
    }

    const filesToProcess = files.slice(0, remainingSlots);
    const validItems: SelectedMediaItem[] = [];

    for (const file of filesToProcess) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" is not a valid JPG, PNG, or WEBP image.`);
        continue;
      }
      if (file.size > MAX_MEDIA_BYTES) {
        toast.error(`"${file.name}" exceeds the 3MB size limit.`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      objectUrlsRef.current.push(previewUrl);
      validItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl,
      });
    }

    if (validItems.length > 0) {
      setSelectedMedia((prev) => [...prev, ...validItems]);
    }
  };

  const handleRemoveMedia = (id: string) => {
    setSelectedMedia((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const canSubmit =
    (postContent.trim().length > 0 || selectedMedia.length > 0) &&
    postContent.length <= MAX_POST_LENGTH &&
    !isCreatePostPending;

  const showToolbar =
    isFocused || postContent.length > 0 || selectedMedia.length > 0;

  const handlePost = () => {
    if (!canSubmit) return;

    createPost(
      {
        content: postContent.trim() || null,
        media: selectedMedia.map((item) => item.file),
      },
      {
        onSuccess: () => {
          setPostContent("");
          selectedMedia.forEach((item) => URL.revokeObjectURL(item.previewUrl));
          setSelectedMedia([]);
          setIsFocused(false);
          if (textareaRef.current) {
            textareaRef.current.style.height = "40px";
          }
        },
        onError: (err) => {
          toast.error(
            err instanceof ApiError
              ? err.message || "Failed to create post."
              : "Failed to create post. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="p-4 sm:px-6 border-b border-border flex gap-4">
      <Avatar name={user?.name} imageUrl={user?.avatar} />
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <textarea
          ref={textareaRef}
          value={postContent}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={MAX_POST_LENGTH}
          placeholder="What is happening?!"
          className="w-full bg-transparent resize-none outline-none text-xl placeholder:text-muted-foreground pt-2 min-h-10 overflow-hidden"
          style={{ height: "40px" }}
        />

        {/* Selected Media Previews */}
        {selectedMedia.length > 0 && (
          <div
            className={`grid gap-2 overflow-hidden rounded-2xl ${
              selectedMedia.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {selectedMedia.map((item) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-2xl border border-border bg-muted/40 ${
                  selectedMedia.length === 1 ? "max-h-72" : "aspect-16/10"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(item.id)}
                  disabled={isCreatePostPending}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/65 hover:bg-black/85 text-white backdrop-blur-xs transition-colors cursor-pointer shadow-sm"
                  aria-label="Remove image"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFilesChange}
          className="hidden"
        />

        {showToolbar && (
          <div className="flex items-center justify-between pt-2 border-t border-border mt-1">
            {/* Media Attachment Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                disabled={
                  selectedMedia.length >= MAX_MEDIA_FILES || isCreatePostPending
                }
                className="p-2 -ml-2 rounded-full text-primary hover:bg-primary/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Add photos (up to 4)"
                aria-label="Add photos"
              >
                <ImageIcon className="w-5 h-5" />
                {selectedMedia.length > 0 && (
                  <span>
                    {selectedMedia.length}/{MAX_MEDIA_FILES}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4">
              {postContent.length > 0 && (
                <div className="relative flex items-center justify-center w-8 h-8">
                  <ProgressRingIcon
                    className="w-full h-full"
                    progress={postContent.length / MAX_POST_LENGTH}
                    variant={
                      postContent.length >= MAX_POST_LENGTH
                        ? "danger"
                        : postContent.length >= 80
                          ? "warning"
                          : "default"
                    }
                  />
                  {MAX_POST_LENGTH - postContent.length <= 20 && (
                    <span
                      className={`absolute text-[10px] font-bold ${
                        postContent.length >= MAX_POST_LENGTH
                          ? "text-destructive"
                          : "text-yellow-500"
                      }`}
                    >
                      {MAX_POST_LENGTH - postContent.length}
                    </span>
                  )}
                </div>
              )}

              <ComposeButton
                onClick={handlePost}
                disabled={!canSubmit}
                text={isCreatePostPending ? "Posting..." : "Post"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

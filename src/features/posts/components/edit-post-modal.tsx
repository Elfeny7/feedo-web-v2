"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import type { PostData } from "@/types/post";
import { Avatar } from "@/components/ui/avatar";
import { ComposeButton } from "@/components/ui/compose-button";
import { ProgressRingIcon, XIcon } from "@/components/icons";

const MAX_POST_LENGTH = 100;

export interface EditPostModalProps {
  isOpen: boolean;
  post: PostData | null;
  onClose: () => void;
  onSave?: (postId: number, content: string) => void;
  isPending?: boolean;
}

function EditPostModalContent({
  post,
  onClose,
  onSave,
  isPending = false,
}: {
  post: PostData;
  onClose: () => void;
  onSave?: (postId: number, content: string) => void;
  isPending?: boolean;
}) {
  const [content, setContent] = useState(post.content ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasMedia = Boolean(post.media && post.media.length > 0);
  const initialTrimmed = (post.content ?? "").trim();
  const currentTrimmed = content.trim();

  const canSave =
    (currentTrimmed.length > 0 || hasMedia) &&
    content.length <= MAX_POST_LENGTH &&
    currentTrimmed !== initialTrimmed &&
    !isPending;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) {
        onClose();
      }
    },
    [onClose, isPending]
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    if (onSave) {
      onSave(post.id, currentTrimmed);
    } else {
      toast.success("Post updated!");
      onClose();
    }
  };

  const sortedMedia = post.media
    ? [...post.media]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .slice(0, 4)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => !isPending && onClose()}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-post-title"
        className="relative z-10 w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <header className="px-4 py-3 sm:px-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="p-2 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close modal"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <h2
              id="edit-post-title"
              className="text-lg sm:text-xl font-bold tracking-tight text-foreground"
            >
              Edit post
            </h2>
          </div>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <Avatar
              name={post.user.name}
              imageUrl={post.user.avatar}
              className="w-11 h-11 shrink-0"
            />
            <div className="flex-1 flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[15px] text-foreground">
                  {post.user.name}
                </span>
                <span className="text-muted-foreground text-sm">
                  @{post.user.handle}
                </span>
              </div>

              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleInput}
                maxLength={MAX_POST_LENGTH}
                placeholder="What is happening?!"
                rows={3}
                className="w-full bg-transparent resize-none outline-none text-lg text-foreground placeholder:text-muted-foreground min-h-20 overflow-hidden"
              />

              {/* Read-only Media Attachments Preview */}
              {sortedMedia.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <div
                    className={`grid gap-1.5 overflow-hidden rounded-2xl border border-border bg-muted/40 opacity-85 ${
                      sortedMedia.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    }`}
                  >
                    {sortedMedia.map((item, idx) => (
                      <div
                        key={item.id ?? idx}
                        className={`relative overflow-hidden ${
                          sortedMedia.length === 1 ? "max-h-52" : "aspect-16/10"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={`Attachment ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Attached images cannot be modified when editing a post.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border mt-2">
            <div className="flex items-center gap-2">
              {content.length > 0 && (
                <div className="relative flex items-center justify-center w-8 h-8">
                  <ProgressRingIcon
                    className="w-full h-full"
                    progress={content.length / MAX_POST_LENGTH}
                    variant={
                      content.length >= MAX_POST_LENGTH
                        ? "danger"
                        : content.length >= 80
                          ? "warning"
                          : "default"
                    }
                  />
                  {MAX_POST_LENGTH - content.length <= 20 && (
                    <span
                      className={`absolute text-[10px] font-bold ${
                        content.length >= MAX_POST_LENGTH
                          ? "text-destructive"
                          : "text-yellow-500"
                      }`}
                    >
                      {MAX_POST_LENGTH - content.length}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-5 py-2.5 rounded-full border border-border text-sm font-bold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <ComposeButton
                type="submit"
                disabled={!canSave}
                text={isPending ? "Saving..." : "Save"}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function EditPostModal({
  isOpen,
  post,
  onClose,
  onSave,
  isPending,
}: EditPostModalProps) {
  if (!isOpen || !post) return null;

  return (
    <EditPostModalContent
      key={`${post.id}-${post.updated_at}`}
      post={post}
      onClose={onClose}
      onSave={onSave}
      isPending={isPending}
    />
  );
}

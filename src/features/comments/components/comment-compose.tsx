"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ComposeButton } from "@/components/ui/compose-button";
import { ProgressRingIcon } from "@/components/icons";

const MAX_COMMENT_LENGTH = 100;

interface CommentComposeProps {
  currentUserName?: string;
  replyingToHandle?: string;
  onSubmit?: (content: string) => void;
}

export function CommentCompose({
  currentUserName = "You",
  replyingToHandle,
  onSubmit,
}: CommentComposeProps) {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = () => {
    if (!content.trim() || content.length > MAX_COMMENT_LENGTH) return;
    onSubmit?.(content.trim());
    setContent("");
    setIsFocused(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
    }
  };

  return (
    <div className="p-4 sm:px-6 border-b border-border flex gap-4">
      <Avatar name={currentUserName} />
      <div className="flex-1 flex flex-col gap-3">
        {(isFocused || content.length > 0) && replyingToHandle && (
          <span className="text-xs text-muted-foreground">
            Replying to <span className="text-primary font-medium">@{replyingToHandle}</span>
          </span>
        )}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={MAX_COMMENT_LENGTH}
          placeholder="Post your reply"
          className="w-full bg-transparent resize-none outline-none text-xl placeholder:text-muted-foreground pt-2 min-h-10 overflow-hidden"
          style={{ height: "40px" }}
        />
        {(isFocused || content.length > 0) && (
          <div className="flex justify-end pt-2 border-t border-border mt-2">
            <div className="flex items-center gap-4">
              {content.length > 0 && (
                <div className="relative flex items-center justify-center w-8 h-8">
                  <ProgressRingIcon
                    className="w-full h-full"
                    progress={content.length / MAX_COMMENT_LENGTH}
                    variant={
                      content.length >= MAX_COMMENT_LENGTH
                        ? "danger"
                        : content.length >= 80
                          ? "warning"
                          : "default"
                    }
                  />
                  {MAX_COMMENT_LENGTH - content.length <= 20 && (
                    <span
                      className={`absolute text-[10px] font-bold ${
                        content.length >= MAX_COMMENT_LENGTH
                          ? "text-destructive"
                          : "text-yellow-500"
                      }`}
                    >
                      {MAX_COMMENT_LENGTH - content.length}
                    </span>
                  )}
                </div>
              )}

              <ComposeButton
                onClick={handleSubmit}
                disabled={
                  content.trim().length === 0 ||
                  content.length > MAX_COMMENT_LENGTH
                }
                text="Reply"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Avatar } from "@/components/ui/avatar";
import { ProgressRingIcon } from "@/components/icons";
import { useCurrentUser } from "@/features/users/hooks/use-current-user";
import { useCreatePost } from "@/features/posts/hooks/use-create-post";

const MAX_POST_LENGTH = 100;

export function ComposeArea() {
  const { data: user } = useCurrentUser();
  const { mutate: createPost, isPending: isCreatePostPending } = useCreatePost();

  const [postContent, setPostContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handlePost = () => {
    if (!postContent.trim() || isCreatePostPending) return;

    createPost({ content: postContent }, {
      onSuccess: () => {
        setPostContent("");
        setIsFocused(false);
        if (textareaRef.current) {
          textareaRef.current.style.height = "40px";
        }
      },
      onError: () => {
        toast.error("Failed to create post. Please try again.");
      },
    });
  };

  return (
    <div className="p-4 sm:px-6 border-b border-border flex gap-4">
      <Avatar name={user?.name} />
      <div className="flex-1 flex flex-col gap-3">
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
        {(isFocused || postContent.length > 0) && (
          <div className="flex justify-end pt-2 border-t border-border mt-2">
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
                      className={`absolute text-[10px] font-bold ${postContent.length >= MAX_POST_LENGTH ? "text-destructive" : "text-yellow-500"
                        }`}
                    >
                      {MAX_POST_LENGTH - postContent.length}
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handlePost}
                disabled={postContent.trim().length === 0 || postContent.length > MAX_POST_LENGTH || isCreatePostPending}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-full shadow-md shadow-primary/20 transition-all active:scale-95 text-sm cursor-pointer"
              >
                {isCreatePostPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

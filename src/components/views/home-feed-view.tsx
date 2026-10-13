"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { PostItem } from "@/components/widgets/post-item";
import { PostItemSkeleton } from "@/components/widgets/post-item-skeleton";
import { Avatar } from "@/components/ui/avatar";
import { DocumentIcon } from "@/components/icons";
import { useFeed } from "@/hooks/use-feed";
import { useCreatePost } from "@/hooks/use-create-post";
import { useToggleLike } from "@/hooks/use-toggle-like";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { toast } from "react-hot-toast";

export function HomeFeedView() {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  const [postContent, setPostContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed();

  const {
    mutate: createPost,
    isPending: isCreatePostPending,
  } = useCreatePost();

  const {
    mutate: toggleLike,
  } = useToggleLike();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const posts = data?.pages.flatMap((page) => page?.data?.data ?? [],) ?? [];

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
      }
    });
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border px-4 sm:px-6 h-[60px] flex items-center">
        <h1 className="text-xl font-bold tracking-tight">Home</h1>
      </header>

      {/* Compose Area */}
      <div className="p-4 sm:px-6 border-b border-border flex gap-4">
        <Avatar name={user?.name} />
        <div className="flex-1 flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            value={postContent}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={100}
            placeholder="What is happening?!"
            className="w-full bg-transparent resize-none outline-none text-xl placeholder:text-muted-foreground pt-2 min-h-[40px] overflow-hidden"
            style={{ height: "40px" }}
          />
          {(isFocused || postContent.length > 0) && (
            <div className="flex justify-end pt-2 border-t border-border mt-2">
              <div className="flex items-center gap-4">
                {/* Character Counter Circle */}
                {postContent.length > 0 && (
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="14" fill="none" className="stroke-border" strokeWidth="3" />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        className={`${postContent.length >= 100
                          ? "stroke-destructive"
                          : postContent.length >= 80
                            ? "stroke-yellow-500"
                            : "stroke-primary"
                          } transition-all duration-300`}
                        strokeWidth="3"
                        strokeDasharray="88"
                        strokeDashoffset={88 - (postContent.length / 100) * 88}
                        strokeLinecap="round"
                      />
                    </svg>
                    {100 - postContent.length <= 20 && (
                      <span
                        className={`absolute text-[10px] font-bold ${postContent.length >= 100 ? "text-destructive" : "text-yellow-500"
                          }`}
                      >
                        {100 - postContent.length}
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={handlePost}
                  disabled={postContent.trim().length === 0 || postContent.length > 100 || isCreatePostPending}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-full shadow-md shadow-primary/20 transition-all active:scale-95 text-sm cursor-pointer"
                >
                  {isCreatePostPending ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feed Posts */}
      <div className="flex flex-col">
        {isLoading && posts.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <PostItemSkeleton key={i} />
          ))
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-b border-border">
            <div className="w-20 h-20 mb-4 rounded-full bg-muted flex items-center justify-center opacity-70">
              <DocumentIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No posts yet</h3>
            <p className="max-w-70 text-sm">
              When someone posts something, it will show up here. Be the first to share what&apos;s on your mind!
            </p>
          </div>
        ) : isError ? (
          <div className="flex justify-center p-8 text-destructive">Failed to load posts.</div>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              onLike={() => toggleLike(post.id)}
              onUserClick={() => {
                const postHandle = post.user.handle?.toLowerCase();
                if (postHandle) {
                  router.push(`/${postHandle}`);
                }
              }}
            >
            </PostItem>
          ))
        )}
        <div ref={loadMoreRef} />
        {hasNextPage && isFetchingNextPage && (
          Array.from({ length: 3 }).map((_, i) => (
            <PostItemSkeleton key={i} />
          ))
        )}
      </div>
    </>
  );
}

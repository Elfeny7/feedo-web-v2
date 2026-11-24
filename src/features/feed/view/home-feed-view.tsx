"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import type { PostData } from "@/types/post";
import { PostItem } from "@/features/posts/components/post-item";
import { PostItemSkeleton } from "@/features/posts/components/post-item-skeleton";
import { EditPostModal } from "@/features/posts/components/edit-post-modal";
import { DeletePostModal } from "@/features/posts/components/delete-post-modal";
import { useDeletePost } from "@/features/posts/hooks/use-delete-post";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { DocumentIcon } from "@/components/icons";
import { useFeed } from "@/features/feed/hooks/use-feed";
import { useToggleLike } from "@/features/like/hooks/use-toggle-like";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { PageHeader } from "@/components/ui/page-header";
import { PostCompose } from "@/features/feed/components/post-compose";

export function HomeFeedView() {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const [postToEdit, setPostToEdit] = useState<PostData | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed();

  const { mutate: toggleLike } = useToggleLike();
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const posts = data?.pages.flatMap((page) => page?.data?.data ?? [],) ?? [];

  const handleConfirmDeletePost = () => {
    if (postToDelete === null) return;

    deletePost(postToDelete, {
      onSuccess: () => {
        setPostToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete post. Please try again.");
      },
    });
  };

  return (
    <>
      <PageHeader title="Home" />

      <PostCompose />

      {/* Feed Posts */}
      <div className="flex flex-col">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <PostItemSkeleton key={i} />
          ))
        ) : isError ? (
          <div className="flex justify-center p-8 text-destructive">Failed to load posts.</div>
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
        ) : (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              isOwner={Boolean(currentUser && post.user.id === currentUser.id)}
              onLike={() => toggleLike(post.id)}
              onEdit={() => setPostToEdit(post)}
              onDelete={() => setPostToDelete(post.id)}
              onUserClick={() => {
                const postHandle = post.user.handle?.toLowerCase();
                if (postHandle) {
                  router.push(`/${postHandle}`);
                }
              }}
              onPostClick={() => {
                const postHandle = post.user.handle?.toLowerCase();
                if (postHandle) {
                  router.push(`/${postHandle}/post/${post.id}`);
                }
              }}
            />
          ))
        )}
        <div ref={loadMoreRef} />
        {hasNextPage && isFetchingNextPage && (
          Array.from({ length: 3 }).map((_, i) => (
            <PostItemSkeleton key={i} />
          ))
        )}
      </div>

      <EditPostModal
        isOpen={postToEdit !== null}
        post={postToEdit}
        onClose={() => setPostToEdit(null)}
      />

      <DeletePostModal
        isOpen={postToDelete !== null}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleConfirmDeletePost}
        isPending={isDeletingPost}
      />
    </>
  );
}

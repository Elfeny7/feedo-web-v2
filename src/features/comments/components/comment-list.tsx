import type { RefObject } from "react";
import type { CommentData } from "@/types/comment";
import { CommentIcon } from "@/components/icons";
import { PostItemSkeleton } from "@/features/posts/components/post-item-skeleton";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  comments: CommentData[];
  currentUserId?: number;
  isLoading?: boolean;
  isError?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  loadMoreRef?: RefObject<HTMLDivElement | null>;
  onLikeComment?: (commentId: number) => void;
  onDeleteComment?: (commentId: number) => void;
  onUserClick?: (handle: string) => void;
}

export function CommentList({
  comments,
  currentUserId,
  isLoading = false,
  isError = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  loadMoreRef,
  onLikeComment,
  onDeleteComment,
  onUserClick,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center p-8 text-destructive">
        Failed to load comments.
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-b border-border">
        <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center opacity-70">
          <CommentIcon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">
          No comments yet
        </h3>
        <p className="max-w-70 text-sm">
          Be the first to share your thoughts on this post!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={Boolean(currentUserId && comment.user.id === currentUserId)}
          onLike={onLikeComment}
          onDelete={onDeleteComment}
          onUserClick={onUserClick}
        />
      ))}
      {loadMoreRef && <div ref={loadMoreRef} />}
      {hasNextPage &&
        isFetchingNextPage &&
        Array.from({ length: 2 }).map((_, i) => <PostItemSkeleton key={i} />)}
    </div>
  );
}

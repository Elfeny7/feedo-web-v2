import type { CommentData } from "@/types/comment";
import { CommentIcon } from "@/components/icons";
import { CommentItem } from "./comment-item";

interface CommentListProps {
  comments: CommentData[];
  onLikeComment?: (commentId: number) => void;
  onUserClick?: (handle: string) => void;
}

export function CommentList({
  comments,
  onLikeComment,
  onUserClick,
}: CommentListProps) {
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
          onLike={onLikeComment}
          onUserClick={onUserClick}
        />
      ))}
    </div>
  );
}

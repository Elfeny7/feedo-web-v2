import type { CommentData } from "@/types/comment";
import { HeartIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/helper/format-time";

interface CommentItemProps {
  comment: CommentData;
  onLike?: (commentId: number) => void;
  onUserClick?: (handle: string) => void;
}

export function CommentItem({ comment, onLike, onUserClick }: CommentItemProps) {
  return (
    <article className="py-3.5 px-4 sm:px-6 border-b border-border hover:bg-muted/50 transition-colors flex gap-4">
      <div
        onClick={() => onUserClick?.(comment.user.handle)}
        className="cursor-pointer shrink-0"
      >
        <Avatar name={comment.user.name} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <h3
            onClick={() => onUserClick?.(comment.user.handle)}
            className="font-bold hover:underline cursor-pointer text-[15px]"
          >
            {comment.user.name}
          </h3>
          <span className="text-muted-foreground text-[15px]">
            @{comment.user.handle} · {formatRelativeTime(comment.created_at)}
          </span>
        </div>
        <p className="mt-0.5 text-foreground text-[15px] leading-normal wrap-break-word">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center mt-1 text-muted-foreground">
          <button
            type="button"
            onClick={() => onLike?.(comment.id)}
            className={`-ml-2 hover:text-destructive transition-colors hover:bg-destructive/10 p-2 rounded-full flex items-center gap-2 text-sm group cursor-pointer ${
              comment.is_liked ? "text-destructive" : ""
            }`}
          >
            <HeartIcon filled={comment.is_liked} />
            <span className="group-hover:text-destructive">
              {comment.likes_count}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

import type { PostData } from "@/types/post";
import { HeartIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/helper/format-time";

interface PostItemProps {
  post: PostData;
  onLike?: () => void;
  onUserClick?: () => void;
}

export function PostItem({ post, onLike, onUserClick }: PostItemProps) {
  return (
    <article className="py-3.5 px-4 sm:px-6 border-b border-border hover:bg-muted/50 transition-colors flex gap-4">
      <div onClick={onUserClick} className="cursor-pointer">
        <Avatar name={post.user.name} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <h2 onClick={onUserClick} className="font-bold hover:underline cursor-pointer">{post.user.name}</h2>
          <span className="text-muted-foreground text-[15px]">@{post.user.handle} · {formatRelativeTime(post.created_at)}</span>
        </div>
        <p className="mt-0.5 text-foreground text-[15px] leading-normal">
          {post.content}
        </p>

        {/* Post Actions */}
        <div className="flex items-center mt-1 text-muted-foreground">
          <button
            onClick={onLike}
            className={`-ml-2 hover:text-destructive transition-colors hover:bg-destructive/10 p-2 rounded-full flex items-center gap-2 text-sm group cursor-pointer ${post.is_liked ? 'text-destructive' : ''}`}
          >
            <HeartIcon filled={post.is_liked} /> <span className="group-hover:text-destructive">{post.likes_count}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import type { PostData } from "@/types/post";
import { CommentIcon, HeartIcon, MoreIcon, TrashIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/helper/format-time";

interface PostItemProps {
  post: PostData;
  isOwner?: boolean;
  onLike?: () => void;
  onDelete?: () => void;
  onUserClick?: () => void;
  onPostClick?: () => void;
}

export function PostItem({
  post,
  isOwner = false,
  onLike,
  onDelete,
  onUserClick,
  onPostClick,
}: PostItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <article
      onClick={onPostClick}
      className="py-3.5 px-4 sm:px-6 border-b border-border hover:bg-muted/50 transition-colors flex gap-4 cursor-pointer"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onUserClick?.();
        }}
        className="cursor-pointer shrink-0"
      >
        <Avatar name={post.user.name} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2
              onClick={(e) => {
                e.stopPropagation();
                onUserClick?.();
              }}
              className="font-bold hover:underline cursor-pointer"
            >
              {post.user.name}
            </h2>
            <span className="text-muted-foreground text-[15px]">
              @{post.user.handle} · {formatRelativeTime(post.created_at)}
            </span>
          </div>

          {isOwner && (
            <div
              className="relative"
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
                className="p-1.5 -mr-1.5 -mt-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                aria-label="Post options"
              >
                <MoreIcon className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-xl shadow-lg shadow-black/10 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete?.();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-muted transition-colors text-destructive font-bold text-sm cursor-pointer"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-0.5 text-foreground text-[15px] leading-normal wrap-break-word">
          {post.content}
        </p>

        {/* Post Actions */}
        <div className="flex items-center gap-6 mt-1 text-muted-foreground">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPostClick?.();
            }}
            className="-ml-2 hover:text-primary transition-colors hover:bg-primary/10 p-2 rounded-full flex items-center gap-2 text-sm group cursor-pointer"
          >
            <CommentIcon />
            <span className="group-hover:text-primary">
              {post.comments_count ?? 0}
            </span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLike?.();
            }}
            className={`hover:text-destructive transition-colors hover:bg-destructive/10 p-2 rounded-full flex items-center gap-2 text-sm group cursor-pointer ${
              post.is_liked ? "text-destructive" : ""
            }`}
          >
            <HeartIcon filled={post.is_liked} />
            <span className="group-hover:text-destructive">
              {post.likes_count}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

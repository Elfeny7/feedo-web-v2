"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PostData } from "@/types/post";
import type { CommentData } from "@/types/comment";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";
import { CommentIcon, HeartIcon } from "@/components/icons";
import { formatRelativeTime } from "@/lib/helper/format-time";
import { CommentCompose } from "@/features/comments/components/comment-compose";
import { CommentList } from "@/features/comments/components/comment-list";

const DUMMY_POST: PostData = {
  id: 1,
  content:
    "Baru saja merilis pembaruan tampilan Feedo v2! Bagaimana menurut kalian dengan desain yang lebih bersih dan responsif ini?",
  user: {
    id: 101,
    name: "Rizky Pratama",
    email: "rizky@feedo.app",
    handle: "rizkypratama",
    bio: "Frontend Engineer & UI Enthusiast",
  },
  likes_count: 24,
  comments_count: 3,
  is_liked: false,
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

const DUMMY_COMMENTS: CommentData[] = [
  {
    id: 201,
    content: "Tampilannya keren banget! Warna teal-nya terasa segar di mata.",
    user: {
      id: 102,
      name: "Nadia Putri",
      email: "nadia@example.com",
      handle: "nadiaputri",
      bio: "Product Designer",
    },
    likes_count: 5,
    is_liked: true,
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
  },
  {
    id: 202,
    content: "Sangat ringan dan cepat ketika berpindah halaman. Mantap!",
    user: {
      id: 103,
      name: "Dimas Aditya",
      email: "dimas@example.com",
      handle: "dimasaditya",
      bio: "Fullstack Developer",
    },
    likes_count: 2,
    is_liked: false,
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 203,
    content: "Ditunggu fitur-fitur selanjutnya!",
    user: {
      id: 104,
      name: "Siti Rahma",
      email: "siti@example.com",
      handle: "sitirahma",
      bio: "Tech Writer",
    },
    likes_count: 1,
    is_liked: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

export function PostDetailView() {
  const router = useRouter();
  const [post, setPost] = useState<PostData>(DUMMY_POST);
  const [comments, setComments] = useState<CommentData[]>(DUMMY_COMMENTS);

  const handleNavigateUser = (handle?: string) => {
    const cleanHandle = handle?.toLowerCase();
    if (cleanHandle) {
      router.push(`/${cleanHandle}`);
    }
  };

  const handleTogglePostLike = () => {
    setPost((prev) => ({
      ...prev,
      is_liked: !prev.is_liked,
      likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1,
    }));
  };

  const handleToggleCommentLike = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              is_liked: !comment.is_liked,
              likes_count: comment.is_liked
                ? comment.likes_count - 1
                : comment.likes_count + 1,
            }
          : comment
      )
    );
  };

  const handleAddComment = (content: string) => {
    const newComment: CommentData = {
      id: Date.now(),
      content,
      user: {
        id: 999,
        name: "Demo User",
        email: "demo@feedo.app",
        handle: "demouser",
        bio: "",
      },
      likes_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    setPost((prev) => ({
      ...prev,
      comments_count: (prev.comments_count ?? comments.length) + 1,
    }));
  };

  return (
    <>
      <PageHeader title="Post" showBackButton />

      {/* Main Post Detail */}
      <article className="pt-4 pb-2 px-4 sm:px-6 border-b border-border flex flex-col gap-3">
        {/* Author Header */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => handleNavigateUser(post.user.handle)}
            className="cursor-pointer shrink-0"
          >
            <Avatar name={post.user.name} />
          </div>
          <div className="flex flex-col leading-tight">
            <h2
              onClick={() => handleNavigateUser(post.user.handle)}
              className="font-bold hover:underline cursor-pointer text-[15px]"
            >
              {post.user.name}
            </h2>
            <span className="text-muted-foreground text-sm">
              @{post.user.handle}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-foreground text-[17px] leading-relaxed wrap-break-word">
          {post.content}
        </p>

        {/* Post Timestamp */}
        <div className="text-sm text-muted-foreground pb-3 border-b border-border">
          <span>{formatRelativeTime(post.created_at)} ago</span>
        </div>

        {/* Post Actions (Comment Count & Like Count) */}
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="-ml-2 p-2 rounded-full flex items-center gap-2 text-sm text-muted-foreground">
            <CommentIcon />
            <span>{post.comments_count ?? comments.length}</span>
          </div>

          <button
            type="button"
            onClick={handleTogglePostLike}
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
      </article>

      {/* Reply / Comment Compose Box */}
      <CommentCompose
        currentUserName="Demo User"
        replyingToHandle={post.user.handle}
        onSubmit={handleAddComment}
      />

      {/* Comment List */}
      <CommentList
        comments={comments}
        onLikeComment={handleToggleCommentLike}
        onUserClick={handleNavigateUser}
      />
    </>
  );
}

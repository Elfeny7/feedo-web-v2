"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";
import { CommentIcon, DocumentIcon, HeartIcon } from "@/components/icons";
import { formatRelativeTime } from "@/lib/helper/format-time";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { GuestActionModal, GuestAction } from "@/features/auth/components/guest-action-modal";
import { useFeed } from "@/features/feed/hooks/use-feed";
import { useUserPosts } from "@/features/posts/hooks/use-user-posts";
import { PostItemSkeleton } from "@/features/posts/components/post-item-skeleton";
import { useToggleLike } from "@/features/like/hooks/use-toggle-like";
import { CommentCompose } from "@/features/comments/components/comment-compose";
import { CommentList } from "@/features/comments/components/comment-list";
import { DeleteCommentModal } from "@/features/comments/components/delete-comment-modal";
import { useComments } from "@/features/comments/hooks/use-comments";
import { useCreateComment } from "@/features/comments/hooks/use-create-comment";
import { useDeleteComment } from "@/features/comments/hooks/use-delete-comment";
import { useToggleCommentLike } from "@/features/comments/hooks/use-toggle-comment-like";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

interface PostDetailViewProps {
  handle: string;
  postId: number;
}

export function PostDetailView({ handle, postId }: PostDetailViewProps) {
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const isGuest = !currentUser;

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    action: GuestAction;
    targetName?: string;
  }>({
    isOpen: false,
    action: "like",
  });

  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  // Cari data post dari cache/query feed maupun user posts
  const { data: feedData, isLoading: isLoadingFeed } = useFeed();
  const { data: userPostsData, isLoading: isLoadingUserPosts } = useUserPosts(handle);

  const feedPosts = feedData?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];
  const userPosts = userPostsData?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];
  const post =
    feedPosts.find((p) => p.id === postId) ??
    userPosts.find((p) => p.id === postId);

  const isLoadingPost = !post && (isLoadingFeed || isLoadingUserPosts);

  const { mutate: togglePostLike } = useToggleLike();

  // Comments query & mutations
  const {
    data: commentsData,
    isLoading: isLoadingComments,
    isError: isCommentsError,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
    isFetchingNextPage: isFetchingNextComments,
  } = useComments(postId);

  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment(postId);
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment(postId);
  const { mutate: toggleCommentLike } = useToggleCommentLike();

  const loadMoreCommentsRef = useInfiniteScroll({
    hasNextPage: hasNextComments,
    isFetchingNextPage: isFetchingNextComments,
    fetchNextPage: fetchNextComments,
  });

  const comments =
    commentsData?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];
  const totalComments =
    commentsData?.pages[0]?.data?.meta?.total ??
    post?.comments_count ??
    comments.length;

  const handleNavigateUser = (targetHandle?: string) => {
    const cleanHandle = targetHandle?.toLowerCase();
    if (cleanHandle) {
      router.push(`/${cleanHandle}`);
    }
  };

  const handleTogglePostLike = () => {
    if (!post) return;
    if (isGuest) {
      setAuthModal({
        isOpen: true,
        action: "like",
        targetName: post.user.name,
      });
      return;
    }
    togglePostLike(post.id);
  };

  const handleToggleCommentLike = (commentId: number) => {
    if (isGuest) {
      const targetComment = comments.find((c) => c.id === commentId);
      setAuthModal({
        isOpen: true,
        action: "like",
        targetName: targetComment?.user.name,
      });
      return;
    }
    toggleCommentLike(commentId);
  };

  const handleAddComment = (content: string, onSuccessCallback: () => void) => {
    if (isGuest) {
      setAuthModal({
        isOpen: true,
        action: "post",
        targetName: post?.user.name,
      });
      return;
    }

    createComment(
      { content },
      {
        onSuccess: () => {
          onSuccessCallback();
        },
        onError: () => {
          toast.error("Failed to post reply. Please try again.");
        },
      }
    );
  };

  const handleConfirmDeleteComment = () => {
    if (commentToDelete === null) return;

    deleteComment(commentToDelete, {
      onSuccess: () => {
        setCommentToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete comment. Please try again.");
      },
    });
  };

  return (
    <>
      <PageHeader title="Post" showBackButton />

      {/* Main Post Detail */}
      {isLoadingPost ? (
        <PostItemSkeleton />
      ) : !post ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-b border-border">
          <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center opacity-70">
            <DocumentIcon className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">
            Post not found
          </h3>
          <p className="max-w-70 text-sm">
            This post may have been removed or is not available in the current feed.
          </p>
        </div>
      ) : (
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
              <span>{totalComments}</span>
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
      )}

      {/* Reply / Comment Compose Box */}
      {!isGuest && (
        <CommentCompose
          currentUserName={currentUser?.name}
          replyingToHandle={post?.user.handle ?? handle}
          isPending={isCreatingComment}
          onSubmit={handleAddComment}
        />
      )}

      {/* Comment List */}
      <CommentList
        comments={comments}
        currentUserId={currentUser?.id}
        isLoading={isLoadingComments}
        isError={isCommentsError}
        hasNextPage={hasNextComments}
        isFetchingNextPage={isFetchingNextComments}
        loadMoreRef={loadMoreCommentsRef}
        onLikeComment={handleToggleCommentLike}
        onDeleteComment={(commentId) => setCommentToDelete(commentId)}
        onUserClick={handleNavigateUser}
      />

      {/* Delete Comment Confirmation Modal */}
      <DeleteCommentModal
        isOpen={commentToDelete !== null}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleConfirmDeleteComment}
        isPending={isDeletingComment}
      />

      {/* Guest Authentication Modal */}
      <GuestActionModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        action={authModal.action}
        targetName={authModal.targetName}
        redirectUrl={`/${handle}/post/${postId}`}
      />
    </>
  );
}

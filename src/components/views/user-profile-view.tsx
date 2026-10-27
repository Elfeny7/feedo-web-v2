"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostItem } from "@/components/widgets/post-item";
import { Avatar } from "@/components/ui/avatar";
import { ChevronLeftIcon, DocumentIcon } from "@/components/icons";
import { AuthGate } from "@/components/auth/auth-gate";
import { GuestActionModal, GuestAction } from "@/components/modal/guest-action-modal";
import { EditProfileModal } from "@/components/modal/edit-profile-modal";
import { UnfollowModal } from "@/components/modal/unfollow-modal";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useUserPosts } from "@/hooks/use-user-posts";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useFollowAction } from "@/hooks/use-follow-action";
import { useToggleLike } from "@/hooks/use-toggle-like";
import { PostItemSkeleton } from "@/components/widgets/post-item-skeleton";
import { ProfileInfoSkeleton } from "@/components/widgets/profile-info-skeleton";
import { ProfileStats } from "@/components/widgets/profile-stats";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

export function UserProfileView({ handle }: { handle: string }) {
    const router = useRouter();
    const { data: user, isLoading: isLoadingUser } = useCurrentUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [authModal, setAuthModal] = useState<{
        isOpen: boolean;
        action: GuestAction;
        targetName?: string;
    }>({
        isOpen: false,
        action: "like",
    });

    const userSelfHandle = user?.handle ? user.handle.toLowerCase() : null;
    const isSelf = Boolean(user && userSelfHandle && userSelfHandle === handle.toLowerCase());
    const isGuest = !user;

    const { data: profile, isLoading: isLoadingProfile } = useUserProfile(handle);

    const followAction = useFollowAction({
        isFollowed: profile?.is_followed ?? false,
        targetHandle: handle,
    });

    const { mutate: toggleLike } = useToggleLike();

    const {
        data,
        isLoading: isLoadingPosts,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useUserPosts(handle);

    const isLoading = isLoadingUser || isLoadingProfile || isLoadingPosts;

    const loadMoreRef = useInfiniteScroll({
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    });

    const posts = data?.pages.flatMap((page) => page?.data?.data ?? [],) ?? [];

    const handleFollowClick = () => {
        if (isGuest) {
            setAuthModal({
                isOpen: true,
                action: "follow",
                targetName: profile?.name,
            });
            return;
        }

        followAction.handleFollowClick();
    };

    const handleLikeClick = (postId: number) => {
        if (isGuest) {
            setAuthModal({
                isOpen: true,
                action: "like",
                targetName: profile?.name,
            });
            return;
        }
        toggleLike(postId);
    };

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border px-4 sm:px-6 h-15 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
                    aria-label="Back"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                {isLoading ? (
                    <div className="h-5 w-28 bg-muted animate-pulse rounded-md"></div>
                ) : (
                    <h1 className="text-xl font-bold tracking-tight">{profile?.name}</h1>
                )}
            </header>

            {/* Cover Image */}
            <div className="h-32 sm:h-48 bg-linear-to-r from-teal-500 to-emerald-400 w-full relative"></div>

            {/* Profile Info */}
            <div className="px-4 sm:px-6 pb-8 border-b border-border relative flex flex-col items-start text-left">
                {isLoading ? (
                    <ProfileInfoSkeleton />
                ) : (
                    <>
                        {/* Tombol Edit Profil (Hanya tampil jika membuka profil milik sendiri) */}
                        {isSelf && (
                            <>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="absolute top-3 right-4 sm:top-4 sm:right-6 font-bold py-1.5 px-4 rounded-full border border-border text-foreground hover:bg-muted transition-colors text-sm z-10 hidden sm:block cursor-pointer"
                                >
                                    Edit profile
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="absolute top-3 right-4 font-bold py-1.5 px-3 rounded-full border border-border text-foreground hover:bg-muted transition-colors text-xs z-10 sm:hidden cursor-pointer"
                                >
                                    Edit profile
                                </button>
                            </>
                        )}

                        {/* Avatar */}
                        <Avatar
                            name={profile?.name || "?"}
                            className="self-center w-24 h-24 sm:w-32 sm:h-32 border-4 border-background mt-[-12%] sm:mt-[-16%] relative z-0 mb-3 shadow-sm text-4xl"
                        />

                        {/* Name and Handle */}
                        <div className="flex flex-col self-center items-center text-center w-full">
                            <h2 className="text-xl font-extrabold tracking-tight">{profile?.name}</h2>
                            <span className="text-muted-foreground text-[15px]">@{profile?.handle}</span>
                        </div>

                        {/* Bio */}
                        {profile?.bio ? (
                            <p className="mt-3 text-[15px] leading-normal text-foreground max-w-md self-center text-center">
                                {profile.bio}
                            </p>
                        ) : null}

                        {/* Stats */}
                        <ProfileStats
                            followingsCount={profile?.followings_count}
                            followersCount={profile?.followers_count}
                            postsCount={profile?.posts_count}
                            onFollowingClick={() => router.push(`/${handle}/following`)}
                            onFollowersClick={() => router.push(`/${handle}/followers`)}
                        />

                        {/* Tombol Follow / Following (Hanya tampil jika membuka profil pengguna lain) */}
                        {!isSelf && profile && !isLoading && (
                            <div className="w-full flex justify-center mt-2">
                                <button
                                    onClick={handleFollowClick}
                                    className={`px-8 py-2 rounded-full font-bold transition-all cursor-pointer ${profile.is_followed
                                        ? "bg-transparent border border-border hover:border-destructive hover:text-destructive hover:bg-destructive/10 text-foreground"
                                        : "bg-foreground text-background hover:bg-foreground/90"
                                        }`}
                                >
                                    {profile.is_followed ? "Following" : "Follow"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Posts */}
            <div className="flex flex-col">
                {isLoading ? (
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
                            {isSelf
                                ? "You haven't posted anything yet. When you do, your posts will show up here."
                                : `@${profile?.handle} hasn't posted anything yet.`
                            }
                        </p>
                    </div>
                ) : isError ? (
                    <div className="flex justify-center p-8 text-destructive">Failed to load posts.</div>
                ) : (
                    posts.map((post) => (
                        <PostItem
                            key={post.id}
                            post={post}
                            onLike={() => handleLikeClick(post.id)}
                            onUserClick={() => {
                                const postHandle = post.user.handle?.toLowerCase();
                                if (postHandle) {
                                    router.push(`/${postHandle}`);
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

                {/* Tampilkan AuthGate jika pengunjung belum login (isGuest) */}
                {isGuest && (
                    <AuthGate
                        title={`Log in to see more from ${profile?.name || "this user"}`}
                        description="Sign in or create an account to view full posts, like, and interact with creators."
                        loginUrl={`/login?redirect=/${handle}`}
                        registerUrl={`/register?redirect=/${handle}`}
                    />
                )}
            </div>

            {/* Pop-up Dialog Otentikasi Dinamis (Like, Follow, dll) untuk Guest */}
            <GuestActionModal
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
                action={authModal.action}
                targetName={authModal.targetName}
                redirectUrl={`/${handle}`}
            />

            <UnfollowModal
                isOpen={followAction.isUnfollowModalOpen}
                onClose={() => followAction.setIsUnfollowModalOpen(false)}
                onConfirm={followAction.handleUnfollowConfirm}
                userName={profile?.name || handle}
                isPending={followAction.isPending}
            />

            {/* Pop-up Dialog Edit Profil */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={profile!}
            />
        </>
    );
}

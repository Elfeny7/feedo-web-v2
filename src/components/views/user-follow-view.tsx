"use client";

import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ChevronLeftIcon } from "@/components/icons";
import { UserItem } from "@/components/widgets/user-item";
import { UserItemSkeleton } from "@/components/widgets/user-item-skeleton";
import { Tabs } from "@/components/ui/tabs";
import { useFollowList } from "@/hooks/use-follow-list";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

type UserFollowViewProps = {
    handle: string;
    type: "followers" | "following";
};

export function UserFollowView({ handle, type }: UserFollowViewProps) {
    const router = useRouter();

    const tabs = [
        { label: "Following", value: "following" },
        { label: "Followers", value: "followers" },
    ] as const;

    const userProfileQuery = useUserProfile(handle);
    const followListQuery = useFollowList(handle, type);

    const users = followListQuery.data?.pages.flatMap((page) => page?.data?.data ?? [],) ?? [];
    const profile = userProfileQuery.data;

    const title = type === "following" ? "following" : "followers";

    const loadMoreRef = useInfiniteScroll({
        hasNextPage: followListQuery.hasNextPage,
        isFetchingNextPage: followListQuery.isFetchingNextPage,
        fetchNextPage: followListQuery.fetchNextPage,
    });

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
                {userProfileQuery.isLoading ? (
                    <div className="h-5 w-28 bg-muted animate-pulse rounded-md"></div>
                ) : (
                    <h1 className="text-xl font-bold tracking-tight">{profile?.name}&apos;s {title}</h1>
                )}
            </header>

            {/* Followers / Following Tabs */}
            <Tabs
                tabs={[...tabs]}
                activeTab={type}
                onTabChange={(value) => router.push(value)}
            />

            {/* User Following/Followers List */}
            <div className="flex flex-col">
                {followListQuery.isLoading && users.length === 0 ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <UserItemSkeleton key={i} />
                    ))
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <h3 className="text-xl font-bold text-foreground mb-2">No {type} yet</h3>
                        <p className="max-w-70 text-sm">{type} will show up here.</p>
                    </div>
                ) : (
                    users.map((user, i) => (
                        <UserItem key={user.id || i} suggestedUser={user} />
                    ))
                )}
                <div ref={loadMoreRef} />
                {followListQuery.hasNextPage && followListQuery.isFetchingNextPage && (
                    Array.from({ length: 3 }).map((_, i) => (
                        <UserItemSkeleton key={i} />
                    ))
                )}
            </div>
        </>
    );
}
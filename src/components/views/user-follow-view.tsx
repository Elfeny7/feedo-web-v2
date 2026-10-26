"use client";

import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ChevronLeftIcon } from "@/components/icons";
import { UserItem } from "@/components/widgets/user-item";
import { useToggleFollow } from "@/hooks/use-toggle-follow";
import { Tabs } from "@/components/ui/tabs";
import { useFollowList } from "@/hooks/use-follow-list";

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
    const { mutate: toggleFollow } = useToggleFollow();
    
    const users = followListQuery.data?.pages.flatMap((page) => page?.data?.data ?? [],) ?? [];
    const isLoading = userProfileQuery.isLoading || followListQuery.isLoading;
    const profile = userProfileQuery.data;

    const title = type === "following" ? "following" : "followers";


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
                {isLoading && users.length === 0 ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 sm:px-6 border-b border-border flex items-center justify-between gap-4 animate-pulse">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 h-12 rounded-full bg-muted shrink-0"></div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <div className="h-4 w-32 bg-muted rounded-md"></div>
                                    <div className="h-3.5 w-24 bg-muted rounded-md"></div>
                                </div>
                            </div>
                            <div className="h-8 w-20 bg-muted rounded-full shrink-0"></div>
                        </div>
                    ))
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <h3 className="text-xl font-bold text-foreground mb-2">No {type} yet</h3>
                        <p className="max-w-70 text-sm">{type} will show up here.</p>
                    </div>
                ) : (
                    users.map((user, i) => (
                        <UserItem key={user.id || i} suggestedUser={user} onFollowClick={toggleFollow} />
                    ))
                )}
            </div>
        </>
    );
}
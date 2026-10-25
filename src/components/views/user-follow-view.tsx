"use client";

import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ChevronLeftIcon } from "@/components/icons";
import { UserData } from "@/types/auth";
import { UserItem } from "@/components/widgets/user-item";

type UserFollowViewProps = {
    handle: string;
    type: "followers" | "following";
};

export function UserFollowView({ handle, type }: UserFollowViewProps) {
    const router = useRouter();

    const { data: profile, isLoading: isLoadingProfile } = useUserProfile(handle);

    const isLoading = isLoadingProfile;
    const title = type === "following" ? "following" : "followers";

    const usersFollowing: UserData[] = [
        {
            id: 1,
            name: "jack",
            email: "orang@email.com",
            handle: "orangorang",
            bio: "bio dari orang",
            followers_count: 0,
            followings_count: 0,
            posts_count: 0,
            is_followed: false,
        },
        {
            id: 2,
            name: "reaper",
            email: "people@email.com",
            handle: "peoplepeople",
            bio: "bio dari people",
            followers_count: 0,
            followings_count: 0,
            posts_count: 0,
            is_followed: false,
        },
    ];

    const usersFollowers: UserData[] = [
        {
            id: 1,
            name: "orang",
            email: "orang@email.com",
            handle: "orangorang",
            bio: "bio dari orang",
            followers_count: 0,
            followings_count: 0,
            posts_count: 0,
            is_followed: false,
        },
        {
            id: 2,
            name: "people",
            email: "people@email.com",
            handle: "peoplepeople",
            bio: "bio dari people",
            followers_count: 0,
            followings_count: 0,
            posts_count: 0,
            is_followed: false,
        },
    ];

    const users = type === "following" ? usersFollowing : usersFollowers;

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
            <div className="sticky top-15 z-10 grid grid-cols-2 border-b border-border bg-background/80 backdrop-blur-md">
                <button
                    type="button"
                    onClick={() => router.push(`followers`)}
                    className={`relative cursor-pointer flex min-h-12 items-center justify-center px-4 text-sm font-semibold transition-colors hover:bg-muted/50 sm:text-base ${type === "followers"
                        ? "text-foreground"
                        : "text-muted-foreground"
                        }`}
                    aria-current={type === "followers" ? "page" : undefined}
                >
                    Followers

                    {type === "followers" && (
                        <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-primary sm:inset-x-10" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`following`)}
                    className={`relative cursor-pointer flex min-h-12 items-center justify-center px-4 text-sm font-semibold transition-colors hover:bg-muted/50 sm:text-base ${type === "following"
                        ? "text-foreground"
                        : "text-muted-foreground"
                        }`}
                    aria-current={type === "following" ? "page" : undefined}
                >
                    Following

                    {type === "following" && (
                        <span className="absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-primary sm:inset-x-10" />
                    )}
                </button>
            </div>

            {/* User Following/Followers List */}
            <div className="flex flex-col">
                {users.map((user, i) => (
                    <UserItem key={user.id || i} suggestedUser={user} onFollowClick={() => { }} />
                ))}
            </div>
        </>
    );
}
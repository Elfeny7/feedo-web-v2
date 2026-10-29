import type { Metadata } from "next";
import { UserFollowView } from "@/features/follow/view/user-follow-view";

interface UserFollowersPageProps {
    params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: UserFollowersPageProps): Promise<Metadata> {
    const { handle } = await params;
    const cleanHandle = decodeURIComponent(handle).replace(/^@/, "");

    try { } catch { }

    return {
        title: `@${cleanHandle}'s Followers`,
        description: "View user followers on Feedo.",
    }
}

export default async function UserProfileFollowersPage({ params }: UserFollowersPageProps) {
    const { handle } = await params;
    return <UserFollowView handle={handle} type="followers" />;
}
import type { Metadata } from "next";
import { UserFollowView } from "@/components/views/user-follow-view";

interface UserFollowingPageProps {
    params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: UserFollowingPageProps): Promise<Metadata> {
    const { handle } = await params;
    const cleanHandle = decodeURIComponent(handle).replace(/^@/, "");

    try { } catch { }

    return {
        title: `@${cleanHandle}'s Following`,
        description: "View user following on Feedo.",
    }
}

export default async function UserProfileFollowersPage({ params }: UserFollowingPageProps) {
    const { handle } = await params;
    return <UserFollowView handle={handle} type="followers" />;
}
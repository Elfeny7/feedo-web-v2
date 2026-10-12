import type { Metadata } from "next";
import { UserProfileView } from "@/components/views/user-profile-view";

interface UserProfilePageProps {
    params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: UserProfilePageProps): Promise<Metadata> {
    const { handle } = await params;
    const cleanHandle = decodeURIComponent(handle).replace(/^@/, "");

    try { } catch { }

    return {
        title: "Profile | Feedo",
        description: "View user profile on Feedo.",
    }
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
    const { handle } = await params;
    return <UserProfileView handle={handle} />;
}
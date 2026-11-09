import type { Metadata } from "next";
import { PostDetailView } from "@/features/posts/views/post-detail-view";

interface PostDetailPageProps {
    params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
    const { handle } = await params;
    const cleanHandle = decodeURIComponent(handle).replace(/^@/, "");

    try { } catch { }

    return {
        title: `@${cleanHandle}'s Post`,
        description: "View user post on Feedo.",
    }
}

export default function PostDetailPage() {
  return <PostDetailView />;
}
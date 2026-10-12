import type { UserData } from "@/types/auth";
import type { PaginatedResponse } from  "@/types/api";

export type PostData = {
    id: number,
    content: string | null
    user: UserData,
    likes_count: number,
    is_liked: boolean,
    created_at: string,
    updated_at: string
}

export type PostCollection = PaginatedResponse<PostData>;

export type CreatePostPayload = {
    content: string;
}

export type CreatePost = {
    id: number;
    content: string;
    user: UserData;
    likes_count: number;
    is_liked: boolean;
    created_at: string;
    updated_at: string;
}

export type ToggleLike = {
    status: "liked" | "unliked";
}
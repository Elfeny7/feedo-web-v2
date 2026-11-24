import type { UserData } from "@/types/auth";
import type { PaginatedResponse } from "@/types/api";

export type PostMediaData = {
    id: number;
    url: string;
    type: string;
    sort_order: number;
};

export type PostData = {
    id: number;
    content: string | null;
    media?: PostMediaData[];
    user: UserData;
    likes_count: number;
    comments_count?: number;
    is_liked: boolean;
    created_at: string;
    updated_at: string;
};

export type PostCollection = PaginatedResponse<PostData>;

export type CreatePostPayload = {
    content?: string | null;
    media?: File[];
};

export type UpdatePostPayload = {
    content: string | null;
};

export type CreatePost = {
    id: number;
    content: string | null;
    media?: PostMediaData[];
    user: UserData;
    likes_count: number;
    comments_count?: number;
    is_liked: boolean;
    created_at: string;
    updated_at: string;
};

export type ToggleLike = {
    status: "liked" | "unliked";
};

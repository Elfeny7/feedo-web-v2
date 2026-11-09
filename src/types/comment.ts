import type { UserData } from "@/types/auth";
import type { PaginatedResponse } from "@/types/api";

export type CommentData = {
    id: number;
    content: string;
    user: UserData;
    likes_count: number;
    is_liked: boolean;
    created_at: string;
    updated_at: string;
};

export type CommentCollection = PaginatedResponse<CommentData>;

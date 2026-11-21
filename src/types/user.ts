import type { UserData } from "@/types/auth";
import type { PaginatedResponse } from "@/types/api";

export type UpdateProfilePayload = {
    name: string;
    bio?: string | null;
    avatar?: File | null;
    banner?: File | null;
    remove_avatar?: boolean;
    remove_banner?: boolean;
};

export type ToggleFollow = {
    status: "followed" | "unfollowed";
};

export type UserSuggestions = UserData[];

export type UserCollection = PaginatedResponse<UserData>;

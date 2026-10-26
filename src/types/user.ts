import type { UserData } from "@/types/auth";
import type { PaginatedResponse } from  "@/types/api";


export type UpdateProfilePayload = {
    name: string,
    bio: string,
}

export type ToggleFollow = {
    status: "followed" | "unfollowed";
}

export type UserSuggestions = UserData[];

export type UserCollection = PaginatedResponse<UserData>;
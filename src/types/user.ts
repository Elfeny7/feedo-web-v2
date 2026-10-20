import type { UserData } from "@/types/auth";

export type UpdateProfilePayload = {
    name: string,
    bio: string,
}

export type ToggleFollow = {
    status: "followed" | "unfollowed";
}

export type UserSuggestions = UserData[];
export type UpdateProfilePayload = {
    name: string,
    bio: string,
}

export type ToggleFollow = {
    status: "followed" | "unfollowed";
}
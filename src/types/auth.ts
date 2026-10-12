export type AuthData = {
    access_token: string,
    expires_in: number,
    user: UserData,
}

export type UserData = {
    id: number,
    name: string,
    email: string,
    handle: string,
    bio: string,
    followers_count?: number,
    followings_count?: number,
    posts_count?: number,
    is_followed?: boolean,
}
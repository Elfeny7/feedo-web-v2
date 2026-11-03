import { client } from "@/lib/fetcher";
import { UserCollection } from "@/types/user";

export const followApi = {
  getFollowList: (handle: string, type: "following" | "followers", page: number) =>
    client.get<UserCollection>(`/api/users/${encodeURIComponent(handle)}/${type}?page=${page}`),
  toggleFollow: (handle: string) =>
    client.post(`/api/users/${encodeURIComponent(handle)}/follow`),
};

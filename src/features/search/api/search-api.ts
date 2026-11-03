import { client } from "@/lib/fetcher";
import { UserData } from "@/types/auth";

export const searchApi = {
  getSuggestions: (limit: string) =>
    client.get<UserData[]>(`/api/users/suggestions?limit=${encodeURIComponent(limit)}`),
  searchUsers: (query: string) =>
    client.get<UserData[]>(`/api/users/search?q=${encodeURIComponent(query)}`),
};

import { client } from "@/lib/fetcher";
import type { UserData } from "@/types/auth";
import type { UpdateProfilePayload } from "@/types/user";

export const profileApi = {
  getUserProfile: (handle: string) =>
    client.get<UserData>(`/api/users/${encodeURIComponent(handle)}`),
  updateProfile: (payload: UpdateProfilePayload) =>
    client.post("/api/users/update-profile", payload),
};

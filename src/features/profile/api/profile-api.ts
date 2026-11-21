import { client } from "@/lib/fetcher";
import type { UserData } from "@/types/auth";
import type { UpdateProfilePayload } from "@/types/user";

export const profileApi = {
  getUserProfile: (handle: string) =>
    client.get<UserData>(`/api/users/${encodeURIComponent(handle)}`),
  updateProfile: (payload: UpdateProfilePayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("bio", payload.bio ?? "");

    if (payload.avatar) {
      formData.append("avatar", payload.avatar);
    }
    if (payload.banner) {
      formData.append("banner", payload.banner);
    }
    if (payload.remove_avatar) {
      formData.append("remove_avatar", "1");
    }
    if (payload.remove_banner) {
      formData.append("remove_banner", "1");
    }

    return client.post<UserData>("/api/users/update-profile", formData);
  },
};

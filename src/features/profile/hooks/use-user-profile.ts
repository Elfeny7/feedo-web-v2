import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/features/profile/api/profile-api";

export function useUserProfile(handle: string) {
    return useQuery({
        queryKey: ["user-profile", handle],
        queryFn: async () => {
            const responseData = await profileApi.getUserProfile(handle);
            const user = responseData?.data;

            if (!user) {
                return null;
            }

            return user;
        },
        staleTime: 60 * 1000,
    });
}
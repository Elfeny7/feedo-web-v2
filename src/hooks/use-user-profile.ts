import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import { UserData } from "@/types/auth";

export function useUserProfile(handle: string) {
    return useQuery({
        queryKey: ["user-profile", handle],
        queryFn: async () => {
            const responseData = await client.get<UserData>(`/api/users/${encodeURIComponent(handle)}`);
            const user = responseData?.data;

            if (!user) {
                return null;
            }

            return user;
        },
        staleTime: 60 * 1000,
    });
}
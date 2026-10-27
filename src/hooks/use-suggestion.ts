import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import { UserData } from "@/types/auth";

export function useSuggestion(limit: string) {
    return useQuery({
        queryKey: ["suggestions"],
        queryFn: async () => {
            const responseData = await client.get<UserData[]>(`/api/users/suggestions?limit=${limit}`);
            const suggestedUser = responseData?.data;

            return suggestedUser;
        },
        staleTime: 60 * 60 * 1000,
    });
}

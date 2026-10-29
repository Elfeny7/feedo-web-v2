import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import { UserData } from "@/types/auth";

export function useSearch(query: string) {
    return useQuery({
        queryKey: ["search", query],
        queryFn: async () => {
            const responseData = await client.get<UserData[]>(`/api/users/search?q=${encodeURIComponent(query)}`);
            const searchResult = responseData?.data;

            return searchResult;
        },
        enabled: query.length > 2,
        staleTime: 10 * 60 * 1000,
    });
}
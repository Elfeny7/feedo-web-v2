import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/features/search/api/search-api";

export function useSearch(query: string) {
    return useQuery({
        queryKey: ["search", query],
        queryFn: async () => {
            const responseData = await searchApi.searchUsers(query);
            const searchResult = responseData?.data;

            return searchResult;
        },
        enabled: query.length > 2,
        staleTime: 10 * 60 * 1000,
    });
}
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/features/search/api/search-api";
import { queryKeys } from "@/lib/query-keys";

export function useSearch(query: string) {
    return useQuery({
        queryKey: queryKeys.search.query(query),
        queryFn: async () => {
            const responseData = await searchApi.searchUsers(query);
            const searchResult = responseData?.data;

            return searchResult;
        },
        enabled: query.length > 2,
        staleTime: 10 * 60 * 1000,
    });
}
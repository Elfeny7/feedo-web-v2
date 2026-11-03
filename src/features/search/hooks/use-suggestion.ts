import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/features/search/api/search-api";

export function useSuggestion(limit: string) {
    return useQuery({
        queryKey: ["suggestions"],
        queryFn: async () => {
            const responseData = await searchApi.getSuggestions(limit);
            const suggestedUser = responseData?.data;

            return suggestedUser;
        },
        staleTime: 60 * 60 * 1000,
    });
}

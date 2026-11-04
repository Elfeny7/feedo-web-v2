import { useInfiniteQuery } from "@tanstack/react-query";
import { feedApi } from "@/features/feed/api/feed-api";
import { queryKeys } from "@/lib/query-keys";

export function useFeed() {
    return useInfiniteQuery({
        queryKey: queryKeys.feed.all,
        initialPageParam: 1,
        queryFn: ({ pageParam }) => {
            return feedApi.getFeed(pageParam);
        },
        getNextPageParam: (lastPage) => {
            const meta = lastPage?.data?.meta;

            if (!meta || meta.current_page >= meta.last_page) {
                return undefined;
            }

            return meta.current_page + 1;
        },
        staleTime: 60 * 1000,
    });
}
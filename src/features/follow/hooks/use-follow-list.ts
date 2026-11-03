import { useInfiniteQuery } from "@tanstack/react-query";
import { followApi } from "@/features/follow/api/follow-api";

export function useFollowList(handle: string, type: "following" | "followers") {
    return useInfiniteQuery({
        queryKey: ["users", handle, type],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => followApi.getFollowList(handle, type, pageParam),
        getNextPageParam: (lastPage) => {
            const meta = lastPage?.data?.meta;

            if (!meta || meta.current_page >= meta.last_page) {
                return undefined;
            }

            return meta.current_page + 1;
        },
        staleTime: 30 * 1000,
    });
}
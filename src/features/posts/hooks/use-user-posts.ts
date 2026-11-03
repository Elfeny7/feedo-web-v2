import { useInfiniteQuery } from "@tanstack/react-query";
import { postsApi } from "@/features/posts/api/posts-api";

export function useUserPosts(handle: string) {
    return useInfiniteQuery({
        queryKey: ["user-posts", handle],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => postsApi.getUserPosts(handle, pageParam),
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
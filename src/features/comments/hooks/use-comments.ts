import { useInfiniteQuery } from "@tanstack/react-query";
import { commentsApi } from "@/features/comments/api/comments-api";
import { queryKeys } from "@/lib/query-keys";

export function useComments(postId: number, enabled: boolean = true) {
    return useInfiniteQuery({
        queryKey: queryKeys.comments.byPost(postId),
        initialPageParam: 1,
        queryFn: ({ pageParam }) => commentsApi.getComments(postId, pageParam),
        getNextPageParam: (lastPage) => {
            const meta = lastPage?.data?.meta;

            if (!meta || meta.current_page >= meta.last_page) {
                return undefined;
            }

            return meta.current_page + 1;
        },
        enabled,
        staleTime: 60 * 1000,
    });
}

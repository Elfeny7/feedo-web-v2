import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/features/posts/api/posts-api";
import { queryKeys } from "@/lib/query-keys";

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: number) => postsApi.deletePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.feed.all,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.users.all,
            });
        },
    });
}

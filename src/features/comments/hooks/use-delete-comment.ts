import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "@/features/comments/api/comments-api";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteComment(postId?: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: number) => commentsApi.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: postId
                    ? queryKeys.comments.byPost(postId)
                    : queryKeys.comments.all,
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.feed.all,
            });
        },
    });
}

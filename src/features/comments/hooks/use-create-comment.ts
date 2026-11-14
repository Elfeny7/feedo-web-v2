import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentsApi } from "@/features/comments/api/comments-api";
import type { CreateCommentPayload } from "@/types/comment";
import { queryKeys } from "@/lib/query-keys";

export function useCreateComment(postId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateCommentPayload) =>
            commentsApi.createComment(postId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.comments.byPost(postId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.feed.all,
            });
        },
    });
}

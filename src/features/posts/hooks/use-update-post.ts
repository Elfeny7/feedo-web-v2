import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/features/posts/api/posts-api";
import type { UpdatePostPayload } from "@/types/post";
import { queryKeys } from "@/lib/query-keys";

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            postId,
            payload,
        }: {
            postId: number;
            payload: UpdatePostPayload;
        }) => postsApi.updatePost(postId, payload),
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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "@/features/posts/api/posts-api";
import type { CreatePostPayload } from "@/types/post";

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePostPayload) => postsApi.createPost(payload),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["feed"],
        })
    })
}
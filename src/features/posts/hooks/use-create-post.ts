import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import { CreatePostPayload } from "@/types/post";

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreatePostPayload) => client.post("/api/post", payload),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: ["feed"],
        })
    })
}
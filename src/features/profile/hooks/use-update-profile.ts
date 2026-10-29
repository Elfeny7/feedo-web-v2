import { client } from "@/lib/fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProfilePayload } from "@/types/user";

export function useUpdateProfile(handle: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProfilePayload) => client.post("api/users/update-profile", payload),
        onSuccess: async () => await Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["user-profile", handle],
            }),
            queryClient.invalidateQueries({
                queryKey: ["user-posts", handle],
            }),
        ]),
    });
}
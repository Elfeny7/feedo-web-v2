import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import type { UserData } from "@/types/auth";

export function useToggleFollow() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (handle: string) => client.post(`/api/users/${encodeURIComponent(handle)}/follow`),
        onMutate: async (handle) => {
            await queryClient.cancelQueries({
                queryKey: ["user-profile", handle],
            });

            const previousProfile = queryClient.getQueryData<UserData>(["user-profile", handle]);

            queryClient.setQueryData<UserData>(["user-profile", handle], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    is_followed: !oldData.is_followed,
                    followers_count: oldData.is_followed
                    ? oldData.followers_count! - 1
                    : oldData.followers_count! + 1
                }
            });

            return { previousProfile };
        },
        onError: (_error, handle, context) => {
            if (context?.previousProfile) {
                queryClient.setQueryData(
                    ["user-profile", handle],
                    context.previousProfile
                )
            }
        },
        onSettled: (_data, _error, handle) => {
            queryClient.invalidateQueries({
                queryKey: ["user-profile", handle],
            });
        },
    });
}
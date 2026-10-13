import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import type { ResponseData } from "@/types/api";
import type { UserData } from "@/types/auth";

export function useToggleFollow() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (handle: string) => client.post(`/api/users/${encodeURIComponent(handle)}/follow`),
        onMutate: async (handle) => {
            await queryClient.cancelQueries({
                queryKey: ["user-profile", handle],
            });

            const previousProfile = queryClient.getQueryData<ResponseData<UserData>>(["user-profile", handle]);

            queryClient.setQueryData<ResponseData<UserData>>(["user-profile", handle], (oldData) => {
                if (!oldData) return oldData;
                if (!oldData.data) return oldData;

                return {
                    ...oldData,
                    data: {
                        ...oldData.data,
                        is_followed: !oldData.data.is_followed,
                    },
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
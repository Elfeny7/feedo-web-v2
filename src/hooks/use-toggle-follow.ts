import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import type { UserData } from "@/types/auth";

function toggleFollowUser(user: UserData): UserData {
    const isFollowed = user.is_followed;
    const followersCount = user.followers_count ?? 0;

    return {
        ...user,
        is_followed: !isFollowed,
        followers_count: isFollowed
            ? Math.max(0, followersCount - 1)
            : followersCount + 1,
    };
}

export function useToggleFollow() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (handle: string) => client.post(`/api/users/${encodeURIComponent(handle)}/follow`),
        onMutate: async (handle) => {
            await Promise.all([
                queryClient.cancelQueries({
                    queryKey: ["user-profile", handle],
                }),
                queryClient.cancelQueries({
                    queryKey: ["suggestions"],
                }),
                queryClient.cancelQueries({
                    queryKey: ["search"],
                }),
            ]);

            const previousProfile = queryClient.getQueryData<UserData>(["user-profile", handle]);
            const previousSuggestions = queryClient.getQueryData<UserData[]>(["suggestions"]);
            const previousSearch = queryClient.getQueriesData<UserData[]>({
                queryKey: ["search"],
            });

            queryClient.setQueryData<UserData>(
                ["user-profile", handle],
                (oldData) => {
                    if (!oldData) return oldData;

                    return toggleFollowUser(oldData);
                }
            );

            queryClient.setQueryData<UserData[]>(
                ["suggestions"],
                (oldData) =>
                    oldData?.map((user) =>
                        user.handle === handle
                            ? toggleFollowUser(user)
                            : user
                    )
            );

            queryClient.setQueriesData<UserData[]>(
                { queryKey: ["search"] },
                (oldData) =>
                    oldData?.map((user) =>
                        user.handle === handle
                            ? toggleFollowUser(user)
                            : user
                    )
            );

            return { previousProfile, previousSuggestions, previousSearch };
        },
        onError: (_error, handle, context) => {
            if (context?.previousProfile !== undefined) {
                queryClient.setQueryData(
                    ["user-profile", handle],
                    context.previousProfile
                );
            }

            if (context?.previousSuggestions !== undefined) {
                queryClient.setQueryData(
                    ["suggestions"],
                    context.previousSuggestions
                );
            }
            context?.previousSearch?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSettled: (_data, _error, handle) => {
            queryClient.invalidateQueries({
                queryKey: ["user-profile", handle],
            });
            // queryClient.invalidateQueries({
            //     queryKey: ["suggestions"],
            // });
            queryClient.invalidateQueries({
                queryKey: ["search"],
            });
        },
    });
}
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import type { UserData } from "@/types/auth";
import type { UserCollection } from "@/types/user";
import type { InfiniteData } from "@tanstack/react-query";
import type { ResponseData } from "@/types/api";

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

function updateFollowList(
    oldData:
        | InfiniteData<ResponseData<UserCollection>>
        | undefined,
    targetHandle: string,
): InfiniteData<ResponseData<UserCollection>> | undefined {
    if (!oldData) return oldData;

    return {
        ...oldData,
        pages: oldData.pages.map((response) => {
            if (!response?.data) return response;

            return {
                ...response,
                data: {
                    ...response.data,
                    data: response.data.data.map((user) =>
                        user.handle === targetHandle
                            ? toggleFollowUser(user)
                            : user,
                    ),
                },
            };
        }),
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
                    queryKey: ["me"],
                }),
                queryClient.cancelQueries({
                    queryKey: ["suggestions"],
                }),
                queryClient.cancelQueries({
                    queryKey: ["search"],
                }),
                queryClient.cancelQueries({
                    queryKey: ["users"],
                }),
            ]);

            const me = queryClient.getQueryData<UserData>(["me"]);
            const myHandle = me?.handle;

            const previousProfile = queryClient.getQueryData<UserData>(["user-profile", handle]);
            const previousMe = myHandle ? queryClient.getQueryData<UserData>(["user-profile", myHandle]) : undefined;
            const previousSuggestions = queryClient.getQueryData<UserData[]>(["suggestions"]);
            const previousSearch = queryClient.getQueriesData<UserData[]>({
                queryKey: ["search"],
            });
            const previousUserLists =
                queryClient.getQueriesData<
                    InfiniteData<ResponseData<UserCollection>>
                >({
                    queryKey: ["users"],
                });

            const userFromSearch = previousSearch
                .flatMap(([, data]) => {
                    return Array.isArray(data) ? data : [];
                })
                .find((user) => user.handle === handle);

            const userFromSuggestions = previousSuggestions?.find(
                (user) => user.handle === handle,
            );

            const targetUser = previousProfile ?? userFromSearch ?? userFromSuggestions;

            const isCurrentlyFollowed = targetUser?.is_followed;

            queryClient.setQueryData<UserData>(
                ["user-profile", handle],
                (oldData) => {
                    if (!oldData) return oldData;

                    return toggleFollowUser(oldData);
                }
            );

            if (
                previousMe?.followings_count !== undefined &&
                isCurrentlyFollowed !== undefined &&
                myHandle
            ) {
                queryClient.setQueryData<UserData>(
                    ["user-profile", myHandle],
                    {
                        ...previousMe,
                        followings_count: Math.max(
                            0,
                            previousMe.followings_count +
                            (isCurrentlyFollowed ? -1 : 1),
                        ),
                    },
                );
            }

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

            previousUserLists.forEach(([queryKey]) => {
                queryClient.setQueryData<
                    InfiniteData<ResponseData<UserCollection>>
                >(queryKey, (oldData) => updateFollowList(oldData, handle));
            });

            return { myHandle, previousProfile, previousMe, previousSuggestions, previousSearch, previousUserLists };
        },
        onError: (_error, handle, context) => {
            if (context?.previousProfile !== undefined) {
                queryClient.setQueryData(
                    ["user-profile", handle],
                    context.previousProfile
                );
            }

            if (context?.previousMe !== undefined && context.myHandle) {
                queryClient.setQueryData(
                    ["user-profile", context.myHandle],
                    context.previousMe
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
            context?.previousUserLists?.forEach(([queryKey, data]) => {
                queryClient.setQueryData(queryKey, data);
            });
        },
        onSettled: (_data, _error, handle, context) => {
            queryClient.invalidateQueries({
                queryKey: ["user-profile", handle],
            });
            if (context?.myHandle) {
                queryClient.invalidateQueries({
                    queryKey: ["user-profile", context.myHandle],
                });
            }
            // queryClient.invalidateQueries({
            //     queryKey: ["suggestions"],
            // });
            queryClient.invalidateQueries({
                queryKey: ["search"],
            });
        },
    });
}
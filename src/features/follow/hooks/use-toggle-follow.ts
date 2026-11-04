import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followApi } from "@/features/follow/api/follow-api";
import type { UserData } from "@/types/auth";
import type { UserCollection } from "@/types/user";
import type { InfiniteData } from "@tanstack/react-query";
import type { ResponseData } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";

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
        mutationFn: async (handle: string) => followApi.toggleFollow(handle),
        onMutate: async (handle) => {
            await Promise.all([
                queryClient.cancelQueries({
                    queryKey: queryKeys.users.detail(handle),
                }),
                queryClient.cancelQueries({
                    queryKey: queryKeys.auth.currentUser,
                }),
                queryClient.cancelQueries({
                    queryKey: queryKeys.suggestions.all,
                }),
                queryClient.cancelQueries({
                    queryKey: queryKeys.search.all,
                }),
                queryClient.cancelQueries({
                    queryKey: queryKeys.users.all,
                }),
            ]);

            const me = queryClient.getQueryData<UserData>(queryKeys.auth.currentUser);
            const myHandle = me?.handle;

            const previousProfile = queryClient.getQueryData<UserData>(queryKeys.users.detail(handle));
            const previousMe = myHandle ? queryClient.getQueryData<UserData>(queryKeys.users.detail(myHandle)) : undefined;
            const previousSuggestions = queryClient.getQueryData<UserData[]>(queryKeys.suggestions.all);
            const previousSearch = queryClient.getQueriesData<UserData[]>({
                queryKey: queryKeys.search.all,
            });
            const previousUserLists =
                queryClient.getQueriesData<
                    InfiniteData<ResponseData<UserCollection>>
                >({
                    queryKey: queryKeys.users.all,
                    predicate: (query) =>
                        query.queryKey[2] === "following" ||
                        query.queryKey[2] === "followers",
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
                queryKeys.users.detail(handle),
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
                    queryKeys.users.detail(myHandle),
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
                queryKeys.suggestions.all,
                (oldData) =>
                    oldData?.map((user) =>
                        user.handle === handle
                            ? toggleFollowUser(user)
                            : user
                    )
            );

            queryClient.setQueriesData<UserData[]>(
                { queryKey: queryKeys.search.all },
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
                    queryKeys.users.detail(handle),
                    context.previousProfile
                );
            }

            if (context?.previousMe !== undefined && context.myHandle) {
                queryClient.setQueryData(
                    queryKeys.users.detail(context.myHandle),
                    context.previousMe
                );
            }

            if (context?.previousSuggestions !== undefined) {
                queryClient.setQueryData(
                    queryKeys.suggestions.all,
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
                queryKey: queryKeys.users.detail(handle),
            });
            if (context?.myHandle) {
                queryClient.invalidateQueries({
                    queryKey: queryKeys.users.detail(context.myHandle),
                });
            }
            // queryClient.invalidateQueries({
            //     queryKey: queryKeys.suggestions.all,
            // });
            queryClient.invalidateQueries({
                queryKey: queryKeys.search.all,
            });
        },
    });
}
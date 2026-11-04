import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeApi } from "@/features/like/api/like-api";
import type { InfiniteData } from "@tanstack/react-query";
import type { PostCollection } from "@/types/post";
import type { ResponseData } from "@/types/api";
import type { PostData } from "@/types/post";
import { queryKeys } from "@/lib/query-keys";

type FeedData = InfiniteData<
    ResponseData<PostCollection>,
    number
>;

type ToggleLikeContext = {
    previousFeed: FeedData | undefined;
    previousUserPosts: [
        readonly unknown[],
        FeedData | undefined,
    ][];
};

export function useToggleLike() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (postId: number) => likeApi.toggleLike(postId),
        onMutate: async (postId): Promise<ToggleLikeContext> => {
            await Promise.all([
                queryClient.cancelQueries({
                    queryKey: queryKeys.feed.all,
                }),
                queryClient.cancelQueries({
                    queryKey: queryKeys.users.all,
                    predicate: (query) => query.queryKey[2] === "posts",
                }),
            ])

            const previousFeed = queryClient.getQueryData<FeedData>(queryKeys.feed.all);
            const previousUserPosts = queryClient.getQueriesData<FeedData>({
                queryKey: queryKeys.users.all,
                predicate: (query) => query.queryKey[2] === "posts",
            });

            const togglePostLike = (oldData: FeedData | undefined): FeedData | undefined => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => {
                        if (!page?.data) return page;

                        return {
                            ...page,
                            data: {
                                ...page.data,
                                data: page.data.data.map((post: PostData) => {
                                    if (post.id !== postId) return post;

                                    const isLiked = !post.is_liked;

                                    return {
                                        ...post,
                                        is_liked: isLiked,
                                        likes_count: Math.max(
                                            0,
                                            post.likes_count + (isLiked ? 1 : -1)
                                        ),
                                    };
                                }),
                            },
                        };
                    }),
                };
            }

            queryClient.setQueryData<FeedData>(queryKeys.feed.all, (oldData) => togglePostLike(oldData));
            queryClient.setQueriesData<FeedData>(
                {
                    queryKey: queryKeys.users.all,
                    predicate: (query) => query.queryKey[2] === "posts",
                },
                (oldData) => togglePostLike(oldData),
            );

            return { previousFeed, previousUserPosts };
        },
        onError: (_error, _postId, context) => {
            if (!context) return;
            if (context?.previousFeed) {
                queryClient.setQueryData(
                    queryKeys.feed.all,
                    context.previousFeed
                );
            }
            for (const [queryKey, previousData] of context.previousUserPosts) {
                queryClient.setQueryData(queryKey, previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.feed.all,
            });
        },
    });
}
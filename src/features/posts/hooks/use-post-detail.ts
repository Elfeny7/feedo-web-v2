import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { postsApi } from "@/features/posts/api/posts-api";
import type { PostCollection, PostData } from "@/types/post";
import type { ResponseData } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";

type FeedInfiniteData = InfiniteData<ResponseData<PostCollection>, number>;

export function usePostDetail(postId: number) {
    const queryClient = useQueryClient();

    const findCachedPost = (): {
        post: PostData;
        updatedAt: number | undefined;
    } | null => {
        const feedCache = queryClient.getQueryData<FeedInfiniteData>(
            queryKeys.feed.all
        );
        const feedFromCache = feedCache?.pages
            .flatMap((page) => page?.data?.data ?? [])
            .find((p) => p.id === postId);

        if (feedFromCache) {
            const state = queryClient.getQueryState(queryKeys.feed.all);
            return {
                post: feedFromCache,
                updatedAt: state?.dataUpdatedAt,
            };
        }

        const userPostsCaches = queryClient.getQueriesData<FeedInfiniteData>({
            queryKey: queryKeys.users.all,
            predicate: (query) => query.queryKey[2] === "posts",
        });

        for (const [queryKey, cache] of userPostsCaches) {
            const userPostFromCache = cache?.pages
                .flatMap((page) => page?.data?.data ?? [])
                .find((p) => p.id === postId);

            if (userPostFromCache) {
                const state = queryClient.getQueryState(queryKey);
                return {
                    post: userPostFromCache,
                    updatedAt: state?.dataUpdatedAt,
                };
            }
        }

        return null;
    };

    return useQuery({
        queryKey: queryKeys.posts.detail(postId),
        queryFn: async () => {
            const responseData = await postsApi.getPostDetail(postId);
            return responseData?.data ?? null;
        },
        initialData: () => findCachedPost()?.post,
        initialDataUpdatedAt: () => findCachedPost()?.updatedAt,
        staleTime: 60 * 1000,
    });
}

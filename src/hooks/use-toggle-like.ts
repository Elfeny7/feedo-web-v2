import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";
import type { InfiniteData } from "@tanstack/react-query";
import type { PostCollection } from "@/types/post";
import type { ResponseData } from "@/types/api";

export function useToggleLike() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (postId: number) => client.post(`/api/post/${postId}/like`),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({
                queryKey: ["feed"],
            });

            const previousFeed = queryClient.getQueryData<InfiniteData<ResponseData<PostCollection>, number>>(["feed"]);

            queryClient.setQueryData<InfiniteData<ResponseData<PostCollection>, number>>(["feed"], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,

                    pages: oldData.pages.map((page) => {
                        if (!page) {
                            return page;
                        }

                        if (!page.data) {
                            return page;
                        }

                        return {
                            ...page,

                            data: {
                                ...page.data,

                                data: page.data.data.map((post) => {
                                    if (post.id !== postId) {
                                        return post;
                                    }

                                    return {
                                        ...post,
                                        is_liked: !post.is_liked,
                                        likes_count: post.is_liked
                                            ? post.likes_count - 1
                                            : post.likes_count + 1,
                                    };
                                }),
                            },
                        };
                    }),

                    pageParams: oldData.pageParams,
                };
            });

            return { previousFeed };
        },
        onError: (_error, _postId, context) => {
            if (context?.previousFeed) {
                queryClient.setQueryData(
                    ["feed"],
                    context.previousFeed
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["feed"],
            });
        },
    });
}
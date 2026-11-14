import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { commentsApi } from "@/features/comments/api/comments-api";
import type { CommentCollection, CommentData } from "@/types/comment";
import type { ResponseData } from "@/types/api";
import { queryKeys } from "@/lib/query-keys";

type CommentsQueryData = InfiniteData<
    ResponseData<CommentCollection>,
    number
>;

type ToggleCommentLikeContext = {
    previousComments: [
        readonly unknown[],
        CommentsQueryData | undefined,
    ][];
};

export function useToggleCommentLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (commentId: number) => commentsApi.toggleLike(commentId),
        onMutate: async (commentId): Promise<ToggleCommentLikeContext> => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.comments.all,
            });

            const previousComments = queryClient.getQueriesData<CommentsQueryData>({
                queryKey: queryKeys.comments.all,
            });

            const toggleLikeInPages = (
                oldData: CommentsQueryData | undefined
            ): CommentsQueryData | undefined => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => {
                        if (!page?.data) return page;

                        return {
                            ...page,
                            data: {
                                ...page.data,
                                data: page.data.data.map((comment: CommentData) => {
                                    if (comment.id !== commentId) return comment;

                                    const isLiked = !comment.is_liked;

                                    return {
                                        ...comment,
                                        is_liked: isLiked,
                                        likes_count: Math.max(
                                            0,
                                            comment.likes_count + (isLiked ? 1 : -1)
                                        ),
                                    };
                                }),
                            },
                        };
                    }),
                };
            };

            queryClient.setQueriesData<CommentsQueryData>(
                {
                    queryKey: queryKeys.comments.all,
                },
                (oldData) => toggleLikeInPages(oldData)
            );

            return { previousComments };
        },
        onError: (_error, _commentId, context) => {
            if (!context) return;

            for (const [queryKey, previousData] of context.previousComments) {
                queryClient.setQueryData(queryKey, previousData);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.comments.all,
            });
        },
    });
}

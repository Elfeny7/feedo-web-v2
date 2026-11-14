import { client } from "@/lib/fetcher";
import type {
  CommentCollection,
  CreateComment,
  CreateCommentPayload,
  ToggleCommentLike,
} from "@/types/comment";

export const commentsApi = {
  getComments: (postId: number, page: number) =>
    client.get<CommentCollection>(`/api/post/${postId}/comments?page=${page}`),
  createComment: (postId: number, payload: CreateCommentPayload) =>
    client.post<CreateComment>(`/api/post/${postId}/comments`, payload),
  deleteComment: (commentId: number) =>
    client.delete(`/api/comment/${commentId}`),
  toggleLike: (commentId: number) =>
    client.post<ToggleCommentLike>(`/api/comment/${commentId}/like`),
};

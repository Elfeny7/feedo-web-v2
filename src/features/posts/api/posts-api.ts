import { client } from "@/lib/fetcher";
import type {
  CreatePost,
  CreatePostPayload,
  PostCollection,
  PostData,
  UpdatePostPayload,
} from "@/types/post";

export const postsApi = {
  getUserPosts: (handle: string, page: number) =>
    client.get<PostCollection>(`/api/users/${encodeURIComponent(handle)}/posts?page=${page}`),
  createPost: (payload: CreatePostPayload) => {
    const formData = new FormData();

    if (payload.content && payload.content.trim().length > 0) {
      formData.append("content", payload.content.trim());
    }

    if (payload.media && payload.media.length > 0) {
      payload.media.forEach((file) => {
        formData.append("media[]", file);
      });
    }

    return client.post<CreatePost>("/api/post", formData);
  },
  updatePost: (postId: number, payload: UpdatePostPayload) =>
    client.put<PostData>(`/api/post/${postId}`, payload),
  deletePost: (postId: number) => client.delete(`/api/post/${postId}`),
};

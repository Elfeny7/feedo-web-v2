import { client } from "@/lib/fetcher";
import type { CreatePostPayload, PostCollection } from "@/types/post";

export const postsApi = {
  getUserPosts: (handle: string, page: number) =>
    client.get<PostCollection>(`/api/users/${encodeURIComponent(handle)}/posts?page=${page}`),
  createPost: (payload: CreatePostPayload) => client.post("/api/post", payload),
};

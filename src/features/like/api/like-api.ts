import { client } from "@/lib/fetcher";

export const likeApi = {
  toggleLike: (postId: number) => client.post(`/api/post/${postId}/like`),
};

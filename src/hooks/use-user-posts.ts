import { PostCollection } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";

export function useUserPosts(handle: string) {
    return useInfiniteQuery({
        queryKey: ["user-posts", handle],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => client.get<PostCollection>(`/api/users/${encodeURIComponent(handle)}/posts?page=${pageParam}`),
        getNextPageParam: (lastPage) => {
            const meta = lastPage?.data?.meta;

            if (!meta || meta.current_page >= meta.last_page) {
                return undefined;
            }

            return meta.current_page + 1;
        },
        staleTime: 60 * 1000,
    });
}
import { UserCollection } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/fetcher";

export function useFollowList(handle: string, type: "following" | "followers") {
    return useInfiniteQuery({
        queryKey: ["users", handle, type],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => {
            if (type === "following") {
                return client.get<UserCollection>(
                    `/api/users/${handle}/following?page=${pageParam}`
                );
            } else {
                return client.get<UserCollection>(
                    `/api/users/${handle}/followers?page=${pageParam}`
                );
            }
        },
        getNextPageParam: (lastPage) => {
            const meta = lastPage?.data?.meta;

            if (!meta || meta.current_page >= meta.last_page) {
                return undefined;
            }

            return meta.current_page + 1;
        },
    });
}
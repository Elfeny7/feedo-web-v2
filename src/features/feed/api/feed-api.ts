import { PostCollection } from "@/types/post";
import { client } from "@/lib/fetcher";

export const feedApi = {
    getFeed: (page: number) => {
        return client.get<PostCollection>(
            `/api/feed?page=${page}`
        );
    },
};

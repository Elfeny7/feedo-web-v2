import { useEffect, useRef } from "react";

export function useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
}: {
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    fetchNextPage: () => void,
}) {
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = loadMoreRef.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            {
                rootMargin: "200px",
            }
        );

        observer.observe(element);

        return () => observer.disconnect();

    }, [
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    ]);

    return loadMoreRef;
}
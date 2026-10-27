import { Skeleton } from "@/components/ui/skeleton";

export function UserItemSkeleton() {
    return (
        <div className="p-4 sm:px-6 border-b border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3.5 w-24" />
                </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-full shrink-0" />
        </div>
    );
}

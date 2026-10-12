import { Skeleton } from "@/components/ui/skeleton";

export function PostItemSkeleton() {
    return (
        <div className="p-4 sm:px-6 border-b border-border flex gap-4">
            {/* Avatar */}
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />

            <div className="flex-1 space-y-2 py-1">
                {/* Username + handle */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                </div>

                {/* Post content */}
                <div className="space-y-1.5 pt-1">
                    <Skeleton className="h-3.5 w-full max-w-md" />
                    <Skeleton className="h-3.5 w-3/4 max-w-sm" />
                </div>

                {/* Action */}
                <div className="pt-2">
                    <Skeleton className="h-4 w-12" />
                </div>
            </div>
        </div>
    );
}
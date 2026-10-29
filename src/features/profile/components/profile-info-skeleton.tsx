import { Skeleton } from "@/components/ui/skeleton";

function StatSkeleton() {
    return (
        <div className="flex flex-col items-center w-20 gap-2">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-3 w-16" />
        </div>
    );
}

export function ProfileInfoSkeleton() {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Avatar */}
            <Skeleton className="self-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background mt-[-12%] sm:mt-[-16%] relative z-0 mb-3 shadow-sm" />

            {/* Name and Handle */}
            <div className="flex flex-col self-center items-center text-center w-full gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
            </div>

            {/* Bio */}
            <div className="mt-4 flex flex-col items-center w-full gap-2">
                <Skeleton className="h-4 w-64 max-w-[80%]" />
                <Skeleton className="h-4 w-48 max-w-[60%]" />
            </div>

            {/* Stats */}
            <div className="flex justify-evenly items-center w-full mt-6 mb-2">
                <StatSkeleton />
                <div className="w-px bg-border/80 h-8"></div>
                <StatSkeleton />
                <div className="w-px bg-border/80 h-8"></div>
                <StatSkeleton />
            </div>

            {/* Follow Button */}
            <div className="w-full flex justify-center mt-2">
                <Skeleton className="h-10 w-32 rounded-full" />
            </div>

        </div>
    );
}

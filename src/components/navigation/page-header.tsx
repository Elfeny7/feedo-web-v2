"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@/components/icons";

type PageHeaderProps = {
    title: React.ReactNode;
    isLoading?: boolean;
    showBackButton?: boolean;
    loadingWidth?: string;
    onBack?: () => void;
};

export function PageHeader({
    title,
    isLoading = false,
    showBackButton = false,
    loadingWidth = "w-28",
    onBack,
}: PageHeaderProps) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border px-4 sm:px-6 h-15 flex items-center gap-4">
            {showBackButton && (
                <button
                    onClick={onBack ?? (() => router.back())}
                    className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
                    aria-label="Back"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
            )}
            {isLoading ? (
                <div
                    className={`h-5 ${loadingWidth} bg-muted animate-pulse rounded-md`}
                    aria-hidden="true"
                />
            ) : (
                <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            )}
        </header>
    );
}

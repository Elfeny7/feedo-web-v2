"use client";

import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import { useSuggestion } from "@/hooks/use-suggestion";
import { SearchIcon } from "@/components/icons";
import { UserItem } from "@/components/widgets/user-item";

export function SearchView() {
    const [query, setQuery] = useState("");

    const debouncedQuery = useDebounce(query, 300);

    const searchQuery = useSearch(debouncedQuery);
    const suggestionsQuery = useSuggestion("5");

    const isSearching = debouncedQuery.length > 0;

    const users = isSearching
        ? searchQuery.data ?? []
        : suggestionsQuery.data ?? [];

    const isLoading = isSearching
        ? searchQuery.isFetching
        : suggestionsQuery.isLoading

    const isError = isSearching
        ? searchQuery.isError
        : suggestionsQuery.isError

    return (
        <>
            {/* Header */}
            <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border px-4 sm:px-6 h-15 flex items-center">
                <h1 className="text-xl font-bold tracking-tight">Explore Users</h1>
            </header>

            {/* Search Input Area */}
            <div className="p-4 sm:px-6 border-b border-border">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search users by name or handle..."
                        className="w-full bg-muted border border-transparent focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary rounded-full py-2.5 pl-12 pr-4 text-foreground outline-none transition-all"
                    />
                </div>
            </div>

            {/* Search Results */}
            <div className="flex flex-col border-t border-border mt-2">
                <h2 className="text-xl font-extrabold tracking-tight p-4 sm:px-6 mb-2">
                    {debouncedQuery ? "Search Results" : "Suggested Users"}
                </h2>

                {isLoading && users.length === 0 ? (
                    !debouncedQuery ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="p-4 sm:px-6 border-b border-border flex items-center justify-between gap-4 animate-pulse">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-muted shrink-0"></div>
                                    <div className="flex flex-col gap-2 flex-1">
                                        <div className="h-4 w-32 bg-muted rounded-md"></div>
                                        <div className="h-3.5 w-24 bg-muted rounded-md"></div>
                                    </div>
                                </div>
                                <div className="h-8 w-20 bg-muted rounded-full shrink-0"></div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">Searching...</div>
                    )
                ) : users.length === 0 && debouncedQuery.length < 3 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <div className="w-20 h-20 mb-4 rounded-full bg-muted flex items-center justify-center opacity-70">
                            <SearchIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Keep typing to search…</h3>
                        <p className="max-w-70 text-sm">Search require at least 3 characters</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <div className="w-20 h-20 mb-4 rounded-full bg-muted flex items-center justify-center opacity-70">
                            <SearchIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No users found</h3>
                        {debouncedQuery && (
                            <p className="max-w-70 text-sm">We couldn&apos;t find anyone matching &quot;{debouncedQuery}&quot;.</p>
                        )}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <h3 className="text-xl font-bold text-danger mb-2">Failed to load users</h3>
                    </div>
                ) : (
                    users.map((user, i) => (
                        <UserItem key={user.id || i} suggestedUser={user} />
                    ))
                )}
            </div>
        </>
    );
}
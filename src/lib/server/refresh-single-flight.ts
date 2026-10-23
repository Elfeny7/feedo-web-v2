import "server-only";

import { AuthData } from "@/types/auth";
import { backend } from "@/lib/fetcher";
import { ApiError } from "@/types/api";

type RecentRefresh = {
    accessToken: string;
    reuseUntil: number;
};

const refreshPromises = new Map<string, Promise<string>>();
const recentRefreshes = new Map<string, RecentRefresh>();

const REUSE_WINDOW_MS = 5_000;

async function performRefresh(oldToken: string): Promise<string> {
    const responseData = await backend.post<AuthData>("/refresh", oldToken);
    const newToken = responseData?.data?.access_token;

    if (!newToken) {
        throw new ApiError(401, "Token refresh failed", responseData);
    }

    return newToken;
}

export async function refreshsingleFlight(
    oldToken: string,
): Promise<string> {
    const recent = recentRefreshes.get(oldToken);

    if (recent) {
        if (Date.now() < recent.reuseUntil) {
            return recent.accessToken;
        }

        recentRefreshes.delete(oldToken);
    }

    const existingPromise = refreshPromises.get(oldToken);

    if (existingPromise) {
        return existingPromise;
    }

    const promise = Promise.resolve().then(() =>
        performRefresh(oldToken),
    );

    refreshPromises.set(oldToken, promise);

    try {
        const newToken = await promise;

        recentRefreshes.set(oldToken, {
            accessToken: newToken,
            reuseUntil: Date.now() + REUSE_WINDOW_MS,
        });

        return newToken;
        
    } finally {
        if (refreshPromises.get(oldToken) === promise) {
            refreshPromises.delete(oldToken);
        }
    }
}
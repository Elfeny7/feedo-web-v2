import "server-only";

import { AuthData } from "@/types/auth";
import { backend } from "@/lib/fetcher";
import { ApiError } from "@/types/api";

const refreshPromises = new Map<string, Promise<string>>();

async function performRefresh(oldToken: string): Promise<string> {
    const responseData = await backend.post<AuthData>("/refresh", oldToken);
    const newToken = responseData?.data?.access_token;

    if (!newToken) {
        throw new ApiError(401, "Token refresh failed", responseData);
    }

    return newToken;
}

export function refreshsingleFlight(oldToken: string): Promise<string> {
    const existingPromise = refreshPromises.get(oldToken);

    if (existingPromise) {
        return existingPromise;
    }

    const promise = performRefresh(oldToken).finally(() => {
        if (refreshPromises.get(oldToken) === promise) {
            refreshPromises.delete(oldToken);
        }
    });

    refreshPromises.set(oldToken, promise);

    return promise;
}
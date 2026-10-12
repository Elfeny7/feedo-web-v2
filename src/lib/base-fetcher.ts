import { ResponseData, ApiError } from "@/types/api";

export async function baseFetcher<T = unknown>(
    endpoint: string,
    token: string | null = null,
    options: RequestInit = {},
    baseUrl: string = ""
): Promise<ResponseData<T>> {
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${path}`;

    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 204) {
        return null;
    }

    let responseData: ResponseData<T>;
    try {
        responseData = await response.json();
    } catch {
        responseData = null;
    }

    if (!response.ok) {
        const message = responseData?.message || (response.status >= 500
            ? "Internal Server Error"
            : "An error occurred during the request");

        if (response.status === 401 && typeof window !== "undefined" && token) {
            throw new ApiError(401, message || "Authentication Error", responseData);
        }

        throw new ApiError(response.status, message, responseData);
    }

    return responseData;
}

export function browserClient() {
    return {
        get: <T = unknown>(endpoint: string, options?: RequestInit) =>
            baseFetcher<T>(endpoint, null, { ...options, method: "GET" }),

        post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, null, {
                ...options,
                method: "POST",
                body: body !== undefined ? JSON.stringify(body) : undefined,
            }),

        put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, null, {
                ...options,
                method: "PUT",
                body: body !== undefined ? JSON.stringify(body) : undefined,
            }),

        patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, null, {
                ...options,
                method: "PATCH",
                body: body !== undefined ? JSON.stringify(body) : undefined,
            }),

        delete: <T = unknown>(endpoint: string, options?: RequestInit) =>
            baseFetcher<T>(endpoint, null, { ...options, method: "DELETE" }),
    };
}

export function backendClient(baseUrl: string = "") {
    return {
        get: <T = unknown>(endpoint: string, token: string | null = null, options?: RequestInit) =>
            baseFetcher<T>(endpoint, token, { ...options, method: "GET" }, baseUrl),

        post: <T = unknown>(endpoint: string, token: string | null = null, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, token, {
                ...options,
                method: "POST",
                body: body !== undefined ? JSON.stringify(body) : undefined,
            }, baseUrl),

        put: <T = unknown>(endpoint: string, token: string | null = null, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, token, {
                ...options,
                method: "PUT",
                body: body !== undefined ? JSON.stringify(body) : undefined,
            }, baseUrl),

        patch: <T = unknown>(endpoint: string, token: string | null = null, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, token, {
                ...options,
                method: "PATCH",
                body: body !== undefined ? JSON.stringify(body) : undefined,
            }, baseUrl),

        delete: <T = unknown>(endpoint: string, token: string | null = null, options?: RequestInit) =>
            baseFetcher<T>(endpoint, token, { ...options, method: "DELETE" }, baseUrl),
    };
}

import { ResponseData, ApiError } from "@/types/api";

const SERVER_ERROR_MESSAGE =
    "Something went wrong on our server. Please try again later.";
const NETWORK_ERROR_MESSAGE =
    "Unable to connect to the server. Please try again later.";

function serializeBody(body: unknown): BodyInit | undefined {
    if (body === undefined) return undefined;
    if (typeof FormData !== "undefined" && body instanceof FormData) {
        return body;
    }
    return JSON.stringify(body);
}

export async function baseFetcher<T = unknown>(
    endpoint: string,
    token: string | null = null,
    options: RequestInit = {},
    baseUrl: string = ""
): Promise<ResponseData<T>> {
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${cleanBaseUrl}${path}`;

    const isFormData =
        typeof FormData !== "undefined" && options.body instanceof FormData;

    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type") && !isFormData) {
        headers.set("Content-Type", "application/json");
    }
    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            headers,
        });
    } catch {
        throw new ApiError(503, NETWORK_ERROR_MESSAGE, {
            success: false,
            message: NETWORK_ERROR_MESSAGE,
        });
    }

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
        const isServerError = response.status >= 500;
        const message = isServerError
            ? SERVER_ERROR_MESSAGE
            : responseData?.message || "An error occurred during the request";

        const sanitizedResponseData: ResponseData<T> = isServerError
            ? { success: false, message: SERVER_ERROR_MESSAGE }
            : responseData;

        if (response.status === 401 && typeof window !== "undefined" && token) {
            throw new ApiError(
                401,
                message || "Authentication Error",
                sanitizedResponseData
            );
        }

        throw new ApiError(response.status, message, sanitizedResponseData);
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
                body: serializeBody(body),
            }),

        put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, null, {
                ...options,
                method: "PUT",
                body: serializeBody(body),
            }),

        patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, null, {
                ...options,
                method: "PATCH",
                body: serializeBody(body),
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
                body: serializeBody(body),
            }, baseUrl),

        put: <T = unknown>(endpoint: string, token: string | null = null, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, token, {
                ...options,
                method: "PUT",
                body: serializeBody(body),
            }, baseUrl),

        patch: <T = unknown>(endpoint: string, token: string | null = null, body?: unknown, options?: RequestInit) =>
            baseFetcher<T>(endpoint, token, {
                ...options,
                method: "PATCH",
                body: serializeBody(body),
            }, baseUrl),

        delete: <T = unknown>(endpoint: string, token: string | null = null, options?: RequestInit) =>
            baseFetcher<T>(endpoint, token, { ...options, method: "DELETE" }, baseUrl),
    };
}

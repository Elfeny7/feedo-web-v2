import "server-only";
import { cookies } from "next/headers";
import { ResponseData, ApiError } from "@/types/api";
import { backend } from "@/lib/fetcher";
import { AuthData } from "@/types/auth";

export async function requestWithRefresh<T>(
    requestToBackend: (token: string) => Promise<ResponseData<T>>,
): Promise<ResponseData<T>> {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        throw new ApiError(401, "Access token not available");
    }

    try {
        return await requestToBackend(token);

    } catch (err) {
        if (!(err instanceof ApiError) || err.status != 401) {
            throw err;
        }

        let refreshed;

        try {
            refreshed = await refreshAccessToken(token);
        } catch (err) {
            cookieStore.delete("access_token");
            throw err;
        }

        const newAccessToken = refreshed?.data?.access_token;

        if (!newAccessToken) {
            throw new ApiError(401, "Token refresh failed", refreshed);
        }

        cookieStore.set("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        })

        return requestToBackend(newAccessToken);
    }
}

async function refreshAccessToken(
    token: string
): Promise<ResponseData<AuthData>> {
    const responseData = backend.post<AuthData>("/refresh", token);
    return responseData;
}
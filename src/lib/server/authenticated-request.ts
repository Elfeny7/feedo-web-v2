import "server-only";
import { cookies } from "next/headers";
import { ResponseData, ApiError } from "@/types/api";
import { refreshsingleFlight } from "@/lib/server/refresh-single-flight";

export async function requestWithRefresh<T>(
    requestToBackend: (token: string) => Promise<ResponseData<T>>,
): Promise<ResponseData<T>> {
    const cookieStore = await cookies();
    const oldToken = cookieStore.get("access_token")?.value;

    if (!oldToken) {
        throw new ApiError(401, "Access token not available");
    }

    try {
        return await requestToBackend(oldToken);

    } catch (err) {
        if (!(err instanceof ApiError) || err.status != 401) {
            throw err;
        }

        const newToken = await refreshsingleFlight(oldToken);

        cookieStore.set("access_token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        })

        return requestToBackend(newToken);
    }
}
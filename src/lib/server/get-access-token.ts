import "server-only";
import { cookies } from "next/headers";

export async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();

    return cookieStore.get("access_token")?.value ?? null;
}

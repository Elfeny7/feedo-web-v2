import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backend } from "@/lib/fetcher";
import { ResponseData } from "@/types/api";

export async function POST() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    try {
        if (token) {
            await backend.post("/logout", token);
        }
    } catch {}

    // Browser must success logout even if backend return eg. 401 token expired
    const response = NextResponse.json<ResponseData>(
        { success: true, message: "Logout Success" },
        { status: 200 }
    );
    response.cookies.delete("access_token");

    return response;
}
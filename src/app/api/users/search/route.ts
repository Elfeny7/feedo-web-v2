import { backend } from "@/lib/fetcher";
import { NextResponse, NextRequest } from "next/server";
import { ApiError, ResponseData } from "@/types/api";
import { UserData } from "@/types/auth";
import { requestWithRefresh } from "@/lib/server/authenticated-request";

export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

        if (query.length < 3) {
            return NextResponse.json<ResponseData>(
                { success: true, message: "Search query is too short"},
                { status: 200 }
            );
        }

        const responseData = await requestWithRefresh((token: string) => backend.get<UserData>(`/users/search?q=${encodeURIComponent(query)}`, token))
        const nextResponse = NextResponse.json(responseData);

        return nextResponse;

    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json<ResponseData>(
                err.responseData ??
                { success: false, message: err.message },
                { status: err.status }
            );
        }

        return NextResponse.json<ResponseData>(
            { success: false, message: err instanceof Error ? err.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
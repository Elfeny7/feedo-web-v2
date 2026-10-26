import { NextResponse, NextRequest } from "next/server";
import { requestWithRefresh } from "@/lib/server/authenticated-request";
import { backend } from "@/lib/fetcher";
import type { UserCollection } from "@/types/user";
import { ApiError, ResponseData } from "@/types/api";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ handle: string }> }
) {
    try {
        const page = request.nextUrl.searchParams.get("page") ?? "1";
        const { handle } = await params;

        const responseData = await requestWithRefresh((token: string) => backend.get<UserCollection>(`/users/${handle}/following?page=${page}&per_page=5`, token));
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
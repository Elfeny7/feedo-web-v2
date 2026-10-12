import { NextResponse } from "next/server";
import { requestWithRefresh } from "@/lib/server/authenticated-request";
import { backend } from "@/lib/fetcher";
import type { PostCollection } from "@/types/post";
import { ApiError, ResponseData } from "@/types/api";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";

    try {
        const responseData = await requestWithRefresh((token: string) => backend.get<PostCollection>(`/posts?page=${page}&per_page=5`, token));
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
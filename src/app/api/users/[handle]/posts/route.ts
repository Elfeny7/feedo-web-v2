import { backend } from "@/lib/fetcher";
import { NextResponse } from "next/server";
import { ApiError, ResponseData } from "@/types/api";
import type { PostCollection } from "@/types/post";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ handle: string }> }
) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const { handle } = await params;

    try {
        const responseData = await backend.get<PostCollection>(`/users/${handle}/posts?page=${page}&per_page=5`);
        const nextResponse = NextResponse.json(responseData);

        return nextResponse;

    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json<ResponseData>(
                err.responseData ??
                { success: false, message: err.message },
                { status: err.status });
        }

        return NextResponse.json<ResponseData>(
            { success: false, message: err instanceof Error ? err.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
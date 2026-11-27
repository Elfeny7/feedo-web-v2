import { NextResponse } from "next/server";
import { backend } from "@/lib/fetcher";
import { ApiError, ResponseData } from "@/types/api";
import type { CommentCollection, CreateComment } from "@/types/comment";
import { requestWithRefresh } from "@/lib/server/authenticated-request";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") ?? "1";
    const { postId } = await params;

    try {
        const responseData = await requestWithRefresh((token: string) =>
            backend.get<CommentCollection>(`/posts/${postId}/comments?page=${page}&per_page=5`, token)
        );

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

export async function POST(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;

    try {
        const body = await request.json();

        const responseData = await requestWithRefresh((token: string) =>
            backend.post<CreateComment>(`/posts/${postId}/comments`, token, {
                content: body.content,
            })
        );

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

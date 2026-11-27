import { NextResponse } from "next/server";
import { backend } from "@/lib/fetcher";
import { requestWithRefresh } from "@/lib/server/authenticated-request";
import { getAccessToken } from "@/lib/server/get-access-token";
import { ApiError, ResponseData } from "@/types/api";
import type { PostData } from "@/types/post";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;
    const token = await getAccessToken();

    try {
        const responseData = token
            ? await requestWithRefresh((token: string) =>
                backend.get<PostData>(`/posts/${postId}`, token)
            )
            : await backend.get<PostData>(`/posts/${postId}`);

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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;

    try {
        const body = await request.json();

        const responseData = await requestWithRefresh((token: string) =>
            backend.put<PostData>(`/posts/${postId}`, token, {
                content: body.content ?? null,
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

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;

    try {
        const responseData = await requestWithRefresh((token: string) =>
            backend.delete(`/posts/${postId}`, token)
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

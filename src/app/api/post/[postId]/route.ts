import { NextResponse } from "next/server";
import { backend } from "@/lib/fetcher";
import { requestWithRefresh } from "@/lib/server/authenticated-request";
import { ApiError, ResponseData } from "@/types/api";

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

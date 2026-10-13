import { backend } from "@/lib/fetcher";
import { NextResponse } from "next/server";
import { ApiError, ResponseData } from "@/types/api";
import { UserData } from "@/types/auth";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ handle: string }> }
) {
    const { handle } = await params;

    try {
        const responseData = await backend.get<UserData>(`/users/${handle}`);
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
import { NextResponse } from "next/server";
import { backend, ResponseData } from "@/lib/fetcher";
import { UserData } from "@/types/auth";
import { requestWithRefresh } from "@/lib/server/authenticated-request";
import { ApiError } from "@/types/api";

export async function GET() {
    try {
        const responseData = await requestWithRefresh((token: string) => backend.get<UserData>("/me", token));
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
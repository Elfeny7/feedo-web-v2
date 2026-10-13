import { backend } from "@/lib/fetcher";
import { requestWithRefresh } from "@/lib/server/authenticated-request";
import { ResponseData, ApiError } from "@/types/api";
import { NextResponse } from "next/server";
import { UserData } from "@/types/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const responseData = await requestWithRefresh((token: string) => backend.put<UserData>("/users/update-profile", token, {
            name: body.name,
            bio: body.bio
        }));
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
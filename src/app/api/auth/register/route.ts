import { NextResponse } from "next/server";
import { backend, ResponseData } from "@/lib/fetcher";
import { ApiError } from "@/types/api";
import type { UserData } from "@/types/auth";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const responseData = await backend.post<UserData>("/register", null, {
            name: body.name,
            email: body.email,
            handle: body.handle,
            password: body.password,
            password_confirmation: body.password_confirmation ?? body.password,
        });

        const nextResponse = NextResponse.json(responseData, { status: 201 });

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

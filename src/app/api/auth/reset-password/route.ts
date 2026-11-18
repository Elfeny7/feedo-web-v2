import { NextResponse } from "next/server";
import { backend, ResponseData } from "@/lib/fetcher";
import { ApiError } from "@/types/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const responseData = await backend.post("/reset-password", null, {
            email: body.email,
            otp: body.otp,
            password: body.password,
            password_confirmation: body.password_confirmation ?? body.password,
        });

        return NextResponse.json(responseData);

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

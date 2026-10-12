import { NextResponse } from "next/server";
import { backend, ResponseData } from "@/lib/fetcher";
import { AuthData } from "@/types/auth";
import { ApiError } from "@/types/api";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const responseData = await backend.post<AuthData>("/login", null, {
            email: body.email,
            password: body.password,
        });

        const token = responseData?.data?.access_token;

        if (!token) {
            return NextResponse.json<ResponseData>(
                { success: false, message: "Login failed: access token not available", },
                { status: 502 },
            );
        }

        //do not return access_token in responseData to browser, make new response without data.
        const nextResponse = NextResponse.json<ResponseData>(
            { success: true, message: "Login Success" },
            { status: 200 }
        );

        nextResponse.cookies.set("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

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
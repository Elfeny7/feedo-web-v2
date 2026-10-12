import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/home"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasAccessToken = Boolean(
        request.cookies.get("access_token")?.value,
    );

    const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    )

    const isAuthRoute = authRoutes.includes(pathname);

    if (isProtectedRoute && !hasAccessToken) {
        const loginUrl = new URL("/login", request.url);

        loginUrl.searchParams.set(
            "next",
            `${request.nextUrl.pathname}${request.nextUrl.search}`,
        )

        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && hasAccessToken) {
        return NextResponse.redirect(new URL("/home", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/home/:path*",
        "/login",
        "/register"
    ]
}